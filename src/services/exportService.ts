import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { formatRgb } from 'culori';
import { rebuildCoverLetterBodyLinesForExport } from '../utils/coverLetterLineBreaker';

export interface ExportResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface PendingExportRequest {
  type: 'pdf' | 'png' | 'print';
  documentId: string;
  filename: string;
  requestedAt: number;
}

/**
 * Centralized High-Definition Export Configuration
 * Standard A4 @ 300 DPI = 2480 × 3508 pixels
 * Standard A4 CSS dimensions @ 96 DPI = 210mm × 297mm ≈ 793.7px × 1122.5px
 * Exact scale factor = 2480 / 793.70 ≈ 3.125
 */
export const EXPORT_CONFIG = {
  targetDpi: 300,
  targetWidthPx: 2480,
  targetHeightPx: 3508,
  desktopScale: 2,
  mobileScale: 2,
  maxCanvasPixelsDesktop: 25000000,
  maxCanvasPixelsMobile: 12000000,
  jpegQuality: 1.0,
} as const;

let isExportInProgress = false;

export function calculateOptimalExportScale(element: HTMLElement, _targetDpi: number = 300): number {
  const widthPx = element.offsetWidth || 794;
  const heightPx = element.offsetHeight || 1123;
  const isMobile =
    typeof window !== 'undefined' &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window.innerWidth !== 'undefined' && window.innerWidth < 768));

  let scale: number = isMobile ? EXPORT_CONFIG.mobileScale : EXPORT_CONFIG.desktopScale;
  const maxSafePixels = isMobile ? EXPORT_CONFIG.maxCanvasPixelsMobile : EXPORT_CONFIG.maxCanvasPixelsDesktop;
  const projectedPixels = widthPx * scale * (heightPx * scale);

  if (projectedPixels > maxSafePixels) {
    const scaleFactor = Math.sqrt(maxSafePixels / (widthPx * heightPx));
    scale = Math.max(1.5, Math.floor(scaleFactor * 100) / 100);
  }

  return scale;
}

export function generateExportFilename(
  fullName?: string,
  docTitle?: string,
  docType?: 'biodata' | 'resume' | 'cover-letter',
  extension: 'pdf' | 'png' = 'pdf'
): string {
  const name = (fullName || '').trim();
  const typeLabel =
    docType === 'biodata'
      ? 'Matrimonial-Profile'
      : docType === 'cover-letter'
      ? 'Cover-Letter'
      : 'Resume';

  let base = '';
  if (name) {
    const cleanName = name
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    base = `${cleanName}-${typeLabel}`;
  } else if (
    docTitle &&
    !docTitle.toLowerCase().includes('untitled') &&
    docTitle !== 'My Resume' &&
    docTitle !== 'My Biodata'
  ) {
    base = docTitle
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  } else {
    base = `GenovaProfile-${typeLabel}`;
  }

  base = base.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  return `${base}.${extension}`;
}

const KNOWN_TEMPLATE_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Poppins',
  'Playfair Display',
  'Cormorant Garamond',
  'Cinzel',
  'JetBrains Mono',
  'Caveat',
  'Rozha One',
  'Yatra One',
  'Noto Sans Gujarati',
];

