import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Server,
  Smartphone,
} from 'lucide-react';
import { BUSINESS } from '../../config/business';
import { PAID_DOCUMENT_RETENTION_DAYS } from '../../config/constants';
import { sessionService } from '../../services/sessionService';

interface PrivacyPolicyPageProps {
  onNavigate?: (page: string) => void;
  onDataCleared?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate, onDataCleared }) => {
  const [showLocalConfirm, setShowLocalConfirm] = useState(false);
  const [showServerConfirm, setShowServerConfirm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isDeletingServer, setIsDeletingServer] = useState(false);

  const handleClearLocalOnly = () => {
    localStorage.clear();
    setShowLocalConfirm(false);
    setActionSuccess('Local browser drafts and cached session details have been wiped.');
    if (onDataCleared) onDataCleared();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleDeleteFromServer = async () => {
    setIsDeletingServer(true);
    setActionSuccess(null);
    try {
      const sessionId = sessionService.getSessionId();
      const token = sessionService.getSessionToken();
      const res = await fetch('/api/user/data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId || '',
          'X-Session-Token': token || '',
        },
      });
      if (!res.ok) {
        throw new Error('Server returned an error while processing deletion request.');
      }
      sessionService.clearSession();
      localStorage.clear();
      setShowServerConfirm(false);
      setActionSuccess('All server documents and drafts for this session have been permanently deleted.');
      if (onDataCleared) onDataCleared();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      setActionSuccess('Could not delete remote data. Your browser data has been cleared.');
      localStorage.clear();
      setShowServerConfirm(false);
      if (onDataCleared) onDataCleared();
    } finally {
      setIsDeletingServer(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans text-slate-800">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal & Transparency</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 13, 2026 &bull; Effective Date: October 13, 2026
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
        {/* Intro */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-[#5B4BDB]" />
            <span>Our Privacy Principles</span>
          </div>
          <p className="text-slate-600">
            {BUSINESS.name} respects the privacy of your resume, career, matrimonial, and family information. We believe in minimal data collection, transparent third-party processing, and zero sale or advertising monetization of your documents.
          </p>
        </div>

        {/* 1. Who We Are */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            1. Who We Are and How to Contact Us
          </h2>
          <p>
            <strong>Genova Profile, operated by Kalpesh Dhola (Surat, Gujarat, India)</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website{' '}
            <a href="https://genovaprofile.com" className="text-indigo-600 underline">genovaprofile.com</a>{' '}
            for creating professional resumes, marriage biodatas, and cover letters.
          </p>
          <p>
            For privacy queries, data requests, or complaints, reach out to our team at{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">
              {BUSINESS.email}
            </a>{' '}
            or call/WhatsApp{' '}
            <a href={BUSINESS.phoneHref} className="text-indigo-600 underline font-medium">
              {BUSINESS.phone}
            </a>{' '}
            ({BUSINESS.hours}); we reply within 7 days.
          </p>
        </section>

        {/* 2. What Data We Collect */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            2. What Data We Collect
          </h2>
          <p>
            We collect only the information required to generate your documents, process optional payments, and deliver customer support.
          </p>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Data Category</th>
                  <th className="p-3">Examples</th>
                  <th className="p-3">Why We Need It & How Handled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Mobile Number</td>
                  <td className="p-3 text-slate-600">10-digit Indian phone number entered during checkout</td>
                  <td className="p-3 text-slate-600">
                    Entered at payment and passed directly to Razorpay to generate a payment session. <strong>Not stored in our database, not logged, and not saved in our records.</strong>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Email Address (Optional)</td>
                  <td className="p-3 text-slate-600">Personal email address optionally provided during checkout</td>
                  <td className="p-3 text-slate-600">
                    Stored to send purchase receipts and provide restore assistance. Never shared with marketers.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Contact Form Data</td>
                  <td className="p-3 text-slate-600">Full name, email address, subject, message text, and ticket reference (e.g. GP-T-XXXXXX)</td>
                  <td className="p-3 text-slate-600">
                    To investigate and resolve your customer support inquiries, payment tickets, and technical questions. Kept for 12 months for compliance and quality records.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Document Content</td>
                  <td className="p-3 text-slate-600">Name, date of birth, education, job history, matrimonial details, Kundali, profile photo</td>
                  <td className="p-3 text-slate-600">
                    To render your chosen template and generate high-resolution PDF and PNG exports. Retained securely for {PAID_DOCUMENT_RETENTION_DAYS} days for paid purchases.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Technical Session Data</td>
                  <td className="p-3 text-slate-600">Anonymous guest session ID and secret token</td>
                  <td className="p-3 text-slate-600">Allows you to edit and re-download your documents without needing an email login or password.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Payment Metadata</td>
                  <td className="p-3 text-slate-600">Razorpay order ID, paid amount, currency, timestamp, payment status</td>
                  <td className="p-3 text-slate-600">
                    To unlock paid templates and maintain statutory financial records under Indian law. All payments are processed through <strong>PCI-DSS compliant Razorpay</strong>. We maintain <strong>zero storage of credit/debit card numbers, CVVs, UPI PINs, or net-banking credentials</strong> on our servers.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Where Data is Stored */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" />
            3. Where Your Data is Stored
          </h2>
          <p>
            Your data is handled across these systems:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Your Device (Browser LocalStorage):</strong> Drafts are cached in your browser so you do not lose progress while editing.
            </li>
            <li>
              <strong>Our Database (Hosted by Supabase):</strong> When you preview, save, or purchase a template, document content and order metadata are stored in our PostgreSQL database hosted by Supabase. Document content is retained for {PAID_DOCUMENT_RETENTION_DAYS} days. Customer mobile numbers are never saved in our database.
            </li>
          </ul>
        </section>

        {/* 4. Third-Party Processors */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            4. Third-Party Processors (Service Providers)
          </h2>
          <p>
            We do not sell, rent, or trade your personal or matrimonial data. We transmit data solely to essential technical processors:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Razorpay Software Pvt. Ltd. (PCI-DSS Compliant Payment Gateway)</span>
              <span className="text-slate-600 text-[11px]">
                When purchasing a paid template, payment processing is handled end-to-end by PCI-DSS compliant Razorpay. Your order amount and transient mobile number are passed to Razorpay to create a secure payment session for UPI, card, or net-banking checkout. Genova Profile never accesses or stores your card details, CVV, UPI PIN, or net-banking credentials, and Razorpay does not receive your resume or biodata contents.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Supabase Inc. (Database Hosting)</span>
              <span className="text-slate-600 text-[11px]">
                Provides cloud PostgreSQL infrastructure for storing guest session tokens, document drafts, and purchase records.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Google Fonts (Typography Delivery)</span>
              <span className="text-slate-600 text-[11px]">
                Fonts (Cinzel, Plus Jakarta Sans, Cormorant Garamond, Inter) are loaded directly from Google CDN to render templates cleanly.
              </span>
            </div>
          </div>
        </section>

        {/* 5. Legal Basis */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            5. Legal Basis for Processing
          </h2>
          <p>
            We process your personal information under two grounds:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Your Consent:</strong> Given when you enter details, check the confirmation box at checkout, or request an export.</li>
            <li><strong>Contractual Performance:</strong> To render your document, verify payment, and deliver the final digital PDF/PNG files.</li>
          </ul>
        </section>

        {/* 6. Data Retention */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            6. How Long We Keep Your Data
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Data Record</th>
                  <th className="p-3">Retention Duration</th>
                  <th className="p-3">Action After Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Unpaid Draft Documents</td>
                  <td className="p-3 text-slate-600">24 hours of inactivity</td>
                  <td className="p-3 text-slate-600">Cleared by scheduled retention cleanup</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Paid Documents (Body details)</td>
                  <td className="p-3 text-slate-600">{PAID_DOCUMENT_RETENTION_DAYS} days</td>
                  <td className="p-3 text-slate-600">Retained for {PAID_DOCUMENT_RETENTION_DAYS} days to allow re-downloads and updates across your devices</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Contact Form Messages</td>
                  <td className="p-3 text-slate-600">12 months</td>
                  <td className="p-3 text-slate-600">Kept for 12 months for customer service compliance, audit, and quality records</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Recovery Code Hash</td>
                  <td className="p-3 text-slate-600">Lifetime of the order</td>
                  <td className="p-3 text-slate-600">Cryptographically salted SHA-256 hash kept permanently to verify document ownership when restoring access</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Customer Mobile</td>
                  <td className="p-3 text-slate-600">0 days (Not stored)</td>
                  <td className="p-3 text-slate-600">Passed transiently to Razorpay at checkout; not stored in our database or logs</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Order & Payment Records</td>
                  <td className="p-3 text-slate-600">Statutory duration under Indian law</td>
                  <td className="p-3 text-slate-600">Retained for tax and audit compliance without personal document contents</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Your Rights */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            7. Your Rights Under DPDP Act 2023
          </h2>
          <p>
            You have clear rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Right to Access:</strong> View all document content and order receipts linked to your session.</li>
            <li><strong>Right to Correction:</strong> Edit and update your personal details in the editor anytime.</li>
            <li><strong>Right to Erasure (Deletion):</strong> Delete your data from your browser and permanently from our servers using the buttons below.</li>
            <li><strong>Right to Withdraw Consent:</strong> Stop using the service and delete your saved records.</li>
            <li><strong>Right of Grievance Redressal:</strong> Write to <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">{BUSINESS.email}</a>; we reply within 7 days.</li>
          </ul>
        </section>

        {/* 8. Security */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            8. Security Practices &amp; Zero Payment Credential Storage
          </h2>
          <p>
            All data in transit is encrypted using industry-standard HTTPS/TLS. Database access is restricted behind authenticated service keys. Payment transactions are processed exclusively via PCI-DSS compliant Razorpay, with zero storage of credit/debit card details, UPI PINs, or net-banking credentials on Genova Profile servers. Paid documents are retained for {PAID_DOCUMENT_RETENTION_DAYS} days for re-downloads and recovery, and you retain full delete control at any time using the tools below.
          </p>
        </section>

        {/* 9. Minors & Third-Party Information */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            9. Minors & Third-Party Information
          </h2>
          <p>
            Our paid services are intended for adults. If you create a marriage biodata or family profile containing details of family members, prospective brides, grooms, or references, you confirm that you have obtained their prior consent before submitting their information.
          </p>
        </section>

        {/* 10. Changes */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may periodically update this policy to reflect operational, legal, or regulatory adjustments. Revisions will be posted on this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        {/* 11. Complaints & Grievance Redressal */}
        <section className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">
            11. Contact &amp; Complaints Redressal
          </h2>
          <p className="text-slate-700">
            <strong>Operator:</strong> {BUSINESS.legalOperator}
          </p>
          <p className="text-slate-600">
            <strong>Location:</strong> {BUSINESS.location}
          </p>
          <p className="text-slate-600">
            <strong>Support Email:</strong>{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">
              {BUSINESS.email}
            </a>{' '}
            (24/7 email intake; we reply to privacy complaints within 7 days)
          </p>
          {BUSINESS.phone ? (
            <p className="text-slate-600">
              <strong>Support Phone / WhatsApp:</strong>{' '}
              <a href={BUSINESS.phoneHref} className="text-indigo-600 underline font-medium">
                {BUSINESS.phone}
              </a>{' '}
              ({BUSINESS.hours})
            </p>
          ) : null}
        </section>

        {/* DATA PURGE ACTIONS */}
        <div className="pt-4 border-t border-slate-200 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Manage & Delete Your Data</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Choose an action below to clear your information locally on this browser or purge it permanently from our backend servers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Clear Local Storage */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-slate-600" /> Clear Data on This Device
                </span>
                <p className="text-[11px] text-slate-600">
                  Erases locally saved drafts and preferences from this browser&apos;s storage only. Does not alter server purchase receipts.
                </p>
              </div>
              {showLocalConfirm ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Clear all local drafts from this browser?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleClearLocalOnly}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 text-xs cursor-pointer"
                    >
                      Yes, Clear Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLocalConfirm(false)}
                      className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLocalConfirm(true)}
                  className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold transition-colors text-xs inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  Clear Data on This Device
                </button>
              )}
            </div>

            {/* Action 2: Delete from Server */}
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-rose-600" /> Delete My Data from Our Servers
                </span>
                <p className="text-[11px] text-rose-800">
                  Permanently deletes all document drafts and body details stored in our database for your current session.
                </p>
              </div>
              {showServerConfirm ? (
                <div className="p-3 bg-rose-100/80 border border-rose-300 rounded-xl space-y-2">
                  <p className="text-[11px] font-bold text-rose-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    Permanently delete all server documents?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isDeletingServer}
                      onClick={handleDeleteFromServer}
                      className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isDeletingServer ? 'Deleting...' : 'Yes, Delete from Server'}
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingServer}
                      onClick={() => setShowServerConfirm(false)}
                      className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowServerConfirm(true)}
                  className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs shadow-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete My Data from Our Servers
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
