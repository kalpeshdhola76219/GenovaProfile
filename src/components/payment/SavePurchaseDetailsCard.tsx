/**
 * SavePurchaseDetailsCard Component (Task 4A)
 * Displayed after a verified PAID state in both CashfreeCheckoutFlow and PaymentResultPage.
 * Shows Receipt ID, Template name, Amount, Date, and Recovery Code (once only).
 * Includes Copy button, "Download receipt" button, and mandatory checkbox before closing.
 */
import React, { useState } from 'react';
import {
  ShieldCheck,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Lock,
  Clock,
  X,
  ExternalLink,
} from 'lucide-react';
import { downloadReceiptPDF, GenerateReceiptData } from '../../utils/receiptGenerator';

export interface SavePurchaseDetailsCardProps {
  receiptId: string;
  orderId?: string;
  templateName: string;
  amount: number;
  paidAt?: string;
  recoveryCode?: string;
  mobile?: string;
  onDismiss?: () => void;
  inline?: boolean;
}

export const SavePurchaseDetailsCard: React.FC<SavePurchaseDetailsCardProps> = ({
  receiptId,
  orderId,
  templateName,
  amount,
  paidAt,
  recoveryCode,
  mobile,
  onDismiss,
  inline = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const displayId = receiptId || orderId || 'GP-ORDER';
  const restoreUrl = `${window.location.origin}/#restore`;

  const handleCopyCode = async () => {
    if (!recoveryCode) return;
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleDownloadReceipt = () => {
    downloadReceiptPDF({
      receiptId: displayId,
      orderId,
      recoveryCode,
      amount,
      templateName,
      paidAt,
      mobile,
      restoreUrl,
    });
  };

  const handleAttemptClose = () => {
    if (acknowledged) {
      onDismiss?.();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleForceClose = () => {
    setShowConfirmModal(false);
    onDismiss?.();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-indigo-500/30 text-left space-y-5 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Save Your Purchase Details</span>
            </h3>
            <p className="text-xs text-indigo-200/80">
              Your recovery key is required to restore access on other devices.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={handleAttemptClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss card"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Details Box */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Receipt / Order ID:</span>
          <span className="font-mono font-bold text-white tracking-wider text-xs">
            {displayId}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Design Template:</span>
          <span className="font-medium text-white">{templateName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Amount Paid:</span>
          <span className="font-bold text-emerald-400">₹{amount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Retention Storage:</span>
          <span className="font-medium text-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Stored securely for 30 days
          </span>
        </div>
      </div>

      {/* Recovery Code Box (Shown Once) */}
      <div className="bg-indigo-950/80 border-2 border-indigo-500/50 rounded-2xl p-4.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            Secret Recovery Code
          </span>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-400/30 font-semibold">
            Shown Once Only
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 bg-black/40 rounded-xl px-4 py-3 border border-indigo-500/30">
          <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-emerald-400 select-all">
            {recoveryCode || 'CODE SAVED'}
          </span>
          {recoveryCode && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
          Save this code now. You will need it to restore your paid template on another device or if you clear your browser. It will not be shown again.
        </p>
      </div>

      {/* Download Receipt Button */}
      <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={handleDownloadReceipt}
          className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 active:bg-white/15 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Receipt (PDF)</span>
        </button>
      </div>

      {/* Mandatory Checkbox */}
      <div className="pt-2 border-t border-white/10">
        <label className="flex items-start gap-3 cursor-pointer select-none text-left">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
          />
          <span className="text-xs text-slate-300 leading-snug">
            I have saved my recovery code and receipt. I understand it cannot be recovered once this screen is closed.
          </span>
        </label>
      </div>

      {/* Confirm Close Warning Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-sm w-full p-5 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Have you saved your recovery code?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you close this window without saving your code, you will need to contact customer support to restore access on other devices.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Go back & save code
              </button>
              <button
                type="button"
                onClick={handleForceClose}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
              >
                Close anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
