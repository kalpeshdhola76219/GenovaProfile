import React from 'react';
import { sanitizeDocumentTextFields, sanitizeText } from '../../utils/textSanitizer';

export { sanitizeDocumentTextFields, sanitizeText };

export const METADATA_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
};

export const METADATA_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '12px',
};

export const METADATA_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
  width: '140px',
  whiteSpace: 'nowrap',
};

export const METADATA_WIDE_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
  width: '40%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
};

export const HEADER_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
};

export const HEADER_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '16px',
};

export const HEADER_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
  whiteSpace: 'nowrap',
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

export const ResumeSplitRow: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  leftClassName?: string;
  leftStyle?: React.CSSProperties;
  rightClassName?: string;
  rightStyle?: React.CSSProperties;
  rightWidth?: string;
  wrapRight?: boolean;
  verticalAlign?: 'top' | 'middle' | 'bottom' | 'baseline';
}> = ({
  left,
  right,
  className,
  style,
  leftClassName,
  leftStyle,
  rightClassName,
  rightStyle,
  rightWidth,
  wrapRight = false,
  verticalAlign = 'top',
}) => {
  const hasRight = right !== undefined && right !== null && right !== false && right !== '';
  return (
    <table
      className={className}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        margin: 0,
        padding: 0,
        border: 'none',
        ...style,
      }}
    >
      <tbody>
        <tr>
          <td
            className={leftClassName}
            style={{
              verticalAlign,
              textAlign: 'left',
              padding: 0,
              paddingRight: hasRight ? '12px' : 0,
              border: 'none',
              background: 'transparent',
              ...leftStyle,
            }}
          >
            {left}
          </td>
          {hasRight && (
            <td
              className={rightClassName}
              style={{
                verticalAlign,
                textAlign: 'right',
                padding: 0,
                border: 'none',
                background: 'transparent',
                width: rightWidth ?? (wrapRight ? '40%' : '152px'),
                whiteSpace: wrapRight ? 'normal' : 'nowrap',
                overflowWrap: wrapRight ? 'anywhere' : 'normal',
                ...rightStyle,
              }}
            >
              {right}
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export const ResumeHeaderTable: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  leftClassName?: string;
  leftStyle?: React.CSSProperties;
  rightClassName?: string;
  rightStyle?: React.CSSProperties;
  rightWidth?: string;
  nowrapRight?: boolean;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}> = ({
  left,
  right,
  className,
  style,
  leftClassName,
  leftStyle,
  rightClassName,
  rightStyle,
  rightWidth,
  nowrapRight = true,
  verticalAlign = 'top',
}) => {
  const hasRight = right !== undefined && right !== null && right !== false && right !== '';
  return (
    <table
      className={className}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: 0,
        padding: 0,
        border: 'none',
        ...style,
      }}
    >
      <tbody>
        <tr>
          <td
            className={leftClassName}
            style={{
              verticalAlign,
              textAlign: 'left',
              padding: 0,
              paddingRight: hasRight ? '16px' : 0,
              border: 'none',
              background: 'transparent',
              ...leftStyle,
            }}
          >
            {left}
          </td>
          {hasRight && (
            <td
              className={rightClassName}
              style={{
                verticalAlign,
                textAlign: 'right',
                padding: 0,
                border: 'none',
                background: 'transparent',
                width: rightWidth ?? (nowrapRight ? '1%' : '44%'),
                whiteSpace: nowrapRight ? 'nowrap' : 'normal',
                ...rightStyle,
              }}
            >
              {right}
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

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