const GUJARATI_CHAR_REGEX = /[\u0A80-\u0AFF]/;
const MODERN_COLOR_FUNC_REGEX = /(oklch|oklab|lab|lch|color-mix|color)\(/gi;

let colorProbeEl: HTMLSpanElement | null = null;

function resolveColorMixInDom(expr: string): string | null {
  if (typeof document === 'undefined' || !document.body) return null;
  try {
    if (!colorProbeEl || !document.body.contains(colorProbeEl)) {
      colorProbeEl = document.createElement('span');
      colorProbeEl.style.position = 'fixed';
      colorProbeEl.style.left = '-9999px';
      colorProbeEl.style.top = '-9999px';
      colorProbeEl.style.visibility = 'hidden';
      colorProbeEl.style.pointerEvents = 'none';
      document.body.appendChild(colorProbeEl);
    }
    colorProbeEl.style.color = '';
    colorProbeEl.style.color = expr;
    const resolved = window.getComputedStyle(colorProbeEl).color;
    if (!resolved || resolved.includes('color-mix')) return null;
    if (resolved.includes('oklch') || resolved.includes('oklab') || resolved.includes('lab(') || resolved.includes('lch(') || resolved.includes('color(')) {
      return formatRgb(resolved) || resolved;
    }
    return resolved;
  } catch {
    return null;
  }
}

function replaceBalancedColorFunctions(
  input: string,
  transform: (fnName: string, fullExpr: string) => string
): string {
  const lower = input.toLowerCase();
  const targets = ['color-mix(', 'oklch(', 'oklab(', 'color(', 'lab(', 'lch('];
  let result = '';
  let idx = 0;

  while (idx < input.length) {
    let nextPos = -1;
    let matchedTarget = '';
    for (const t of targets) {
      const found = lower.indexOf(t, idx);
      if (found !== -1 && (nextPos === -1 || found < nextPos)) {
        // Ensure word boundary before function name (not part of e.g. background-color() or var(--color-))
        const prevChar = found > 0 ? lower[found - 1] : '';
        if (!prevChar || !/[a-z0-9_-]/i.test(prevChar)) {
          nextPos = found;
          matchedTarget = t;
        }
      }
    }

    if (nextPos === -1) {
      result += input.slice(idx);
      break;
    }

    result += input.slice(idx, nextPos);
    const openParenIdx = nextPos + matchedTarget.length - 1;
    let depth = 0;
    let endIdx = openParenIdx;

    while (endIdx < input.length) {
      const ch = input[endIdx];
      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          endIdx++;
          break;
        }
      }
      endIdx++;
    }

    if (depth !== 0) {
      result += input.slice(nextPos);
      break;
    }

    const fullExpr = input.slice(nextPos, endIdx);
    const fnName = matchedTarget.slice(0, -1);
    result += transform(fnName, fullExpr);
    idx = endIdx;
  }

  return result;
}

export function sanitizeModernColorString(cssString: string): string {
  if (!cssString || typeof cssString !== 'string') return cssString;
  MODERN_COLOR_FUNC_REGEX.lastIndex = 0;
  if (!MODERN_COLOR_FUNC_REGEX.test(cssString)) {
    return cssString;
  }

  return replaceBalancedColorFunctions(cssString, (fnName, fullExpr) => {
    try {
      if (fnName === 'color-mix') {
        const innerSanitized = sanitizeModernColorString(fullExpr.slice('color-mix('.length, -1));
        const normalizedExpr = `color-mix(${innerSanitized})`;
        const resolved = resolveColorMixInDom(normalizedExpr);
        return resolved || fullExpr;
      }
      const converted = formatRgb(fullExpr);
      return converted || fullExpr;
    } catch {
      return fullExpr;
    }
  });
}

function sanitizeCssRuleList(rules: CSSRuleList, styleRuleCtor: typeof CSSStyleRule): void {
  for (let r = 0; r < rules.length; r++) {
    const rule = rules[r] as CSSRule & { cssRules?: CSSRuleList; style?: CSSStyleDeclaration };
    if (rule instanceof styleRuleCtor && rule.style?.cssText) {
      const cssText = rule.style.cssText;
      if (
        cssText.includes('oklch') ||
        cssText.includes('oklab') ||
        cssText.includes('color(') ||
        cssText.includes('color-mix(') ||
        cssText.includes('lab(') ||
        cssText.includes('lch(')
      ) {
        rule.style.cssText = sanitizeModernColorString(cssText);
      }
    } else if (rule.cssRules) {
      sanitizeCssRuleList(rule.cssRules, styleRuleCtor);
    }
  }
}

