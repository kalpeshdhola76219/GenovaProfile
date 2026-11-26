/**
 * RestorePurchaseModal Component (Task 4C)
 * Allows customers who cleared localStorage or switched devices to recover their paid document.
 * Accessible from Dashboard header, Navbar, and Footer links (#restore).
 * Fields:
 * - Receipt / Order ID
 * - Registered Mobile Number
 * - Secret Recovery Code (Optional for fallback Option B, Required for instant unlock Option A)
 * Shows generic errors to prevent enumeration, attempt limits, and success button to open document.
 */
import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldCheck,
  Lock,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  HelpCircle,
  Mail,
  Loader2,
} from 'lucide-react';
import { razorpayService, RestorePurchaseResult } from '../../services/razorpayService';
import { storageService } from '../../services/storageService';

export interface RestorePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: (documentId: string, templateId?: string) => void;
}

export const RestorePurchaseModal: React.FC<RestorePurchaseModalProps> = ({
  isOpen,
  onClose,
  onRestoreSuccess,
}) => {
  const [orderId, setOrderId] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [restoreResult, setRestoreResult] = useState<RestorePurchaseResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRestoreResult(null);

    const cleanOrderId = orderId.trim();
    const cleanMobile = mobile.trim();
    const cleanCode = recoveryCode.trim().toUpperCase();

    if (!cleanOrderId || !cleanMobile) {
      setErrorMessage('Please enter both your Order ID and registered mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await razorpayService.restorePurchase({
        orderId: cleanOrderId,
        mobile: cleanMobile,
        recoveryCode: cleanCode || undefined,
      });

      setRestoreResult(res);

      // On instant unlock success (Option A)
      if (res.success && res.restored && res.documentId) {
        // Fetch authoritative document data from server to populate local storage
        try {
          const docData = await razorpayService.fetchDocumentData(res.documentId);
          if (docData?.document?.documentData) {
            storageService.saveDocument({
              id: res.documentId,
              title: res.title || docData.document.title || 'Restored Document',
              type: docData.document.type || 'resume',
              templateId: res.templateId || docData.document.templateId || 'resume-ats-basic',
              ...docData.document.documentData,
            });
          }
        } catch (fetchErr) {
          console.warn('[Restore Modal] Could not sync full documentData, document record ready:', fetchErr);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Could not restore purchase. Please verify your Order ID, mobile number and recovery code, or contact support at support@genovaprofile.com.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRestoredDocument = () => {
    if (restoreResult?.documentId) {
      onRestoreSuccess(restoreResult.documentId, restoreResult.templateId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
            <RotateCcw className="w-3 h-3 text-indigo-300" />
            Cross-Device Recovery
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Restore Purchase</h2>
          <p className="text-xs text-slate-300 mt-1">
            Access your previously purchased document on a new phone, computer, or after clearing browser history.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* SUCCESS UNLOCKED VIEW (Option A) */}
          {restoreResult?.success && restoreResult.restored && restoreResult.documentId ? (
            <div className="text-center space-y-4 py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Purchase Restored!</h3>
                <p className="text-xs text-slate-600">
                  Your document <strong>{restoreResult.title}</strong> has been transferred to this device and fully unlocked.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Design Template:</span>
                  <span className="font-semibold text-slate-800">{restoreResult.templateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700">Authoritative Paid (₹{restoreResult.amount})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenRestoredDocument}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0055D6] hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 cursor-pointer"
              >
                <span>Open Document Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : restoreResult?.success && restoreResult.option === 'B' ? (
            /* OPTION B: Fallback without code (Safe notice) */
            <div className="text-center space-y-4 py-2 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Purchase Found</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {restoreResult.message}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* RESTORE INPUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Order ID */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Receipt / Order ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="order_17... or GP-XXXX-XXXX"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full text-xs font-mono font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-indigo-100 focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Registered Mobile Number *
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
                  <span className="px-3 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 focus:outline-hidden text-slate-900"
                    maxLength={14}
                  />
                </div>
              </div>

              {/* Recovery Code */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Secret Recovery Code
                  </label>
                  <span className="text-[10px] text-slate-400">10-character code</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 7XKM94WBD2"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold tracking-widest px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-indigo-100 focus:outline-hidden text-indigo-900 uppercase"
                  maxLength={12}
                />
                <p className="text-[10px] text-slate-400">
                  Enter the recovery code shown on your purchase screen to unlock immediately. If lost, leave blank to verify via email or support.
                </p>
              </div>

              {/* Security Limit Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Protected by rate limiting (5 attempts/hour). Orders with excessive failed attempts are locked for 24 hours for security.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !orderId.trim() || !mobile.trim()}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0055D6] hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with server...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore My Purchase</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
