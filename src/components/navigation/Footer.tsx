import React from 'react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { ShieldCheck, Heart, FileText, Mail, Phone, MapPin, RefreshCw, Info } from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-shell bg-navy text-slate-300 text-xs border-t border-white/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info & Merchant Address (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl block w-fit"
            >
              <GenovaDocLogo size="md" theme="dark" showTagline />
            </a>
            <p className="text-slate-300/90 text-xs leading-relaxed max-w-sm">
              Genova Profile (genovaprofile.com) is an online document builder for creating ATS-friendly resumes, matrimonial biodatas, and cover letters.
            </p>
            {/* Merchant Details Block */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-[12px] text-slate-300/90">
              <div className="text-white font-bold site-heading tracking-tight">GenovaProfile</div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
                  {BUSINESS.email}
                </a>
              </div>
              {BUSINESS.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                  <a href={BUSINESS.phoneHref} className="hover:text-white transition-colors">
                    {BUSINESS.phone}
                  </a>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{BUSINESS.location}</span>
              </div>
              <div className="text-slate-400">
                Support Hours: {BUSINESS.hours}
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-medium text-[12px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Payments secured by Razorpay</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-tight">Product</h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a
                  href="/resume-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('resume-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-resume shrink-0" />
                  <span>Resume Builder</span>
                </a>
              </li>
              <li>
                <a
                  href="/cover-letter-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('cover-letter-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-cover-letter shrink-0" />
                  <span>Cover Letter Generator</span>
                </a>
              </li>
              <li>
                <a
                  href="/biodata-templates"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('biodata-templates');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 text-matrimonial shrink-0" />
                  <span>Matrimonial Profile Builder</span>
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
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-tight">Support &amp; Tools</h4>
            <ul className="space-y-2.5 text-slate-300">
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
                  className="text-accent hover:text-white transition-colors cursor-pointer font-semibold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Purchase</span>
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
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-tight">Legal &amp; Policies</h4>
            <ul className="space-y-2.5 text-slate-300">
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
                  Terms &amp; Conditions
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
                  Refund &amp; Cancellation Policy
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
                  Shipping &amp; Digital Delivery
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Software-Only Compliance Disclaimer */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 flex items-start gap-3 text-[12px] text-slate-300 leading-relaxed">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p>
            <strong className="text-white font-semibold">Disclaimer:</strong> Genova Profile is strictly a self-service{' '}
            <span className="text-white font-medium">PDF Document &amp; Bio-Profile Formatting Software Tool (SaaS)</span>. We are{' '}
            <span className="text-white font-medium">NOT a matchmaking, dating, marriage bureau, or matrimonial agency</span>, and we do not host public profile directories, connect users, or provide partner-finding services.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} GenovaProfile. All rights reserved. &bull; Payments secured by Razorpay
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('about');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About Us
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('privacy-policy');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('terms');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </a>
            <a
              href="/refund-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('refund-policy');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </a>
            <a
              href="/shipping-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('shipping-policy');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping &amp; Delivery
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Us
            </a>
            <a
              href="/restore"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('restore');
              }}
              className="text-accent hover:text-white transition-colors cursor-pointer font-medium"
            >
              Restore
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
