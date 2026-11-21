import React from 'react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { FileText, ShieldCheck, Download, ArrowRight, Mail } from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <GenovaDocLogo size="lg" showTagline />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">About Us</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          {BUSINESS.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {BUSINESS.name} is a web-based document creation platform helping individuals design and download polished marriage biodatas, professional resumes, and cover letters.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-base font-extrabold text-slate-900">What We Do</h2>
        <p>
          We provide clean, structured templates for essential personal and career documents. You select a template, fill in your details through our straightforward editor, preview the design, and download the finished document instantly as a high-resolution PDF or PNG.
        </p>
        <p>
          Our catalog includes:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Marriage Biodatas:</strong> Traditional, contemporary, and royal designs formatted for Indian matrimonial sharing.</li>
          <li><strong>Resumes:</strong> Clean, single-column and multi-column formats focused on readability and structure.</li>
          <li><strong>Cover Letters:</strong> Coordinated executive layouts matching our resume styles.</li>
        </ul>

        <h2 className="text-base font-extrabold text-slate-900 pt-4 border-t border-slate-100">
          Pricing & Digital Delivery
        </h2>
        <p>
          We offer both free starter templates (₹0) and paid premium designs (₹40 – ₹100 one-time per template). Creation and live watermarked preview are free without creating an account. Free templates can be downloaded immediately at no cost. Paid designs require a single, one-time payment in Indian Rupees (INR) processed securely via PCI-DSS compliant Cashfree Payments to unlock watermark-free 300 DPI A4 PDF &amp; PNG exports plus 30-day cloud recovery. We do not operate subscriptions or recurring plans.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0066FF]" /> Document Templates
            </h3>
            <p className="text-[11px] text-slate-500">
              Thoughtfully formatted layouts for biodatas, resumes, and cover letters.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" /> Instant Download
            </h3>
            <p className="text-[11px] text-slate-500">
              Download your document directly to your device as a crisp 300 DPI A4 PDF or high-resolution PNG image.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" /> Secure Checkout
            </h3>
            <p className="text-[11px] text-slate-500">
              All transactions are handled securely by PCI-DSS compliant payment gateway partner Cashfree Payments.
            </p>
          </div>
        </div>

        <h2 className="text-base font-extrabold text-slate-900 pt-4 border-t border-slate-100">
          Business &amp; Customer Support
        </h2>
        <p>
          {BUSINESS.legalOperator}. Have questions or need assistance with an order? Our support desk is available to assist you:
        </p>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
          <p><strong>Brand Name:</strong> {BUSINESS.name}</p>
          <p><strong>Support Email:</strong> <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">{BUSINESS.email}</a></p>
          {BUSINESS.phone ? (
            <p>
              <strong>Support Phone / WhatsApp:</strong>{' '}
              <a href={BUSINESS.phoneHref} className="text-indigo-600 underline font-medium">{BUSINESS.phone}</a>
            </p>
          ) : null}
          <p><strong>Location:</strong> {BUSINESS.location}</p>
          <p className="text-[11px] text-slate-500">{BUSINESS.phoneHoursNote}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Support</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('templates')}
          className="px-6 py-3 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-[#0055D6] transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Browse Templates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
