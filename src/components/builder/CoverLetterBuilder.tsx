import React, { useState, useEffect, useRef } from 'react';
import { DocumentData } from '../../types/document';
import { storageService, sanitizeDocument } from '../../services/storageService';
import { exportService, generateExportFilename } from '../../services/exportService';
import { sessionService } from '../../services/sessionService';
import { CoverLetterForm } from '../forms/CoverLetterForm';
import { TemplateRenderer } from '../preview/TemplateRenderer';
import { CoverLetterToolbar } from './CoverLetterToolbar';
import { CoverLetterCustomizer } from './CoverLetterCustomizer';
import { getTemplateById } from '../../templates/registry';
import { CashfreeCheckoutFlow } from '../payment/CashfreeCheckoutFlow';
import { isCoverLetterTemplateATS, validateCoverLetterFields } from '../../utils/mapCoverLetterData';
import { CoverLetterPreviewProvider } from '../../templates/coverletter/CoverLetterTemplateHelpers';
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

interface CoverLetterBuilderProps {
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

const waitForExportModePaint = async () => {
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 80)))
  );
};

export const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({
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
  const [isCoverLetterExporting, setIsCoverLetterExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(doc.title);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [exportError, setExportError] = useState<{
    message: string;
    action: 'pdf' | 'validation';
  } | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | null>(null);
  const [isPaidServerConfirmed, setIsPaidServerConfirmed] = useState<boolean>(false);

  const [preparedBlob, setPreparedBlob] = useState<{
    blob: Blob;
    filename: string;
    type: 'pdf';
  } | null>(null);
  const [isPreparingBlob, setIsPreparingBlob] = useState<boolean>(false);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [isDocumentEditedSinceBuild, setIsDocumentEditedSinceBuild] = useState<boolean>(false);

  const hasAutoBuiltRef = useRef<boolean>(false);
  const docVersionRef = useRef<number>(0);

  const handleFitToScreen = () => {
    setZoom(calculateOptimalZoom());
  };

  const handleSwitchToPreview = () => {
    setMobileView('preview');
    setZoom(calculateOptimalZoom());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setZoom(calculateOptimalZoom());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sanitized = sanitizeDocument(initialDocument);
    setDoc(sanitized);
    setTempTitle(sanitized.title);
  }, [initialDocument.id, initialDocument.templateId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      storageService.saveDocument(doc);
    }, 600);
    return () => clearTimeout(timer);
  }, [doc]);

  const handleDocumentChange = (updated: DocumentData) => {
    docVersionRef.current += 1;
    if (preparedBlob) {
      setPreparedBlob(null);
      setIsDocumentEditedSinceBuild(true);
    }
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

  const ensureReadyForExport = async (): Promise<boolean> => {
    const { isValid, errors, missingRequiredFields } = validateCoverLetterFields(doc);
    if (missingRequiredFields.length > 0) {
      setExportError({
        message: `Please fill: ${missingRequiredFields.join(', ')}`,
        action: 'validation',
      });
      return false;
    }
    if (!isValid) {
      const firstError = Object.values(errors).find(Boolean);
      if (firstError) {
        setExportError({
          message: firstError,
          action: 'validation',
        });
        return false;
      }
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileView !== 'preview') {
      handleSwitchToPreview();
      await new Promise((resolve) => setTimeout(resolve, 180));
    }

    const overflowSheet = document.querySelector(
      '[data-document-type="cover-letter"][data-is-overflowing="true"]'
    );
    if (overflowSheet) {
      const paraNum = overflowSheet.getAttribute('data-overflow-paragraph') || '2';
      setExportError({
        message: `Letter is too long for one page. Please shorten paragraph ${paraNum}.`,
        action: 'validation',
      });
      return false;
    }

    return true;
  };

  const executeExportPDF = async () => {
    if (isExportingPDF || isExternalExporting || exportService.isBusy()) {
      return;
    }
    if (mobileView !== 'preview') {
      handleSwitchToPreview();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setIsExportingPDF(true);
    setIsCoverLetterExporting(true);
    setExportError(null);
    setExportSuccess(null);
    const filename = generateExportFilename(doc.personal?.fullName, doc.title, doc.type, 'pdf');

    try {
      await waitForExportModePaint();
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
      console.error('Cover Letter PDF export execution error:', err);
      setExportError({
        message: err?.message || 'PDF generation failed. Please try again.',
        action: 'pdf',
      });
    } finally {
      setIsCoverLetterExporting(false);
      setIsExportingPDF(false);
    }
  };

  const currentTemplate = getTemplateById(doc.templateId);
  const isATSTemplate = isCoverLetterTemplateATS(doc.templateId);

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

  const isAllowedToExport = async (): Promise<boolean> => {
    const isFree = (currentTemplate?.priceINR ?? 0) === 0;
    if (isFree) return true;

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

    setPendingAction('pdf');
    setIsCheckoutOpen(true);
    return false;
  };

  useEffect(() => {
    if (autoOpenCheckout) {
      setIsCheckoutOpen(true);
    }
  }, [autoOpenCheckout]);

  const runBackgroundBuild = async () => {
    if (isPreparingBlob || exportService.isBusy()) return;
    setIsPreparingBlob(true);
    setIsCoverLetterExporting(true);
    setIsDocumentEditedSinceBuild(false);

    await new Promise((resolve) => setTimeout(resolve, 450));

    const captureVersion = docVersionRef.current;
    const filename = generateExportFilename(doc.personal?.fullName, doc.title, doc.type, 'pdf');

    try {
      await waitForExportModePaint();
      const blob = await exportService.generatePdfBlob('document-preview-root');

      if (docVersionRef.current === captureVersion) {
        setPreparedBlob({ blob, filename, type: 'pdf' });
      }
    } catch (err: any) {
      console.warn('[CoverLetterBuilder] Background blob build error:', err);
    } finally {
      setIsCoverLetterExporting(false);
      setIsPreparingBlob(false);
    }
  };

  useEffect(() => {
    if (paid && !hasAutoBuiltRef.current) {
      hasAutoBuiltRef.current = true;
      runBackgroundBuild();
    }
  }, [paid]);

  const handleDownloadPreparedBlob = () => {
    if (!preparedBlob) return;
    exportService.saveBlob(preparedBlob.blob, preparedBlob.filename);
    setHasDownloaded(true);
    setExportSuccess('PDF downloaded successfully!');
    setTimeout(() => setExportSuccess(null), 3500);
  };

  const handleDownloadPDF = async () => {
    if (!(await ensureReadyForExport())) {
      return;
    }
    if (preparedBlob) {
      handleDownloadPreparedBlob();
      return;
    }
    if (isExportingPDF || isExternalExporting || exportService.isBusy()) {
      return;
    }
    storageService.saveDocument(doc);
    onDocumentChange?.(doc);

    const allowed = await isAllowedToExport();
    if (allowed) {
      executeExportPDF();
    }
  };

  const saveTitle = () => {
    const trimmed = tempTitle.trim() || doc.title;
    const updated = { ...doc, title: trimmed };
    setDoc(updated);
    storageService.saveDocument(updated);
    onDocumentChange?.(updated);
    setIsEditingTitle(false);
  };

  const effectiveIsExportingPDF = isExportingPDF || (isExternalExporting && externalExportingType === 'pdf');

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col overflow-x-hidden pb-16 lg:pb-0 ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden !pb-0' : ''}`}>
      {/* Top Builder Navigation */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 builder-nav no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

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

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="text-slate-300">|</span>
            <span className={isATSTemplate ? 'text-emerald-700 font-semibold' : 'text-slate-700 font-semibold'}>
              {isATSTemplate ? 'ATS-Friendly' : 'Normal'}
            </span>
            <span className="text-slate-300">&middot;</span>
            {isDocumentPaid ? (
              <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid & Unlocked
              </span>
            ) : (currentTemplate?.priceINR ?? 0) === 0 ? (
              <span className="font-semibold text-emerald-700">Free (₹0)</span>
            ) : (
              <span className="font-semibold text-slate-800">₹{currentTemplate?.priceINR}</span>
            )}
          </div>

          {saveSuccessNotice && (
            <span className="text-[11px] font-semibold text-emerald-700">
              Autosaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>
              Template: <strong className="text-slate-900">{currentTemplate?.name || 'Standard'}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsCustomizerOpen((prev) => !prev)}
              className="text-[#0066FF] font-semibold hover:underline ml-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              Switch / Style
            </button>
            <span className="text-slate-300">&middot;</span>
            <button
              type="button"
              onClick={onOpenTemplates}
              className="text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              All Templates
            </button>
          </div>

          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setMobileView('form')}
              className={`min-h-[40px] px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                mobileView === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Edit Form
            </button>
            <button
              type="button"
              onClick={handleSwitchToPreview}
              className={`min-h-[40px] px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                mobileView === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </header>

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
                  onClick={() => runBackgroundBuild()}
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

      {/* Main Cover Letter Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div
          className={`lg:w-[42%] xl:w-[40%] bg-white border-r border-slate-200 overflow-y-auto p-6 builder-sidebar ${
            mobileView === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Cover Letter & Application Details
                </h2>
                <p className="text-xs text-slate-500">
                  Information entered here populates into all templates automatically.
                </p>
              </div>
            </div>

            <CoverLetterForm data={doc} onChange={handleDocumentChange} />
          </div>
        </div>

        <div
          className={`flex-1 flex-col bg-slate-200/75 overflow-hidden relative ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="px-4 pt-4 pb-2 z-20">
            <CoverLetterToolbar
              zoom={zoom}
              onZoomIn={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
              onZoomOut={() => setZoom((z) => Math.max(0.35, Number((z - 0.1).toFixed(1))))}
              onResetZoom={() => setZoom(0.9)}
              onFitToScreen={handleFitToScreen}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onDownloadPDF={handleDownloadPDF}
              onSave={handleManualSave}
              isSaving={isSaving}
              isExportingPDF={effectiveIsExportingPDF}
              onToggleCustomizer={() => setIsCustomizerOpen(!isCustomizerOpen)}
              isCustomizerOpen={isCustomizerOpen}
            />
          </div>

          {isCustomizerOpen && (
            <div className="px-4 pb-3 z-20 max-w-3xl mx-auto w-full">
              <CoverLetterCustomizer
                data={doc}
                onChange={handleDocumentChange}
                onClose={() => setIsCustomizerOpen(false)}
              />
            </div>
          )}

          <div className="flex-1 overflow-auto p-2 sm:p-6 lg:p-8 flex justify-center items-start print-container">
            <div
              style={{
                width: `${Math.round(800 * zoom)}px`,
                minHeight: `${Math.round((pageCount * 1131 + Math.max(0, pageCount - 1) * 32) * zoom)}px`,
                position: 'relative',
              }}
              className="my-auto transition-all print:!w-auto print:!min-h-0"
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
                className="cl-print-root print:transform-none print:shadow-none relative origin-top-left"
              >
                <CoverLetterPreviewProvider isExportMode={isCoverLetterExporting}>
                  <TemplateRenderer
                    data={doc}
                    isUnpaidPremium={isUnpaidPremium}
                    onPageCountChange={setPageCount}
                  />
                </CoverLetterPreviewProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {exportError && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900/95 text-white p-4 rounded-2xl shadow-2xl border border-rose-700 max-w-md animate-in slide-in-from-bottom-2 duration-200 no-print">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="font-bold text-sm">
                {exportError.action === 'validation' ? 'Required Fields Missing' : 'Export Notice'}
              </div>
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

      {exportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200 no-print">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      <CashfreeCheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setPendingAction(null);
        }}
        documentId={doc.id}
        templateId={doc.templateId}
        documentTitle={doc.title}
        documentType="Cover Letter"
        documentData={doc}
        pendingAction={pendingAction}
        onPaymentSuccess={() => {
          setIsPaidServerConfirmed(true);
          sessionService.markDocumentPaidLocally(doc.id, doc.templateId);
          setIsCheckoutOpen(false);
          runBackgroundBuild();
        }}
        onExecuteDownload={async () => {
          setIsCheckoutOpen(false);
          runBackgroundBuild();
        }}
      />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-3.5 py-2 flex items-center justify-between shadow-lg no-print">
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mobileView === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={handleSwitchToPreview}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className="min-h-[40px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="Fit to Screen"
            >
              <Scan className="w-3.5 h-3.5 text-slate-600" />
              <span>Fit ({Math.round(zoom * 100)}%)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={effectiveIsExportingPDF}
              className="min-h-[40px] px-3 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSwitchToPreview}
            className="min-h-[40px] px-3.5 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Sheet</span>
          </button>
        )}
      </div>

      {(isExportingPDF || isExternalExporting) && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-200 no-print">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Preparing your PDF...</h3>
              <p className="text-xs text-slate-400">Rendering high-definition vector document at 300 DPI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
