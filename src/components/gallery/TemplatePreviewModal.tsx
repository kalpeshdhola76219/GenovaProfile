import React, { useState, useEffect, useMemo } from 'react';
import { TemplateMetadata, DocumentData } from '../../types/document';
import {
  sampleResumeDocument,
  sampleInternationalResumeDocument,
  sampleModernCorporateResumeDocument,
  sampleMonacoSovereignResumeDocument,
  sampleBiodataDocument,
  sampleCoverLetterDocument,
} from '../../data/sampleData';
import { getPreviewDataForTemplate } from '../../data/previewSampleData';
import { sanitizeDocumentTextFields } from '../../utils/textSanitizer';
import {
  X,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react';

interface TemplatePreviewModalProps {
  template: TemplateMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: TemplateMetadata) => void;
  currentDocumentData?: DocumentData | null;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelect,
  currentDocumentData,
}) => {
  const calculateOptimalZoom = () => {
    if (typeof window === 'undefined') return 0.85;
    const availableWidth = window.innerWidth < 640 ? window.innerWidth - 32 : Math.min(window.innerWidth - 64, 820);
    return Math.max(0.35, Math.min(0.95, Number((availableWidth / 800).toFixed(2))));
  };

  const [zoom, setZoom] = useState<number>(() => calculateOptimalZoom());
  const [dataMode, setDataMode] = useState<'sample' | 'user'>('sample');

  useEffect(() => {
    if (isOpen) {
      setZoom(calculateOptimalZoom());
    }
    const handleResize = () => {
      if (isOpen && window.innerWidth < 768) {
        setZoom(calculateOptimalZoom());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Check if current document has genuine filled user information
  const hasUserFilledData = useMemo(() => {
    if (!currentDocumentData || !template) return false;
    if (currentDocumentData.type !== template.type) return false;
    const hasName = Boolean(currentDocumentData.personal?.fullName?.trim());
    const hasExp = Boolean(
      currentDocumentData.experience &&
      currentDocumentData.experience.length > 0 &&
      currentDocumentData.experience.some((e) => e.company?.trim() || e.jobTitle?.trim())
    );
    const hasEdu = Boolean(
      currentDocumentData.education &&
      currentDocumentData.education.length > 0 &&
      currentDocumentData.education.some((e) => e.institute?.trim() || e.degree?.trim())
    );
    const hasSummary = Boolean(currentDocumentData.summary?.trim());
    const hasLetter = Boolean(
      currentDocumentData.coverLetter?.hiringManagerName?.trim() ||
      currentDocumentData.coverLetter?.companyName?.trim()
    );
    return hasName || hasExp || hasEdu || hasSummary || hasLetter;
  }, [currentDocumentData, template]);

  // Reset zoom and ensure dataMode defaults to 'sample' when opened or if no user data
  useEffect(() => {
    if (isOpen) {
      setZoom(window.innerWidth < 768 ? 0.65 : 0.85);
      if (!hasUserFilledData) {
        setDataMode('sample');
      }
    }
  }, [isOpen, template, hasUserFilledData]);

  // Build complete fallback sample data based on template.type
  const defaultSampleData: DocumentData | null = useMemo(() => {
    if (!template) return null;
    if (template.type === 'resume') {
      if (template.id === 'resume-prem-international') {
        return { ...sampleInternationalResumeDocument, templateId: template.id };
      }
      if (template.id === 'resume-modern-corporate') {
        return { ...sampleModernCorporateResumeDocument, templateId: template.id };
      }
      if (template.id === 'resume-monaco-sovereign') {
        return { ...sampleMonacoSovereignResumeDocument, templateId: template.id };
      }
      return { ...sampleResumeDocument, templateId: template.id };
    }
    if (template.type === 'biodata') {
      return { ...sampleBiodataDocument, templateId: template.id };
    }
    if (template.type === 'cover-letter') {
      return { ...sampleCoverLetterDocument, templateId: template.id };
    }
    return getPreviewDataForTemplate(template.id, template.type);
  }, [template]);

  if (!isOpen || !template) return null;

  const TemplateComponent = template.component;

  // Use user data if explicitly selected AND user data is filled; otherwise always render sample data
  const previewData =
    dataMode === 'user' && hasUserFilledData && currentDocumentData
      ? { ...currentDocumentData, templateId: template.id }
      : (defaultSampleData || sampleResumeDocument);

  const handleSelect = () => {
    onSelect(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
            style={{ backgroundColor: template.primaryColorSample }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                {template.name}
              </h2>
              {template.priceINR > 0 ? (
                <span className="text-[10px] font-bold text-violet-900 bg-violet-100 border border-violet-200 px-2 py-0.5 rounded">
                  ₹{template.priceINR}
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Free (₹0)
                </span>
              )}
              {template.isATS && (
                <span className="hidden sm:inline-flex text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> ATS Friendly
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 capitalize">
              {template.type === 'biodata'
                ? 'Matrimonial Profile'
                : template.type === 'cover-letter'
                ? 'Cover Letter'
                : 'Professional Resume'}{' '}
              &bull; Category: {template.category}
            </p>
          </div>
        </div>

        {/* Center Controls: Data Toggle & Zoom */}
        <div className="flex items-center gap-2">
          {/* Intelligent Data Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDataMode('sample')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dataMode === 'sample'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sample Preview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (hasUserFilledData) {
                  setDataMode('user');
                }
              }}
              disabled={!hasUserFilledData}
              title={
                hasUserFilledData
                  ? 'Preview with your filled information'
                  : 'No details entered yet for this document type'
              }
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                dataMode === 'user'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>My Details</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 w-11 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelect}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Use Template</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Scrollable Viewport */}
      <div
        className="flex-1 overflow-auto p-2 sm:p-6 lg:p-8 flex items-start justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          style={{
            width: `${Math.round(800 * zoom)}px`,
            minHeight: `${Math.round(1130 * zoom)}px`,
            position: 'relative',
          }}
          className="my-auto transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="transition-transform duration-150 origin-top-left shadow-2xl rounded-sm"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: '800px',
              minHeight: '1130px',
            }}
          >
            <TemplateComponent data={sanitizeDocumentTextFields(previewData)} />
          </div>
        </div>
      </div>
    </div>
  );
};
