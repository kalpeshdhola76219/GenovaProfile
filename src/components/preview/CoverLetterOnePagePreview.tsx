import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DocumentData } from '../../types/document';
import {
  COVER_LETTER_TYPE_SCALE,
  isCoverLetterTemplateATS,
  mapCoverLetterData,
  MappedCoverLetterData,
} from '../../utils/mapCoverLetterData';
import { detectTemplateBackgroundColor, TARGET_A4_HEIGHT } from './OnePageFit';
import {
  CoverLetterPreviewContext,
  CoverLetterPreviewProvider,
} from '../../templates/coverletter/CoverLetterTemplateHelpers';
import { AlertTriangle } from 'lucide-react';

export interface CoverLetterOnePagePreviewProps {
  data: DocumentData;
  TemplateComponent:
    | React.ComponentType<{ data: DocumentData; mapped?: MappedCoverLetterData }>
    | React.ComponentType<{ data: DocumentData }>;
  isUnpaidPremium?: boolean;
  onPageCountChange?: (count: number) => void;
}

const MAX_FIT_LEVEL = 5;

export const CoverLetterOnePagePreview: React.FC<CoverLetterOnePagePreviewProps> = ({
  data,
  TemplateComponent,
  isUnpaidPremium = false,
  onPageCountChange,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastImmediateKeyRef = useRef<string>('');

  const [fitLevel, setFitLevel] = useState<number>(0);
  const [isHeightOverflowing, setIsHeightOverflowing] = useState<boolean>(false);
  const [isVerticallyBalanced, setIsVerticallyBalanced] = useState<boolean>(false);
  const [pageBgColor, setPageBgColor] = useState<string>('#ffffff');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const outerPreviewCtx = useContext(CoverLetterPreviewContext);
  const effectiveExportMode = outerPreviewCtx.isExportMode || isPrinting;

  const mapped = useMemo(() => mapCoverLetterData(data), [data]);
  const { wordCount, recommendedMinWords, recommendedMaxWords, longestParagraphIndex } =
    mapped.metrics;
  const isATS = isCoverLetterTemplateATS(data.templateId);

  const ResolvedTemplate = TemplateComponent as React.ComponentType<{
    data: DocumentData;
    mapped?: MappedCoverLetterData;
  }>;

  useEffect(() => {
    const onBeforePrint = () => setIsPrinting(true);
    const onAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  const measureFit = useCallback(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const templateRoot = stageEl.firstElementChild as HTMLElement | null;
    if (!templateRoot) return;

    const detectedBg = detectTemplateBackgroundColor(templateRoot);
    if (detectedBg) {
      setPageBgColor((prev) => (prev === detectedBg ? prev : detectedBg));
    }

    stageEl.classList.add('cl-measure-stage');
    stageEl.removeAttribute('data-cl-balance');
    let chosenLevel = 0;
    let overflowsAtMinFont = false;
    let shouldBalance = false;

    try {
      for (let lvl = 0; lvl <= MAX_FIT_LEVEL; lvl++) {
        stageEl.setAttribute('data-cl-fit-level', String(lvl));
        const rootScroll = templateRoot.scrollHeight;
        if (lvl === 0 && rootScroll < TARGET_A4_HEIGHT * 0.7) {
          shouldBalance = true;
        }
        if (rootScroll <= TARGET_A4_HEIGHT + 2) {
          chosenLevel = lvl;
          overflowsAtMinFont = false;
          break;
        }
        if (lvl === MAX_FIT_LEVEL) {
          chosenLevel = MAX_FIT_LEVEL;
          overflowsAtMinFont = rootScroll > TARGET_A4_HEIGHT + 2;
        }
      }
    } finally {
      stageEl.classList.remove('cl-measure-stage');
      stageEl.setAttribute('data-cl-fit-level', String(chosenLevel));
      if (chosenLevel === 0 && shouldBalance) {
        stageEl.setAttribute('data-cl-balance', 'true');
      } else {
        stageEl.removeAttribute('data-cl-balance');
      }
    }

    setFitLevel((prev) => (prev === chosenLevel ? prev : chosenLevel));
    setIsVerticallyBalanced((prev) => (prev === (chosenLevel === 0 && shouldBalance) ? prev : (chosenLevel === 0 && shouldBalance)));
    setIsHeightOverflowing((prev) => (prev === overflowsAtMinFont ? prev : overflowsAtMinFont));
  }, []);

  // Measure immediately on initial mount or template/export/customization switches; debounce typing by ~120ms
  const immediateKey = `${data.templateId}|${effectiveExportMode}|${JSON.stringify(data.customization)}`;
  useLayoutEffect(() => {
    if (lastImmediateKeyRef.current !== immediateKey) {
      lastImmediateKeyRef.current = immediateKey;
      measureFit();
      return;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      measureFit();
    }, 120);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [mapped, immediateKey, measureFit]);

  // Single font-ready pass on mount + ResizeObserver on single visible stage (debounced 120ms)
  useEffect(() => {
    let active = true;
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready
        .then(() => {
          if (active) measureFit();
        })
        .catch(() => {});
    }

    const stageEl = stageRef.current;
    if (!stageEl || typeof ResizeObserver === 'undefined') {
      return () => {
        active = false;
      };
    }

    const observer = new ResizeObserver(() => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(() => {
        if (active) measureFit();
      }, 120);
    });

    if (stageEl.firstElementChild) {
      observer.observe(stageEl.firstElementChild);
    } else {
      observer.observe(stageEl);
    }

    return () => {
      active = false;
      observer.disconnect();
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [measureFit, data.templateId]);

  useEffect(() => {
    onPageCountChange?.(1);
  }, [onPageCountChange]);

  const warningText = `Letter is too long for one page. Please shorten paragraph ${
    longestParagraphIndex || 2
  }.`;
  const showSampleIndicator = mapped.previewMode === 'sample' && !effectiveExportMode;

  const fontSizeChoice = data.customization?.fontSize || 'base';
  const fontShift = fontSizeChoice === 'sm' ? -0.5 : fontSizeChoice === 'lg' ? 0.5 : 0;
  const activeScale = COVER_LETTER_TYPE_SCALE[fitLevel] || COVER_LETTER_TYPE_SCALE[0];
  const effectiveBodyPt = Math.max(10, activeScale.bodyPt + fontShift);
  const fontPtLabel = `${effectiveBodyPt}pt${fitLevel >= 4 || effectiveBodyPt <= 10 ? ' (min)' : ''}`;

  const wordStatusClass = isHeightOverflowing
    ? 'text-rose-700 font-semibold'
    : wordCount === 0
    ? 'text-slate-600'
    : wordCount >= recommendedMinWords && wordCount <= recommendedMaxWords
    ? 'text-emerald-700 font-semibold'
    : 'text-amber-700 font-semibold';

  return (
    <CoverLetterPreviewProvider isExportMode={effectiveExportMode} previewMode={mapped.previewMode}>
      <div className="w-full flex flex-col items-center">
        <style>{`
          .cl-one-page-stage {
            width: 800px;
            height: 1131px;
            position: relative;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          .cl-one-page-stage > :first-child {
            width: 100% !important;
            max-width: none !important;
            min-height: 1131px !important;
            height: 100% !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow-wrap: break-word;
            word-break: normal;
          }
          .cl-one-page-stage.cl-measure-stage {
            height: auto !important;
          }
          .cl-one-page-stage.cl-measure-stage > :first-child {
            min-height: 0 !important;
            height: auto !important;
          }
          .cl-one-page-stage[data-cl-font-size="sm"] {
            --cl-shift: -0.5pt;
          }
          .cl-one-page-stage[data-cl-font-size="base"] {
            --cl-shift: 0pt;
          }
          .cl-one-page-stage[data-cl-font-size="lg"] {
            --cl-shift: 0.5pt;
          }
          .cl-one-page-stage .cl-name {
            font-size: var(--cl-name) !important;
            line-height: 1.15 !important;
          }
          .cl-one-page-stage .cl-title {
            font-size: var(--cl-title) !important;
            line-height: var(--cl-line-meta) !important;
          }
          .cl-one-page-stage .cl-body,
          .cl-one-page-stage .cl-body-content {
            font-size: var(--cl-body) !important;
            line-height: var(--cl-line-body) !important;
          }
          .cl-one-page-stage .cl-meta {
            font-size: var(--cl-meta) !important;
            line-height: var(--cl-line-meta) !important;
          }
          .cl-one-page-stage .cl-label {
            font-size: var(--cl-label) !important;
            line-height: var(--cl-line-meta) !important;
          }
          .cl-one-page-stage .cl-body-content > * + * {
            margin-top: max(6px, 0.9em) !important;
          }
          .cl-one-page-stage .cl-body-content p {
            text-align: justify !important;
            text-justify: inter-word !important;
            text-align-last: left !important;
            hyphens: none !important;
            -webkit-hyphens: none !important;
            overflow-wrap: break-word !important;
            word-break: normal !important;
            text-wrap: pretty;
          }
          .cl-one-page-stage .cl-body-content .cl-unbreakable-token {
            overflow-wrap: anywhere !important;
            word-break: normal !important;
            hyphens: none !important;
            -webkit-hyphens: none !important;
          }
          .cl-one-page-stage .cl-signature-handwritten {
            font-family: 'Caveat', cursive !important;
            font-size: 20pt !important;
            line-height: 1.15 !important;
            font-weight: 600 !important;
            font-style: normal !important;
          }
          /* Level 0: 22 | 9.5 | 11 | 10 | 8 (line-height 1.50) */
          .cl-one-page-stage[data-cl-fit-level="0"] {
            --cl-name: max(18pt, calc(22pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(9.5pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(11pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(10pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(8pt + var(--cl-shift)));
            --cl-line-body: 1.50;
            --cl-line-meta: 1.40;
          }
          /* Vertical balance when letter fills < 70% at Level 0 (up to +8% spacing) */
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] {
            --cl-line-body: 1.56;
          }
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] .cl-body-content {
            margin-top: 8px !important;
            margin-bottom: 8px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] .cl-body-content > * + * {
            margin-top: max(6px, 0.97em) !important;
          }
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] .cl-signature-block {
            margin-top: 34px !important;
            padding-top: 18px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] .cl-header-block {
            margin-bottom: 26px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="0"][data-cl-balance="true"] .cl-recipient-block {
            margin-bottom: 24px !important;
          }
          /* Level 1: 21 | 9.5 | 10.75 | 9.75 | 8 (line-height 1.47) */
          .cl-one-page-stage[data-cl-fit-level="1"] {
            --cl-name: max(18pt, calc(21pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(9.5pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(10.75pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(9.75pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(8pt + var(--cl-shift)));
            --cl-line-body: 1.47;
            --cl-line-meta: 1.40;
          }
          /* Level 2: 20 | 9 | 10.5 | 9.5 | 7.75 (line-height 1.44) */
          .cl-one-page-stage[data-cl-fit-level="2"] {
            --cl-name: max(18pt, calc(20pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(9pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(10.5pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(9.5pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(7.75pt + var(--cl-shift)));
            --cl-line-body: 1.44;
            --cl-line-meta: 1.40;
          }
          /* Level 3: 19 | 9 | 10.25 | 9.25 | 7.5 (line-height 1.41) */
          .cl-one-page-stage[data-cl-fit-level="3"] {
            --cl-name: max(18pt, calc(19pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(9pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(10.25pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(9.25pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(7.5pt + var(--cl-shift)));
            --cl-line-body: 1.41;
            --cl-line-meta: 1.40;
          }
          .cl-one-page-stage[data-cl-fit-level="3"] .cl-sheet-root {
            padding-top: 36px !important;
            padding-bottom: 36px !important;
          }
          /* Level 4: 18 | 9 | 10 | 9 | 7.5 (line-height 1.38) */
          .cl-one-page-stage[data-cl-fit-level="4"] {
            --cl-name: max(18pt, calc(18pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(9pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(10pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(9pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(7.5pt + var(--cl-shift)));
            --cl-line-body: 1.38;
            --cl-line-meta: 1.40;
          }
          .cl-one-page-stage[data-cl-fit-level="4"] .cl-sheet-root {
            padding-top: 30px !important;
            padding-bottom: 30px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="4"] .cl-header-block {
            margin-bottom: 14px !important;
            padding-bottom: 12px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="4"] .cl-signature-block {
            margin-top: 14px !important;
            padding-top: 10px !important;
          }
          /* Level 5: 18 | 8.5 | 10 | 9 | 7.5 (minimum, line-height 1.35) */
          .cl-one-page-stage[data-cl-fit-level="5"] {
            --cl-name: max(18pt, calc(18pt + var(--cl-shift)));
            --cl-title: max(8.5pt, calc(8.5pt + var(--cl-shift)));
            --cl-body: max(10pt, calc(10pt + var(--cl-shift)));
            --cl-meta: max(9pt, calc(9pt + var(--cl-shift)));
            --cl-label: max(7.5pt, calc(7.5pt + var(--cl-shift)));
            --cl-line-body: 1.35;
            --cl-line-meta: 1.40;
          }
          .cl-one-page-stage[data-cl-fit-level="5"] .cl-sheet-root {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="5"] .cl-header-block {
            margin-bottom: 10px !important;
            padding-bottom: 8px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="5"] .cl-recipient-block {
            margin-bottom: 10px !important;
          }
          .cl-one-page-stage[data-cl-fit-level="5"] .cl-signature-block {
            margin-top: 10px !important;
            padding-top: 8px !important;
          }
          @media print {
            .cl-sample-placeholder,
            .cl-sample-badge {
              display: none !important;
            }
          }
        `}</style>

        {/* Clean Unboxed Editorial Metadata Bar Above Sheet */}
        <div className="w-[800px] max-w-full mb-3 pb-2 border-b border-slate-300/70 print:hidden flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-slate-600 select-none">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-semibold text-slate-800">Page 1 of 1 (A4)</span>
            <span className="text-slate-400">&middot;</span>
            <span className="font-mono text-slate-700">{fontPtLabel}</span>
            <span className="text-slate-400">&middot;</span>
            <span className={`font-mono ${wordStatusClass}`}>
              {wordCount} words ({recommendedMinWords}&ndash;{recommendedMaxWords} rec.)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`font-semibold ${isATS ? 'text-emerald-700' : 'text-slate-700'}`}>
              {isATS ? 'ATS-Friendly Format' : 'Normal Format'}
            </span>
            {showSampleIndicator && (
              <>
                <span className="text-slate-400">&middot;</span>
                <span className="cl-sample-badge text-slate-500 font-medium italic">
                  Sample Preview
                </span>
              </>
            )}
          </div>
        </div>

        {/* Live Overflow Alert Banner (only when content exceeds 1 A4 page at 10pt min) */}
        {isHeightOverflowing && (
          <div
            role="alert"
            className="w-[800px] max-w-full mb-3 print:hidden px-4 py-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{warningText}</span>
          </div>
        )}

        {/* Single A4 Page Sheet (800 x 1131 px) & Single Template Render */}
        <div
          className="document-page-sheet a4-page-sheet one-page-fit-sheet relative overflow-hidden shadow-[0_14px_40px_rgba(15,23,42,0.12)] border border-slate-300/60 print:shadow-none print:border-none"
          data-document-page="1"
          data-one-page-fit="true"
          data-document-type="cover-letter"
          lang="en"
          data-cl-justify="true"
          data-is-overflowing={isHeightOverflowing ? 'true' : 'false'}
          data-overflow-paragraph={String(longestParagraphIndex || 2)}
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
          <div
            ref={stageRef}
            className="cl-one-page-stage"
            data-cl-fit-level={String(fitLevel)}
            data-cl-font-size={fontSizeChoice}
            data-cl-justify="true"
            data-cl-balance={isVerticallyBalanced ? 'true' : undefined}
            style={{
              width: '800px',
              height: '1131px',
            }}
          >
            <ResolvedTemplate data={data} mapped={mapped} />
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
    </CoverLetterPreviewProvider>
  );
};
