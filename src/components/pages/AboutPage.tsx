import React from 'react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { FileText, ShieldCheck, Download, ArrowRight, Mail, Info } from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <GenovaDocLogo size="lg" showTagline />
        </div>
        <p className="text-xs font-semibold text-brand">About Us</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy text-balance">
          {BUSINESS.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Genova Profile (genovaprofile.com) is an online document builder for creating ATS-friendly resumes, matrimonial biodatas, and cover letters.
        </p>
      </div>

      <div className="site-card p-6 sm:p-9 rounded-3xl space-y-6 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-navy">What We Do</h2>
        <p>
          We provide clean, structured templates for essential personal and career documents. You select a template, fill in your details through our straightforward editor, preview the design, and download the finished document instantly as a high-resolution PDF or PNG.
        </p>
        <p>
          Our catalog includes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong className="text-navy">Marriage Biodatas:</strong> Traditional, contemporary, and royal designs formatted for Indian matrimonial sharing.</li>
          <li><strong className="text-navy">Resumes:</strong> Clean, single-column and multi-column formats focused on readability and structure.</li>
          <li><strong className="text-navy">Cover Letters:</strong> Coordinated executive layouts matching our resume styles.</li>
        </ul>

        <div className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate-200/90 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-brand" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-navy">
              Software-Only Tool Disclaimer &mdash; Not a Matchmaking or Matrimonial Agency
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-navy">Genova Profile</strong> is strictly a self-service{' '}
              <strong className="text-navy">PDF Document &amp; Bio-Profile Formatting Software Tool (SaaS)</strong>. We are{' '}
              <strong className="text-navy">NOT a matchmaking, dating, marriage bureau, or matrimonial agency</strong>, and we do not operate any partner-search platform, public profile directory, user messaging network, or matrimonial brokerage service. Our software solely enables users to format their own personal and career information into downloadable PDF and PNG documents.
            </p>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-navy pt-4 border-t border-slate-100">
          Pricing &amp; Digital Delivery
        </h2>
        <p>
          We offer both free starter templates (₹0) and paid premium designs (₹40 – ₹100 one-time per template). Creation and live watermarked preview are free without creating an account. Free templates can be downloaded immediately at no cost. Paid designs require a single, one-time payment in Indian Rupees (INR) processed securely via PCI-DSS compliant Razorpay to unlock watermark-free 300 DPI A4 PDF &amp; PNG exports plus 30-day cloud recovery. We do not operate subscriptions or recurring plans.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-navy flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4 text-brand shrink-0" /> Document Templates
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thoughtfully formatted layouts for biodatas, resumes, and cover letters.
            </p>
          </div>
          <div className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-navy flex items-center gap-2 text-xs sm:text-sm">
              <Download className="w-4 h-4 text-cover-letter shrink-0" /> Instant Download
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download your document directly to your device as a crisp 300 DPI A4 PDF or high-resolution PNG image.
            </p>
          </div>
          <div className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-navy flex items-center gap-2 text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> Secure Checkout
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All transactions are handled securely by PCI-DSS compliant payment gateway partner Razorpay.
            </p>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-navy pt-4 border-t border-slate-100">
          Business &amp; Customer Support
        </h2>
        <p>
          {BUSINESS.legalOperator}. Have questions or need assistance with an order? Our support desk is available to assist you:
        </p>
        <div className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate-200/80 space-y-1.5 text-slate-700">
          <p><strong className="text-navy">Brand Name:</strong> {BUSINESS.name}</p>
          <p><strong className="text-navy">Support Email:</strong> <a href={`mailto:${BUSINESS.email}`} className="text-brand underline font-medium">{BUSINESS.email}</a></p>
          {BUSINESS.phone ? (
            <p>
              <strong className="text-navy">Support Phone / WhatsApp:</strong>{' '}
              <a href={BUSINESS.phoneHref} className="text-brand underline font-medium">{BUSINESS.phone}</a>
            </p>
          ) : null}
          <p><strong className="text-navy">Location:</strong> {BUSINESS.location}</p>
          <p className="text-xs text-slate-500">{BUSINESS.phoneHoursNote}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 bg-navy text-white rounded-2xl text-xs sm:text-sm font-semibold hover:bg-navy/90 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98]"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Support</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('templates')}
          className="px-6 py-3 bg-brand text-white rounded-2xl text-xs sm:text-sm font-semibold hover:bg-brand-hover transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98]"
        >
          <span>Browse Templates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
