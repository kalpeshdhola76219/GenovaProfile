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
  desktopScale: 3.125,
  mobileScale: 2.2,
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

export function sanitizeModernColorString(cssString: string): string {
  if (!cssString || typeof cssString !== 'string') return cssString;
  if (
    !cssString.includes('oklch') &&
    !cssString.includes('oklab') &&
    !cssString.includes('lab(') &&
    !cssString.includes('lch(') &&
    !cssString.includes('color(')
  ) {
    return cssString;
  }
  return cssString.replace(/(oklch|oklab|lab|lch|color)\([^)]+\)/gi, (match) => {
    try {
      const converted = formatRgb(match);
      return converted || match;
    } catch {
      return match;
    }
  });
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
          styleTag.textContent.includes('color('))
      ) {
        styleTag.textContent = sanitizeModernColorString(styleTag.textContent);
      }
    });
  } catch (e) {
    console.warn('Notice while sanitizing cloned style tags:', e);
  }

  try {
    const sheets = clonedDoc.styleSheets;
    for (let s = 0; s < sheets.length; s++) {
      try {
        const sheet = sheets[s];
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let r = 0; r < rules.length; r++) {
            const rule = rules[r];
            if (rule instanceof (clonedDoc.defaultView?.CSSStyleRule || CSSStyleRule)) {
              if (rule.style?.cssText && rule.style.cssText.includes('oklch')) {
                rule.style.cssText = sanitizeModernColorString(rule.style.cssText);
              }
            }
          }
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
              val.includes('color('))
          ) {
            const sanitized = sanitizeModernColorString(val);
            clonedEl.style[prop as any] = sanitized;
          }
        }
        if (clonedEl.style.cssText && clonedEl.style.cssText.includes('oklch')) {
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
    clonedTarget.style.transform = 'none';
    clonedTarget.style.transition = 'none';
    clonedTarget.style.zoom = '1';
    clonedTarget.style.width = liveTarget.style.width || '800px';
    clonedTarget.style.height = liveTarget.style.height || '1131px';
    clonedTarget.style.boxSizing = 'border-box';
    clonedTarget.style.textRendering = 'geometricPrecision';
    (clonedTarget.style as any).webkitFontSmoothing = 'antialiased';
  } catch {}
}

export async function waitForDocumentReadyForExport(element: HTMLElement): Promise<void> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Export timed out waiting for document resources to be ready.'));
    }, 10000);
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
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (fontErr) {
        console.warn('Font loading check notice:', fontErr);
      }
    }
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            let finished = false;
            const onDone = () => {
              if (!finished) {
                finished = true;
                img.removeEventListener('load', onDone);
                img.removeEventListener('error', onDone);
                resolve();
              }
            };
            img.addEventListener('load', onDone);
            img.addEventListener('error', onDone);
            setTimeout(onDone, 1500);
          });
        })
      );
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  })();

  await Promise.race([readyPromise, timeoutPromise]);
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

  // Also check if rootElement itself has an active inline transform (e.g. Invitation preview scale)
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
 * and revoking the object URL to prevent memory leaks.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Free the Blob URL safely after the browser has started the download
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Builds a multi-page high-definition PDF Blob from the preview element in memory.
 */
export async function generatePdfBlob(
  elementOrId: string | HTMLElement = 'document-preview-root',
  options?: { targetDpi?: number }
): Promise<Blob> {
  const prep = getTargetSheetsAndAncestorTransform(elementOrId);
  const pageSheets = prep.pageSheets;
  const transformedAncestor = prep.transformedAncestor;
  const originalTransform = prep.originalTransform;
  const originalTransition = prep.originalTransition;
  const transformedTarget = (prep as any).transformedTarget as HTMLElement | null;
  const originalTargetTransform = (prep as any).originalTargetTransform || '';
  const originalTargetTransition = (prep as any).originalTargetTransition || '';

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
      await new Promise((resolve) => setTimeout(resolve, 60));

      const isBiodata =
        sheet.getAttribute('data-document-type') === 'biodata' ||
        sheet.hasAttribute('data-one-page-fit');

      const renderScale = isBiodata
        ? 3
        : calculateOptimalExportScale(sheet, options?.targetDpi || EXPORT_CONFIG.targetDpi);
      const canvas = await html2canvas(sheet, {
        scale: renderScale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: sheet.style.backgroundColor || '#ffffff',
        imageTimeout: 15000,
        windowWidth: Math.max(1280, typeof window !== 'undefined' ? window.innerWidth : 1280),
        onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
          sanitizeClonedDocumentForExport(clonedDoc, clonedElement, sheet);
          clonedElement.style.textRendering = 'geometricPrecision';
          (clonedElement.style as any).webkitFontSmoothing = 'antialiased';

          if (isBiodata) {
            clonedElement.style.width = '800px';
            clonedElement.style.height = '1131px';
            clonedElement.style.minWidth = '800px';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.minHeight = '1131px';
            clonedElement.style.maxHeight = '1131px';
            clonedElement.style.overflow = 'hidden';
            clonedElement.style.backgroundColor = sheet.style.backgroundColor || '#ffffff';
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
        // Exactly one A4 page at 210mm x 297mm with no margin
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
  options?: { targetDpi?: number }
): Promise<Blob> {
  const prep = getTargetSheetsAndAncestorTransform(elementOrId);
  const targetElement = prep.pageSheets[0] || prep.rootElement;
  const transformedAncestor = prep.transformedAncestor;
  const originalTransform = prep.originalTransform;
  const originalTransition = prep.originalTransition;
  const transformedTarget = (prep as any).transformedTarget as HTMLElement | null;
  const originalTargetTransform = (prep as any).originalTargetTransform || '';
  const originalTargetTransition = (prep as any).originalTargetTransition || '';

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

    const renderScale = isBiodata
      ? 3
      : calculateOptimalExportScale(targetElement, options?.targetDpi || EXPORT_CONFIG.targetDpi);
    const canvas = await html2canvas(targetElement, {
      scale: renderScale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: targetElement.style.backgroundColor || '#ffffff',
      imageTimeout: 15000,
      windowWidth: Math.max(1280, typeof window !== 'undefined' ? window.innerWidth : 1280),
      onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
        sanitizeClonedDocumentForExport(clonedDoc, clonedElement, targetElement);
        clonedElement.style.textRendering = 'geometricPrecision';
        (clonedElement.style as any).webkitFontSmoothing = 'antialiased';

        if (isBiodata) {
          clonedElement.style.width = '800px';
          clonedElement.style.height = '1131px';
          clonedElement.style.minWidth = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.minHeight = '1131px';
          clonedElement.style.maxHeight = '1131px';
          clonedElement.style.overflow = 'hidden';
          clonedElement.style.backgroundColor = targetElement.style.backgroundColor || '#ffffff';
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
        message: 'PDF downloaded successfully (300 DPI HD).',
      };
    } catch (err: any) {
      console.error('Failed to generate high-quality PDF:', err);
      return {
        success: false,
        error: 'PDF generation failed. Please try again or use the Print option.',
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
        error: 'Image export failed. Please try again.',
      };
    } finally {
      isExportInProgress = false;
    }
  },
};
