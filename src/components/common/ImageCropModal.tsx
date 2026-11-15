import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Crop,
  Circle,
  Square,
  Sparkles,
} from 'lucide-react';
import { compressCanvasToDataUrl, compressImageDataUrl } from '../../utils/imageCompression';

export type AspectRatioType = '1:1' | '3:4' | '4:5' | '9:16' | 'free';

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
  initialAspectRatio?: AspectRatioType;
  title?: string;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  initialAspectRatio = '1:1',
  title = 'Crop & Adjust Photograph',
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialAspectRatio);
  const [isCircleMask, setIsCircleMask] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset state when opening a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setPan({ x: 0, y: 0 });
      setAspectRatio(initialAspectRatio);
      setIsCircleMask(initialAspectRatio === '1:1');
    }
  }, [isOpen, imageSrc, initialAspectRatio]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setPan({ x: 0, y: 0 });
  };

  // Determine viewport dimensions based on aspect ratio
  const getViewportDimensions = useCallback(() => {
    // Max container bounds inside the modal viewport area
    const maxW = 340;
    const maxH = 340;

    switch (aspectRatio) {
      case '1:1':
        return { width: maxW, height: maxW };
      case '3:4':
        return { width: Math.round(maxH * 0.75), height: maxH };
      case '4:5':
        return { width: Math.round(maxH * 0.8), height: maxH };
      case '9:16':
        return { width: Math.round(maxH * (9 / 16)), height: maxH };
      case 'free':
      default:
        return { width: maxW, height: Math.round(maxW * 0.75) };
    }
  }, [aspectRatio]);

  const vp = getViewportDimensions();

  // Mouse / Touch drag handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(0.5, Number((prev + delta).toFixed(2))), 4));
  };

  // Rotation helpers
  const handleRotateCw = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCcw = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPan({ x: 0, y: 0 });
  };

  // Execute Crop on HTML5 Canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageSrc;
      });

      // Target export dimensions (crisp 300DPI equivalent for resumes and biodata)
      let targetW = 800;
      let targetH = 800;

      if (aspectRatio === '3:4') {
        targetW = 675;
        targetH = 900;
      } else if (aspectRatio === '4:5') {
        targetW = 720;
        targetH = 900;
      } else if (aspectRatio === '9:16') {
        targetW = 540;
        targetH = 960;
      } else if (aspectRatio === 'free') {
        targetW = 800;
        targetH = 600;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear and fill white background
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      // Save context
      ctx.save();

      // Move context to center of output canvas
      ctx.translate(targetW / 2, targetH / 2);

      // Apply pan scaled proportionally to output resolution
      const scaleMultiplierX = targetW / vp.width;
      const scaleMultiplierY = targetH / vp.height;
      ctx.translate(pan.x * scaleMultiplierX, pan.y * scaleMultiplierY);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply horizontal flip
      ctx.scale(flipH ? -1 : 1, 1);

      // Calculate how the image is fitted inside the preview viewport
      // In the preview, image has CSS `max-w-none` and rendered size:
      // Base rendered width matches natural aspect ratio fitted into viewport
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const vpAspect = vp.width / vp.height;

      let baseRenderedW = targetW;
      let baseRenderedH = targetH;

      if (imgAspect > vpAspect) {
        // Wider than viewport: fit width (contain)
        baseRenderedW = targetW;
        baseRenderedH = targetW / imgAspect;
      } else {
        // Taller than viewport: fit height (contain)
        baseRenderedH = targetH;
        baseRenderedW = targetH * imgAspect;
      }

      // Apply user zoom
      const drawW = baseRenderedW * zoom;
      const drawH = baseRenderedH * zoom;

      // Draw image centered at (0, 0)
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      ctx.restore();

      // Convert to compressed JPEG base64 well below serverless payload limits
      const croppedBase64 = compressCanvasToDataUrl(canvas, 450 * 1024, 0.86);

      onCropComplete(croppedBase64);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      // Fallback: compress original imageSrc before applying if canvas crop fails
      try {
        const compressedFallback = await compressImageDataUrl(imageSrc);
        onCropComplete(compressedFallback);
      } catch {
        onCropComplete(imageSrc);
      }
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Drag to position • Scroll or use slider to zoom • Rotate if needed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Selector Bar */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            Ratio:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: '1:1', label: '1:1 Square', sub: 'Avatar' },
              { id: '3:4', label: '3:4 Portrait', sub: 'Biodata' },
              { id: '4:5', label: '4:5 Formal', sub: 'Resume' },
              { id: '9:16', label: '9:16 Story', sub: 'Card' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => {
                  setAspectRatio(ratio.id as AspectRatioType);
                  if (ratio.id !== '1:1') {
                    setIsCircleMask(false);
                  }
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                  aspectRatio === ratio.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {ratio.label}
              </button>
            ))}

            {aspectRatio === '1:1' && (
              <button
                type="button"
                onClick={() => setIsCircleMask(!isCircleMask)}
                title="Toggle circular frame preview guide"
                className={`p-1 text-[11px] rounded-lg border transition-all cursor-pointer flex items-center gap-1 px-2 ${
                  isCircleMask
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Round</span>
              </button>
            )}
          </div>
        </div>

        {/* Cropping Viewport Container */}
        <div className="flex-1 min-h-[360px] bg-slate-900 flex items-center justify-center p-4 overflow-hidden select-none relative">
          {/* Viewport Box */}
          <div
            ref={containerRef}
            style={{
              width: `${vp.width}px`,
              height: `${vp.height}px`,
            }}
            className={`relative overflow-hidden shadow-2xl border-2 border-indigo-400/90 cursor-grab active:cursor-grabbing bg-slate-950 transition-all ${
              isCircleMask ? 'rounded-full' : 'rounded-lg'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* Image Layer */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="To Crop"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                className="max-w-none transition-transform duration-75 select-none"
                style={{
                  width: `${vp.width}px`,
                  height: `${vp.height}px`,
                  objectFit: 'contain',
                  transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                  transformOrigin: 'center center',
                }}
                draggable={false}
              />
            </div>

            {/* Rule-of-Thirds Grid Lines (Overlay) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-white/30" />
                <div className="border-r border-white/30" />
                <div />
              </div>
            </div>

            {/* Corner Crop Indicators */}
            {!isCircleMask && (
              <>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white pointer-events-none" />
              </>
            )}
          </div>

          {/* Quick Helper Badge */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1.5 shadow-lg">
            <span>Drag image to position</span>
            <span className="opacity-40">•</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            {rotation !== 0 && (
              <>
                <span className="opacity-40">•</span>
                <span>{rotation}°</span>
              </>
            )}
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 space-y-3">
          {/* Zoom Slider Row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.5, Number((prev - 0.2).toFixed(2))))}
              title="Zoom Out"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3.5, Number((prev + 0.2).toFixed(2))))}
              title="Zoom In"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-slate-600 w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Tools Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRotateCcw}
                title="Rotate 90° Left"
                className="px-2 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate Left</span>
              </button>
              <button
                type="button"
                onClick={handleRotateCw}
                title="Rotate 90° Right"
                className="px-2 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate Right</span>
              </button>
              <button
                type="button"
                onClick={handleFlipH}
                title="Flip Horizontally"
                className={`px-2 py-1.5 text-xs rounded-lg border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  flipH
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset zoom & rotation"
                className="p-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApplyCrop}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {isProcessing ? 'Processing...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
