/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DocumentData, DocumentType, TemplateMetadata } from './types/document';
import { storageService, normalizeCoverLetterTemplateId, sanitizeDocument } from './services/storageService';
import { sampleBiodataDocument, sampleResumeDocument, sampleCoverLetterDocument } from './data/sampleData';

// Navigation & Layout
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';

// Pages
import { HomePage } from './components/pages/HomePage';
import { TemplateGallery } from './components/gallery/TemplateGallery';
import { TemplateGalleryPage } from './components/pages/TemplateGalleryPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { DocumentBuilder } from './components/builder/DocumentBuilder';
import { CoverLetterBuilder } from './components/builder/CoverLetterBuilder';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsPage } from './components/pages/TermsPage';
import { RefundPolicyPage } from './components/pages/RefundPolicyPage';
import { ShippingPolicyPage } from './components/pages/ShippingPolicyPage';
import { PaymentResultPage } from './components/pages/PaymentResultPage';
import { PurchaseRecoveryPage } from './components/pages/PurchaseRecoveryPage';
import { RestorePurchaseModal } from './components/payment/RestorePurchaseModal';
import { getTemplateById } from './templates/registry';
import { AlertCircle, CheckCircle, Printer, X } from 'lucide-react';
import { BUSINESS } from './config/business';
import { useSeo } from './hooks/useSeo';
import { resolveCurrentRoute, navigateToPath, PAGE_TO_PATH_MAP, SEO_CONFIG } from './utils/routes';

