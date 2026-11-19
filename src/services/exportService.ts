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
    clonedDoc.documentElement.style.zoom = '1';
    clonedDoc.documentElement.style.transform = 'none';
    clonedDoc.body.style.zoom = '1';
    clonedDoc.body.style.transform = 'none';
    clonedDoc.body.style.margin = '0';

    let parent = clonedTarget.parentElement;
    while (parent && parent !== clonedDoc.documentElement) {
      parent.style.transform = 'none';
      parent.style.transition = 'none';
      parent.style.zoom = '1';
      parent = parent.parentElement;
    }
    const liveComputedTarget = window.getComputedStyle(liveTarget);
    clonedTarget.style.transform = 'none';
    clonedTarget.style.transition = 'none';
    clonedTarget.style.zoom = '1';
    clonedTarget.style.margin = '0';
    clonedTarget.style.boxShadow = 'none';
    clonedTarget.style.width = '794px';
    clonedTarget.style.maxWidth = '794px';
    clonedTarget.style.minWidth = '794px';
    clonedTarget.style.height = liveTarget.style.height || `${liveTarget.offsetHeight || 1123}px`;
    clonedTarget.style.boxSizing = 'border-box';
    clonedTarget.style.wordBreak = 'normal';
    clonedTarget.style.overflowWrap = 'break-word';
    (clonedTarget.style as any).hyphens = 'none';
    (clonedTarget.style as any).webkitHyphens = 'none';
    clonedTarget.style.textRendering = liveComputedTarget.textRendering || 'auto';
  } catch {}
}

/**
 * Temporarily normalizes window.devicePixelRatio to 1 during html2canvas capture so
 * Windows 125%/150% OS scaling and high-DPR mobile browsers compute identical CSS line
 * heights and cell offsets without subpixel wrapping or date dropping.
 */
async function withNormalizedDevicePixelRatio<T>(task: () => Promise<T>): Promise<T> {
  if (typeof window === 'undefined') {
    return await task();
  }
  const ownDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
  let patched = false;
  try {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      get: () => 1,
    });
    patched = true;
  } catch {
    patched = false;
  }

  try {
    return await task();
  } finally {
    if (patched) {
      try {
        if (ownDesc) {
          Object.defineProperty(window, 'devicePixelRatio', ownDesc);
        } else {
          delete (window as unknown as Record<string, unknown>).devicePixelRatio;
        }
      } catch {}
    }
  }
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
          fontRequests.add(`normal 500 16px "${knownFont}"`);
          fontRequests.add(`normal 600 16px "${knownFont}"`);
          fontRequests.add(`normal 700 16px "${knownFont}"`);
          fontRequests.add(`normal 800 16px "${knownFont}"`);
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

const EXPORT_A4_WIDTH_PX = 794;
const EXPORT_A4_HEIGHT_PX = 1123;
const EXPORT_PAGE_TOP_MARGIN_PX = 36;
const EXPORT_PAGE_BOTTOM_MARGIN_PX = 40;

/**
 * Unwraps any live preview height/transform clipping on a cloned multi-page resume sheet
 * and inserts normal-flow marginTop spacers before any heading, entry, card, or bullet row
 * that crosses an A4 (1123px @ 96 DPI) boundary so no content is ever sliced or clipped.
 */
