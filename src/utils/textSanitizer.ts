/**
 * Normalizes stray backslash escapes (e.g. `\$120M+` -> `$120M+`, `\%` -> `%`, `\&` -> `&`)
 * produced by markdown/JSON/AI inputs while leaving legitimate backslashes and URLs intact.
 */
export function sanitizeDisplayText(value: string): string {
  if (typeof value !== 'string' || !value) return value;
  return value.replace(/\\{1,2}([$€£₹¥%#&_*])/g, '$1');
}

export const sanitizeText = sanitizeDisplayText;

const SKIP_STRING_KEYS = new Set([
  'id',
  'templateId',
  'type',
  'status',
  'createdAt',
  'updatedAt',
  'profilePhoto',
  'extraPhotos',
  'signatureImage',
  'qrCodeUrl',
  'fontFamily',
  'fontSize',
  'headingSize',
  'lineHeight',
  'margins',
  'sectionSpacing',
  'primaryColor',
  'accentColor',
  'paperColor',
  'nameStyle',
  'dateFormat',
  'coverLetterType',
]);

function walkAndSanitizeText<T>(node: T, currentKey?: string): T {
  if (node === null || node === undefined) return node;
  if (typeof node === 'string') {
    if (
      (currentKey && SKIP_STRING_KEYS.has(currentKey)) ||
      node.startsWith('data:') ||
      node.startsWith('blob:')
    ) {
      return node;
    }
    return sanitizeDisplayText(node) as unknown as T;
  }
  if (Array.isArray(node)) {
    return node.map((item) => walkAndSanitizeText(item)) as unknown as T;
  }
  if (typeof node === 'object') {
    const record = node as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      if (SKIP_STRING_KEYS.has(key)) {
        out[key] = record[key];
      } else {
        out[key] = walkAndSanitizeText(record[key], key);
      }
    }
    return out as T;
  }
  return node;
}

export function sanitizeDocumentTextFields<T>(doc: T): T {
  return walkAndSanitizeText(doc);
}