interface ToastState {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return resolveCurrentRoute();
  });
  const [activeDocument, setActiveDocument] = useState<DocumentData | null>(null);
  const [builderPendingAction, setBuilderPendingAction] = useState<'pdf' | 'png' | 'print' | null>(null);
  const [builderAutoCheckout, setBuilderAutoCheckout] = useState<boolean>(false);
  const [builderIsPaid, setBuilderIsPaid] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);

  // Set unique <title>, meta description, and canonical URL on every route change
  useSeo(SEO_CONFIG[currentPage] || SEO_CONFIG.home);

  const showToast = (toastData: Omit<ToastState, 'id'>, durationMs = 4000) => {
    const id = Date.now();
    setToast({ ...toastData, id });
    if (durationMs > 0) {
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, durationMs);
    }
  };

  // Initialize with documents from storage if available
  useEffect(() => {
    const docs = storageService.getDocuments();
    if (docs.length > 0 && !activeDocument) {
      setActiveDocument(docs[0]);
    }
  }, []);

  // Handle HTML5 History popstate & backward compatibility redirect for #hash
  useEffect(() => {
    const syncRoute = () => {
      const resolved = resolveCurrentRoute();
      if (resolved === 'restore') {
        setIsRestoreModalOpen(true);
      }
      setCurrentPage(resolved);
    };

    // Initial check (redirects any #hash on landing)
    syncRoute();

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateTo = (page: string) => {
    if (page === 'restore') {
      setIsRestoreModalOpen(true);
      navigateToPath('/restore');
      setCurrentPage('restore');
      return;
    }
    if (page === 'pricing') {
      navigateToPath('/');
      setCurrentPage('home');
      return;
    }
    const cleanPath = PAGE_TO_PATH_MAP[page] || (page.startsWith('/') ? page : `/${page}`);
    navigateToPath(cleanPath);
    setCurrentPage(page);
  };

  // Open existing or recovered document by ID with pending export action
  const handleOpenDocumentById = (
    documentId: string,
    templateId?: string,
    action?: 'pdf' | 'png' | 'print',
    openCheckout?: boolean,
    isPaid?: boolean
  ) => {
    const normalizedTemplateId = normalizeCoverLetterTemplateId(templateId);
    let doc = storageService.get(documentId);
    const tpl = normalizedTemplateId ? getTemplateById(normalizedTemplateId) : null;
    if (!doc) {
      const docType: DocumentType = tpl
        ? (tpl.type as DocumentType)
        : normalizedTemplateId?.startsWith('coverletter-')
        ? 'cover-letter'
        : 'resume';
      doc = storageService.createNewDocument(docType, normalizedTemplateId || 'resume-ats-basic');
      doc.id = documentId;
      storageService.saveDocument(doc);
    } else if (normalizedTemplateId && doc.templateId !== normalizedTemplateId) {
      doc = sanitizeDocument({ ...doc, templateId: normalizedTemplateId });
      storageService.saveDocument(doc);
    }
    setActiveDocument(doc);
    setBuilderPendingAction(action || null);
    setBuilderAutoCheckout(Boolean(openCheckout));
    setBuilderIsPaid(Boolean(isPaid));

    navigateTo('builder');
  };

  // Start new document flow: choose template first
  const handleStartNewDocument = (type: DocumentType) => {
    if (type === 'biodata') {
      navigateTo('biodata-templates');
    } else if (type === 'cover-letter') {
      navigateTo('cover-letter-templates');
    } else {
      navigateTo('resume-templates');
    }
  };

  // When a template is clicked from gallery
  const handleSelectTemplate = (template: TemplateMetadata) => {
    if (activeDocument && activeDocument.type === template.type) {
      const updated = sanitizeDocument({
        ...activeDocument,
        templateId: template.id,
        updatedAt: new Date().toISOString(),
      });
      setActiveDocument(updated);
      storageService.saveDocument(updated);
    } else {
      const newDoc = sanitizeDocument(storageService.createNewDocument(template.type, template.id));
      setActiveDocument(newDoc);
    }
    navigateTo('builder');
  };

  // Open existing document from dashboard
  const handleOpenDocument = (doc: DocumentData) => {
    setActiveDocument(sanitizeDocument(doc));
    navigateTo('builder');
  };

  // Try Demo immediately
  const handleTryDemo = (type: DocumentType) => {
    const rawDemo =
      type === 'biodata'
        ? sampleBiodataDocument
        : type === 'cover-letter'
        ? sampleCoverLetterDocument
        : sampleResumeDocument;
    const demoDoc = sanitizeDocument(rawDemo);
    storageService.saveDocument(demoDoc);
    setActiveDocument(demoDoc);
    navigateTo('builder');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Hide standard navbar in builder to maximize workspace */}
      {currentPage !== 'builder' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onTryDemo={handleTryDemo}
          onStartCreating={() => navigateTo('templates')}
        />
      )}

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onStartDocument={handleStartNewDocument}
            onBrowseTemplates={(type) => {
              if (type === 'biodata') navigateTo('biodata-templates');
              else if (type === 'resume') navigateTo('resume-templates');
              else if (type === 'cover-letter') navigateTo('cover-letter-templates');
              else navigateTo('templates');
            }}
            onTryDemo={handleTryDemo}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'templates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B4BDB]">{BUSINESS.name} Directory</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Professional Templates</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose from beautifully designed templates and create documents that represent you. Your data is preserved automatically when switching designs.
              </p>
            </div>
            <TemplateGallery
              initialType="resume"
              onSelectTemplate={handleSelectTemplate}
              currentDocumentData={activeDocument}
            />
          </div>
        )}

        {currentPage === 'biodata-templates' && (
          <TemplateGalleryPage
            key="biodata-templates"
            initialType="biodata"
            onSelectTemplate={handleSelectTemplate}
            currentDocumentData={activeDocument}
          />
        )}

        {currentPage === 'resume-templates' && (
          <TemplateGalleryPage
            key="resume-templates"
            initialType="resume"
            onSelectTemplate={handleSelectTemplate}
            currentDocumentData={activeDocument}
          />
        )}

        {currentPage === 'cover-letter-templates' && (
          <TemplateGalleryPage
            key="cover-letter-templates"
            initialType="cover-letter"
            onSelectTemplate={handleSelectTemplate}
            currentDocumentData={activeDocument}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard
            onOpenDocument={handleOpenDocument}
            onCreateNew={(type) => {
              const defaultTemplateId =
                type === 'biodata'
                  ? 'biodata-traditional-indian'
                  : type === 'cover-letter'
                  ? 'coverletter-modern-corporate'
                  : 'resume-ats-professional';
              const newDoc = storageService.createNewDocument(type, defaultTemplateId);
              setActiveDocument(newDoc);
              navigateTo('builder');
            }}
            onBrowseTemplates={(type) => {
              if (type === 'biodata') navigateTo('biodata-templates');
              else if (type === 'resume') navigateTo('resume-templates');
              else if (type === 'cover-letter') navigateTo('cover-letter-templates');
              else navigateTo('templates');
            }}
          />
        )}

        {currentPage === 'builder' && activeDocument && (
          activeDocument.type === 'cover-letter' ? (
            <CoverLetterBuilder
              initialDocument={activeDocument}
              onBackToDashboard={() => {
                setBuilderPendingAction(null);
                setBuilderAutoCheckout(false);
                setBuilderIsPaid(false);
                navigateTo('dashboard');
              }}
              onOpenTemplates={() => navigateTo('cover-letter-templates')}
              onDocumentChange={(updated) => setActiveDocument(updated)}
              initialPendingAction={builderPendingAction}
              autoOpenCheckout={builderAutoCheckout}
              paid={builderIsPaid}
              targetAction={builderPendingAction === 'png' ? 'png' : 'pdf'}
            />
          ) : (
            <DocumentBuilder
              initialDocument={activeDocument}
              onBackToDashboard={() => {
                setBuilderPendingAction(null);
                setBuilderAutoCheckout(false);
                setBuilderIsPaid(false);
                navigateTo('dashboard');
              }}
              onOpenTemplates={() => {
                if (activeDocument.type === 'biodata') navigateTo('biodata-templates');
                else navigateTo('resume-templates');
              }}
              onDocumentChange={(updated) => setActiveDocument(updated)}
              initialPendingAction={builderPendingAction}
              autoOpenCheckout={builderAutoCheckout}
              paid={builderIsPaid}
              targetAction={builderPendingAction === 'png' ? 'png' : 'pdf'}
            />
          )
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={navigateTo} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={navigateTo} />
        )}

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage onNavigate={navigateTo} />
        )}

        {currentPage === 'terms' && (
          <TermsPage onNavigate={navigateTo} />
        )}

        {currentPage === 'refund-policy' && (
          <RefundPolicyPage onNavigate={navigateTo} />
        )}

        {currentPage === 'shipping-policy' && (
          <ShippingPolicyPage onNavigate={navigateTo} />
        )}

        {currentPage === 'payment-result' && (
          <PaymentResultPage
            onNavigate={navigateTo}
            onOpenDocument={handleOpenDocumentById}
          />
        )}

        {currentPage === 'restore' && (
          <PurchaseRecoveryPage
            onNavigate={navigateTo}
            onOpenDocument={handleOpenDocumentById}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Restore Purchases Modal */}
      <RestorePurchaseModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onRestoreSuccess={(documentId, templateId) => {
          setIsRestoreModalOpen(false);
          handleOpenDocumentById(documentId, templateId, undefined, false, true);
        }}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {toast.type === 'info' && <Printer className="w-5 h-5 text-indigo-500" />}
            </div>
            <div className="flex-1 text-xs text-slate-700 leading-relaxed font-medium">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
