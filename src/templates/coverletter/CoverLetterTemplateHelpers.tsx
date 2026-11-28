import React, { createContext, useContext, useLayoutEffect, useRef } from 'react';
import { DocumentCustomization } from '../../types/document';
import { MappedCoverLetterData } from '../../utils/mapCoverLetterData';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { sanitizeDocumentTextFields, sanitizeText } from '../../utils/textSanitizer';

export { sanitizeDocumentTextFields, sanitizeText };

export const CL_METADATA_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
};

export const CL_METADATA_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '12px',
};

export const CL_METADATA_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
  width: '140px',
  whiteSpace: 'nowrap',
};

export const CL_HEADER_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
};

export const CL_HEADER_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '16px',
};

export const CL_HEADER_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

interface CoverLetterPreviewContextValue {
  isExportMode: boolean;
  previewMode: 'sample' | 'live';
}

export const CoverLetterPreviewContext = createContext<CoverLetterPreviewContextValue>({
  isExportMode: false,
  previewMode: 'sample',
});

export const CoverLetterPreviewProvider: React.FC<{
  isExportMode: boolean;
  previewMode?: 'sample' | 'live';
  children: React.ReactNode;
}> = ({ isExportMode, previewMode, children }) => {
  const parent = useContext(CoverLetterPreviewContext);
  const effectiveExportMode = isExportMode || parent.isExportMode;
  const effectivePreviewMode = previewMode || parent.previewMode;
  return (
    <CoverLetterPreviewContext.Provider
      value={{ isExportMode: effectiveExportMode, previewMode: effectivePreviewMode }}
    >
      {children}
    </CoverLetterPreviewContext.Provider>
  );
};

export function useCoverLetterPreviewMode(): CoverLetterPreviewContextValue {
  return useContext(CoverLetterPreviewContext);
}

export function shouldShowCoverLetterSlot(
  value: string | undefined,
  previewMode: 'sample' | 'live',
  isExportMode: boolean,
  required: boolean = false
): boolean {
  if (value && value.trim().length > 0) return true;
  if (isExportMode) return false;
  if (previewMode === 'sample') return true;
  return required;
}

export function getCoverLetterSheetTypography(
  customization?: DocumentCustomization,
  defaultFont: DocumentCustomization['fontFamily'] = 'jakarta'
) {
  const fontClass = getStaticFontClass(customization?.fontFamily, defaultFont);
  const paddingClass =
    customization?.margins === 'compact'
      ? 'p-10'
      : customization?.margins === 'spacious'
      ? 'p-14'
      : 'p-12';

  return { fontClass, paddingClass };
}