export function sanitizeClonedDocumentForExport(
  clonedDoc: Document,
  clonedTarget: HTMLElement,
  liveTarget: HTMLElement
): void {
  try {
    const styleElements = clonedDoc.querySelectorAll('style');
    styleElements.forEach((styleTag) => {
      if (
        styleTag.textContent &&
        (styleTag.textContent.includes('oklch') ||
          styleTag.textContent.includes('oklab') ||
          styleTag.textContent.includes('color(') ||
          styleTag.textContent.includes('color-mix('))
      ) {
        styleTag.textContent = sanitizeModernColorString(styleTag.textContent);
      }
    });
  } catch (e) {
    console.warn('Notice while sanitizing cloned style tags:', e);
  }

  try {
    const sheets = clonedDoc.styleSheets;
    const styleRuleCtor = clonedDoc.defaultView?.CSSStyleRule || CSSStyleRule;
    for (let s = 0; s < sheets.length; s++) {
      try {
        const sheet = sheets[s];
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          sanitizeCssRuleList(rules, styleRuleCtor);
        }
      } catch {}
    }
  } catch (e) {
    console.warn('Notice while inspecting cloned stylesheets:', e);
  }

  try {
    const liveElements = [liveTarget, ...Array.from(liveTarget.querySelectorAll('*'))] as HTMLElement[];
    const clonedElements = [clonedTarget, ...Array.from(clonedTarget.querySelectorAll('*'))] as HTMLElement[];
    const count = Math.min(liveElements.length, clonedElements.length);
    for (let i = 0; i < count; i++) {
      const liveEl = liveElements[i];
      const clonedEl = clonedElements[i];
      if (!liveEl || !clonedEl) continue;
      try {
        const computed = window.getComputedStyle(liveEl);
        const colorProps: Array<
          | 'color'
          | 'backgroundColor'
          | 'borderTopColor'
          | 'borderRightColor'
          | 'borderBottomColor'
          | 'borderLeftColor'
          | 'outlineColor'
          | 'textDecorationColor'
          | 'boxShadow'
          | 'textShadow'
          | 'fill'
          | 'stroke'
          | 'backgroundImage'
        > = [
          'color',
          'backgroundColor',
          'borderTopColor',
          'borderRightColor',
          'borderBottomColor',
          'borderLeftColor',
          'outlineColor',
          'textDecorationColor',
          'boxShadow',
          'textShadow',
          'fill',
          'stroke',
          'backgroundImage',
        ];
        for (const prop of colorProps) {
          const val = computed[prop];
          if (
            val &&
            typeof val === 'string' &&
            (val.includes('oklch') ||
              val.includes('oklab') ||
              val.includes('lab(') ||
              val.includes('lch(') ||
              val.includes('color(') ||
              val.includes('color-mix('))
          ) {
            const sanitized = sanitizeModernColorString(val);
            clonedEl.style[prop as any] = sanitized;
          }
        }
        if (computed.wordBreak === 'break-all') {
          clonedEl.style.wordBreak = 'normal';
        }
        if ((computed as any).hyphens === 'auto' || (computed as any).webkitHyphens === 'auto') {
          (clonedEl.style as any).hyphens = 'none';
          (clonedEl.style as any).webkitHyphens = 'none';
        }
        if (
          clonedEl.style.cssText &&
          (clonedEl.style.cssText.includes('oklch') ||
            clonedEl.style.cssText.includes('oklab') ||
            clonedEl.style.cssText.includes('color(') ||
            clonedEl.style.cssText.includes('color-mix('))
        ) {
          clonedEl.style.cssText = sanitizeModernColorString(clonedEl.style.cssText);
        }
      } catch {}
    }
  } catch (err) {
    console.warn('Notice while mapping computed colors to clone:', err);
  }

  try {
    let parent = clonedTarget.parentElement;
    while (parent && parent !== clonedDoc.body) {
      parent.style.transform = 'none';
      parent.style.transition = 'none';
      parent.style.zoom = '1';
      parent = parent.parentElement;
    }
    const liveComputedTarget = window.getComputedStyle(liveTarget);
    clonedTarget.style.transform = 'none';
    clonedTarget.style.transition = 'none';
    clonedTarget.style.zoom = '1';
    clonedTarget.style.width = liveTarget.style.width || `${liveTarget.offsetWidth || 800}px`;
    clonedTarget.style.height = liveTarget.style.height || `${liveTarget.offsetHeight || 1131}px`;
    clonedTarget.style.boxSizing = 'border-box';
    clonedTarget.style.wordBreak = 'normal';
    clonedTarget.style.overflowWrap = 'break-word';
    (clonedTarget.style as any).hyphens = 'none';
    (clonedTarget.style as any).webkitHyphens = 'none';
    clonedTarget.style.textRendering = liveComputedTarget.textRendering || 'auto';
  } catch {}
}

