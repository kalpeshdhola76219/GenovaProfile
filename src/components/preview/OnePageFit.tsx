import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DocumentData } from '../../types/document';
import { sanitizeDocumentTextFields } from '../../utils/textSanitizer';

export interface OnePageFitProps {
  data: DocumentData;
  TemplateComponent: React.ComponentType<{ data: DocumentData }>;
  isUnpaidPremium?: boolean;
  onPageCountChange?: (count: number) => void;
  onFitChange?: (fit: {
    fillPercent: number;
    isOverflowing: boolean;
    scale: number;
    naturalHeight: number;
  }) => void;
}

export const TARGET_A4_WIDTH = 800;
export const TARGET_A4_HEIGHT = 1131;
export const MIN_AUTOFIT_SCALE = 0.72;
export const MAX_AUTOFIT_SCALE = 1.0;

/**
 * Detect the background color of the template root (or first non-transparent child)
 * so the outer 800 x 1131 page div has the exact same color and zero white gaps.
 */
export function detectTemplateBackgroundColor(rootEl: HTMLElement | null): string {
  if (!rootEl || typeof window === 'undefined') return '#ffffff';

  const isTransparent = (color: string): boolean => {
    if (!color) return true;
    const c = color.trim().toLowerCase();
    return (
      c === 'transparent' ||
      c === 'rgba(0, 0, 0, 0)' ||
      c === 'rgba(0,0,0,0)' ||
      c === 'hsla(0, 0%, 0%, 0)' ||
      c === 'hsla(0,0%,0%,0)' ||
      c.endsWith(', 0)') ||
      c.endsWith(',0)')
    );
  };

  try {
    const rootBg = window.getComputedStyle(rootEl).backgroundColor;
    if (!isTransparent(rootBg)) {
      return rootBg;
    }

    const elements = Array.from(rootEl.querySelectorAll('*')) as HTMLElement[];
    for (const el of elements) {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (!isTransparent(bg)) {
        return bg;
      }
    }
  } catch (err) {
    console.warn('Notice while detecting template background color:', err);
  }

  return '#ffffff';
}

