import React from 'react';
import {
  sanitizeDocumentTextFields as baseSanitizeDocumentTextFields,
  sanitizeText,
} from '../../utils/textSanitizer';

export { sanitizeText };

const isLanguageSectionTitle = (title?: string): boolean => {
  const t = (title || '').trim();
  if (!t) return false;
  return /^(spoken\s+|known\s+)?languages?(\s+(known|spoken|proficiency|skills|fluency)|(\s*[/&]\s*.*))?$/i.test(t);
};

export function sanitizeDocumentTextFields<T>(doc: T): T {
  const sanitized = baseSanitizeDocumentTextFields(doc) as any;
  if (!sanitized || typeof sanitized !== 'object') return sanitized;

  if (Array.isArray(sanitized.customSections)) {
    const mergedMap = new Map<string, any>();
    const orderedKeys: string[] = [];

    for (const rawSec of sanitized.customSections) {
      if (!rawSec || typeof rawSec !== 'object') continue;
      const rawTitle = typeof rawSec.title === 'string' ? rawSec.title.trim() : '';
      const rawItems = Array.isArray(rawSec.items)
        ? rawSec.items.filter(
            (it: any) =>
              it &&
              typeof it === 'object' &&
              (String(it.key || '').trim().length > 0 || String(it.value || '').trim().length > 0)
          )
        : [];
      const rawContent = typeof rawSec.content === 'string' ? rawSec.content.trim() : '';

      // Drop completely empty custom sections (prevents orphaned headings like empty LANGUAGES)
      if (rawItems.length === 0 && !rawContent) {
        continue;
      }

      const isLang = isLanguageSectionTitle(rawTitle);
      const normKey = isLang
        ? '__languages__'
        : rawTitle
        ? rawTitle.toLowerCase().replace(/\s+/g, ' ')
        : `__untitled_${orderedKeys.length}__`;

      if (!mergedMap.has(normKey)) {
        const seenItemKeys = new Set<string>();
        const dedupedItems: any[] = [];
        for (const it of rawItems) {
          const itemKey = `${String(it.key || '').trim().toLowerCase()}::${String(it.value || '').trim().toLowerCase()}`;
          if (!seenItemKeys.has(itemKey)) {
            seenItemKeys.add(itemKey);
            dedupedItems.push(it);
          }
        }

        mergedMap.set(normKey, {
          ...rawSec,
          title: rawTitle || (isLang ? 'Languages' : 'Additional Details'),
          items: dedupedItems,
          content: rawContent,
          _seenItemKeys: seenItemKeys,
          _contentParts: rawContent ? [rawContent] : [],
          _seenContentNorm: new Set(rawContent ? [rawContent.toLowerCase().replace(/\s+/g, ' ')] : []),
        });
        orderedKeys.push(normKey);
      } else {
        const existing = mergedMap.get(normKey);
        if (!existing.title && rawTitle) existing.title = rawTitle;

        for (const it of rawItems) {
          const itemKey = `${String(it.key || '').trim().toLowerCase()}::${String(it.value || '').trim().toLowerCase()}`;
          if (!existing._seenItemKeys.has(itemKey)) {
            existing._seenItemKeys.add(itemKey);
            existing.items.push(it);
          }
        }

        if (rawContent) {
          const normContent = rawContent.toLowerCase().replace(/\s+/g, ' ');
          if (!existing._seenContentNorm.has(normContent)) {
            existing._seenContentNorm.add(normContent);
            existing._contentParts.push(rawContent);
          }
        }
      }
    }

    sanitized.customSections = orderedKeys.map((key) => {
      const entry = mergedMap.get(key);
      const { _seenItemKeys, _contentParts, _seenContentNorm, ...cleanSec } = entry;
      return {
        ...cleanSec,
        items: entry.items && entry.items.length > 0 ? entry.items : undefined,
        content: _contentParts.join('\n'),
      };
    });
  }

  return sanitized as T;
}

