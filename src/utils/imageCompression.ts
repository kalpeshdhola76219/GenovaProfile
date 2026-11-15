/**
 * Client-side Image Compression & Resizing Utilities
 * Ensures uploaded/cropped profile photos stay sharp for A4 PDF export
 * while remaining well under Vercel's 4.5 MB serverless request payload limit.
 */

const DEFAULT_MAX_WIDTH = 900;
const DEFAULT_MAX_HEIGHT = 900;
const DEFAULT_MAX_DATA_URL_BYTES = 450 * 1024; // ~450 KB base64 (~330 KB binary)

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxBytes?: number;
  initialQuality?: number;
}

/**
 * Compresses an HTMLCanvasElement into a JPEG data URL under maxBytes.
 */
export function compressCanvasToDataUrl(
  canvas: HTMLCanvasElement,
  maxBytes: number = DEFAULT_MAX_DATA_URL_BYTES,
  initialQuality: number = 0.86
): string {
  const qualities = [initialQuality, 0.78, 0.7, 0.6, 0.5, 0.4];
  let result = '';

  for (const q of qualities) {
    result = canvas.toDataURL('image/jpeg', q);
    if (result.length <= maxBytes) {
      return result;
    }
  }

  // If still above maxBytes, progressively downscale the canvas
  let scale = 0.75;
  while (result.length > maxBytes && scale >= 0.35) {
    const scaledW = Math.max(160, Math.round(canvas.width * scale));
    const scaledH = Math.max(160, Math.round(canvas.height * scale));
    const resized = document.createElement('canvas');
    resized.width = scaledW;
    resized.height = scaledH;
    const ctx = resized.getContext('2d');
    if (!ctx) break;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, scaledW, scaledH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, scaledW, scaledH);
    result = resized.toDataURL('image/jpeg', 0.68);
    scale -= 0.15;
  }

  return result;
}

/**
 * Loads an image data URL / URL, resizes it to fit within maxWidth x maxHeight,
 * and compresses it to JPEG well below Vercel's serverless payload limit.
 */
export async function compressImageDataUrl(
  imageSrc: string,
  options: ImageCompressionOptions = {}
): Promise<string> {
  if (!imageSrc || typeof imageSrc !== 'string') return imageSrc;
  // Remote URLs (e.g. Unsplash sample avatars) don't bloat request payloads
  if (!imageSrc.startsWith('data:image/')) return imageSrc;
  if (typeof document === 'undefined') return imageSrc;

  const {
    maxWidth = DEFAULT_MAX_WIDTH,
    maxHeight = DEFAULT_MAX_HEIGHT,
    maxBytes = DEFAULT_MAX_DATA_URL_BYTES,
    initialQuality = 0.86,
  } = options;

  // Already a reasonably sized JPEG
  if (imageSrc.startsWith('data:image/jpeg') && imageSrc.length <= maxBytes) {
    return imageSrc;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = imageSrc;
  });

  const naturalW = img.naturalWidth || maxWidth;
  const naturalH = img.naturalHeight || maxHeight;
  const ratio = Math.min(1, maxWidth / naturalW, maxHeight / naturalH);
  const targetW = Math.max(1, Math.round(naturalW * ratio));
  const targetH = Math.max(1, Math.round(naturalH * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return compressCanvasToDataUrl(canvas, maxBytes, initialQuality);
}

/**
 * Recursively walks documentData before sending to /api/* endpoints and
 * compresses any large embedded base64 data:image/* values so total JSON
 * payloads remain well below Vercel's 4.5 MB serverless limit.
 */
export async function sanitizeDocumentDataImages<T>(documentData: T): Promise<T> {
  if (!documentData || typeof documentData !== 'object' || typeof document === 'undefined') {
    return documentData;
  }

  const processValue = async (val: unknown): Promise<unknown> => {
    if (typeof val === 'string') {
      if (val.startsWith('data:image/') && val.length > DEFAULT_MAX_DATA_URL_BYTES) {
        try {
          return await compressImageDataUrl(val, {
            maxWidth: DEFAULT_MAX_WIDTH,
            maxHeight: DEFAULT_MAX_HEIGHT,
            maxBytes: DEFAULT_MAX_DATA_URL_BYTES,
          });
        } catch {
          return val;
        }
      }
      return val;
    }

    if (Array.isArray(val)) {
      return Promise.all(val.map((item) => processValue(item)));
    }

    if (val && typeof val === 'object') {
      const entries = await Promise.all(
        Object.entries(val as Record<string, unknown>).map(async ([k, v]) => [k, await processValue(v)] as const)
      );
      return Object.fromEntries(entries);
    }

    return val;
  };

  return (await processValue(documentData)) as T;
}
