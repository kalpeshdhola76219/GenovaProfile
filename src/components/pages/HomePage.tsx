import React, { useState, useRef, useEffect } from 'react';
import { DocumentType, TemplateMetadata } from '../../types/document';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { TemplatePreview } from '../gallery/TemplatePreview';
import {
  Heart,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Printer,
  ChevronDown,
  Mail,
  Zap,
  Sliders,
  Check,
  Lock,
  Info,
} from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface HomePageProps {
  onStartDocument: (type: DocumentType) => void;
  onBrowseTemplates: (type?: DocumentType) => void;
  onTryDemo: (type: DocumentType) => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartDocument,
  onBrowseTemplates,
  onNavigate,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showDocTypeMenu, setShowDocTypeMenu] = useState(false);
  const [activeHeroCard, setActiveHeroCard] = useState<'resume' | 'matrimonial'>('resume');
  const docTypeMenuRef = useRef<HTMLDivElement>(null);

  // Close Create Profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!showDocTypeMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (docTypeMenuRef.current && !docTypeMenuRef.current.contains(event.target as Node)) {
        setShowDocTypeMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDocTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDocTypeMenu]);

  const biodataTotalCount = TEMPLATE_REGISTRY.filter((t) => t.type === 'biodata').length;
  const resumeTotalCount = TEMPLATE_REGISTRY.filter((t) => t.type === 'resume').length;
  const coverLetterTotalCount = TEMPLATE_REGISTRY.filter((t) => t.type === 'cover-letter').length;

  // 4 Featured top-selling templates
  const featuredTemplates: TemplateMetadata[] = [
    TEMPLATE_REGISTRY.find((t) => t.id === 'biodata-royal-vedic-qr') ||
      TEMPLATE_REGISTRY.find((t) => t.type === 'biodata' && t.priceINR === 100) ||
      TEMPLATE_REGISTRY.find((t) => t.type === 'biodata')!,
    TEMPLATE_REGISTRY.find((t) => t.id === 'resume-ats-professional') ||
      TEMPLATE_REGISTRY.find((t) => t.id === 'resume-ats-classic') ||
      TEMPLATE_REGISTRY.find((t) => t.type === 'resume')!,
    TEMPLATE_REGISTRY.find((t) => t.id === 'resume-executive') ||
      TEMPLATE_REGISTRY.find((t) => t.id === 'resume-modern-corporate') ||
      TEMPLATE_REGISTRY.find((t) => t.type === 'resume' && t.priceINR > 0)!,
    TEMPLATE_REGISTRY.find((t) => t.id === 'biodata-traditional-indian') ||
      TEMPLATE_REGISTRY.find((t) => t.type === 'biodata' && t.priceINR === 0) ||
      TEMPLATE_REGISTRY[0],
  ].filter(Boolean);

  const steps = [
    {
      num: '01',
      title: 'Choose Design',
      desc: 'Pick your preferred layout from 60+ ATS-certified resumes, executive cover letters, and royal Vedic matrimonial styles.',
      icon: <Sliders className="w-5 h-5 text-[#0066FF]" />,
    },
    {
      num: '02',
      title: 'Fill Details Once',
      desc: 'Enter your credentials, career history, or family heritage once. Switch templates freely with zero data loss.',
      icon: <Zap className="w-5 h-5 text-[#00C2CB]" />,
    },
    {
      num: '03',
      title: 'Instant 300 DPI Download',
      desc: 'Live preview in real time and export vector-sharp A4 PDF or print directly with pixel-perfect resolution.',
      icon: <Printer className="w-5 h-5 text-[#10B981]" />,
    },
  ];

  const faqs = [
    {
      q: 'Do I need an account to create and download documents?',
      a: 'No login or registration is required. You can choose any template, fill in your details, preview live, and download instantly without creating an account or providing your email address.',
    },
    {
      q: 'Will I lose my entered information if I change the template?',
      a: `Never! ${BUSINESS.name} is engineered with a decoupled content architecture. Your profile data is stored independently of the visual presentation. You can switch between 10+ different templates with 100% data preservation.`,
    },
    {
      q: 'Are your resumes strictly compliant with Applicant Tracking Systems (ATS)?',
      a: 'Yes. Our ATS-certified resume templates follow single-column parseable structures with standard section titles, standard Unicode typography, and no graphics or multi-column grids that confuse ATS parsers at companies using Workday, Taleo, Greenhouse, or Lever.',
    },
    {
      q: 'How does the Cashfree UPI payment work for premium templates?',
      a: 'Free templates (₹0) can be exported immediately with no payment. For premium templates (₹40 - ₹100), you pay a one-time fee via Cashfree\'s secure payment gateway using Google Pay, PhonePe, Paytm, BHIM UPI, Net Banking, or Credit/Debit Cards. No recurring subscriptions or hidden fees.',
    },
    {
      q: 'Is my matrimonial and personal family information kept private?',
      a: 'Yes. We respect your privacy and never sell, rent, or trade your personal, matrimonial, or career data to advertisers or third parties. Mobile numbers entered at checkout are passed transiently to Cashfree and are not stored in our database. Documents are retained for 30 days for downloading, and you can clear your data at any time.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section Layout (Split Desktop: 7 cols left / 5 cols right) */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-cyan-50/15 to-white z-10">
        {/* Subtle radial background glow behind headline */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] pointer-events-none overflow-hidden -z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[360px] rounded-full bg-gradient-to-tr from-blue-200/35 via-cyan-200/30 to-emerald-100/25 blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-cyan-100/40 blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols) - elevated z-index so dropdown renders above right-column previews */}
            <div className="lg:col-span-7 space-y-6 text-left relative z-20">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 text-slate-800 border border-blue-200/70 text-xs font-semibold shadow-2xs">
                <span className="text-[#0066FF] font-bold">★</span>
                <span>{BUSINESS.name} &bull; Personal & Professional Identity Studio</span>
              </div>

              {/* Main Headline H1 */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15] text-balance">
                Build Standout Resumes, Matrimonial Profiles & Cover Letters in Minutes
              </h1>

              {/* Supporting text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal text-balance max-w-2xl">
                Craft ATS-certified resumes, royal matrimonial alliance profiles, and executive cover letters. Switch styles effortlessly with zero data loss.
              </p>

              {/* Call to Action (CTA) Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 relative z-30">
                <div ref={docTypeMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDocTypeMenu(!showDocTypeMenu)}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#0066FF] via-[#007CF0] to-[#00C2CB] hover:from-[#0055D6] hover:to-[#00B4BD] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    aria-expanded={showDocTypeMenu}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>+ Create Your Profile</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDocTypeMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Document Type Picker Dropdown */}
                  {showDocTypeMenu && (
                    <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-180px)] overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDocTypeMenu(false);
                          onStartDocument('resume');
                        }}
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-800 text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Resume</div>
                          <span className="text-[10px] text-slate-400 font-normal">ATS-friendly corporate and tech resumes</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDocTypeMenu(false);
                          onStartDocument('cover-letter');
                        }}
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-800 text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Cover Letter</div>
                          <span className="text-[10px] text-slate-400 font-normal">Tailored executive and job application letters</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDocTypeMenu(false);
                          onStartDocument('biodata');
                        }}
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-800 text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Matrimonial Profile</div>
                          <span className="text-[10px] text-slate-400 font-normal">Culturally authentic matrimonial & alliance portfolios</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onBrowseTemplates()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Browse 70+ Templates</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>No Login Required</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Privacy First & Full Delete Control</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span>Instant 300 DPI PDF</span>
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Layered 3D Preview Card Stack */}
            <div className="lg:col-span-5 mt-10 lg:mt-0 relative z-10">
              {/* Stack Preview Tabs */}
              <div className="flex items-center justify-center lg:justify-start gap-1 p-1 bg-slate-200/80 rounded-xl mb-4 max-w-sm mx-auto lg:mx-0">
                <button
                  type="button"
                  onClick={() => setActiveHeroCard('resume')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeHeroCard === 'resume'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ATS Resume
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroCard('matrimonial')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeHeroCard === 'matrimonial'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Matrimonial
                </button>
              </div>

              {/* Layered Card Container with Solid Opaque Backgrounds & Zero Ghosting */}
              <div className="relative min-h-[460px] flex items-center justify-center">
                {/* 1. Card 1 (Front / Default): Executive ATS Resume */}
                <div
                  onClick={() => {
                    if (activeHeroCard !== 'resume') {
                      setActiveHeroCard('resume');
                    } else {
                      onStartDocument('resume');
                    }
                  }}
                  className={`absolute inset-0 bg-white p-5 sm:p-6 rounded-2xl border-2 overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer ${
                    activeHeroCard === 'resume'
                      ? 'z-30 scale-100 translate-y-0 rotate-0 border-indigo-400 ring-4 ring-indigo-400/20 shadow-2xl'
                      : 'z-20 scale-[0.96] translate-y-3.5 rotate-1 border-slate-300 shadow-lg'
                  }`}
                >
                  <div
                    className={`w-full h-full flex flex-col justify-between transition-opacity duration-200 ${
                      activeHeroCard === 'resume' ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#0066FF]" /> Executive ATS Resume
                      </span>
                      <span className="text-[11px] font-bold text-[#0066FF] hover:underline">
                        40+ ATS Templates &rarr;
                      </span>
                    </div>

                    {/* Document Inner Mockup */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs font-sans">
                      <div className="border-b border-slate-200 pb-2 flex justify-between items-baseline">
                        <div>
                          <div className="text-base font-extrabold text-slate-900">Priya Patel</div>
                          <div className="text-xs font-semibold text-[#0066FF]">Staff Full Stack Engineer</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ATS 100%
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                          Staff Engineer with 8+ years architecting high-throughput distributed systems processing $120M+ transaction volume.
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200 flex flex-wrap gap-1.5">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">React</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Node</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Kafka</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">AWS</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
                        <span>B.Tech Computer Science</span>
                        <span className="text-emerald-700 font-semibold">Single-Column Parseable</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-medium">ATS-Certified Format</span>
                      <span className="font-bold text-indigo-700 inline-flex items-center gap-1">
                        Build ATS Resume <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Card 2 (Middle): Royal Vedic Matrimonial Profile */}
                <div
                  onClick={() => {
                    if (activeHeroCard !== 'matrimonial') {
                      setActiveHeroCard('matrimonial');
                    } else {
                      onStartDocument('biodata');
                    }
                  }}
                  className={`absolute inset-0 bg-[#fffdfa] p-5 sm:p-6 rounded-2xl border-2 overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer ${
                    activeHeroCard === 'matrimonial'
                      ? 'z-30 scale-100 translate-y-0 rotate-0 border-amber-400 ring-4 ring-amber-400/20 shadow-2xl'
                      : 'z-20 scale-[0.96] translate-y-3.5 -rotate-1 border-amber-300 shadow-lg'
                  }`}
                >
                  <div
                    className={`w-full h-full flex flex-col justify-between transition-opacity duration-200 ${
                      activeHeroCard === 'matrimonial' ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300/80 inline-flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-600" /> Royal Vedic Matrimonial
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 hover:underline">
                        47 Designs &rarr;
                      </span>
                    </div>

                    {/* Document Inner Mockup */}
                    <div className="bg-white rounded-xl border border-amber-200/90 p-4 space-y-2.5 shadow-2xs font-cormorant">
                      <div className="text-center border-b border-amber-200/80 pb-2">
                        <div className="text-xs text-amber-800 font-bold tracking-widest">॥ श्री गणेशाय नमः ॥</div>
                        <div className="text-lg font-bold text-slate-900 font-serif mt-0.5">Rahul Sharma</div>
                        <div className="text-[11px] text-slate-600 font-sans">Software Architect &bull; B.Tech & M.Tech</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-700">
                        <div><strong className="text-slate-900">DOB:</strong> 14 Oct 1995</div>
                        <div><strong className="text-slate-900">Height:</strong> 5' 11"</div>
                        <div><strong className="text-slate-900">Gotra:</strong> Kashyap</div>
                        <div><strong className="text-slate-900">Kundali:</strong> Non-Manglik</div>
                      </div>
                      <div className="text-[11px] font-sans text-slate-600 pt-1.5 border-t border-amber-100 flex items-center justify-between">
                        <span>Father: Sr. Bank Manager</span>
                        <span className="text-amber-800 font-bold">Jaipur, Rajasthan</span>
                      </div>
                      {/* QR Code footer mock */}
                      <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-2 text-[10px] font-sans text-amber-900">
                        <div className="w-6 h-6 bg-white border border-amber-300 rounded flex items-center justify-center font-mono text-[8px] font-bold shrink-0">
                          QR
                        </div>
                        <span className="truncate">Scan to connect on WhatsApp / View Full Kundali</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-amber-200/70 flex items-center justify-between text-xs">
                      <span className="text-amber-800 font-medium">Saffron & Gold Crest</span>
                      <span className="font-bold text-amber-900 inline-flex items-center gap-1">
                        Customize Profile <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4-Pillar Bento Grid ("Our Creation Suite") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0066FF] uppercase tracking-wider">
            <span>Our Creation Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Craft Every Identity Milestone with Precision
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            From corporate career ladders to traditional family alliances, {BUSINESS.name} delivers purpose-built design systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Career Architecture */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Career Architecture
                </h3>
                <span className="text-xs font-semibold text-indigo-600 block mt-0.5">CVs & Resumes</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ATS-tested single-column formats, tech stack matrices, executive leadership layouts, and clean corporate styles designed to pass candidate filters.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onStartDocument('resume')}
                className="w-full py-2.5 px-3 bg-[#0066FF] hover:bg-[#0055D6] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Build Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onBrowseTemplates('resume')}
                className="w-full py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer"
              >
                Browse {resumeTotalCount} Resumes
              </button>
            </div>
          </div>

          {/* Card 2: Application Suite */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Application Suite
                </h3>
                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">Executive Cover Letters</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Tailored executive, tech lead, and corporate letters designed to pair seamlessly with your resume letterhead and typography.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onStartDocument('cover-letter')}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Write Cover Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onBrowseTemplates('cover-letter')}
                className="w-full py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer"
              >
                Browse {coverLetterTotalCount} Letters
              </button>
            </div>
          </div>

          {/* Card 3: Matrimonial Suite */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-rose-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Matrimonial Suite
                </h3>
                <span className="text-xs font-semibold text-rose-600 block mt-0.5">Alliance Profiles & Kundali</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Culturally authentic Vedic formats, auspicious header chants, Kundali details, family hierarchy, gold borders & optional WhatsApp QR codes.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onStartDocument('biodata')}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Create Matrimonial Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onBrowseTemplates('biodata')}
                className="w-full py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer"
              >
                Browse {biodataTotalCount} Profiles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Featured Template Showcase (4-Column Top Sellers Preview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              Featured Top-Selling Templates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Instant live preview. Click any template to start customizing immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBrowseTemplates()}
            className="text-xs font-bold text-[#0066FF] hover:text-[#0055D6] transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All 70+ Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map((t) => (
            <div
              key={t.id}
              onClick={() => onBrowseTemplates(t.type)}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[210/297] bg-slate-50 overflow-hidden border-b border-slate-100">
                <TemplatePreview template={t} />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                  <span className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg inline-flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                    Use Template <ArrowRight className="w-3.5 h-3.5 text-[#0066FF]" />
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors truncate">
                    {t.name}
                  </h3>
                  {t.priceINR > 0 ? (
                    <span className="text-[11px] font-bold text-indigo-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                      ₹{t.priceINR}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between font-medium">
                  <span className="capitalize">{t.type === 'biodata' ? 'Matrimonial Profile' : t.type}</span>
                  <span className="text-indigo-600 font-semibold group-hover:underline">Customize &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 3-Step "How It Works" Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Effortless Workflow</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            How {BUSINESS.name} Works in 3 Steps
          </h2>
          <p className="text-xs text-slate-500">
            No redundant forms. Enter your profile data once and switch between designs effortlessly with zero retyping.
          </p>
        </div>

        <div className="relative">
          {/* Subtle horizontal timeline connector line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 -translate-y-6 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 -z-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#0066FF]/30 font-mono">{st.num}</span>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-indigo-100">{st.icon}</div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{st.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-semibold text-[#0066FF] flex items-center gap-1">
                  <span>Step {st.num} Completed</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Transparent One-Time Export Pricing (INR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
            Transparent INR Pricing &bull; Zero Subscriptions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Create &amp; Preview Free. Pay Once Only When You Export Premium Designs.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            No monthly plans or hidden charges. Create and preview any document for free with watermarked preview on premium designs, or pay a single one-time fee in Indian Rupees (INR) to unlock watermark-free 300 DPI A4 PDF export and 30-day cloud recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free Tier Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Free Forever
                </span>
                <span className="text-xs font-semibold text-slate-500">No Login Required</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs font-medium text-slate-500">INR / starter templates</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  Free Creation, Live Preview &amp; Starter Exports
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free creation &amp; editing</strong> across all {resumeTotalCount + biodataTotalCount + coverLetterTotalCount} templates with live preview (watermarked preview on premium templates).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free watermark-free PDF export</strong> on 42 starter templates (12 Resumes, 20 Matrimonial Profiles, and all 10 Cover Letters).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Switch templates anytime with 100% data preservation and zero payment required.</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onBrowseTemplates()}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Start Creating Free (₹0)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Paid One-Time Export Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0066FF] shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                  One-Time Export Pass
                </span>
                <span className="text-xs font-semibold text-slate-500">Per Template</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">₹40 – ₹100</span>
                  <span className="text-xs font-medium text-slate-500">INR one-time</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  Premium Watermark-Free 300 DPI A4 PDF + 30-Day Recovery
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span><strong>Exact template pricing in INR:</strong> Resumes (₹40, ₹60, ₹100) &bull; Matrimonial Profiles (₹40, ₹50, ₹60, ₹80, ₹100).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span><strong>Instant watermark-free 300 DPI A4 PDF &amp; PNG download</strong> immediately after payment verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span><strong>30-day cloud recovery</strong> across devices via Receipt ID &amp; Recovery Code, plus full user delete control anytime.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span><strong>PCI-DSS compliant checkout via Cashfree Payments</strong> (UPI, Cards, NetBanking). Final INR price shown—zero recurring charges.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onBrowseTemplates()}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Browse All Templates &amp; Prices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Covered by our{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('refund-policy')}
                  className="text-indigo-600 underline font-medium cursor-pointer"
                >
                  Refund Policy
                </button>{' '}
                &amp;{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('privacy-policy')}
                  className="text-indigo-600 underline font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>

          {/* SaaS Business Model & Non-Matchmaking Compliance Disclaimer */}
          <div className="max-w-4xl mx-auto mt-8 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Important Disclaimer: Self-Service PDF Formatting Software Only
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                <strong>Genova Profile (genovaprofile.com)</strong> is strictly a self-service{' '}
                <strong>PDF Document &amp; Bio-Profile Formatting Software Tool (SaaS)</strong>. We are{' '}
                <strong>NOT a matchmaking, dating, marriage bureau, or matrimonial agency</strong>. We do not host public profile directories, broker introductions, connect users, or offer partner-search services. Users simply format their own details into templates and download PDF/PNG files for personal use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Accordion FAQ Section (5 Expandable Questions) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about privacy, template persistence, and formats.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0066FF] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#0066FF]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. High-Contrast Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden border border-slate-800/80">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to build your profile? Start creating for free today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Create standout resumes, matrimonial biodatas, cover letters, and designer invitations in minutes with instant digital downloads.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onBrowseTemplates()}
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-bold transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              <span>+ Create Your Profile Now</span>
            </button>
            <button
              type="button"
              onClick={() => onBrowseTemplates()}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Browse 70+ Templates</span>
              <ArrowRight className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-6 pt-2 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Privacy First & Full Delete Control</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Instant PDF Generation</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Cashfree UPI Secured</span>
          </div>
        </div>
      </section>
    </div>
  );
};
