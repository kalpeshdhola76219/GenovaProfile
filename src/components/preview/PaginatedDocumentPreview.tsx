import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const MultiPagePaginatedDocumentPreview: React.FC<PaginatedDocumentPreviewProps> = ({
  data,
  TemplateComponent,
  isUnpaidPremium = false,
  onPageCountChange,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
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

  // Re-calculate pages whenever data or template changes
  const runPaginationCalculation = () => {
    if (!measureRef.current) return;
    const result = calculateDocumentPagination(measureRef.current);
    setPagination(result);
    onPageCountChange?.(result.pageCount);
  };

  useLayoutEffect(() => {
    runPaginationCalculation();
  }, [
    data.templateId,
    data.type,
    data.customization.fontSize,
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
  ]);

  // Recalculate after images load or window resizes
  useEffect(() => {
    const timer = setTimeout(runPaginationCalculation, 150);

    // Watch for image loads inside measurement container
    const measureEl = measureRef.current;
    if (measureEl) {
      const imgs = Array.from(measureEl.querySelectorAll('img'));
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', runPaginationCalculation);
          img.addEventListener('error', runPaginationCalculation);
        }
      });
    }

    return () => clearTimeout(timer);
  }, [data]);

  const { pageBreaks, pageCount, isMultiPage } = pagination;

  return (
    <div className="w-full flex flex-col items-center">
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
