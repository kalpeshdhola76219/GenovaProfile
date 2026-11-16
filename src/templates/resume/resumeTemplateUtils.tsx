import React from 'react';
import { sanitizeDocumentTextFields, sanitizeText } from '../../utils/textSanitizer';

export { sanitizeDocumentTextFields, sanitizeText };

export const METADATA_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  gap: '16px',
  columnGap: '16px',
  rowGap: '2px',
};

export const METADATA_LEFT_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

export const METADATA_RIGHT_STYLE: React.CSSProperties = {
  flexShrink: 0,
  whiteSpace: 'nowrap',
  textAlign: 'right',
};

export const CONTACT_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: '14px',
  rowGap: '4px',
};

export const CONTACT_CENTER_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  columnGap: '14px',
  rowGap: '4px',
};

export const BULLET_LIST_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '4px',
};

export const BULLET_ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: '8px',
  lineHeight: '1.5',
};

export const BULLET_MARKER_STYLE: React.CSSProperties = {
  flexShrink: 0,
  userSelect: 'none',
  lineHeight: '1.5',
};

export const BULLET_TEXT_STYLE: React.CSSProperties = {
  flex: '1 1 0%',
  minWidth: 0,
};

export const isBulletedOrMultiline = (text?: string): boolean => {
  if (!text) return false;
  const trimmed = sanitizeText(text).trim();
  return (
    text.includes('\n') ||
    trimmed.startsWith('-') ||
    trimmed.startsWith('•') ||
    trimmed.startsWith('*')
  );
};

export const parseBulletLines = (text?: string): string[] => {
  if (!text) return [];
  return sanitizeText(text)
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);
};

export const ResumeBulletItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  markerClassName?: string;
  marker?: string;
}> = ({
  children,
  className = 'leading-relaxed',
  markerClassName = 'text-slate-400',
  marker = '•',
}) => (
  <div
    data-bullet="true"
    className={`flex items-start gap-2 ${className}`}
    style={BULLET_ITEM_STYLE}
  >
    <span
      className={`select-none shrink-0 ${markerClassName}`}
      style={BULLET_MARKER_STYLE}
      aria-hidden="true"
    >
      {marker}
    </span>
    <span style={BULLET_TEXT_STYLE}>{children}</span>
  </div>
);

export const ResumeDescriptionBlock: React.FC<{
  text?: string;
  wrapperClassName?: string;
  itemClassName?: string;
  markerClassName?: string;
  paragraphClassName?: string;
}> = ({
  text,
  wrapperClassName = 'mt-1 space-y-1 text-xs text-slate-700',
  itemClassName = 'leading-relaxed',
  markerClassName = 'text-slate-400',
  paragraphClassName = 'text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed',
}) => {
  const safe = text ? sanitizeText(text) : '';
  if (!safe) return null;
  if (isBulletedOrMultiline(safe)) {
    const lines = parseBulletLines(safe);
    if (lines.length === 0) return null;
    return (
      <div className={wrapperClassName} style={BULLET_LIST_STYLE}>
        {lines.map((line, idx) => (
          <ResumeBulletItem
            key={idx}
            className={itemClassName}
            markerClassName={markerClassName}
          >
            {line}
          </ResumeBulletItem>
        ))}
      </div>
    );
  }
  return <p className={paragraphClassName}>{safe}</p>;
};