async function ensureFontsLoadedForElement(element: HTMLElement): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;

  const fontRequests = new Set<string>();
  const textContent = element.textContent || '';
  if (GUJARATI_CHAR_REGEX.test(textContent)) {
    fontRequests.add('400 16px "Noto Sans Gujarati"');
    fontRequests.add('500 16px "Noto Sans Gujarati"');
    fontRequests.add('600 16px "Noto Sans Gujarati"');
    fontRequests.add('700 16px "Noto Sans Gujarati"');
  }

  const nodes = [element, ...Array.from(element.querySelectorAll('*'))].slice(0, 250) as HTMLElement[];
  for (const node of nodes) {
    try {
      const style = window.getComputedStyle(node);
      const familyAttr = style.fontFamily || '';
      const weight = style.fontWeight || '400';
      const fontStyle = style.fontStyle === 'italic' ? 'italic' : 'normal';
      for (const knownFont of KNOWN_TEMPLATE_FONTS) {
        if (familyAttr.includes(knownFont)) {
          fontRequests.add(`${fontStyle} ${weight} 16px "${knownFont}"`);
          fontRequests.add(`normal 400 16px "${knownFont}"`);
          fontRequests.add(`normal 600 16px "${knownFont}"`);
          fontRequests.add(`normal 700 16px "${knownFont}"`);
        }
      }
    } catch {}
  }

  if (fontRequests.size > 0) {
    const loadPromises = Array.from(fontRequests).map((desc) =>
      document.fonts.load(desc).catch(() => [])
    );
    await Promise.race([
      Promise.allSettled(loadPromises),
      new Promise<void>((resolve) => setTimeout(resolve, 6000)),
    ]);
  }

  await Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => setTimeout(resolve, 6000)),
  ]);
}

async function waitForLayoutSettlement(rootElement: HTMLElement): Promise<void> {
  const start = Date.now();
  const maxWaitMs = 2500;

  while (Date.now() - start < maxWaitMs) {
    const unsettled =
      rootElement.querySelector('[data-pagination-settled="false"], [data-fit-settled="false"]') ||
      (rootElement.matches('[data-pagination-settled="false"], [data-fit-settled="false"]')
        ? rootElement
        : null);
    if (!unsettled) {
      break;
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function decodeAndVerifyImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  if (images.length === 0) return;

  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute('src') || img.src || '';
      if (!src) {
        throw new Error('A required image in the document has no source URL.');
      }

      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          let finished = false;
          const cleanup = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
          };
          const onLoad = () => {
            if (!finished) {
              finished = true;
              cleanup();
              resolve();
            }
          };
          const onError = () => {
            if (!finished) {
              finished = true;
              cleanup();
              reject(new Error('A required image or signature in the document failed to load.'));
            }
          };
          img.addEventListener('load', onLoad);
          img.addEventListener('error', onError);
          setTimeout(() => {
            if (!finished) {
              finished = true;
              cleanup();
              if (img.complete && img.naturalWidth > 0) {
                resolve();
              } else {
                reject(new Error('Timed out waiting for a required document image to load.'));
              }
            }
          }, 12000);
        });
      }

      if (img.naturalWidth <= 0) {
        throw new Error('A required image or signature in the document failed to load.');
      }

      if (typeof img.decode === 'function') {
        const isInlineSvg = src.startsWith('data:image/svg+xml');
        try {
          await img.decode();
        } catch (decodeErr) {
          if (!isInlineSvg || img.naturalWidth <= 0) {
            throw new Error('A required image in the document could not be decoded for export.');
          }
          console.warn('Inline SVG decode fallback notice:', decodeErr);
        }
      }
    })
  );
}

export async function waitForDocumentReadyForExport(element: HTMLElement): Promise<void> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Export timed out waiting for document resources to be ready.'));
    }, 15000);
  });

  const readyPromise = (async () => {
    if (!element || !document.body.contains(element)) {
      throw new Error('Document preview element is not mounted in the DOM.');
    }
    const computed = window.getComputedStyle(element);
    if (computed.display === 'none' || computed.visibility === 'hidden') {
      throw new Error('Document preview element is currently hidden.');
    }
    if (element.offsetWidth <= 0 || element.offsetHeight <= 0) {
      throw new Error('Document preview element has zero dimensions.');
    }

    await ensureFontsLoadedForElement(element);
    await waitForLayoutSettlement(element);
    await decodeAndVerifyImages(element);

    // Confirm stable two animation frames + brief paint settle after all fonts & decoded images are committed
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 150);
        });
      });
    });
  })();

  await Promise.race([readyPromise, timeoutPromise]);
}