export const OnePageFit: React.FC<OnePageFitProps> = ({
  data,
  TemplateComponent,
  isUnpaidPremium = false,
  onPageCountChange,
  onFitChange,
}) => {
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const measureStageRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState<number>(MAX_AUTOFIT_SCALE);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [fillPercent, setFillPercent] = useState<number>(100);
  const [pageBgColor, setPageBgColor] = useState<string>('#ffffff');
  const [isFitSettled, setIsFitSettled] = useState<boolean>(false);

  // Binary search measurement function to find largest s in [0.72, 1.0]
  const measure = () => {
    const stageEl = measureStageRef.current;
    if (!stageEl) return;
    const templateRoot = stageEl.firstElementChild as HTMLElement | null;
    if (!templateRoot) return;

    // 1. Detect background color from the template
    const detectedBg = detectTemplateBackgroundColor(templateRoot);
    if (detectedBg) {
      setPageBgColor(detectedBg);
    }

    // 2. Helper to test if a candidate scale s fits inside 1131 / s
    const checkScaleFits = (sCandidate: number): boolean => {
      const targetW = TARGET_A4_WIDTH / sCandidate;
      const targetH = TARGET_A4_HEIGHT / sCandidate;

      stageEl.style.width = `${targetW}px`;
      stageEl.style.height = `${targetH}px`;

      const maxAllowedH = Math.ceil(targetH) + 1; // 1px rounding margin
      const rootScroll = templateRoot.scrollHeight;

      let maxChildScroll = rootScroll;
      const children = Array.from(templateRoot.children) as HTMLElement[];
      for (const ch of children) {
        if (ch.scrollHeight > maxChildScroll) {
          maxChildScroll = ch.scrollHeight;
        }
      }

      return maxChildScroll <= maxAllowedH;
    };

    let optimalScale = MAX_AUTOFIT_SCALE;
    let overflowing = false;

    // Quick check: does it fit at maximum scale s = 1.0?
    if (checkScaleFits(MAX_AUTOFIT_SCALE)) {
      optimalScale = MAX_AUTOFIT_SCALE;
      overflowing = false;
    } else if (!checkScaleFits(MIN_AUTOFIT_SCALE)) {
      // Even at minimum scale s = 0.72, it does not fit
      optimalScale = MIN_AUTOFIT_SCALE;
      overflowing = true;
    } else {
      // Binary search largest s between MIN_AUTOFIT_SCALE and MAX_AUTOFIT_SCALE
      overflowing = false;
      let low = MIN_AUTOFIT_SCALE;
      let high = MAX_AUTOFIT_SCALE;
      optimalScale = MIN_AUTOFIT_SCALE;

      for (let iter = 0; iter < 8; iter++) {
        const mid = Math.round(((low + high) / 2) * 1000) / 1000;
        if (checkScaleFits(mid)) {
          optimalScale = mid;
          low = mid + 0.005; // Try larger scale
        } else {
          high = mid - 0.005; // Scale down
        }
      }

      // Safety refinement to strictly guarantee it fits
      while (optimalScale > MIN_AUTOFIT_SCALE && !checkScaleFits(optimalScale)) {
        optimalScale = Math.round((optimalScale - 0.005) * 1000) / 1000;
      }
    }

    optimalScale = Math.max(
      MIN_AUTOFIT_SCALE,
      Math.min(MAX_AUTOFIT_SCALE, Math.round(optimalScale * 1000) / 1000)
    );

    setScale(optimalScale);
    setIsOverflowing(overflowing);

    const fillPct = Math.min(100, Math.round((1 / optimalScale) * 100));
    setFillPercent(fillPct);
  };

  // Immediate layout measurement on data changes
  useLayoutEffect(() => {
    setIsFitSettled(false);
    measure();
  }, [
    data.templateId,
    data.type,
    data.customization,
    data.personal,
    data.family,
    data.marriage,
    data.contact,
    data.education,
    data.experience,
    data.skills,
    data.projects,
    data.certifications,
    data.achievements,
    data.customSections,
    data.summary,
  ]);

  // Observer & event-based re-measurement (ResizeObserver, fonts, images)
  useEffect(() => {
    let active = true;
    const cleanups: Array<() => void> = [];
    let rafId1 = 0;
    let rafId2 = 0;

    const safeMeasure = () => {
      if (active) measure();
    };

    const timer = setTimeout(safeMeasure, 100);
    const timer2 = setTimeout(safeMeasure, 350);
    cleanups.push(() => {
      clearTimeout(timer);
      clearTimeout(timer2);
    });

    if (typeof ResizeObserver !== 'undefined' && measureContainerRef.current) {
      const ro = new ResizeObserver(safeMeasure);
      ro.observe(measureContainerRef.current);
      cleanups.push(() => ro.disconnect());
    }

    const el = measureContainerRef.current;

    const onFontLoadingDone = () => {
      safeMeasure();
    };
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.addEventListener('loadingdone', onFontLoadingDone);
      cleanups.push(() => document.fonts.removeEventListener('loadingdone', onFontLoadingDone));
    }

    const waitAndSettle = async () => {
      try {
        if (typeof document !== 'undefined' && document.fonts) {
          const text = el?.textContent || '';
          if (/[\u0A80-\u0AFF]/.test(text)) {
            await Promise.allSettled([
              document.fonts.load('400 14px "Noto Sans Gujarati"'),
              document.fonts.load('600 14px "Noto Sans Gujarati"'),
            ]);
          }
          await document.fonts.ready;
        }
      } catch {}

      if (el) {
        const imgs = Array.from(el.querySelectorAll('img'));
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise<void>((resolve) => {
                const finish = async () => {
                  try {
                    if (img.complete && img.naturalWidth > 0 && typeof img.decode === 'function') {
                      await img.decode();
                    }
                  } catch {}
                  resolve();
                };
                if (img.complete) {
                  void finish();
                  return;
                }
                const onLoadOrError = () => {
                  img.removeEventListener('load', onLoadOrError);
                  img.removeEventListener('error', onLoadOrError);
                  safeMeasure();
                  void finish();
                };
                img.addEventListener('load', onLoadOrError);
                img.addEventListener('error', onLoadOrError);
                cleanups.push(() => {
                  img.removeEventListener('load', onLoadOrError);
                  img.removeEventListener('error', onLoadOrError);
                });
              })
          )
        );
      }

      if (!active) return;
      measure();
      rafId1 = requestAnimationFrame(() => {
        if (!active) return;
        measure();
        rafId2 = requestAnimationFrame(() => {
          if (active) setIsFitSettled(true);
        });
      });
    };

    void waitAndSettle();

    return () => {
      active = false;
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      cleanups.forEach((fn) => fn());
    };
  }, [data]);

  // Strictly exactly 1 page
  useEffect(() => {
    onPageCountChange?.(1);
  }, [onPageCountChange]);

  // Notify parent of fit details
  useEffect(() => {
    const naturalHeight = Math.round(TARGET_A4_HEIGHT / scale);
    const fitInfo = { fillPercent, isOverflowing, scale, naturalHeight };
    onFitChange?.(fitInfo);

    if (typeof window !== 'undefined') {
      (window as any).__BIODATA_FIT__ = fitInfo;
      window.dispatchEvent(new CustomEvent('biodataFitChange', { detail: fitInfo }));
    }
  }, [fillPercent, isOverflowing, scale, onFitChange]);

  // Disable Pay and Download when overflowing
  useEffect(() => {
    if (!isOverflowing) {
      document.querySelectorAll('[data-overflow-disabled="true"]').forEach((el) => {
        el.removeAttribute('data-overflow-disabled');
        (el as HTMLButtonElement).disabled = false;
      });
      return;
    }

    const disableButtons = () => {
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach((btn) => {
        const text = (btn.textContent || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();

        const isTarget =
          text.includes('download') ||
          text.includes('pay') ||
          title.includes('download') ||
          title.includes('pay') ||
          ariaLabel.includes('download') ||
          ariaLabel.includes('pay');

        if (isTarget) {
          btn.setAttribute('data-overflow-disabled', 'true');
          (btn as HTMLButtonElement).disabled = true;
        }
      });
    };

    disableButtons();
    const observer = new MutationObserver(disableButtons);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const preventClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest('button');
      if (btn) {
        const text = (btn.textContent || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        if (
          text.includes('download') ||
          text.includes('pay') ||
          title.includes('download') ||
          title.includes('pay')
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    window.addEventListener('click', preventClick, true);

    return () => {
      observer.disconnect();
      window.removeEventListener('click', preventClick, true);
      document.querySelectorAll('[data-overflow-disabled="true"]').forEach((el) => {
        el.removeAttribute('data-overflow-disabled');
        (el as HTMLButtonElement).disabled = false;
      });
    };
  }, [isOverflowing]);

  const stageWidth = TARGET_A4_WIDTH / scale;
  const stageHeight = TARGET_A4_HEIGHT / scale;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Scoped CSS Rule: Forces every template root to 100% of the stage */}
      <style>{`
        .one-page-stage {
          position: relative;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .one-page-stage > :first-child {
          width: 100% !important;
          max-width: none !important;
          height: 100% !important;
          min-height: 100% !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Hidden measurement container offscreen */}
      <div
        ref={measureContainerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -99,
        }}
      >
        <div
          ref={measureStageRef}
          className="one-page-stage"
          style={{
            width: `${TARGET_A4_WIDTH}px`,
            height: `${TARGET_A4_HEIGHT}px`,
          }}
        >
          <TemplateComponent data={sanitizeDocumentTextFields(data)} />
        </div>
      </div>

      {/* Page Badge & Auto-fit Status */}
      <div className="text-xs font-medium text-slate-500 mb-2.5 print:hidden flex items-center gap-2 select-none">
        <span className="bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs font-mono text-[11px] text-slate-600 font-semibold">
          Page 1 of 1 • One Page Fit ({fillPercent}%)
        </span>
        {scale < 1 && !isOverflowing && (
          <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
            Scaled to {Math.round(scale * 100)}%
          </span>
        )}
      </div>

      {/* Visible Page: Exactly 800 x 1131 px with overflow hidden and data-document-page="1" */}
      <div
        className="document-page-sheet a4-page-sheet one-page-fit-sheet relative overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-200/80 rounded-xs print:shadow-none print:border-none"
        data-document-page="1"
        data-one-page-fit="true"
        data-document-type="biodata"
        data-fill-percent={fillPercent}
        data-is-overflowing={isOverflowing ? 'true' : 'false'}
        data-fit-settled={isFitSettled ? 'true' : 'false'}
        data-scale={scale}
        style={{
          width: '800px',
          height: '1131px',
          minWidth: '800px',
          maxWidth: '800px',
          minHeight: '1131px',
          maxHeight: '1131px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: pageBgColor,
          boxSizing: 'border-box',
        }}
      >
        {/* Stage: (800 / s) wide and (1131 / s) high, with transform: scale(s) and transform-origin: top left */}
        <div
          className="one-page-stage"
          style={{
            width: `${stageWidth}px`,
            height: `${stageHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          }}
        >
          <TemplateComponent data={sanitizeDocumentTextFields(data)} />
        </div>

        {/* Diagonal PREVIEW Watermark Overlay for Unpaid Premium Templates */}
        {isUnpaidPremium && (
          <div
            className="no-export-when-paid absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-30 select-none"
            aria-hidden="true"
          >
            <div className="transform -rotate-45 text-rose-500/25 border-4 border-dashed border-rose-500/30 rounded-3xl px-12 py-5 text-6xl sm:text-7xl font-black tracking-[0.25em] uppercase font-sans print:text-slate-500/40 print:border-slate-500/40">
              PREVIEW
            </div>
          </div>
        )}
      </div>

      {/* Red message under preview when overflowing */}
      {isOverflowing && (
        <div
          role="alert"
          className="mt-4 px-4 py-3 bg-rose-50 border-2 border-rose-400 rounded-xl text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-md max-w-xl text-center animate-in fade-in duration-150"
        >
          <svg
            className="w-5 h-5 text-rose-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Too much content for one page. Please shorten the highlighted text.</span>
        </div>
      )}
    </div>
  );
};

// Automatic dev-only loader for /dev/biodata-audit
if (import.meta.env.DEV && typeof window !== 'undefined') {
  if (window.location.pathname === '/dev/biodata-audit') {
    import('../../pages/BiodataFullPageAudit')
      .then((m) => m.mountBiodataAuditPage?.())
      .catch(() => {});
  }
}
