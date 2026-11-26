import React from 'react';
import { BUSINESS } from '../../config/business';

interface TermsPageProps {
  onNavigate?: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 13, 2026 &bull; Effective Date: October 13, 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900">1. Who We Are &amp; Acceptance of Terms</h2>
          <p>
            Welcome to <strong>Genova Profile, operated by Kalpesh Dhola (Surat, Gujarat, India)</strong> (
            <a href="https://genovaprofile.com" className="text-indigo-600 underline">genovaprofile.com</a>, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p>
            By accessing or using {BUSINESS.name} to browse, create, edit, preview, or download documents including resumes, curriculum vitae (CVs), marriage biodatas, and executive cover letters, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">2. Service Description & Guest Sessions</h2>
          <p>
            {BUSINESS.name} provides web-based profile layout software allowing individuals to input biographical, career, and personal details into standardized structured templates.
          </p>
          <p>
            <strong>No Mandatory Account Registration:</strong> We use lightweight guest sessions identified by cryptographically generated session tokens stored in your browser&apos;s local storage. You do not need to create a permanent password-protected account or submit your email address to use free features or design drafts.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">3. Acceptable Use & Third-Party Personal Information</h2>
          <p>
            You agree to use {BUSINESS.name} only for lawful purposes in accordance with applicable laws. You agree that:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>You will provide accurate, truthful information in resume and profile fields.</li>
            <li>You will not upload defamatory, obscene, infringing, or deceptive materials.</li>
            <li>
              <strong>Personal Data of Family Members or Others:</strong> When preparing matrimonial profiles, marriage biodatas, or family invitations containing personal details of other living individuals (such as prospective brides/grooms, parents, siblings, or referees), you represent and warrant that you have obtained their explicit, informed consent prior to entering their personal data into our software.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">4. Pricing &amp; Payments via Razorpay</h2>
          <p>
            {BUSINESS.name} operates on clear per-template pricing:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>Creation and live watermarked preview are free without creating an account. Free starter templates are ₹0 and do not require mobile numbers or payment information.</li>
            <li>Premium and royal templates are priced individually (₹40 – ₹100 one-time per template) as shown in the template catalog and checkout screen, unlocking watermark-free 300 DPI A4 PDF &amp; PNG export plus 30-day cloud recovery.</li>
            <li>All prices are quoted in <strong>Indian Rupees (INR)</strong> and are the final amount payable.</li>
            <li>There are <strong>zero recurring subscriptions</strong>, renewal fees, or hidden handling costs.</li>
          </ul>
          <p className="pt-1">
            All online transactions are securely processed by our PCI-DSS compliant payment gateway partner, <strong>Razorpay Software Private Limited</strong> (&quot;Razorpay&quot;), supporting UPI, Indian debit/credit cards, and net banking. We maintain zero storage of card numbers, CVVs, UPI PINs, or net-banking credentials on our servers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">5. Digital Delivery &amp; Refund Policy</h2>
          <p>
            All purchased documents are delivered instantaneously upon payment confirmation via direct browser download in high-resolution 300 DPI A4 PDF and PNG formats. No physical goods are shipped.
          </p>
          <p>
            Because digital PDF delivery is instantaneous, cancellations once unlocked are not possible. We provide a <strong>100% refund within 5–7 business days</strong> for verified duplicate payments, failed technical delivery unresolved within 24 hours, or overcharges. For full details, review our{' '}
            <button type="button" onClick={() => handleNavigate('refund-policy')} className="text-indigo-600 underline font-semibold cursor-pointer">
              Refund &amp; Cancellation Policy
            </button>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">6. Intellectual Property & Template Usage Rights</h2>
          <p>
            All template visual layouts, vector borders, typography pairings, CSS stylesheets, graphic motifs, and source code are the proprietary intellectual property of <strong>{BUSINESS.name}</strong>.
          </p>
          <p>
            <strong>Customer Usage License:</strong> Upon creating and downloading a document, you are granted a perpetual, non-exclusive, worldwide license to use, print, email, publish, and distribute that finalized document for your own personal, matrimonial, or career purposes. You may <em>not</em> extract our template files or layouts to resell, re-license, distribute as stock templates, or operate a competing document generation service.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">7. Automated Suggestions Disclaimer</h2>
          <p>
            {BUSINESS.name} includes optional automated text-polishing features. These automated suggestions are assistive tools intended to refine phrasing and readability based solely on the input facts you provide.
          </p>
          <p>
            Automated suggestions may occasionally be inaccurate or unsuited to your specific context. You are solely responsible for reviewing, verifying, and approving all statements before finalizing, publishing, or sharing your documents. {BUSINESS.name} does not guarantee employment offers, job interview selections, or matrimonial proposals.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">8. Service Availability & Modifications</h2>
          <p>
            We strive to provide continuous service availability but do not warrant that access will be 100% uninterrupted or error-free. We reserve the right to modify template designs, refine pricing, or temporarily suspend parts of the service for scheduled maintenance without prior liability.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">9. Reasonable Limitation of Liability</h2>
          <p>
            To the maximum extent permitted under applicable law, {BUSINESS.name}, its operators, officers, and contractors shall not be liable for any indirect, special, incidental, or consequential damages resulting from your use or inability to use the platform.
          </p>
          <p>
            Our total aggregate financial liability for any direct claim arising under any transaction shall strictly be limited to the actual amount paid by you for the specific template in dispute.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">10. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms &amp; Conditions shall be governed by, construed, and enforced in accordance with the laws of <strong>India</strong>. Any dispute, claim, suit, or legal proceeding arising out of or relating to these Terms or transactions on {BUSINESS.name} shall be subject to the exclusive jurisdiction of the courts in <strong>Surat, Gujarat, India</strong>.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2 pt-3 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">11. Contact &amp; Customer Support</h2>
          <p>
            If you have questions, notices, or formal inquiries concerning these Terms or transactions on our platform, please reach out through our official channels:
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 max-w-lg">
            <strong className="text-slate-900 block font-semibold">{BUSINESS.legalOperator}</strong>
            <p>
              <strong>Support Email:</strong>{' '}
              <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">
                {BUSINESS.email}
              </a>
            </p>
            {BUSINESS.phone ? (
              <p>
                <strong>Support Phone / WhatsApp:</strong>{' '}
                <a href={BUSINESS.phoneHref} className="text-indigo-600 underline font-medium">
                  {BUSINESS.phone}
                </a>
              </p>
            ) : null}
            <p><strong>Location:</strong> {BUSINESS.location}</p>
            <p className="text-[11px] text-slate-500">{BUSINESS.phoneHoursNote}</p>
            <p className="text-[11px] text-slate-500">
              Expected reply time: {BUSINESS.replyTime}. For complaints write to {BUSINESS.email}; we reply within 7 days.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
