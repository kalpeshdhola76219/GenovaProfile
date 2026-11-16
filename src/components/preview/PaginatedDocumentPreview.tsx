import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DocumentData } from '../../types/document';
import { calculateDocumentPagination, DocumentPaginationResult, A4_DIMENSIONS } from '../../services/paginationEngine';
import { OnePageFit } from './OnePageFit';

interface PaginatedDocumentPreviewProps {
  data: DocumentData;
  TemplateComponent: React.ComponentType<{ data: DocumentData }>;
  isUnpaidPremium?: boolean;
  onPageCountChange?: (count: number) => void;
}

export const PaginatedDocumentPreview: React.FC<PaginatedDocumentPreviewProps> = (props) => {
  if (props.data.type === 'biodata') {
    return (
      <OnePageFit
        data={props.data}
        TemplateComponent={props.TemplateComponent}
        isUnpaidPremium={props.isUnpaidPremium}
        onPageCountChange={props.onPageCountChange}
      />
    );
  }

  return <MultiPagePaginatedDocumentPreview {...props} />;
};

const GUJARATI_CHAR_REGEX = /[\u0A80-\u0AFF]/;

const MultiPagePaginatedDocumentPreview: React.FC<PaginatedDocumentPreviewProps> = ({
  data,
  TemplateComponent,
  isUnpaidPremium = false,
  onPageCountChange,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [isPaginationSettled, setIsPaginationSettled] = useState<boolean>(false);
  const [pagination, setPagination] = useState<DocumentPaginationResult>({
    pageCount: 1,
    pageBreaks: [
      {
        pageIndex: 0,
        startY: 0,
        endY: A4_DIMENSIONS.heightPx,
        contentHeight: A4_DIMENSIONS.heightPx,
        isLastPage: true,
      },
    ],
    totalHeight: A4_DIMENSIONS.heightPx,
    isMultiPage: false,
  });

  // Re-calculate pages whenever data, fonts, or images finish loading
  const runPaginationCalculation = useCallback(() => {
    if (!measureRef.current) return;
    const result = calculateDocumentPagination(measureRef.current);
    setPagination(result);
    onPageCountChange?.(result.pageCount);
  }, [onPageCountChange]);

  useLayoutEffect(() => {
    setIsPaginationSettled(false);
    runPaginationCalculation();
  }, [
    data.templateId,
    data.type,
    data.customization.fontFamily,
    data.customization.fontSize,
    data.customization.headingSize,
    data.customization.lineHeight,
    data.customization.margins,
    data.customization.sectionSpacing,
    data.experience,
    data.education,
    data.skills,
    data.projects,
    data.certifications,
    data.achievements,
    data.customSections,
    data.summary,
    data.personal,
    data.contact,
    runPaginationCalculation,
  ]);

  // Recalculate reliably after fonts, images, and resize settle
  useEffect(() => {
    let active = true;
    const cleanups: Array<() => void> = [];
    let rafId1 = 0;
    let rafId2 = 0;

    const scheduleCalculation = () => {
      if (!active) return;
      runPaginationCalculation();
    };

    const timer = setTimeout(scheduleCalculation, 150);
    cleanups.push(() => clearTimeout(timer));

    const measureEl = measureRef.current;

    // Watch ResizeObserver on offscreen measurement container
    if (typeof ResizeObserver !== 'undefined' && measureEl) {
      let roTimer: ReturnType<typeof setTimeout> | null = null;
      const ro = new ResizeObserver(() => {
        if (!active) return;
        if (roTimer) clearTimeout(roTimer);
        roTimer = setTimeout(() => {
          if (active) runPaginationCalculation();
        }, 40);
      });
      ro.observe(measureEl);
      cleanups.push(() => {
        ro.disconnect();
        if (roTimer) clearTimeout(roTimer);
      });
    }

    // Wait for fonts (plus Noto Sans Gujarati if Gujarati characters are present) and images
    const waitForResourcesAndSettle = async () => {
      try {
        if (typeof document !== 'undefined' && document.fonts) {
          const textContent = measureEl?.textContent || '';
          if (GUJARATI_CHAR_REGEX.test(textContent)) {
            await Promise.allSettled([
              document.fonts.load('400 14px "Noto Sans Gujarati"'),
              document.fonts.load('600 14px "Noto Sans Gujarati"'),
            ]);
          }
          await document.fonts.ready;
        }
      } catch {}

      if (measureEl) {
        const imgs = Array.from(measureEl.querySelectorAll('img'));
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
      runPaginationCalculation();
      rafId1 = requestAnimationFrame(() => {
        if (!active) return;
        runPaginationCalculation();
        rafId2 = requestAnimationFrame(() => {
          if (active) setIsPaginationSettled(true);
        });
      });
    };

    if (typeof document !== 'undefined' && document.fonts) {
      const onFontLoadingDone = () => {
        if (active) runPaginationCalculation();
      };
      document.fonts.addEventListener('loadingdone', onFontLoadingDone);
      cleanups.push(() => {
        document.fonts.removeEventListener('loadingdone', onFontLoadingDone);
      });
    }

    void waitForResourcesAndSettle();

    return () => {
      active = false;
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      cleanups.forEach((fn) => fn());
    };
  }, [data, runPaginationCalculation]);

  const { pageBreaks, pageCount, isMultiPage } = pagination;

  return (
    <div
      className="w-full flex flex-col items-center"
      data-pagination-settled={isPaginationSettled ? 'true' : 'false'}
    >
      {/* Hidden measurement container rendered offscreen at exact 800px A4 width */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '800px',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -99,
        }}
      >
        <TemplateComponent data={data} />
      </div>

      {/* Visible Multi-Page Preview */}
      <div className="w-full flex flex-col items-center space-y-8 print:space-y-0">
        {pageBreaks.map((page, idx) => {
          const isFirstPage = idx === 0;
          const isLastPage = page.isLastPage;

          return (
            <div
              key={`page-${idx}-${data.templateId}`}
              className="flex flex-col items-center w-full group/page"
            >
              {/* Floating Page Indicator Badge */}
              <div className="text-xs font-medium text-slate-500 mb-2.5 print:hidden flex items-center gap-2 select-none">
                <span className="bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs font-mono text-[11px] text-slate-600 font-semibold group-hover/page:border-indigo-300 group-hover/page:text-[#5B4BDB] transition-colors">
                  Page {idx + 1} of {pageCount}
                </span>
                {isMultiPage && (
                  <span className="text-[10px] text-slate-400">
                    {isFirstPage ? '• Starts' : isLastPage ? '• Concludes' : '• Continued'}
                  </span>
                )}
              </div>

              {/* Single A4 Page Sheet */}
              <div
                className="document-page-sheet a4-page-sheet bg-white shadow-xl hover:shadow-2xl transition-all border border-slate-200/80 rounded-xs relative overflow-hidden print:shadow-none print:border-none"
                data-document-page={idx + 1}
                data-page-index={idx}
                style={{
                  width: '800px',
                  height: '1131px',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  hyphens: 'none',
                }}
              >
                {/* Content Viewport Window */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: idx > 0 ? '32px' : '0px',
                    height: isFirstPage
                      ? isMultiPage
                        ? `${page.endY}px`
                        : '1131px'
                      : `${Math.min(1055, page.contentHeight)}px`,
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      transform: idx > 0 ? `translateY(-${page.startY}px)` : 'none',
                      width: '800px',
                    }}
                  >
                    <TemplateComponent data={data} />
                  </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