export const RESUME_SHEET_BASE_STYLE: React.CSSProperties = {
  minHeight: 'var(--a4-sheet-min-height, 1123px)',
  boxSizing: 'border-box',
  position: 'relative',
};

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

export const ResumeTwoColumnTable: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  rightWidth?: string;
  gapPx?: number;
  className?: string;
  style?: React.CSSProperties;
  leftClassName?: string;
  leftStyle?: React.CSSProperties;
  rightClassName?: string;
  rightStyle?: React.CSSProperties;
}> = ({
  left,
  right,
  leftWidth = '50%',
  rightWidth = '50%',
  gapPx = 24,
  className,
  style,
  leftClassName,
  leftStyle,
  rightClassName,
  rightStyle,
}) => {
  const halfGap = Math.round(gapPx / 2);
  return (
    <table
      data-layout-table="true"
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
              width: leftWidth,
              verticalAlign: 'top',
              padding: 0,
              paddingRight: `${halfGap}px`,
              border: 'none',
              background: 'transparent',
              ...leftStyle,
            }}
          >
            {left}
          </td>
          <td
            className={rightClassName}
            style={{
              width: rightWidth,
              verticalAlign: 'top',
              padding: 0,
              paddingLeft: `${halfGap}px`,
              border: 'none',
              background: 'transparent',
              ...rightStyle,
            }}
          >
            {right}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const ResumeTwoColGrid: React.FC<{
  items: React.ReactNode[];
  gapX?: number;
  gapY?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ items, gapX = 12, gapY = 10, className, style }) => {
  if (!items || items.length === 0) return null;
  const rows: Array<[React.ReactNode, React.ReactNode | null]> = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], i + 1 < items.length ? items[i + 1] : null]);
  }
  const halfGap = Math.round(gapX / 2);
  return (
    <div className={className} style={style}>
      {rows.map((pair, rIdx) => (
        <div
          key={rIdx}
          data-entry="true"
          className="avoid-break"
          style={{ marginBottom: rIdx < rows.length - 1 ? `${gapY}px` : 0 }}
        >
          <table
            data-layout-table="true"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              margin: 0,
              padding: 0,
              border: 'none',
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: '50%',
                    verticalAlign: 'top',
                    padding: 0,
                    paddingRight: `${halfGap}px`,
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  {pair[0]}
                </td>
                <td
                  style={{
                    width: '50%',
                    verticalAlign: 'top',
                    padding: 0,
                    paddingLeft: `${halfGap}px`,
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  {pair[1]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export const ResumeCustomSectionBody: React.FC<{
  items?: Array<{ id?: string; key: string; value: string }>;
  content?: string;
  textClassName?: string;
  keyClassName?: string;
  columns?: 1 | 2;
}> = ({
  items,
  content,
  textClassName = 'text-xs text-slate-700',
  keyClassName = 'font-semibold',
  columns = 2,
}) => {
  const validItems = Array.isArray(items)
    ? items.filter((it) => (it.key || '').trim() || (it.value || '').trim())
    : [];
  const hasContent = Boolean(content && content.trim());

  if (validItems.length === 0 && !hasContent) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '6px' }}>
      {validItems.length > 0 &&
        (columns === 1 ? (
          <div className={textClassName} style={{ display: 'flex', flexDirection: 'column', rowGap: '4px' }}>
            {validItems.map((it, idx) => (
              <div key={it.id || idx}>
                <ResumeSplitRow
                  wrapRight
                  leftClassName={keyClassName}
                  left={it.key ? `${it.key}:` : ''}
                  right={it.value}
                  rightWidth="52%"
                />
              </div>
            ))}
          </div>
        ) : (
          <ResumeTwoColGrid
            className={textClassName}
            gapX={16}
            gapY={6}
            items={validItems.map((it, idx) => (
              <div key={it.id || idx}>
                <span className={keyClassName}>{it.key}:</span> {it.value}
              </div>
            ))}
          />
        ))}
      {hasContent && (
        <p className={`${textClassName} whitespace-pre-line leading-relaxed`} style={{ margin: 0 }}>
          {content}
        </p>
      )}
    </div>
  );
};

