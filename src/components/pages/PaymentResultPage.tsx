import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Mail,
  ShieldCheck,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { sessionService } from '../../services/sessionService';
import { cashfreeService, VerifyOrderResponse } from '../../services/cashfreeService';
import { pendingOrderService, PendingOrder } from '../../services/pendingOrderService';
import { SavePurchaseDetailsCard } from '../payment/SavePurchaseDetailsCard';
import { BUSINESS } from '../../config/business';
import { storageService } from '../../services/storageService';
import { DocumentData } from '../../types/document';

export interface PaymentResultPageProps {
  onNavigate: (page: string) => void;
  onOpenDocument: (
    documentId: string,
    templateId?: string,
    action?: 'pdf' | 'png' | 'print',
    openCheckout?: boolean,
    paid?: boolean
  ) => void;
  onToast?: (toast: { type: 'success' | 'error' | 'info'; message: string }) => void;
}

type PaymentResultState =
  | 'checking'
  | 'paid'
  | 'pending_timeout'
  | 'failed'
  | 'not_found';

function maskMobileLastTwo(raw?: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  return '******' + digits.slice(-2);
}

export const PaymentResultPage: React.FC<PaymentResultPageProps> = ({
  onNavigate,
  onOpenDocument,
  onToast,
}) => {
  const [statusState, setStatusState] = useState<PaymentResultState>('checking');
  const [orderId, setOrderId] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<VerifyOrderResponse | null>(null);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const stopAllTimers = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
  };

  useEffect(() => {
    isCancelledRef.current = false;

    const hash = window.location.hash || '';
    const queryIdx = hash.indexOf('?');
    const hashQuery = queryIdx !== -1 ? hash.slice(queryIdx + 1) : '';
    const searchParams = new URLSearchParams(hashQuery || window.location.search);
    const resolvedOrderId = searchParams.get('order_id') || searchParams.get('orderId');

    const storedPending = pendingOrderService.getPendingOrder();
    setPendingOrder(storedPending);

    const activeOrderId = resolvedOrderId || storedPending?.orderId || '';
    if (!activeOrderId) {
      setStatusState('not_found');
      return;
    }

    setOrderId(activeOrderId);
    verifyOrderWithPolling(activeOrderId, 0, storedPending);

    return () => {
      isCancelledRef.current = true;
      stopAllTimers();
    };
  }, []);

  const verifyOrderWithPolling = async (
    targetOrderId: string,
    attempt: number,
    cachedPending?: PendingOrder | null
  ) => {
    if (isCancelledRef.current) return;

    try {
      const res = await cashfreeService.verifyOrder(targetOrderId);
      if (isCancelledRef.current) return;

      setOrderDetails(res);

      const upperStatus = String(res.status || '').toUpperCase();

      if (res.isPaid || upperStatus === 'PAID') {
        const docId = res.documentId || cachedPending?.documentId || '';
        const tplId = res.templateId || cachedPending?.templateId || '';
        if (docId && tplId) {
          sessionService.markDocumentPaidLocally(docId, tplId);
        }
        pendingOrderService.clearPendingOrder();

        if (docId) {
          try {
            const serverDocRes = await cashfreeService.fetchDocumentData(docId);
            if (!isCancelledRef.current && serverDocRes?.document) {
              const fullDoc: DocumentData = {
                ...serverDocRes.document,
                ...(serverDocRes.document.documentData || {}),
                id: docId,
                templateId: tplId || serverDocRes.document.templateId,
              };
              storageService.saveDocument(fullDoc);
            }
          } catch (fetchErr) {
            console.warn('[PaymentResultPage] Server document fetch fallback:', fetchErr);
          }
        }

        if (isCancelledRef.current) return;
        setStatusState('paid');
        onToast?.({
          type: 'success',
          message: 'Payment confirmed! Your document is unlocked.',
        });

        if (docId) {
          const targetAction = cachedPending?.pendingAction || 'pdf';
          autoOpenTimerRef.current = setTimeout(() => {
            if (!isCancelledRef.current) {
              onOpenDocument(docId, tplId, targetAction, false, true);
            }
          }, 1200);
        }
        return;
      }

      if (
        upperStatus === 'FAILED' ||
        upperStatus === 'EXPIRED' ||
        upperStatus === 'CANCELLED' ||
        upperStatus === 'USER_DROPPED' ||
        upperStatus === 'VOID'
      ) {
        setErrorMessage(res.reason || res.error || 'Payment was declined or cancelled.');
        setStatusState('failed');
        return;
      }

      // Finite retry cap for PENDING responses (max 4 checks, 1.5 seconds apart)
      if (attempt < 4) {
        const nextDelay = 1500;
        setRetryCount(attempt + 1);
        pollTimerRef.current = setTimeout(() => {
          verifyOrderWithPolling(targetOrderId, attempt + 1, cachedPending);
        }, nextDelay);
      } else {
        setStatusState('pending_timeout');
      }
    } catch (err: any) {
      if (isCancelledRef.current) return;
      if (attempt < 4) {
        setRetryCount(attempt + 1);
        pollTimerRef.current = setTimeout(() => {
          verifyOrderWithPolling(targetOrderId, attempt + 1, cachedPending);
        }, 1500);
      } else {
        setErrorMessage(err?.message || 'Unable to verify payment right now.');
        setStatusState('pending_timeout');
      }
    }
  };

  const resolvedDocId = orderDetails?.documentId || pendingOrder?.documentId || '';
  const resolvedTemplateId = orderDetails?.templateId || pendingOrder?.templateId || '';
  const resolvedTemplateName =
    orderDetails?.templateName || pendingOrder?.documentTitle || 'Selected Document';
  const resolvedAmount = orderDetails?.amount || pendingOrder?.amount || 0;
  const resolvedMobile = maskMobileLastTwo(orderDetails?.maskedMobile || pendingOrder?.mobile);
  const resolvedAction = pendingOrder?.pendingAction || 'pdf';

  const handleOpenDocumentNow = () => {
    if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
    if (!resolvedDocId) {
      onNavigate('dashboard');
      return;
    }
    onOpenDocument(resolvedDocId, resolvedTemplateId, resolvedAction, false, true);
  };

  const handleCheckAgain = () => {
    stopAllTimers();
    setStatusState('checking');
    setErrorMessage('');
    setRetryCount(0);
    verifyOrderWithPolling(orderId, 0, pendingOrder);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* CHECKING */}
          {statusState === 'checking' && (
            <div className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Verifying Your Payment...
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Please wait while we confirm your payment status directly with Cashfree Payment Gateway.
                </p>
              </div>

              {orderId && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Order Reference</span>
                  <span className="font-mono font-semibold text-slate-800">{orderId}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Attempt {retryCount + 1} &bull; Automatic verification active
              </p>
            </div>
          )}

          {/* PAID */}
          {statusState === 'paid' && (
            <div className="p-7 sm:p-9 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cashfree Payment Verified</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Payment Successful!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your document has been unlocked and is ready for clean HD export.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                {resolvedTemplateName && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Template</span>
                    <span className="font-semibold text-slate-900">{resolvedTemplateName}</span>
                  </div>
                )}
                {resolvedAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Amount Paid</span>
                    <span className="font-bold text-emerald-700">₹{resolvedAmount}</span>
                  </div>
                )}
                {resolvedMobile && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Customer Mobile</span>
                    <span className="font-mono text-slate-700">{resolvedMobile}</span>
                  </div>
                )}
              </div>

              <div className="text-left">
                <SavePurchaseDetailsCard
                  receiptId={orderDetails?.receiptId || orderDetails?.orderId || orderId}
                  orderId={orderId}
                  templateName={resolvedTemplateName}
                  amount={resolvedAmount}
                  paidAt={orderDetails?.paidAt}
                  recoveryCode={orderDetails?.recoveryCode}
                  mobile={orderDetails?.maskedMobile}
                />
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleOpenDocumentNow}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0055D6] hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Document & Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* PENDING TIMEOUT */}
          {statusState === 'pending_timeout' && (
            <div className="p-7 sm:p-9 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Payment Confirmation Pending
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  We have not received final confirmation from Cashfree yet. If money was deducted, please check again in a minute or restore your purchase later.
                </p>
              </div>

              {orderId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex items-center justify-between">
                  <span className="font-medium text-amber-900">Order Reference</span>
                  <span className="font-mono font-bold text-amber-900">{orderId}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCheckAgain}
                  className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Status Again</span>
                </button>
                <a
                  href={`mailto:${BUSINESS.email}?subject=Pending%20Order%20${encodeURIComponent(orderId)}`}
                  className="w-full py-2.5 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Contact Support</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2 px-5 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* FAILED */}
          {statusState === 'failed' && (
            <div className="p-7 sm:p-9 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <XCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Payment Not Completed
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {errorMessage || 'Your payment was declined or cancelled.'}
                </p>
              </div>

              {orderId && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Order Reference</span>
                  <span className="font-mono text-slate-800">{orderId}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (resolvedDocId) {
                      onOpenDocument(resolvedDocId, resolvedTemplateId, resolvedAction, true, false);
                    } else {
                      onNavigate('dashboard');
                    }
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Payment Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* NOT FOUND */}
          {statusState === 'not_found' && (
            <div className="p-7 sm:p-9 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                <HelpCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Order Reference Not Found
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  We could not find an active payment order for this link. If you already paid, restore your purchase using your mobile number.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('restore')}
                  className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  Restore Purchase
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