function resolveRootElement(elementOrId: string | HTMLElement = 'document-preview-root'): HTMLElement {
  let rootElement: HTMLElement | null = null;
  if (typeof elementOrId === 'string') {
    rootElement = document.getElementById(elementOrId);
    if (!rootElement) {
      rootElement = document.querySelector(elementOrId) as HTMLElement;
    }
    if (!rootElement) {
      rootElement = document.querySelector('.document-page-sheet') as HTMLElement;
    }
    if (!rootElement) {
      rootElement = (document.querySelector('#document-preview-root') ||
        document.querySelector('[data-document-page]') ||
        document.querySelector('.print-container > div')) as HTMLElement;
    }
  } else if (elementOrId instanceof HTMLElement) {
    rootElement = elementOrId;
  }

  if (!rootElement) {
    throw new Error('Document preview element not found in DOM.');
  }

  return rootElement;
}

function getTargetSheetsAndAncestorTransform(elementOrId: string | HTMLElement = 'document-preview-root'): {
  rootElement: HTMLElement;
  pageSheets: HTMLElement[];
  transformedAncestor: HTMLElement | null;
  originalTransform: string;
  originalTransition: string;
  transformedTarget?: HTMLElement | null;
  originalTargetTransform?: string;
  originalTargetTransition?: string;
} {
  const rootElement = resolveRootElement(elementOrId);

  // Page selection: for biodata / OnePageFit, strictly select exactly 1 page sheet
  const onePageSheet = (rootElement.matches('[data-one-page-fit="true"], [data-document-type="biodata"]')
    ? rootElement
    : rootElement.querySelector('[data-one-page-fit="true"], [data-document-type="biodata"]')) as HTMLElement | null;

  let pageSheets: HTMLElement[] = [];
  if (onePageSheet) {
    if (onePageSheet.getAttribute('data-is-overflowing') === 'true') {
      throw new Error('Too much content for one page. Please shorten the highlighted text.');
    }
    pageSheets = [onePageSheet];
  } else {
    // Query individual page sheets inside the root preview element
    pageSheets = Array.from(rootElement.querySelectorAll('.a4-page-sheet')) as HTMLElement[];
    if (pageSheets.length === 0) {
      pageSheets = Array.from(rootElement.querySelectorAll('.document-page-sheet')) as HTMLElement[];
    }
    if (pageSheets.length === 0 && rootElement.classList.contains('document-page-sheet')) {
      pageSheets = [rootElement];
    }
    if (pageSheets.length === 0) {
      pageSheets = [rootElement];
    }

    // Exclude offscreen/hidden measurement containers
    pageSheets = pageSheets.filter((sheet) => {
      if (sheet.closest('[aria-hidden="true"]')) return false;
      if (sheet.getAttribute('aria-hidden') === 'true') return false;
      return true;
    });

    if (pageSheets.length === 0) {
      pageSheets = [rootElement];
    }
  }

  let transformedAncestor: HTMLElement | null = null;
  let originalTransform = '';
  let originalTransition = '';
  let parent = rootElement.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if (style.transform && style.transform !== 'none') {
      transformedAncestor = parent;
      originalTransform = parent.style.transform;
      originalTransition = parent.style.transition;
      break;
    }
    parent = parent.parentElement;
  }

  // Also check if rootElement itself has an active inline transform (e.g. zoom scale wrapper)
  let transformedTarget: HTMLElement | null = null;
  let originalTargetTransform = '';
  let originalTargetTransition = '';
  if (rootElement.style && rootElement.style.transform && rootElement.style.transform !== 'none') {
    transformedTarget = rootElement;
    originalTargetTransform = rootElement.style.transform;
    originalTargetTransition = rootElement.style.transition;
  }

  return {
    rootElement,
    pageSheets,
    transformedAncestor,
    originalTransform,
    originalTransition,
    transformedTarget,
    originalTargetTransform,
    originalTargetTransition,
  };
}

/**
 * Saves a Blob to disk by creating an object URL, clicking a hidden anchor tag,
 * and revoking the object URL safely after download starts.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 15000);
}

/**
 * Unified PDF generation pipeline used identically for both automatic background builds
 * and manual PDF downloads across resumes, biodatas, and cover letters.
 */
