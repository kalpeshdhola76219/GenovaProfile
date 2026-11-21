import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cashfreeService } from '../../services/cashfreeService';
import { sessionService } from '../../services/sessionService';
import { pendingOrderService } from '../../services/pendingOrderService';
import { getTemplatePriceInfo, getTemplatePriceINR } from '../../config/templatesCatalog';
import {
  ShieldCheck,
  X,
  CreditCard,
  Lock,
  Sparkles,
  AlertCircle,
  QrCode,
  ArrowRight,
  RefreshCw,
  Mail,
} from 'lucide-react';

export interface CashfreeCheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  templateId?: string;
  documentTitle: string;
  documentType?: string;
  documentData?: any;
  pendingAction?: 'pdf' | 'png' | 'print' | null;
  onPaymentSuccess: () => void;
  onExecuteDownload?: () => Promise<void>;
}

type FlowStep = 'checkout_form' | 'verifying' | 'failed';

const MAX_VERIFY_RETRIES = 4;
const VERIFY_RETRY_DELAY_MS = 1500;

export const CashfreeCheckoutFlow: React.FC<CashfreeCheckoutFlowProps> = ({
  isOpen,
  onClose,
  documentId,
  templateId,
  documentTitle,
  documentType = 'Biodata',
  documentData,
  pendingAction,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<FlowStep>('checkout_form');
  const [mobile, setMobile] = useState<string>(() => sessionService.getSession().mobile || '');
  const [email, setEmail] = useState<string>('');
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingText, setLoadingText] = useState('Opening Cashfree Checkout...');
  const [verifyAttemptLabel, setVerifyAttemptLabel] = useState('Confirming payment with Cashfree...');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');
  const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);

  const isMountedRef = useRef<boolean>(true);
  const verifyRunIdRef = useRef<number>(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifyAbortRef = useRef<AbortController | null>(null);
  const inProgressRef = useRef<boolean>(false);

  const clearVerificationTimers = useCallback(() => {
    verifyRunIdRef.current += 1;
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (verifyAbortRef.current) {
      try {
        verifyAbortRef.current.abort();
      } catch {}
      verifyAbortRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearVerificationTimers();
    };
  }, [clearVerificationTimers]);

  const handleCloseModal = useCallback(() => {
    clearVerificationTimers();
    inProgressRef.current = false;
    setIsLoading(false);
    setIsVerifying(false);
    onClose();
  }, [clearVerificationTimers, onClose]);

  useEffect(() => {
    if (!isOpen) {
      clearVerificationTimers();
      inProgressRef.current = false;
      setIsLoading(false);
      setIsVerifying(false);
      return;
    }

    setIsLoading(false);
    setIsVerifying(false);
    setFailureReason('');
    setGeneralError(null);
    setMobileError(null);
    setEmailError(null);
    setStep('checkout_form');

    const currentMobile = sessionService.getSession().mobile || '';
    if (currentMobile) {
      setMobile((prev) => prev || currentMobile);
    }

    let cancelled = false;
    cashfreeService.getConfig().then((cfg) => {
      if (cancelled || !isMountedRef.current) return;
      setGatewayConfigured(cfg.isConfigured);
      if (!cfg.isConfigured) {
        setGeneralError('Cashfree payment is not configured yet.');
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelled = true;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, clearVerificationTimers, handleCloseModal]);

  const templateInfo = getTemplatePriceInfo(templateId);
  const resolvedPriceINR = templateInfo?.priceINR ?? getTemplatePriceINR(templateId);
  const resolvedTemplateName = templateInfo?.name || 'Selected Design';

  const verifyOrderWithFiniteRetries = useCallback(
    async (
      orderId: string,
      maxAttempts: number,
      closedWithoutPaymentDetails: boolean
    ): Promise<void> => {
      clearVerificationTimers();
      const runId = verifyRunIdRef.current;

      setIsVerifying(true);
      setStep('verifying');
      setVerifyAttemptLabel('Confirming payment with Cashfree...');

      const attemptCheck = async (attemptIndex: number) => {
        if (!isMountedRef.current || verifyRunIdRef.current !== runId) return;

        const controller = new AbortController();
        verifyAbortRef.current = controller;

        try {
          const res = await cashfreeService.verifyOrder(orderId, controller.signal);
          if (!isMountedRef.current || verifyRunIdRef.current !== runId) return;

          const normalizedStatus = String(res?.status || '').toUpperCase();

          // 1. Confirmed PAID -> stop spinner, close modal, unlock & auto-download
          if (res?.isPaid || normalizedStatus === 'PAID') {
            clearVerificationTimers();
            inProgressRef.current = false;
            setIsVerifying(false);
            setIsLoading(false);

            const docToUnlock = res.documentId || documentId;
            const tplToUnlock = res.templateId || templateId || '';
            if (docToUnlock && tplToUnlock) {
              sessionService.markDocumentPaidLocally(docToUnlock, tplToUnlock);
            }
            pendingOrderService.clearPendingOrder();
            onClose();
            onPaymentSuccess();
            return;
          }

          // 2. Confirmed FAILED / CANCELLED / USER_DROPPED / EXPIRED -> stop immediately, keep locked
          if (
            normalizedStatus === 'FAILED' ||
            normalizedStatus === 'USER_DROPPED' ||
            normalizedStatus === 'CANCELLED' ||
            normalizedStatus === 'VOID' ||
            normalizedStatus === 'EXPIRED'
          ) {
            clearVerificationTimers();
            inProgressRef.current = false;
            setIsVerifying(false);
            setIsLoading(false);
            pendingOrderService.clearPendingOrder();
            setFailureReason(
              res?.reason || res?.error || 'Payment was not completed. Please retry payment.'
            );
            setStep('failed');
            return;
          }

          // 3. PENDING response -> retry at most maxAttempts checks (1.5s apart)
          if (attemptIndex + 1 < maxAttempts) {
            setVerifyAttemptLabel(
              `Confirming payment (${attemptIndex + 2}/${maxAttempts})...`
            );
            retryTimerRef.current = setTimeout(() => {
              attemptCheck(attemptIndex + 1);
            }, VERIFY_RETRY_DELAY_MS);
            return;
          }

          // Finite retry cap reached -> stop spinner, keep locked, show retry
          clearVerificationTimers();
          inProgressRef.current = false;
          setIsVerifying(false);
          setIsLoading(false);
          setFailureReason(
            closedWithoutPaymentDetails
              ? 'Payment popup was closed before completion. No money was charged.'
              : 'Payment could not be confirmed yet. Please retry your payment.'
          );
          setStep('failed');
        } catch (err: any) {
          if (!isMountedRef.current || verifyRunIdRef.current !== runId || err?.name === 'AbortError') {
            return;
          }
          if (attemptIndex + 1 < maxAttempts) {
            retryTimerRef.current = setTimeout(() => {
              attemptCheck(attemptIndex + 1);
            }, VERIFY_RETRY_DELAY_MS);
            return;
          }
          clearVerificationTimers();
          inProgressRef.current = false;
          setIsVerifying(false);
          setIsLoading(false);
          setFailureReason(
            err?.message || 'Unable to verify payment status right now. Please retry payment.'
          );
          setStep('failed');
        }
      };

      await attemptCheck(0);
    },
    [clearVerificationTimers, documentId, templateId, onClose, onPaymentSuccess]
  );

  const validateCustomerFields = (): string | null => {
    const digits = mobile.replace(/\D/g, '');
    let clean = digits;
    if (clean.startsWith('91') && clean.length === 12) {
      clean = clean.slice(2);
    } else if (clean.startsWith('0') && clean.length === 11) {
      clean = clean.slice(1);
    }
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setMobileError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return null;
    }
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address.');
        return null;
      }
    }
    if (!consentAgreed) {
      setGeneralError('Please accept the Terms, Privacy Policy, and Refund Policy to continue.');
      return null;
    }

    setMobileError(null);
    setEmailError(null);
    setGeneralError(null);
    setMobile(clean);
    sessionService.saveMobile(clean);
    return clean;
  };

  // Single direct action: create Cashfree order on backend & immediately open _modal popup
  const handleStartPayment = async () => {
    if (inProgressRef.current || isLoading || isVerifying) return;
    if (gatewayConfigured === false) {
      setGeneralError('Cashfree payment is not configured yet.');
      return;
    }

    // Free templates bypass payment completely
    if (resolvedPriceINR === 0) {
      sessionService.markDocumentPaidLocally(documentId, templateId || '');
      onPaymentSuccess();
      onClose();
      return;
    }

    const cleanMobile = validateCustomerFields();
    if (!cleanMobile) return;

    clearVerificationTimers();
    inProgressRef.current = true;
    setIsLoading(true);
    setIsVerifying(false);
    setGeneralError(null);
    setFailureReason('');
    setStep('checkout_form');

    try {
      setLoadingText('Connecting to Cashfree...');
      await Promise.all([
        cashfreeService.loadCashfreeSdk(),
        sessionService.initBackendSession(cleanMobile),
      ]);

      setLoadingText('Preparing secure payment...');
      const orderRes = await cashfreeService.createOrder({
        documentId,
        mobile: cleanMobile,
        email: email.trim() || undefined,
        templateId,
        documentTitle,
        documentData,
        consent: {
          accepted: true,
          at: new Date().toISOString(),
          policyVersion: '2026-10',
        },
      });

      const resolvedOrderId = orderRes.orderId || orderRes.order_id || '';
      const rawSessionId = orderRes.paymentSessionId || orderRes.payment_session_id || '';
      const paymentSessionId = String(rawSessionId).trim();
      if (!resolvedOrderId || !paymentSessionId) {
        throw new Error('Cashfree payment session ID was not received. Please try again.');
      }

      const normalizedSyncType = (() => {
        const raw = String(documentType || '').toLowerCase().trim();
        if (raw.includes('invit')) return 'invitation';
        if (raw.includes('cover') || raw.includes('letter')) return 'cover-letter';
        if (raw.includes('resume') || raw.includes('cv')) return 'resume';
        return 'biodata';
      })();

      await cashfreeService.syncDocument({
        id: documentId,
        templateId: templateId || '',
        type: normalizedSyncType,
        title: documentTitle,
        documentData,
      });

      pendingOrderService.savePendingOrder({
        orderId: resolvedOrderId,
        documentId,
        templateId: templateId || '',
        documentTitle,
        amount: orderRes.amount,
        mobile: cleanMobile,
        createdAt: Date.now(),
        pendingAction: pendingAction || 'pdf',
      });

      if (typeof window.Cashfree !== 'function') {
        throw new Error('Cashfree payment SDK could not be loaded. Please check your connection.');
      }

      const mode: 'sandbox' | 'production' =
        orderRes.environment === 'production' ? 'production' : 'sandbox';

      const cashfree = window.Cashfree({ mode });

      // Release loading spinner before launching centered _modal popup
      setIsLoading(false);

      const checkoutResult = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
      });

      if (!isMountedRef.current) return;

      // User dropped / cancelled / SDK returned error inside modal
      if (checkoutResult?.error) {
        inProgressRef.current = false;
        setIsVerifying(false);
        pendingOrderService.clearPendingOrder();
        const rawErr =
          checkoutResult.error.message ||
          checkoutResult.error.description ||
          checkoutResult.error.error ||
          '';
        const isCancel = /close|cancel|dismiss|drop/i.test(rawErr);
        setFailureReason(
          isCancel
            ? 'Payment was cancelled before completion. No money was charged.'
            : rawErr || 'Payment could not be completed. Please try again.'
        );
        setStep('failed');
        return;
      }

      // Payment attempt finished with paymentDetails -> verify up to 4 checks (1.5s apart)
      if (checkoutResult?.paymentDetails) {
        await verifyOrderWithFiniteRetries(resolvedOrderId, MAX_VERIFY_RETRIES, false);
        return;
      }

      // Modal closed without explicit paymentDetails or error -> run single instant verification check
      // in case a QR payment settled, otherwise stop immediately and allow retry
      await verifyOrderWithFiniteRetries(resolvedOrderId, 1, true);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      inProgressRef.current = false;
      setIsLoading(false);
      setIsVerifying(false);
      pendingOrderService.clearPendingOrder();
      setFailureReason(
        err?.message || 'Payment service is temporarily unavailable. Please try again.'
      );
      setStep('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close payment window"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-300" />
              Cashfree Verified Checkout
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Direct Purchase
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">{documentTitle}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete payment to unlock and download your clean, high-definition document.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
          {generalError && (
            <div className="p-3 sm:p-4 bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl text-xs text-rose-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-800">Payment Notice</p>
                <p>{generalError}</p>
              </div>
            </div>
          )}

          {/* LOADING / VERIFYING STATE */}
          {isLoading || step === 'verifying' || isVerifying ? (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4 animate-in fade-in duration-150">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {isVerifying || step === 'verifying' ? 'Verifying Payment...' : loadingText}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {isVerifying || step === 'verifying'
                    ? verifyAttemptLabel
                    : 'Please wait while we open Cashfree Checkout.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : step === 'failed' ? (
            /* PAYMENT FAILED / CANCELLED STATE */
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Payment Not Completed</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {failureReason || 'Payment was not completed. Please try again.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleStartPayment}
                  className="py-3 px-5 bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0055D6] hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Payment</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFailureReason('');
                    setStep('checkout_form');
                  }}
                  className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit Mobile
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-3 px-3 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* SINGLE-STEP CHECKOUT FORM + ORDER SUMMARY */
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Compact Order Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>
                    {documentType} &bull; <strong className="text-slate-900">{resolvedTemplateName}</strong>
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {resolvedPriceINR === 0 ? 'Free' : `₹${resolvedPriceINR}`}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-slate-500 pt-1 border-t border-slate-200/70">
                  <span className="inline-flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#0066FF]" /> UPI / QR
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-600" /> Cards
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3 h-3 text-blue-600" /> NetBanking
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" /> 300 DPI A4 PDF + 30-Day Recovery
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Indian Mobile Number
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
                  <span className="px-3.5 py-3 text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (mobileError) setMobileError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartPayment();
                    }}
                    className="w-full text-sm font-medium px-3.5 py-3 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
                    maxLength={14}
                    autoFocus
                  />
                </div>
                {mobileError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {mobileError}
                  </p>
                )}
              </div>

              {/* Optional Email Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Email (optional) - for receipt &amp; restore link
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
                  <span className="px-3.5 py-3 text-slate-400 bg-slate-50 border-r border-slate-200">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartPayment();
                    }}
                    className="w-full text-xs font-medium px-3.5 py-3 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => {
                      setConsentAgreed(e.target.checked);
                      if (generalError) setGeneralError(null);
                    }}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-[11px] leading-relaxed text-slate-700">
                    I confirm this mobile number belongs to me and consent to one-time INR payment processing via Cashfree Payments.
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                disabled={!consentAgreed || !mobile.trim() || gatewayConfigured === false}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 ${
                  consentAgreed && mobile.trim() && gatewayConfigured !== false
                    ? 'bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0055D6] hover:to-indigo-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {resolvedPriceINR === 0
                    ? 'Download for Free'
                    : `Pay ₹${resolvedPriceINR} & Download`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[11px] leading-relaxed text-slate-500 text-center">
                By proceeding, you agree to Genova Profile&apos;s{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline font-medium hover:text-indigo-800"
                >
                  Terms &amp; Conditions
                </a>
                ,{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline font-medium hover:text-indigo-800"
                >
                  Privacy Policy
                </a>
                , and{' '}
                <a
                  href="/refund-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline font-medium hover:text-indigo-800"
                >
                  Refund Policy
                </a>
                .
              </p>

              <div className="text-center pt-1">
                <a
                  href="/restore"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                >
                  Already paid? Restore here
                </a>
              </div>
            </div>
          )}

          {/* Security Footnote */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-500" /> Secure payment powered by Cashfree
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> Server-side payment verification
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
