import React from 'react';
import { Download, ShieldCheck, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { BUSINESS } from '../../config/business';
import { PAID_DOCUMENT_RETENTION_DAYS } from '../../config/constants';

interface ShippingPolicyPageProps {
  onNavigate?: (page: string) => void;
}

export const ShippingPolicyPage: React.FC<ShippingPolicyPageProps> = ({ onNavigate }) => {
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
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Fulfillment</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Shipping & Digital Delivery Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 13, 2026 &bull; Effective Date: October 13, 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900">1. Nature of Products Sold</h2>
          <p>
            {BUSINESS.name} operates exclusively as an online digital document creation and profile design studio. All templates and generated items (including resumes, marriage biodatas, executive cover letters, and event invitations) are <strong>100% digital goods</strong>.
          </p>
          <p>
            <strong>No physical goods or printed paper materials are shipped or delivered by postal courier or freight.</strong>
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">2. Instant Delivery Mechanism & Access</h2>
          <p>
            Upon successful payment authorization via our payment gateway (Cashfree), digital fulfillment occurs instantaneously:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Instant High-Resolution PDF</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Standard print-ready vector A4 PDF rendered directly in your browser without watermarks.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>High-Resolution PNG Image</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Optimized 300 DPI image export perfect for sharing on mobile messaging apps and WhatsApp.
              </p>
            </div>
          </div>
          <p className="pt-2">
            No waiting time or shipping delays apply. Your browser immediately unlocks the download button upon payment verification.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">3. How to Access Your Purchased Document Again</h2>
          <p>
            If you close your browser tab, switch computers, or clear your cache, you can retrieve and re-download your purchased document at any time:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-700">
            <li>Open the {BUSINESS.name} website (<a href="https://genovaprofile.com" className="text-indigo-600 underline">genovaprofile.com</a>).</li>
            <li>Click <strong>&quot;Restore Purchase&quot;</strong> in the navigation bar or footer.</li>
            <li>Enter your <strong>Receipt ID</strong> (e.g. GP-XXXX-XXXX-XXXX) and your secret <strong>Recovery Code</strong>.</li>
            <li>Your document opens immediately in the builder with all your data intact, ready for unlimited re-downloads.</li>
          </ol>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">4. Server Storage & Retention Window</h2>
          <p>
            To uphold rigorous privacy protections under India&apos;s Digital Personal Data Protection (DPDP) Act 2023, paid documents are securely retained on our servers for:
          </p>
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-amber-950">
                {PAID_DOCUMENT_RETENTION_DAYS} Days Storage Guarantee
              </strong>
              <p className="text-xs text-amber-800 mt-0.5">
                Paid documents are stored securely for <strong>{PAID_DOCUMENT_RETENTION_DAYS} days</strong> following purchase. After {PAID_DOCUMENT_RETENTION_DAYS} days, personal document text is permanently purged to minimize storage exposure, while your payment receipt record remains on file for tax and accounting audits.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            We encourage all users to download and store their PDF and PNG files locally on their device immediately after checkout.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">5. Shipping Charges</h2>
          <p>
            Because all products are delivered electronically over the Internet, <strong>shipping charges are ₹0 (Free)</strong>. There are no shipping, handling, or packaging fees associated with any transaction.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">6. Questions Regarding Digital Delivery</h2>
          <p>
            If you experience any difficulties downloading your purchased document, please write to our support team immediately:
          </p>
          <div className="space-y-1 text-slate-600 pt-1">
            <p><strong>Business Name:</strong> {BUSINESS.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">{BUSINESS.email}</a></p>
            <p><strong>Support Hours:</strong> {BUSINESS.hours}</p>
            <p className="text-[11px] text-slate-500">Expected reply time: {BUSINESS.replyTime}</p>
            {BUSINESS.phone ? <p><strong>Phone:</strong> {BUSINESS.phone}</p> : null}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => handleNavigate('restore')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restore Past Purchase</span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('contact')}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Contact Support</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