export async function generatePdfBlob(
  elementOrId: string | HTMLElement = 'document-preview-root',
  _options?: { targetDpi?: number }
): Promise<Blob> {
  // Ensure fonts, layout pagination/auto-fit, and images settle BEFORE collecting page sheets
  const initialRoot = resolveRootElement(elementOrId);
  await waitForDocumentReadyForExport(initialRoot);

  const prep = getTargetSheetsAndAncestorTransform(initialRoot);
  const pageSheets = prep.pageSheets;
  const transformedAncestor = prep.transformedAncestor;
  const originalTransform = prep.originalTransform;
  const originalTransition = prep.originalTransition;
  const transformedTarget = prep.transformedTarget || null;
  const originalTargetTransform = prep.originalTargetTransform || '';
  const originalTargetTransition = prep.originalTargetTransition || '';

  try {
    if (transformedAncestor) {
      transformedAncestor.style.transition = 'none';
      transformedAncestor.style.transform = 'none';
    }
    if (transformedTarget) {
      transformedTarget.style.transition = 'none';
      transformedTarget.style.transform = 'none';
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const totalPages = pageSheets.length;

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const sheet = pageSheets[pageIdx];
      if (pageIdx > 0) {
        pdf.addPage();
      }

      await waitForDocumentReadyForExport(sheet);

      const isBiodata =
        sheet.getAttribute('data-document-type') === 'biodata' ||
        sheet.hasAttribute('data-one-page-fit');

      const computedSheetBg = sanitizeModernColorString(
        sheet.style.backgroundColor || window.getComputedStyle(sheet).backgroundColor || '#ffffff'
      );
      const safeBgColor =
        computedSheetBg && computedSheetBg !== 'rgba(0, 0, 0, 0)' && computedSheetBg !== 'transparent'
          ? computedSheetBg
          : '#ffffff';

      const canvas = await html2canvas(sheet, {
        scale: EXPORT_CONFIG.desktopScale,
        useCORS: true,
        logging: false,
        backgroundColor: safeBgColor,
        imageTimeout: 15000,
        windowWidth: Math.max(1280, typeof window !== 'undefined' ? window.innerWidth : 1280),
        onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
          sanitizeClonedDocumentForExport(clonedDoc, clonedElement, sheet);

          if (isBiodata) {
            clonedElement.style.width = '800px';
            clonedElement.style.height = '1131px';
            clonedElement.style.minWidth = '800px';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.minHeight = '1131px';
            clonedElement.style.maxHeight = '1131px';
            clonedElement.style.overflow = 'hidden';
            clonedElement.style.backgroundColor = safeBgColor;
            clonedElement.style.boxSizing = 'border-box';

            const stage = clonedElement.querySelector('.one-page-stage') as HTMLElement | null;
            const liveStage = sheet.querySelector('.one-page-stage') as HTMLElement | null;
            if (stage && liveStage) {
              stage.style.width = liveStage.style.width;
              stage.style.height = liveStage.style.height;
              stage.style.transform = liveStage.style.transform;
              stage.style.transformOrigin = 'top left';
            }
          }

          if (sheet.getAttribute('data-document-type') === 'cover-letter') {
            rebuildCoverLetterBodyLinesForExport(clonedDoc, clonedElement, sheet);
          }
        },
      });

      const pageImgData = canvas.toDataURL('image/png');
      if (isBiodata) {
        pdf.addImage(pageImgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      } else {
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    }

    return pdf.output('blob');
  } finally {
    if (transformedAncestor) {
      transformedAncestor.style.transform = originalTransform;
      transformedAncestor.style.transition = originalTransition;
    }
    if (transformedTarget) {
      transformedTarget.style.transform = originalTargetTransform;
      transformedTarget.style.transition = originalTargetTransition;
    }
  }
}

/**
 * Builds a high-definition PNG image Blob from the preview element in memory.
 */
export async function generatePngBlob(
  elementOrId: string | HTMLElement = 'document-preview-root',
  _options?: { targetDpi?: number }
): Promise<Blob> {
  const initialRoot = resolveRootElement(elementOrId);
  await waitForDocumentReadyForExport(initialRoot);

  const prep = getTargetSheetsAndAncestorTransform(initialRoot);
  const targetElement = prep.pageSheets[0] || prep.rootElement;
  const transformedAncestor = prep.transformedAncestor;
  const originalTransform = prep.originalTransform;
  const originalTransition = prep.originalTransition;
  const transformedTarget = prep.transformedTarget || null;
  const originalTargetTransform = prep.originalTargetTransform || '';
  const originalTargetTransition = prep.originalTargetTransition || '';

  try {
    if (transformedAncestor) {
      transformedAncestor.style.transition = 'none';
      transformedAncestor.style.transform = 'none';
    }
    if (transformedTarget) {
      transformedTarget.style.transition = 'none';
      transformedTarget.style.transform = 'none';
    }

    await waitForDocumentReadyForExport(targetElement);
    const isBiodata =
      targetElement.getAttribute('data-document-type') === 'biodata' ||
      targetElement.hasAttribute('data-one-page-fit');

    const computedSheetBg = sanitizeModernColorString(
      targetElement.style.backgroundColor || window.getComputedStyle(targetElement).backgroundColor || '#ffffff'
    );
    const safeBgColor =
      computedSheetBg && computedSheetBg !== 'rgba(0, 0, 0, 0)' && computedSheetBg !== 'transparent'
        ? computedSheetBg
        : '#ffffff';

    const canvas = await html2canvas(targetElement, {
      scale: EXPORT_CONFIG.desktopScale,
      useCORS: true,
      logging: false,
      backgroundColor: safeBgColor,
      imageTimeout: 15000,
      windowWidth: Math.max(1280, typeof window !== 'undefined' ? window.innerWidth : 1280),
      onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
        sanitizeClonedDocumentForExport(clonedDoc, clonedElement, targetElement);

        if (isBiodata) {
          clonedElement.style.width = '800px';
          clonedElement.style.height = '1131px';
          clonedElement.style.minWidth = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.minHeight = '1131px';
          clonedElement.style.maxHeight = '1131px';
          clonedElement.style.overflow = 'hidden';
          clonedElement.style.backgroundColor = safeBgColor;
          clonedElement.style.boxSizing = 'border-box';

          const stage = clonedElement.querySelector('.one-page-stage') as HTMLElement | null;
          const liveStage = targetElement.querySelector('.one-page-stage') as HTMLElement | null;
          if (stage && liveStage) {
            stage.style.width = liveStage.style.width;
            stage.style.height = liveStage.style.height;
            stage.style.transform = liveStage.style.transform;
            stage.style.transformOrigin = 'top left';
          }
        }

        if (targetElement.getAttribute('data-document-type') === 'cover-letter') {
          rebuildCoverLetterBodyLinesForExport(clonedDoc, clonedElement, targetElement);
        }
      },
    });

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion returned null'));
        }
      }, 'image/png');
    });
  } finally {
    if (transformedAncestor) {
      transformedAncestor.style.transform = originalTransform;
      transformedAncestor.style.transition = originalTransition;
    }
    if (transformedTarget) {
      transformedTarget.style.transform = originalTargetTransform;
      transformedTarget.style.transition = originalTargetTransition;
    }
  }
}