export const CoverLetterContactBar: React.FC<{
  items: React.ReactNode[];
  separator?: React.ReactNode;
  separatorClassName?: string;
  className?: string;
  center?: boolean;
}> = ({
  items,
  separator = '|',
  separatorClassName = 'text-slate-300',
  className = '',
  center = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncLineEnds = () => {
      const children = Array.from(container.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        const current = children[i];
        const next = children[i + 1];
        if (!next) {
          if (current.hasAttribute('data-line-end')) {
            current.removeAttribute('data-line-end');
          }
          continue;
        }
        const wrapped = Math.abs(current.offsetTop - next.offsetTop) > 2;
        if (wrapped) {
          if (current.getAttribute('data-line-end') !== 'true') {
            current.setAttribute('data-line-end', 'true');
          }
        } else if (current.hasAttribute('data-line-end')) {
          current.removeAttribute('data-line-end');
        }
      }
    };

    syncLineEnds();

    if (typeof ResizeObserver === 'undefined') return;
    let rafId = 0;
    const observer = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        syncLineEnds();
      });
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [items.length, center]);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`cl-contact-bar cl-meta flex flex-wrap items-center ${
        center ? 'justify-center' : ''
      } gap-y-0.5 break-words ${className}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: center ? 'center' : undefined,
        rowGap: '2px',
      }}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="cl-contact-item inline-flex items-center"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <span>{item}</span>
          {idx < items.length - 1 && (
            <span
              className={`cl-contact-sep mx-2 select-none ${separatorClassName}`}
              style={{ marginLeft: '8px', marginRight: '8px' }}
              aria-hidden="true"
            >
              {separator}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export const CoverLetterSampleText: React.FC<{
  value?: string;
  sample: string;
  required?: boolean;
  dark?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}> = ({ value, sample, required = false, dark = false, prefix, suffix }) => {
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const clean = sanitizeText((value || '').trim());
  if (clean) {
    return (
      <>
        {prefix}
        {clean}
        {suffix}
      </>
    );
  }
  if (isExportMode) return null;
  if (previewMode === 'live' && !required) return null;

  const isDottedRequired = previewMode === 'live' && required;

  return (
    <span
      className={`cl-sample-placeholder italic font-normal ${
        dark ? 'text-white/60' : 'text-slate-400'
      } ${
        isDottedRequired
          ? dark
            ? 'border-b border-dotted border-white/50 pb-[1px]'
            : 'border-b border-dotted border-slate-400 pb-[1px]'
          : ''
      }`}
    >
      {prefix}
      {sample}
      {suffix}
    </span>
  );
};

export const CoverLetterDetailsBlock: React.FC<{
  mapped: MappedCoverLetterData;
  variant?: 'ats' | 'normal';
  accentColor?: string;
  className?: string;
}> = ({ mapped, variant = 'normal', accentColor, className = '' }) => {
  const hasDetails = mapped.details.length > 0;
  const hasFreelanceSummary = Boolean(mapped.freelanceSummaryLine);

  if (!hasDetails && !hasFreelanceSummary) {
    return null;
  }

  if (variant === 'ats') {
    return (
      <div
        className={`cl-details-block mb-4 cl-meta space-y-0.5 break-words ${className}`}
      >
        <div className="cl-label font-bold uppercase tracking-wider text-gray-500 mb-1">
          Application Details
        </div>
        {hasFreelanceSummary && (
          <div className="cl-meta font-semibold text-black">{sanitizeText(mapped.freelanceSummaryLine || '')}</div>
        )}
        {mapped.details.map((item) => (
          <div key={item.label} className="cl-meta">
            <span className="font-medium text-gray-600">{item.label}:</span>{' '}
            <span className="font-semibold text-black">{sanitizeText(item.value)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`cl-details-block mb-4 py-2.5 px-3.5 rounded-md bg-slate-50/85 border border-slate-200/80 cl-meta break-words ${className}`}
      style={accentColor ? { borderLeft: `2px solid ${accentColor}` } : undefined}
    >
      <div className="cl-label font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        Application Details
      </div>
      {hasFreelanceSummary && (
        <div className="cl-meta font-bold text-slate-900 mb-1.5">{sanitizeText(mapped.freelanceSummaryLine || '')}</div>
      )}
      {hasDetails && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {mapped.details.map((item) => (
            <div key={item.label} className="cl-meta whitespace-normal">
              <span className="font-medium text-slate-500">{item.label}:</span>{' '}
              <span className="text-slate-900 font-semibold">{sanitizeText(item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UNBREAKABLE_TOKEN_REGEX =
  /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:https?:\/\/|www\.|linkedin\.com\/|github\.com\/)[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/g;

function renderBodyParagraphTokens(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  UNBREAKABLE_TOKEN_REGEX.lastIndex = 0;

  while ((match = UNBREAKABLE_TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    let token = match[0];
    let trailingPunctuation = '';
    const punctMatch = token.match(/[.,;:!?)]+$/);
    if (punctMatch) {
      trailingPunctuation = punctMatch[0];
      token = token.slice(0, token.length - trailingPunctuation.length);
    }

    if (token) {
      nodes.push(
        <span key={`${match.index}-${token}`} className="cl-unbreakable-token">
          {token}
        </span>
      );
    }
    if (trailingPunctuation) {
      nodes.push(trailingPunctuation);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export const CoverLetterBodyBlocks: React.FC<{
  mapped: MappedCoverLetterData;
  className?: string;
}> = ({ mapped, className = 'text-slate-800' }) => {
  const { isExportMode } = useCoverLetterPreviewMode();

  if (mapped.blocks.length === 0) {
    if (isExportMode || mapped.previewMode === 'live') return null;
    return (
      <div className={`cl-body-content cl-body cl-sample-placeholder ${className}`}>
        <p className="text-slate-400 italic font-normal">Write your cover letter here...</p>
      </div>
    );
  }

  return (
    <div className={`cl-body-content cl-body ${className}`}>
      {mapped.blocks.map((block) => (
        <div key={block.id}>
          {block.text && <p>{renderBodyParagraphTokens(sanitizeText(block.text))}</p>}
        </div>
      ))}
    </div>
  );
};

export const CoverLetterClosingBlock: React.FC<{
  mapped: MappedCoverLetterData;
  containerClassName?: string;
}> = ({
  mapped,
  containerClassName = 'mt-7 pt-3 avoid-break text-slate-800',
}) => {
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const { closing, sender } = mapped;

  const showNameOrPlaceholder = shouldShowCoverLetterSlot(
    closing.signatureName,
    previewMode,
    isExportMode,
    true
  );
  const titleAndCompany = [sender.professionalTitle, sender.companyName].filter(Boolean).join(', ');
  const showTitle = shouldShowCoverLetterSlot(
    titleAndCompany,
    previewMode,
    isExportMode,
    false
  );

  const hasRealContent = Boolean(
    closing.declarationLine ||
      closing.signOff ||
      closing.signatureName ||
      closing.signatureImage ||
      closing.enclosures
  );

  if (!hasRealContent && isExportMode) return null;

  return (
    <div className={`cl-signature-block avoid-break ${containerClassName}`}>
      {closing.declarationLine && (
        <p className="cl-meta text-slate-700 mb-3 break-words">
          <strong className="font-semibold text-slate-900">Declaration:</strong> {sanitizeText(closing.declarationLine)}
        </p>
      )}
      {closing.signOff && (
        <div className="cl-body font-normal break-words">{sanitizeText(closing.signOff)}</div>
      )}

      {closing.signatureType === 'image' && closing.signatureImage ? (
        <div className="my-1.5">
          <img
            src={closing.signatureImage}
            alt="Signature"
            crossOrigin={
              closing.signatureImage.startsWith('data:') || closing.signatureImage.startsWith('blob:')
                ? undefined
                : 'anonymous'
            }
            referrerPolicy={
              closing.signatureImage.startsWith('data:') || closing.signatureImage.startsWith('blob:')
                ? undefined
                : 'no-referrer'
            }
            className="max-h-[44px] w-auto object-contain"
          />
        </div>
      ) : (
        <div className="h-[28px]" aria-hidden="true" />
      )}

      {showNameOrPlaceholder && (
        <div
          className={`${
            closing.handwrittenSignature
              ? 'cl-signature-handwritten'
              : 'cl-body font-semibold'
          } break-words`}
        >
          <CoverLetterSampleText value={closing.signatureName} sample="Your Name" required />
        </div>
      )}

      {showTitle && (
        <div className="cl-meta font-normal text-slate-600 mt-0.5 break-words">
          <CoverLetterSampleText value={titleAndCompany} sample="Your Professional Title" />
        </div>
      )}

      {closing.enclosures && (
        <div className="cl-meta text-slate-600 font-normal pt-3 border-t border-slate-200 mt-4 break-words">
          <span className="font-semibold text-slate-800">Enclosures:</span> {sanitizeText(closing.enclosures)}
        </div>
      )}
    </div>
  );
};
