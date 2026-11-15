import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Scan,
  Maximize2,
  Minimize2,
  Download,
  Save,
  Palette,
  Loader2,
  Sparkles,
  FileText,
} from 'lucide-react';

interface PreviewToolbarProps {
  zoom: number;
  pageCount?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen?: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPrint?: () => void;
  onDownloadPDF: () => void;
  onDownloadPNG?: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isExportingPDF?: boolean;
  isExportingPNG?: boolean;
  isPrintDisabled?: boolean;
  onToggleCustomizer?: () => void;
  isCustomizerOpen?: boolean;
  onLoadDemoData?: () => void;
  isDocumentEmpty?: boolean;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  zoom,
  pageCount = 1,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  isFullscreen,
  onToggleFullscreen,
  onDownloadPDF,
  onSave,
  isSaving,
  isExportingPDF = false,
  onToggleCustomizer,
  isCustomizerOpen,
  onLoadDemoData,
  isDocumentEmpty,
}) => {
  const isBusyExporting = isExportingPDF;

  return (
    <div className="bg-white/95 backdrop-blur border border-slate-200 shadow-sm rounded-2xl px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3 builder-toolbar">
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-600">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 0.35}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          className="px-1.5 sm:px-2 py-1 font-mono text-[10px] sm:text-[11px] rounded-md hover:bg-slate-100 font-medium cursor-pointer"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 1.5}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={onFitToScreen || onResetZoom}
          className="px-2 sm:px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          title="Fit to Screen"
        >
          <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Fit</span>
        </button>
        <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>
        <span
          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200/60 hidden sm:inline-flex items-center gap-1 select-none"
          title={`Document contains ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}
        >
          <FileText className="w-3 h-3 text-[#0066FF]" />
          <span>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</span>
        </span>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
        {onToggleCustomizer && (
          <button
            type="button"
            onClick={onToggleCustomizer}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
              isCustomizerOpen
                ? 'bg-indigo-50 text-[#0066FF] border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Style</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {onLoadDemoData && isDocumentEmpty && (
          <button
            type="button"
            onClick={onLoadDemoData}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Populate with realistic sample details"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Load Demo</span>
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || isBusyExporting}
          className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
          title="Save draft to device storage"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>
        <button
          type="button"
          onClick={onDownloadPDF}
          disabled={isBusyExporting}
          className="px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-[#0066FF] rounded-lg hover:bg-[#0055D6] transition-all inline-flex items-center gap-1.5 shadow-xs shadow-indigo-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          title="Download PDF"
        >
          {isExportingPDF ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
