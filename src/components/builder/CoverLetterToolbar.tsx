import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Save,
  SlidersHorizontal,
  Scan,
} from 'lucide-react';

interface CoverLetterToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen?: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownloadPDF: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isExportingPDF?: boolean;
  onToggleCustomizer: () => void;
  isCustomizerOpen: boolean;
}

export const CoverLetterToolbar: React.FC<CoverLetterToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  isFullscreen,
  onToggleFullscreen,
  onDownloadPDF,
  onSave,
  isSaving = false,
  isExportingPDF = false,
  onToggleCustomizer,
  isCustomizerOpen,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs no-print">
      {/* Left: Zoom & Sheet Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={onZoomOut}
            className="min-w-[36px] min-h-[40px] p-1.5 hover:bg-white hover:shadow-xs rounded-md text-slate-600 transition-all cursor-pointer flex items-center justify-center"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            className="min-h-[40px] px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 hover:bg-white rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="min-w-[36px] min-h-[40px] p-1.5 hover:bg-white hover:shadow-xs rounded-md text-slate-600 transition-all cursor-pointer flex items-center justify-center"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {onFitToScreen && (
          <button
            type="button"
            onClick={onFitToScreen}
            className="min-h-[40px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            title="Fit to screen"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Fit</span>
          </button>
        )}

        <span className="hidden sm:inline-block px-2 text-slate-500 font-medium whitespace-nowrap shrink-0">
          1 A4 Page
        </span>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="min-w-[40px] min-h-[40px] p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer flex items-center justify-center"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onToggleCustomizer}
          className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isCustomizerOpen
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Templates & Style</span>
        </button>
      </div>

      {/* Right: Save & Download PDF */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>

        <button
          type="button"
          onClick={onDownloadPDF}
          disabled={isExportingPDF}
          className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0055D6] text-white font-bold rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExportingPDF ? 'Exporting...' : 'Download PDF'}</span>
        </button>
      </div>
    </div>
  );
};
