import React, { useState, useEffect, useRef } from 'react';
import { DocumentData } from '../../types/document';
import { storageService, sanitizeDocument } from '../../services/storageService';
import { exportService, generateExportFilename } from '../../services/exportService';
import { sessionService } from '../../services/sessionService';
import { BiodataForm } from '../forms/BiodataForm';
import { ResumeForm } from '../forms/ResumeForm';
import { TemplateRenderer } from '../preview/TemplateRenderer';
import { PreviewToolbar } from '../preview/PreviewToolbar';
import { DocumentCustomizer } from '../preview/DocumentCustomizer';
import { getTemplateById } from '../../templates/registry';
import { CashfreeCheckoutFlow } from '../payment/CashfreeCheckoutFlow';
import {
  ArrowLeft,
  Edit3,
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Scan,
  Eye,
  FileText,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface DocumentBuilderProps {
  initialDocument: DocumentData;
  onBackToDashboard: () => void;
  onOpenTemplates: () => void;
  onDocumentChange?: (doc: DocumentData) => void;
  isExternalExporting?: boolean;
  externalExportingType?: 'pdf' | 'png' | 'print' | null;
  initialPendingAction?: 'pdf' | 'png' | 'print' | null;
  autoOpenCheckout?: boolean;
  paid?: boolean;
  targetAction?: 'pdf' | 'png';
}

export const DocumentBuilder: React.FC<DocumentBuilderProps> = ({
  initialDocument,
  onBackToDashboard,
  onOpenTemplates,
  onDocumentChange,
  isExternalExporting = false,
  externalExportingType = null,
  initialPendingAction = null,
  autoOpenCheckout = false,
  paid = false,
  targetAction,
}) => {
  const calculateOptimalZoom = () => {
    if (typeof window === 'undefined') return 0.9;
    const isMobile = window.innerWidth < 1024;
    const availableWidth = isMobile
      ? window.innerWidth - 32
      : Math.min(window.innerWidth * 0.58, 860) - 48;
    return Math.max(0.35, Math.min(1.0, Number((availableWidth / 800).toFixed(2))));
  };

  const [doc, setDoc] = useState<DocumentData>(() => sanitizeDocument(initialDocument));
  const [zoom, setZoom] = useState<number>(() => calculateOptimalZoom());
  const [pageCount, setPageCount] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(doc.title);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [exportError, setExportError] = useState<{ message: string; action: 'pdf' | 'png' } | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Cashfree Direct Checkout Modal State & Pending Action
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | 'png' | 'print' | null>(null);
  const [isPaidServerConfirmed, setIsPaidServerConfirmed] = useState<boolean>(false);

  // Background build & prepared Blob state (Single payment flow without auto-download)
  const targetType: 'pdf' | 'png' = targetAction || (initialPendingAction === 'png' ? 'png' : 'pdf');
  const [preparedBlob, setPreparedBlob] = useState<{
    blob: Blob;
    filename: string;
    type: 'pdf' | 'png';
  } | null>(null);
  const [isPreparingBlob, setIsPreparingBlob] = useState<boolean>(false);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [isDocumentEditedSinceBuild, setIsDocumentEditedSinceBuild] = useState<boolean>(false);

  // Guard against React double-running with useRef
  const hasAutoBuiltRef = useRef<boolean>(false);
  const docVersionRef = useRef<number>(0);

  // Responsive Fit to Screen handler
  const handleFitToScreen = () => {
    setZoom(calculateOptimalZoom());
  };

  // Switch to preview and auto-fit to screen for smartphone viewports
  const handleSwitchToPreview = () => {
    setMobileView('preview');
    setZoom(calculateOptimalZoom());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoom(calculateOptimalZoom());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const invalidatePreparedBlob = (markEdited = true) => {
    docVersionRef.current += 1;
    if (preparedBlob || isPreparingBlob) {
      setPreparedBlob(null);
      if (markEdited) {
        setIsDocumentEditedSinceBuild(true);
      }
    }
  };

  // Sync state if initialDocument id or templateId changes
  useEffect(() => {
    const sanitized = sanitizeDocument(initialDocument);
    setDoc(sanitized);
    setTempTitle(sanitized.title);
    invalidatePreparedBlob(false);
    setIsDocumentEditedSinceBuild(false);
    hasAutoBuiltRef.current = false;
  }, [initialDocument.id, initialDocument.templateId, initialDocument.updatedAt]);

  // Autosave to localStorage on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      storageService.saveDocument(doc);
      onDocumentChange?.(doc);
    }, 600);
    return () => clearTimeout(timer);
  }, [doc]);

  // Requirement 4: The rule that edited documents rebuild the file
  const handleDocumentChange = (updated: DocumentData) => {
    invalidatePreparedBlob(true);
    setDoc(updated);
    onDocumentChange?.(updated);
  };

  const handleManualSave = () => {
    setIsSaving(true);
    storageService.saveDocument(doc);
    onDocumentChange?.(doc);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 2500);
    }, 300);
  };

  // Direct export execution
  const executeExportPDF = async () => {
    if (isExportingPDF || isExportingPNG || isExternalExporting || exportService.isBusy()) {
      return;
    }
    // Ensure preview element is active and visible on mobile screens
    if (mobileView !== 'preview') {
      handleSwitchToPreview();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setIsExportingPDF(true);
    setExportError(null);
    setExportSuccess(null);
    const filename = generateExportFilename(doc.personal?.fullName, doc.title, doc.type, 'pdf');

    try {
      const result = await exportService.downloadPDF('document-preview-root', filename);
      if (!result.success) {
        setExportError({
          message: result.error || 'PDF could not be generated. Please try again.',
          action: 'pdf',
        });
      } else {
        setExportSuccess(result.message || 'PDF downloaded successfully!');
        setTimeout(() => setExportSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error('PDF export execution error:', err);
      setExportError({
        message: err?.message || 'PDF generation failed. Please try again.',
        action: 'pdf',
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const executeExportPNG = async () => {
    if (isExportingPDF || isExportingPNG || isExternalExporting || exportService.isBusy()) {
      return;
    }
    // Ensure preview element is active and visible on mobile screens
    if (mobileView !== 'preview') {
      handleSwitchToPreview();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setIsExportingPNG(true);
    setExportError(null);
    setExportSuccess(null);
    const filename = generateExportFilename(doc.personal?.fullName, doc.title, doc.type, 'png');

    try {
      const result = await exportService.downloadPNG('document-preview-root', filename);
      if (!result.success) {
        setExportError({
          message: result.error || 'Image export failed. Please try again.',
          action: 'png',
        });
      } else {
        setExportSuccess(result.message || 'Image downloaded successfully!');
        setTimeout(() => setExportSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error('PNG export execution error:', err);
      setExportError({
        message: err?.message || 'Image export failed. Please try again.',
        action: 'png',
      });
    } finally {
      setIsExportingPNG(false);
    }
  };

  const currentTemplate = getTemplateById(doc.templateId);

  // Authoritative server entitlement re-check on mount and whenever template changes
  useEffect(() => {
    const isFree = (currentTemplate?.priceINR ?? 0) === 0;
    if (isFree) {
      setIsPaidServerConfirmed(false);
      return;
    }
    let active = true;
    sessionService
      .checkEntitlement(doc.id, doc.templateId)
      .then((allowed) => {
        if (active) {
          setIsPaidServerConfirmed(allowed);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [doc.id, doc.templateId, currentTemplate?.priceINR]);

  const isDocumentPaid =
    (currentTemplate?.priceINR ?? 0) > 0 &&
    (isPaidServerConfirmed || sessionService.isDocumentPaidLocally(doc.id, doc.templateId));
  const isUnpaidPremium = (currentTemplate?.priceINR ?? 0) > 0 && !isDocumentPaid;

  const executeExportPrint = () => {
    exportService.printDocument();
  };

  // Authoritative gating for ALL export actions (PDF, PNG, Print)
  const isAllowedToExport = async (action: 'pdf' | 'png' | 'print'): Promise<boolean> => {
    const isFree = (currentTemplate?.priceINR ?? 0) === 0;
    if (isFree) return true;

    // Server check is authoritative source of truth before every export
    try {
      const serverAllowed = await sessionService.checkEntitlement(doc.id, doc.templateId);
      if (serverAllowed) {
        setIsPaidServerConfirmed(true);
        return true;
      }
    } catch {
      if (sessionService.isDocumentPaidLocally(doc.id, doc.templateId)) {
        return true;
      }
    }

    setPendingAction(action);
    setIsCheckoutOpen(true);
    return false;
  };

  // Auto-open checkout if requested via route navigation
  useEffect(() => {
    if (autoOpenCheckout) {
      setIsCheckoutOpen(true);
    }
  }, [autoOpenCheckout]);

  // Background build triggered once when paid=true, using the exact same readiness pipeline as manual download
  const runBackgroundBuild = async (type: 'pdf' | 'png') => {
    if (isPreparingBlob || isExportingPDF || isExportingPNG || exportService.isBusy()) return;
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileView !== 'preview') {
      handleSwitchToPreview();
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    setIsPreparingBlob(true);
    setIsDocumentEditedSinceBuild(false);

    const captureVersion = docVersionRef.current;
    const filename = generateExportFilename(doc.personal?.fullName, doc.title, doc.type, type);

    try {
      let blob: Blob;
      if (type === 'png') {
        blob = await exportService.generatePngBlob('document-preview-root');
      } else {
        blob = await exportService.generatePdfBlob('document-preview-root');
      }

      if (docVersionRef.current === captureVersion) {
        setPreparedBlob({ blob, filename, type });
      }
    } catch (err: any) {
      console.warn('[DocumentBuilder] Background blob build error:', err);
    } finally {
      setIsPreparingBlob(false);
    }
  };

  useEffect(() => {
    if (paid && !hasAutoBuiltRef.current) {
      hasAutoBuiltRef.current = true;
      runBackgroundBuild(targetType);
    }
  }, [paid]);

  // Requirement 3: Clicking Download must call saveBlob immediately and not run html2canvas again
  const handleDownloadPreparedBlob = () => {
    if (!preparedBlob) return;
    exportService.saveBlob(preparedBlob.blob, preparedBlob.filename);
    setHasDownloaded(true);
    setExportSuccess(`${preparedBlob.type.toUpperCase()} downloaded successfully!`);
    setTimeout(() => setExportSuccess(null), 3500);
  };

  // Download Trigger: If prepared blob matches, download immediately without html2canvas.
  // Otherwise, fallback build with full-screen "Preparing..." overlay.
  const handleDownloadPDF = async () => {
    if (preparedBlob && preparedBlob.type === 'pdf') {
      handleDownloadPreparedBlob();
      return;
    }
    if (isExportingPDF || isExportingPNG || isExternalExporting || exportService.isBusy()) {
      return;
    }
    // Save latest document data
    storageService.saveDocument(doc);
    onDocumentChange?.(doc);

    const allowed = await isAllowedToExport('pdf');
    if (allowed) {
      executeExportPDF();
    }
  };

  const handleDownloadPNG = async () => {
    if (preparedBlob && preparedBlob.type === 'png') {
      handleDownloadPreparedBlob();
      return;
    }
    if (isExportingPDF || isExportingPNG || isExternalExporting || exportService.isBusy()) {
      return;
    }
    storageService.saveDocument(doc);
    onDocumentChange?.(doc);

    const allowed = await isAllowedToExport('png');
    if (allowed) {
      executeExportPNG();
    }
  };

  const handlePrint = async () => {
    if (exportService.isBusy()) {
      return;
    }
    storageService.saveDocument(doc);
    onDocumentChange?.(doc);

    const allowed = await isAllowedToExport('print');
    if (allowed) {
      executeExportPrint();
    }
  };

  const saveTitle = () => {
    const trimmed = tempTitle.trim() || doc.title;
    const updated = { ...doc, title: trimmed };
    invalidatePreparedBlob(true);
    setDoc(updated);
    storageService.saveDocument(updated);
    onDocumentChange?.(updated);
    setIsEditingTitle(false);
  };

  // Combined export loading states
  const effectiveIsExportingPDF = isExportingPDF || (isExternalExporting && externalExportingType === 'pdf');
  const effectiveIsExportingPNG = isExportingPNG || (isExternalExporting && externalExportingType === 'png');

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col pb-14 lg:pb-0 ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden !pb-0' : ''}`}>
      {/* Top Builder Navigation */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 builder-nav no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Editable Document Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="px-2 py-1 text-sm font-bold border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                autoFocus
              />
              <button
                type="button"
                onClick={saveTitle}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <h1 className="text-sm font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                {doc.title}
              </h1>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF]" />
            </div>
          )}

          {isDocumentPaid ? (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid & Unlocked
            </span>
          ) : (currentTemplate?.priceINR ?? 0) === 0 ? (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Free Template (₹0)
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
              ₹{currentTemplate?.priceINR}
            </span>
          )}

          {saveSuccessNotice && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Autosaved
            </span>
          )}
        </div>

        {/* Center: Four-Step Progress Bar for Resumes */}
        {doc.type === 'resume' ? (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <button
              type="button"
              onClick={onOpenTemplates}
              className="flex items-center gap-1 text-slate-700 hover:text-[#0066FF] transition-colors cursor-pointer"
              title="Click to select a different template"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
              <span>1. Select Template</span>
            </button>

            <span className="text-slate-300 font-normal">&bull;</span>

            <button
              type="button"
              onClick={() => setMobileView('form')}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                mobileView === 'form' ? 'text-[#0066FF] font-bold' : 'text-slate-700 hover:text-[#0066FF]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                mobileView === 'form' ? 'bg-[#0066FF] text-white' : 'bg-slate-200 text-slate-700'
              }`}>2</span>
              <span>2. Enter Details</span>
            </button>

            <span className="text-slate-300 font-normal">&bull;</span>

            <button
              type="button"
              onClick={handleSwitchToPreview}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                mobileView === 'preview' ? 'text-[#0066FF] font-bold' : 'text-slate-700 hover:text-[#0066FF]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                mobileView === 'preview' ? 'bg-[#0066FF] text-white' : 'bg-slate-200 text-slate-700'
              }`}>3</span>
              <span>3. Preview</span>
            </button>

            <span className="text-slate-300 font-normal">&bull;</span>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">4</span>
              <span>4. Download</span>
            </button>
          </div>
        ) : (currentTemplate?.priceINR ?? 0) === 0 ? (
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <span className="text-slate-800">1 Choose Template</span>
            <span>&bull;</span>
            <span className="text-slate-800">2 Fill Details</span>
            <span>&bull;</span>
            <span className="text-[#0066FF] font-bold">3 Preview</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-bold">4 Free Instant Download</span>
          </div>
        ) : (
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <span className="text-slate-800">1 Choose Template</span>
            <span>&bull;</span>
            <span className="text-slate-800">2 Fill Details</span>
            <span>&bull;</span>
            <span className="text-[#0066FF] font-bold">3 Preview</span>
            <span>&bull;</span>
            <span>4 Mobile</span>
            <span>&bull;</span>
            <span>5 Payment (₹{currentTemplate?.priceINR})</span>
            <span>&bull;</span>
            <span>6 Download</span>
          </div>
        )}

        {/* Right Quick Template Info & Mobile Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>Template: <strong className="text-slate-800">{currentTemplate?.name || 'Standard'}</strong></span>
            <button
              type="button"
              onClick={onOpenTemplates}
              className="text-[#0066FF] font-semibold hover:underline ml-1 cursor-pointer"
            >
              Change Template
            </button>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setMobileView('form')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                mobileView === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Edit Form
            </button>
            <button
              type="button"
              onClick={handleSwitchToPreview}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                mobileView === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* Top Banner when editor opens with paid=true or while preparing/ready */}
      {(paid || isPreparingBlob || preparedBlob || isDocumentEditedSinceBuild) && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 sm:px-6 shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 no-print">
          {isPreparingBlob ? (
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Payment successful ✓ Preparing your file...</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
            </div>
          ) : preparedBlob ? (
            <>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Your file is ready ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPreparedBlob}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{hasDownloaded ? 'Download again' : 'Download Now'}</span>
                </button>
              </div>
            </>
          ) : isDocumentEditedSinceBuild ? (
            <>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Document edited — download will rebuild your file with latest changes.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runBackgroundBuild(targetType)}
                  disabled={isPreparingBlob}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rebuild file</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Payment successful ✓</span>
            </div>
          )}
        </div>
      )}

      {/* Main Builder Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Form Area (40% width on desktop) */}
        <div
          className={`lg:w-[42%] xl:w-[40%] bg-white border-r border-slate-200 overflow-y-auto p-6 builder-sidebar ${
            mobileView === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {doc.type === 'biodata'
                    ? 'Matrimonial Profile Information'
                    : 'Resume Details'}
                </h2>
                <p className="text-xs text-slate-500">
                  Information entered here populates into all templates automatically.
                </p>
              </div>
            </div>

            {doc.type === 'biodata' ? (
              <BiodataForm data={doc} onChange={handleDocumentChange} />
            ) : (
              <ResumeForm data={doc} onChange={handleDocumentChange} />
            )}
          </div>
        </div>

        {/* Right Live Preview Area (60% width on desktop) */}
        <div
          className={`flex-1 flex flex-col bg-slate-200/70 overflow-hidden relative ${
            mobileView === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Top Sticky Toolbar */}
          <div className="p-4 z-20">
            <PreviewToolbar
              zoom={zoom}
              pageCount={pageCount}
              onZoomIn={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
              onZoomOut={() => setZoom((z) => Math.max(0.35, Number((z - 0.1).toFixed(1))))}
              onResetZoom={() => setZoom(0.9)}
              onFitToScreen={handleFitToScreen}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onPrint={handlePrint}
              onDownloadPDF={handleDownloadPDF}
              onDownloadPNG={handleDownloadPNG}
              onSave={handleManualSave}
              isSaving={isSaving}
              isExportingPDF={effectiveIsExportingPDF}
              isExportingPNG={effectiveIsExportingPNG}
              onToggleCustomizer={() => setIsCustomizerOpen(!isCustomizerOpen)}
              isCustomizerOpen={isCustomizerOpen}
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 pt-1.5">
              <span>Your document is saved on our secure server. <a href="#privacy" className="text-[#0066FF] underline hover:text-indigo-800 font-medium">See Privacy Policy</a>.</span>
              {saveSuccessNotice && (
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Autosaved
                </span>
              )}
            </div>
          </div>

          {/* Slide-Down Customizer Panel */}
          {isCustomizerOpen && (
            <div className="px-4 pb-4 z-20 max-w-2xl mx-auto w-full">
              <DocumentCustomizer
                data={doc}
                onChange={handleDocumentChange}
                onClose={() => setIsCustomizerOpen(false)}
              />
            </div>
          )}

          {/* Preview Viewport Container */}
          <div className="flex-1 overflow-auto p-2 sm:p-6 lg:p-8 flex justify-center items-start print-container">
            <div
              style={{
                width: `${Math.round(800 * zoom)}px`,
                minHeight: `${Math.round((pageCount * 1131 + Math.max(0, pageCount - 1) * 32) * zoom)}px`,
                position: 'relative',
              }}
              className="my-auto transition-all"
            >
              <div
                id="document-preview-root"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: '800px',
                  minHeight: `${pageCount * 1131 + Math.max(0, pageCount - 1) * 32}px`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="print:transform-none print:shadow-none relative origin-top-left"
              >
                <TemplateRenderer
                  data={doc}
                  isUnpaidPremium={isUnpaidPremium}
                  onPageCountChange={setPageCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Error Notice with Action Buttons */}
      {exportError && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900/95 text-white p-4 rounded-2xl shadow-2xl border border-rose-700 max-w-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="font-bold text-sm">Export Notice</div>
              <p className="text-xs text-rose-100 leading-relaxed">{exportError.message}</p>
              <div className="flex items-center gap-2 pt-1">
                {exportError.action === 'pdf' && (
                  <button
                    type="button"
                    onClick={() => {
                      setExportError(null);
                      executeExportPDF();
                    }}
                    className="px-3 py-1 bg-white text-rose-950 font-bold text-xs rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setExportError(null)}
                  className="px-2 py-1 text-xs text-rose-300 hover:text-white transition-colors cursor-pointer ml-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Exporting Modal Loader */}
      {effectiveIsExportingPDF && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 no-print">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-75"></div>
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0066FF] to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Generating PDF... Please wait a moment.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Preparing your high-resolution document.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Notice */}
      {exportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Cashfree Direct Purchase Checkout Flow */}
      <CashfreeCheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setPendingAction(null);
        }}
        documentId={doc.id}
        templateId={doc.templateId}
        documentTitle={doc.title}
        documentType={
          doc.type === 'biodata'
            ? 'Marriage Biodata'
            : 'Resume'
        }
        documentData={doc}
        pendingAction={pendingAction}
        onPaymentSuccess={() => {
          setIsPaidServerConfirmed(true);
          sessionService.markDocumentPaidLocally(doc.id, doc.templateId);
          setIsCheckoutOpen(false);
          runBackgroundBuild(targetType);
        }}
        onExecuteDownload={async () => {
          setIsCheckoutOpen(false);
          runBackgroundBuild(targetType);
        }}
      />

      {/* Mobile Sticky Bottom Navigation Toolbar & Preview Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-3.5 py-2 flex items-center justify-between shadow-lg no-print">
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mobileView === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={handleSwitchToPreview}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mobileView === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {mobileView === 'preview' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFitToScreen}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="Fit to Screen"
            >
              <Scan className="w-3.5 h-3.5 text-slate-600" />
              <span>Fit ({Math.round(zoom * 100)}%)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={effectiveIsExportingPDF}
              className="px-3 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSwitchToPreview}
            className="px-3.5 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Sheet</span>
          </button>
        )}
      </div>

      {/* Full-screen Preparing Overlay for fallback build / direct builds */}
      {(isExportingPDF || isExportingPNG || isExternalExporting) && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Preparing your {effectiveIsExportingPNG ? 'HD Image' : 'PDF'}...</h3>
              <p className="text-xs text-slate-400">Rendering high-definition vector document at 300 DPI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
