import React from 'react';
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface RefundPolicyPageProps {
  onNavigate?: (page: string) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans text-slate-800">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Assurance</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 13, 2026 &bull; Effective Date: October 13, 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900">1. Instant Digital Product Delivery</h2>
          <p>
            {BUSINESS.name} provides digital profile creation software. All templates, resumes, matrimonial biodatas, cover letters, and invitations are delivered digitally via immediate web browser download in high-resolution PDF and PNG formats.
          </p>
          <p>
            Because delivery of digital files is instantaneous upon payment confirmation, cancellations after digital delivery has commenced are not possible.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">2. Eligible Refund Conditions</h2>
          <p>
            We take pride in our service. We offer full refunds exclusively under the following specific circumstances:
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">1. Payment Deducted, Document Not Unlocked:</strong>
                <span>Money was deducted from your bank or UPI account, but due to a technical error, your document could not be unlocked or delivered.</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">2. Duplicate Payment:</strong>
                <span>You were charged multiple times for the same document and template design due to a network glitch.</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">3. Technical Fault on Our Side:</strong>
                <span>A reproducible server-side technical defect prevented the document from rendering or generating properly that our support team was unable to resolve.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">3. Ineligible Circumstances</h2>
          <p>
            Refunds will not be issued in the following situations:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>Change of mind after a document has been successfully unlocked and downloaded.</li>
            <li>Typographical or factual errors entered by the user (the editor allows you to edit and re-download your document freely within the retention window).</li>
            <li>Failure to secure employment offers, interview calls, or matrimonial alliances.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">4. How to Request a Refund</h2>
          <p>
            To request a refund under one of the eligible conditions above, contact our support team within <strong>7 calendar days</strong> of payment:
          </p>
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5 text-slate-700">
            <p><strong>Step 1:</strong> Go to our <button type="button" onClick={() => handleNavigate('contact')} className="text-indigo-600 font-bold underline cursor-pointer">Contact Support Page</button> or email <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 font-bold underline">{BUSINESS.email}</a>.</p>
            <p><strong>Step 2:</strong> Select &quot;Refund request&quot; as the subject line.</p>
            <p><strong>Step 3:</strong> Provide your <strong>Receipt ID or Order ID</strong> (e.g. GP-XXXX-XXXX-XXXX).</p>
            <p><strong>Step 4:</strong> Briefly state the reason for your request (such as double deduction or download issue).</p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">5. Review & Processing Timeline</h2>
          <p>
            Our customer support and finance team reviews refund requests within <strong>3 working days</strong>.
          </p>
          <p>
            Once approved, the refund is initiated directly to the original payment source (UPI account, debit card, or credit card) via our payment gateway partner, Cashfree.
          </p>
          <p>
            Depending on your issuing bank&apos;s settlement schedule, the refunded amount typically reflects in your statement within <strong>5 to 7 working days</strong>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">6. Failed or Dropped Transactions</h2>
          <p>
            If money was debited from your bank account but you received a failure screen or did not receive an order confirmation, the transaction was not captured by Cashfree.
          </p>
          <p>
            In such banking gateway timeout scenarios, the money is held in an interim settlement account and is normally reversed to your original bank account automatically by your bank according to RBI guidelines. If the deduction does not reverse within 5 business days, please write to us with your bank transaction UTR reference so we can verify the status with Cashfree.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">7. Contact Information</h2>
          <div className="space-y-1 text-slate-600 pt-1">
            <p><strong>Business Name:</strong> {BUSINESS.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">{BUSINESS.email}</a></p>
            <p><strong>Support Hours:</strong> {BUSINESS.hours}</p>
            <p className="text-[11px] text-slate-500">Expected reply time: {BUSINESS.replyTime}</p>
            {BUSINESS.phone ? <p><strong>Customer Helpline:</strong> {BUSINESS.phone}</p> : null}
          </div>
        </section>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => handleNavigate('contact')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
        >
          <span>Contact Our Support Desk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