function layoutClonedMultiPageSheet(
  clonedRoot: HTMLElement,
  flowRoot: HTMLElement,
  clonedDoc: Document,
  safeBgColor: string
): number {
  // Unclip any preview window wrapper inside or above flowRoot (e.g. translateY / height clip)
  const viewportEls = Array.from(
    clonedRoot.querySelectorAll('[data-page-viewport="true"], [data-page-flow="true"]')
  ) as HTMLElement[];
  for (const vp of viewportEls) {
    vp.style.overflow = 'visible';
    vp.style.height = 'auto';
    vp.style.minHeight = '0';
    vp.style.maxHeight = 'none';
    vp.style.marginTop = '0px';
    vp.style.transform = 'none';
    vp.style.width = '100%';
  }

  let walker: HTMLElement | null = flowRoot;
  while (walker && walker !== clonedRoot) {
    walker.style.overflow = 'visible';
    walker.style.height = 'auto';
    walker.style.minHeight = '0';
    walker.style.maxHeight = 'none';
    walker.style.marginTop = '0px';
    walker.style.transform = 'none';
    walker.style.width = '100%';
    walker = walker.parentElement;
  }

  clonedDoc.documentElement.style.zoom = '1';
  clonedDoc.documentElement.style.transform = 'none';
  clonedDoc.body.style.zoom = '1';
  clonedDoc.body.style.transform = 'none';

  clonedRoot.style.setProperty('--a4-sheet-min-height', '0px');
  clonedRoot.style.width = `${EXPORT_A4_WIDTH_PX}px`;
  clonedRoot.style.minWidth = `${EXPORT_A4_WIDTH_PX}px`;
  clonedRoot.style.maxWidth = `${EXPORT_A4_WIDTH_PX}px`;
  clonedRoot.style.height = 'auto';
  clonedRoot.style.minHeight = '0px';
  clonedRoot.style.maxHeight = 'none';
  clonedRoot.style.overflow = 'visible';
  clonedRoot.style.transform = 'none';
  clonedRoot.style.zoom = '1';
  clonedRoot.style.margin = '0';
  clonedRoot.style.boxShadow = 'none';
  clonedRoot.style.backgroundColor = safeBgColor;
  clonedRoot.style.boxSizing = 'border-box';

  if (flowRoot !== clonedRoot) {
    flowRoot.style.setProperty('--a4-sheet-min-height', '0px');
    flowRoot.style.width = `${EXPORT_A4_WIDTH_PX}px`;
    flowRoot.style.minWidth = `${EXPORT_A4_WIDTH_PX}px`;
    flowRoot.style.maxWidth = `${EXPORT_A4_WIDTH_PX}px`;
    flowRoot.style.height = 'auto';
    flowRoot.style.minHeight = '0px';
    flowRoot.style.maxHeight = 'none';
    flowRoot.style.overflow = 'visible';
    flowRoot.style.transform = 'none';
    flowRoot.style.zoom = '1';
    flowRoot.style.margin = '0';
    flowRoot.style.boxShadow = 'none';
    flowRoot.style.boxSizing = 'border-box';
  }

  // Force reflow at exact 794px desktop A4 width
  void flowRoot.offsetHeight;

  const getRelRect = (el: HTMLElement) => {
    const rootTop = flowRoot.getBoundingClientRect().top;
    const r = el.getBoundingClientRect();
    return {
      top: r.top - rootTop,
      bottom: r.bottom - rootTop,
      height: r.height,
      width: r.width,
    };
  };

  const pushToNextPage = (el: HTMLElement, pageIdx: number) => {
    const curRect = getRelRect(el);
    const targetTop = (pageIdx + 1) * EXPORT_A4_HEIGHT_PX + EXPORT_PAGE_TOP_MARGIN_PX;
    const delta = Math.ceil(targetTop - curRect.top);
    if (delta > 0) {
      const view = clonedDoc.defaultView || window;
      const existingMargin = parseFloat(view.getComputedStyle(el).marginTop) || 0;
      el.style.marginTop = `${existingMargin + delta}px`;
      void flowRoot.offsetHeight;
    }
  };

  const totalNaturalHeight = Math.max(flowRoot.scrollHeight, flowRoot.offsetHeight);
  if (totalNaturalHeight > EXPORT_A4_HEIGHT_PX) {
    const pushedElements = new Set<HTMLElement>();

    // Pass 1: Scan entries, headings, and compact avoid-break sections in document order
    const blocks = Array.from(
      flowRoot.querySelectorAll('h1, h2, h3, [data-heading], [data-section-title], [data-entry], .avoid-break, [data-atomic]')
    ) as HTMLElement[];

    for (let i = 0; i < blocks.length; i++) {
      const el = blocks[i];
      if (pushedElements.has(el)) continue;
      if (/^(TABLE|TBODY|THEAD|TR|TD|TH)$/.test(el.tagName)) continue;

      const rect = getRelRect(el);
      if (rect.height < 6) continue;

      // Never treat an outer full-width multi-column wrapper (> 340px tall containing nested entries) as atomic
      const isHeading = /^(H1|H2|H3)$/.test(el.tagName) || el.hasAttribute('data-heading') || el.hasAttribute('data-section-title');
      if (!isHeading && el.classList.contains('avoid-break') && !el.hasAttribute('data-entry')) {
        if (rect.height > 320) continue;
      }

      const pageIdx = Math.floor(Math.max(0, rect.top) / EXPORT_A4_HEIGHT_PX);
      const pageEnd = (pageIdx + 1) * EXPORT_A4_HEIGHT_PX - EXPORT_PAGE_BOTTOM_MARGIN_PX;

      if (isHeading) {
        // Check whether the heading itself crosses pageEnd or would be orphaned from its immediate next item
        let orphaned = rect.bottom > pageEnd;
        if (!orphaned) {
          for (let j = i + 1; j < blocks.length; j++) {
            const candidate = blocks[j];
            if (/^(TABLE|TBODY|THEAD|TR|TD|TH)$/.test(candidate.tagName)) continue;
            if (el.contains(candidate) || candidate.contains(el)) continue;
            const cRect = getRelRect(candidate);
            if (cRect.top >= rect.bottom - 2 && cRect.top - rect.bottom <= 70) {
              if (cRect.height <= 220 && cRect.bottom > pageEnd) {
                orphaned = true;
              } else if (cRect.height > 220) {
                const firstBullet = candidate.querySelector('[data-bullet], li') as HTMLElement | null;
                if (firstBullet && getRelRect(firstBullet).bottom > pageEnd) {
                  orphaned = true;
                }
              }
              break;
            }
          }
        }
        if (orphaned && rect.top > pageIdx * EXPORT_A4_HEIGHT_PX + 120) {
          pushToNextPage(el, pageIdx);
          pushedElements.add(el);
        }
        continue;
      }

      if (rect.bottom <= pageEnd) continue;

      // Element crosses pageEnd
      const bullets = Array.from(el.querySelectorAll('[data-bullet], li')) as HTMLElement[];
      const isSplittableLargeEntry = el.hasAttribute('data-entry') && rect.height > 150 && bullets.length >= 2;

      if (isSplittableLargeEntry) {
        // Keep header + first bullet together; if even first bullet doesn't fit, push whole entry
        const firstBulletRect = getRelRect(bullets[0]);
        if (firstBulletRect.bottom > pageEnd && rect.top > pageIdx * EXPORT_A4_HEIGHT_PX + 120) {
          pushToNextPage(el, pageIdx);
          pushedElements.add(el);
        } else {
          for (const b of bullets) {
            const bRect = getRelRect(b);
            const bPageIdx = Math.floor(Math.max(0, bRect.top) / EXPORT_A4_HEIGHT_PX);
            const bPageEnd = (bPageIdx + 1) * EXPORT_A4_HEIGHT_PX - EXPORT_PAGE_BOTTOM_MARGIN_PX;
            if (bRect.bottom > bPageEnd && bRect.height < EXPORT_A4_HEIGHT_PX - 120) {
              pushToNextPage(b, bPageIdx);
              pushedElements.add(b);
            }
          }
        }
      } else {
        // Compact entry (e.g. Featured Project, Education, Certification) or compact avoid-break block: move whole block
        // If a heading sits immediately above this block with no siblings before it, push the heading too
        let precedingHeading: HTMLElement | null = null;
        for (let k = i - 1; k >= 0; k--) {
          const prev = blocks[k];
          if (/^(H2|H3)$/.test(prev.tagName) || prev.hasAttribute('data-heading') || prev.hasAttribute('data-section-title')) {
            const pRect = getRelRect(prev);
            const hasEntryBetween = blocks.slice(k + 1, i).some((mid) => !prev.contains(mid) && mid.hasAttribute('data-entry'));
            if (!hasEntryBetween && rect.top - pRect.bottom < 50 && pRect.top > pageIdx * EXPORT_A4_HEIGHT_PX + 120) {
              precedingHeading = prev;
            }
            break;
          }
        }
        if (precedingHeading && !pushedElements.has(precedingHeading)) {
          pushToNextPage(precedingHeading, pageIdx);
          pushedElements.add(precedingHeading);
        } else if (rect.top > pageIdx * EXPORT_A4_HEIGHT_PX + 80 && rect.height < EXPORT_A4_HEIGHT_PX - 120) {
          pushToNextPage(el, pageIdx);
          pushedElements.add(el);
        }
      }
    }

    // Pass 2: Safety sweep over leaf paragraphs/bullets/grid cells so no single line gets sliced by 1123px
    const leafCandidates = Array.from(
      flowRoot.querySelectorAll('[data-bullet], li, p, .grid > div')
    ) as HTMLElement[];
    for (const leaf of leafCandidates) {
      if (pushedElements.has(leaf)) continue;
      if (/^(TABLE|TBODY|THEAD|TR|TD|TH)$/.test(leaf.tagName)) continue;
      const lRect = getRelRect(leaf);
      if (lRect.height <= 4 || lRect.height > 220) continue;
      // Skip multi-column layout wrappers (only check leaf grid cells <= 60px tall)
      if (leaf.parentElement?.classList.contains('grid') && lRect.height > 80) continue;
      const lPageIdx = Math.floor(Math.max(0, lRect.top) / EXPORT_A4_HEIGHT_PX);
      const lPageEnd = (lPageIdx + 1) * EXPORT_A4_HEIGHT_PX - EXPORT_PAGE_BOTTOM_MARGIN_PX;
      if (lRect.bottom > lPageEnd && lRect.top > lPageIdx * EXPORT_A4_HEIGHT_PX + 80) {
        pushToNextPage(leaf, lPageIdx);
        pushedElements.add(leaf);
      }
    }
  }

  // Measure final rendered bottom across all non-empty leaf elements
  void flowRoot.offsetHeight;
  const rootTop = flowRoot.getBoundingClientRect().top;
  let maxLeafBottom = 0;
  const allEls = Array.from(flowRoot.querySelectorAll('h1, h2, h3, p, div, li, span, td, th, img')) as HTMLElement[];
  for (const el of allEls) {
    if (el.closest('[aria-hidden="true"]')) continue;
    if ((el.children.length === 0 && (el.textContent || '').trim().length > 0) || el.tagName === 'IMG') {
      const b = el.getBoundingClientRect().bottom - rootTop;
      if (b > maxLeafBottom) maxLeafBottom = b;
    }
  }

  const measuredBottom = maxLeafBottom > 0 ? maxLeafBottom + 10 : flowRoot.scrollHeight;
  const totalPages = Math.max(1, Math.ceil(measuredBottom / EXPORT_A4_HEIGHT_PX));
  const finalHeightPx = totalPages * EXPORT_A4_HEIGHT_PX;

  clonedRoot.style.setProperty('--a4-sheet-min-height', `${finalHeightPx}px`);
  clonedRoot.style.height = `${finalHeightPx}px`;
  clonedRoot.style.minHeight = `${finalHeightPx}px`;
  clonedRoot.style.maxHeight = `${finalHeightPx}px`;
  if (flowRoot !== clonedRoot) {
    flowRoot.style.setProperty('--a4-sheet-min-height', `${finalHeightPx}px`);
    flowRoot.style.height = `${finalHeightPx}px`;
    flowRoot.style.minHeight = `${finalHeightPx}px`;
  }

  // Ensure unpaid PREVIEW watermark covers each exported page cleanly if present
  const existingWatermark = clonedRoot.querySelector('.no-export-when-paid') as HTMLElement | null;
  if (existingWatermark && totalPages > 1) {
    const view = clonedDoc.defaultView || window;
    if (view.getComputedStyle(existingWatermark).display !== 'none') {
      existingWatermark.style.bottom = 'auto';
      existingWatermark.style.height = `${EXPORT_A4_HEIGHT_PX}px`;
      for (let p = 1; p < totalPages; p++) {
        const cloneWm = existingWatermark.cloneNode(true) as HTMLElement;
        cloneWm.style.top = `${p * EXPORT_A4_HEIGHT_PX}px`;
        cloneWm.style.height = `${EXPORT_A4_HEIGHT_PX}px`;
        cloneWm.style.bottom = 'auto';
        clonedRoot.appendChild(cloneWm);
      }
    }
  }

  return totalPages;
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
    const firstSheet = pageSheets[0];

    const isBiodata =
      firstSheet.getAttribute('data-document-type') === 'biodata' ||
      firstSheet.hasAttribute('data-one-page-fit');
    const isCoverLetter = firstSheet.getAttribute('data-document-type') === 'cover-letter';

    if (isBiodata || isCoverLetter) {
      // Single-page OnePageFit export path (Biodata & Cover Letter)
      const sheet = firstSheet;
      await waitForDocumentReadyForExport(sheet);
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      const computedSheetBg = sanitizeModernColorString(
        sheet.style.backgroundColor || window.getComputedStyle(sheet).backgroundColor || '#ffffff'
      );
      const safeBgColor =
        computedSheetBg && computedSheetBg !== 'rgba(0, 0, 0, 0)' && computedSheetBg !== 'transparent'
          ? computedSheetBg
          : '#ffffff';

      const canvas = await withNormalizedDevicePixelRatio(() =>
        html2canvas(sheet, {
          scale: EXPORT_CONFIG.desktopScale,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
          width: EXPORT_A4_WIDTH_PX,
          windowWidth: EXPORT_A4_WIDTH_PX,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
            if (isCoverLetter) {
              rebuildCoverLetterBodyLinesForExport(clonedDoc, clonedElement, sheet);
            }

            sanitizeClonedDocumentForExport(clonedDoc, clonedElement, sheet);

            clonedElement.style.width = `${EXPORT_A4_WIDTH_PX}px`;
            clonedElement.style.maxWidth = `${EXPORT_A4_WIDTH_PX}px`;
            clonedElement.style.minWidth = `${EXPORT_A4_WIDTH_PX}px`;
            clonedElement.style.height = `${EXPORT_A4_HEIGHT_PX}px`;
            clonedElement.style.minHeight = `${EXPORT_A4_HEIGHT_PX}px`;
            clonedElement.style.maxHeight = `${EXPORT_A4_HEIGHT_PX}px`;
            clonedElement.style.overflow = 'hidden';
            clonedElement.style.transform = 'none';
            clonedElement.style.zoom = '1';
            clonedElement.style.margin = '0';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.backgroundColor = safeBgColor;
            clonedElement.style.boxSizing = 'border-box';

            if (isCoverLetter) {
              const clStage = clonedElement.querySelector('.cl-one-page-stage') as HTMLElement | null;
              if (clStage) {
                clStage.style.transform = `scale(${EXPORT_A4_WIDTH_PX / 800})`;
                clStage.style.transformOrigin = 'top left';
              }
            } else {
              const stage = clonedElement.querySelector('.one-page-stage') as HTMLElement | null;
              const liveStage = sheet.querySelector('.one-page-stage') as HTMLElement | null;
              if (stage && liveStage) {
                const liveScaleAttr = Number(sheet.getAttribute('data-scale') || '1');
                const liveScale = Number.isFinite(liveScaleAttr) && liveScaleAttr > 0 ? liveScaleAttr : 1;
                stage.style.width = liveStage.style.width;
                stage.style.height = liveStage.style.height;
                stage.style.transform = `scale(${liveScale * (EXPORT_A4_WIDTH_PX / 800)})`;
                stage.style.transformOrigin = 'top left';
              }
            }
          },
        })
      );

      const pageImgData = canvas.toDataURL('image/png');
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      return pdf.output('blob');
    }

    // Multi-page Resume export: measure and space unclipped flow in onclone at exact 794px,
    // then slice the 2x high-resolution canvas into clean 794×1123 A4 pages.
    await waitForDocumentReadyForExport(firstSheet);
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

    const computedSheetBg = sanitizeModernColorString(
      firstSheet.style.backgroundColor || window.getComputedStyle(firstSheet).backgroundColor || '#ffffff'
    );
    const safeBgColor =
      computedSheetBg && computedSheetBg !== 'rgba(0, 0, 0, 0)' && computedSheetBg !== 'transparent'
        ? computedSheetBg
        : '#ffffff';

    // Determine safe canvas scale respecting browser pixel limits across all estimated pages
    const isMobile =
      typeof window !== 'undefined' &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (typeof window.innerWidth !== 'undefined' && window.innerWidth < 768));
    const maxSafePixels = isMobile ? EXPORT_CONFIG.maxCanvasPixelsMobile : EXPORT_CONFIG.maxCanvasPixelsDesktop;
    const measureEl = initialRoot.querySelector('[aria-hidden="true"]') as HTMLElement | null;
    const estimatedContentHeight = Math.max(
      measureEl?.scrollHeight || 0,
      pageSheets.length * EXPORT_A4_HEIGHT_PX
    );
    const estimatedTotalPages = Math.max(1, Math.ceil((estimatedContentHeight + 120) / EXPORT_A4_HEIGHT_PX));
    let exportScale: number = EXPORT_CONFIG.desktopScale;
    const projectedPixels = EXPORT_A4_WIDTH_PX * exportScale * (estimatedTotalPages * EXPORT_A4_HEIGHT_PX * exportScale);
    if (projectedPixels > maxSafePixels) {
      const capFactor = Math.sqrt(maxSafePixels / (EXPORT_A4_WIDTH_PX * estimatedTotalPages * EXPORT_A4_HEIGHT_PX));
      exportScale = Math.max(1.4, Math.floor(capFactor * 100) / 100);
    }

    let resolvedTotalPages = Math.max(1, pageSheets.length);

    const fullCanvas = await withNormalizedDevicePixelRatio(() =>
      html2canvas(firstSheet, {
        scale: exportScale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: safeBgColor,
        imageTimeout: 15000,
        width: EXPORT_A4_WIDTH_PX,
        windowWidth: EXPORT_A4_WIDTH_PX,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
          sanitizeClonedDocumentForExport(clonedDoc, clonedElement, firstSheet);
          const templateSheet = (clonedElement.querySelector('.document-page-sheet') as HTMLElement | null) || clonedElement;
          resolvedTotalPages = layoutClonedMultiPageSheet(clonedElement, templateSheet, clonedDoc, safeBgColor);
        },
      })
    );

    const sliceCanvasHeight = Math.round(EXPORT_A4_HEIGHT_PX * exportScale);
    const actualPages = Math.max(1, resolvedTotalPages, Math.round(fullCanvas.height / sliceCanvasHeight));

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = fullCanvas.width;
    sliceCanvas.height = sliceCanvasHeight;
    const sliceCtx = sliceCanvas.getContext('2d');

    for (let pageIdx = 0; pageIdx < actualPages; pageIdx++) {
      if (pageIdx > 0) {
        pdf.addPage();
      }
      const srcY = pageIdx * sliceCanvasHeight;
      const srcH = Math.min(sliceCanvasHeight, Math.max(0, fullCanvas.height - srcY));
      if (sliceCtx) {
        sliceCtx.fillStyle = safeBgColor;
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        if (srcH > 0) {
          sliceCtx.drawImage(
            fullCanvas,
            0,
            srcY,
            fullCanvas.width,
            srcH,
            0,
            0,
            sliceCanvas.width,
            srcH
          );
        }
      }
      const pageImgData = sliceCanvas.toDataURL('image/png');
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
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
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

    const isBiodata =
      targetElement.getAttribute('data-document-type') === 'biodata' ||
      targetElement.hasAttribute('data-one-page-fit');
    const isCoverLetter = targetElement.getAttribute('data-document-type') === 'cover-letter';
    const isPaginatedSheet = targetElement.classList.contains('a4-page-sheet') || targetElement.hasAttribute('data-page-index');

    const computedSheetBg = sanitizeModernColorString(
      targetElement.style.backgroundColor || window.getComputedStyle(targetElement).backgroundColor || '#ffffff'
    );
    const safeBgColor =
      computedSheetBg && computedSheetBg !== 'rgba(0, 0, 0, 0)' && computedSheetBg !== 'transparent'
        ? computedSheetBg
        : '#ffffff';

    const canvas = await withNormalizedDevicePixelRatio(() =>
      html2canvas(targetElement, {
        scale: EXPORT_CONFIG.desktopScale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        width: EXPORT_A4_WIDTH_PX,
        windowWidth: EXPORT_A4_WIDTH_PX,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
          if (isCoverLetter) {
            rebuildCoverLetterBodyLinesForExport(clonedDoc, clonedElement, targetElement);
          }

          sanitizeClonedDocumentForExport(clonedDoc, clonedElement, targetElement);

          clonedElement.style.width = '794px';
          clonedElement.style.maxWidth = '794px';
          clonedElement.style.minWidth = '794px';
          clonedElement.style.transform = 'none';
          clonedElement.style.zoom = '1';
          clonedElement.style.margin = '0';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.backgroundColor = safeBgColor;
          clonedElement.style.boxSizing = 'border-box';

          if (isCoverLetter) {
            clonedElement.style.height = '1123px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.maxHeight = '1123px';
            clonedElement.style.overflow = 'hidden';

            const clStage = clonedElement.querySelector('.cl-one-page-stage') as HTMLElement | null;
            if (clStage) {
              clStage.style.transform = `scale(${794 / 800})`;
              clStage.style.transformOrigin = 'top left';
            }
          } else if (isBiodata) {
            clonedElement.style.height = '1123px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.maxHeight = '1123px';
            clonedElement.style.overflow = 'hidden';

            const stage = clonedElement.querySelector('.one-page-stage') as HTMLElement | null;
            const liveStage = targetElement.querySelector('.one-page-stage') as HTMLElement | null;
            if (stage && liveStage) {
              const liveScaleAttr = Number(targetElement.getAttribute('data-scale') || '1');
              const liveScale = Number.isFinite(liveScaleAttr) && liveScaleAttr > 0 ? liveScaleAttr : 1;
              stage.style.width = liveStage.style.width;
              stage.style.height = liveStage.style.height;
              stage.style.transform = `scale(${liveScale * (794 / 800)})`;
              stage.style.transformOrigin = 'top left';
            }
          } else if (isPaginatedSheet) {
            clonedElement.style.height = '1123px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.maxHeight = '1123px';
            clonedElement.style.overflow = 'hidden';
          }
        },
      })
    );

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
