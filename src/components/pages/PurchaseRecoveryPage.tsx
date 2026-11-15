import React, { useState } from 'react';
import { cashfreeService, RestorePurchaseResult } from '../../services/cashfreeService';
import { storageService } from '../../services/storageService';
import { BUSINESS } from '../../config/business';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Loader2,
  Phone,
  Key,
  Hash,
} from 'lucide-react';

interface PurchaseRecoveryPageProps {
  onNavigate: (route: string) => void;
  onOpenDocument: (documentId: string) => void;
}

export const PurchaseRecoveryPage: React.FC<PurchaseRecoveryPageProps> = ({
  onNavigate,
  onOpenDocument,
}) => {
  const [orderId, setOrderId] = useState('');
  const [mobile, setMobile] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<RestorePurchaseResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);

    const cleanOrderId = orderId.trim();
    const cleanMobile = mobile.trim();
    const cleanCode = recoveryCode.trim().toUpperCase();

    if (!cleanOrderId && !cleanCode) {
      setErrorMsg('Please enter either your Order ID or your 10-character Recovery Code.');
      return;
    }
    if (!cleanMobile) {
      setErrorMsg('Please enter the mobile number used during payment.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await cashfreeService.restorePurchase({
        orderId: cleanOrderId || undefined,
        mobile: cleanMobile,
        recoveryCode: cleanCode || undefined,
      });

      setResult(res);

      if (res.success && res.restored && res.documentId) {
        if (res.documentData) {
          storageService.saveDocument(res.documentData);
        }
      } else if (!res.success) {
        setErrorMsg(res.error || 'No matching active purchase found with these details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to recovery server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Restore Your Purchased Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Re-download your paid resume or matrimonial biodata using your Order ID or 10-character recovery code.
          Active for 30 days from purchase date.
        </p>
      </div>

      {/* Main Recovery Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {result && result.success && result.restored ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Purchase Successfully Verified & Restored!</p>
                <p className="text-emerald-700 mt-0.5">
                  Your template unlock and document data have been restored to this browser session.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">{result.orderId}</span>
              </div>
              {result.templateId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Template ID:</span>
                  <span className="font-semibold text-slate-800">{result.templateId}</span>
                </div>
              )}
              {result.daysRemaining !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Retention Access Remaining:</span>
                  <span className="font-bold text-indigo-600">{result.daysRemaining} days</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {result.documentId && (
                <button
                  type="button"
                  onClick={() => onOpenDocument(result.documentId!)}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open in Document Editor</span>
                </button>
              )}

              {result.receiptUrl && (
                <a
                  href={result.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cashfree Order ID</span>
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. order_genova_1729000000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Found on your SMS or payment confirmation receipt
              </span>
            </div>

            <div className="relative py-2 text-center">
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                OR
              </span>
              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-200" />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>10-Character Recovery Code</span>
              </label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB3X9KM4P7"
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase tracking-wider text-sm font-bold text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                The code shown on your screen right after checkout
              </span>
            </div>

            <div className="pt-2">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Registered Mobile Number *</span>
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Required for security verification against payment logs
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Purchase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Restore Document</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Support Callout */}
      <div className="text-center text-xs text-slate-500 space-y-1">
        <p>Need assistance restoring your document?</p>
        <p>
          Email our dedicated support at{' '}
          <a href={`mailto:${BUSINESS.supportEmail}`} className="font-semibold text-indigo-600 underline">
            {BUSINESS.supportEmail}
          </a>{' '}
          with your transaction screenshot.
        </p>
      </div>
    </div>
  );
};
