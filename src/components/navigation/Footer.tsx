import React from 'react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { ShieldCheck, Heart, FileText, Mail, Phone, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Merchant Address (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="text-left cursor-pointer group focus:outline-none block"
            >
              <GenovaDocLogo size="md" theme="dark" showTagline />
            </a>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {BUSINESS.name} is an all-in-one profile and document studio. Design standout matrimonial biodatas, ATS-optimized resumes, and executive cover letters, then download instantly.
            </p>
            {/* Merchant Details Block */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
              <div className="text-slate-300 font-semibold">{BUSINESS.name}</div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
                  {BUSINESS.email}
                </a>
              </div>
              <div className="text-slate-400">
                Support Hours: {BUSINESS.hours}
              </div>
              {BUSINESS.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{BUSINESS.phone}</span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Payments secured by Cashfree</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/resume-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('resume-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="/cover-letter-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('cover-letter-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Cover Letter Generator
                </a>
              </li>
              <li>
                <a
                  href="/biodata-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('biodata-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Matrimonial Profile Builder
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('dashboard');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  My Documents
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Help & Restore */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Support & Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/restore"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('restore');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-semibold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restore Purchase
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Legal & Policies</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('privacy-policy');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('terms');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('refund-policy');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('shipping-policy');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Shipping & Digital Delivery
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved. &bull; Payments secured by Cashfree
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('privacy-policy');
              }}
              className="hover:text-slate-400 cursor-pointer"
            >
              Privacy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('terms');
              }}
              className="hover:text-slate-400 cursor-pointer"
            >
              Terms
            </a>
            <a
              href="/refund-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('refund-policy');
              }}
              className="hover:text-slate-400 cursor-pointer"
            >
              Refund Policy
            </a>
            <a
              href="/shipping-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('shipping-policy');
              }}
              className="hover:text-slate-400 cursor-pointer"
            >
              Shipping & Delivery
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="hover:text-slate-400 cursor-pointer"
            >
              Contact Us
            </a>
            <a
              href="/restore"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('restore');
              }}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
            >
              Restore
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