export const exportService = {
  isBusy: (): boolean => isExportInProgress,

  printDocument: (): ExportResult => {
    try {
      window.print();
      return { success: true, message: 'Print dialog opened successfully.' };
    } catch (err: any) {
      console.error('Print invocation error:', err);
      return { success: false, error: err?.message || 'Could not open print dialog.' };
    }
  },

  generatePdfBlob,
  generatePngBlob,
  saveBlob,

  downloadPDF: async (
    elementId: string = 'document-preview-root',
    filename: string = 'document.pdf'
  ): Promise<ExportResult> => {
    if (isExportInProgress) {
      return { success: false, error: 'A document export is already in progress. Please wait a moment.' };
    }
    isExportInProgress = true;

    try {
      const blob = await generatePdfBlob(elementId);
      const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      saveBlob(blob, cleanFilename);
      return {
        success: true,
        message: 'PDF downloaded successfully (HD).',
      };
    } catch (err: any) {
      console.error('Failed to generate high-quality PDF:', err);
      return {
        success: false,
        error: err?.message || 'PDF generation failed. Please try again or use the Print option.',
      };
    } finally {
      isExportInProgress = false;
    }
  },

  downloadPNG: async (
    elementId: string = 'document-preview-root',
    filename: string = 'document.png'
  ): Promise<ExportResult> => {
    if (isExportInProgress) {
      return { success: false, error: 'A document export is already in progress. Please wait a moment.' };
    }
    isExportInProgress = true;

    try {
      const blob = await generatePngBlob(elementId);
      const cleanFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
      saveBlob(blob, cleanFilename);
      return {
        success: true,
        message: 'PNG downloaded successfully (300 DPI HD).',
      };
    } catch (err: any) {
      console.error('Failed to export high-quality PNG:', err);
      return {
        success: false,
        error: err?.message || 'Image export failed. Please try again.',
      };
    } finally {
      isExportInProgress = false;
    }
  },
};
