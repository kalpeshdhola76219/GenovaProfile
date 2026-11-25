import React, { useState, useRef, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { DocumentType, TemplateMetadata } from '../../types/document';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { TemplatePreview } from '../gallery/TemplatePreview';
import {
  Heart,
  FileText,
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

const fadeUpProps = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};

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

  // Live hero templates
  const heroResumeTemplate: TemplateMetadata =
    TEMPLATE_REGISTRY.find((t) => t.id === 'resume-ats-professional') ||
    TEMPLATE_REGISTRY.find((t) => t.type === 'resume')!;
  const heroBiodataTemplate: TemplateMetadata =
    TEMPLATE_REGISTRY.find((t) => t.id === 'biodata-royal-vedic-qr') ||
    TEMPLATE_REGISTRY.find((t) => t.type === 'biodata' && t.priceINR === 100) ||
    TEMPLATE_REGISTRY.find((t) => t.type === 'biodata')!;

  // 4 Featured top-selling templates
  const featuredTemplates: TemplateMetadata[] = [
    heroBiodataTemplate,
    heroResumeTemplate,
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
      icon: <Sliders className="w-5 h-5 text-brand" />,
      iconBg: 'bg-brand/8 border-brand/15',
    },
    {
      num: '02',
      title: 'Fill Details Once',
      desc: 'Enter your credentials, career history, or family heritage once. Switch templates freely with zero data loss.',
      icon: <Zap className="w-5 h-5 text-accent" />,
      iconBg: 'bg-accent/10 border-accent/25',
    },
    {
      num: '03',
      title: 'Instant 300 DPI Download',
      desc: 'Live preview in real time and export vector-sharp A4 PDF or print directly with pixel-perfect resolution.',
      icon: <Printer className="w-5 h-5 text-cover-letter" />,
      iconBg: 'bg-cover-letter/10 border-cover-letter/20',
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

  const activeHeroTemplate = activeHeroCard === 'resume' ? heroResumeTemplate : heroBiodataTemplate;

  const getTypeBadgeStyle = (type: DocumentType) => {
    if (type === 'biodata') {
      return 'text-matrimonial';
    }
    if (type === 'cover-letter') {
      return 'text-cover-letter';
    }
    return 'text-resume';
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell bg-surface text-navy space-y-20 sm:space-y-24 pb-24 lg:pb-20 overflow-x-hidden">
        {/* 1. Clean Hero Section */}
        <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 bg-surface border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left relative z-20">
                <p className="text-xs sm:text-sm font-semibold text-brand tracking-tight">
                  {BUSINESS.name} &middot; Personal &amp; Professional Identity Studio
                </p>

                {/* Main Headline H1 */}
                <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-navy leading-[1.16] text-balance">
                  Build Standout Resumes, Matrimonial Profiles &amp; Cover Letters in Minutes
                </h1>

                {/* Supporting text */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                  Craft ATS-certified resumes, royal matrimonial alliance profiles, and executive cover letters. Switch styles effortlessly with zero data loss.
                </p>

                {/* Primary & Secondary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 relative z-30">
                  <div ref={docTypeMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDocTypeMenu(!showDocTypeMenu)}
                      className="w-full sm:w-auto px-7 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-sm font-semibold transition-all shadow-[0_6px_20px_-6px_rgba(0,102,255,0.45)] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      aria-expanded={showDocTypeMenu}
                    >
                      <span>Create now</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDocTypeMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Document Type Picker Dropdown */}
                    {showDocTypeMenu && (
                      <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_16px_40px_-10px_rgba(11,27,58,0.18)] border border-slate-200/90 p-2 z-50 text-left max-h-[calc(100vh-180px)] overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setShowDocTypeMenu(false);
                            onStartDocument('resume');
                          }}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs font-semibold text-navy text-left cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-resume/10 text-resume flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-navy">Resume</div>
                            <span className="text-[11px] text-slate-500 font-normal">ATS-friendly corporate and tech resumes</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDocTypeMenu(false);
                            onStartDocument('biodata');
                          }}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs font-semibold text-navy text-left cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-matrimonial/10 text-matrimonial ring-1 ring-matrimonial-gold/30 flex items-center justify-center shrink-0">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-navy">Matrimonial Profile</div>
                            <span className="text-[11px] text-slate-500 font-normal">Culturally authentic matrimonial &amp; alliance portfolios</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDocTypeMenu(false);
                            onStartDocument('cover-letter');
                          }}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs font-semibold text-navy text-left cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-cover-letter/10 text-cover-letter flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-navy">Cover Letter</div>
                            <span className="text-[11px] text-slate-500 font-normal">Tailored executive and job application letters</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onBrowseTemplates()}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white text-navy border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl text-sm font-semibold transition-colors shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Browse 70+ Templates</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Clean Unboxed Trust Line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-slate-600 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cover-letter shrink-0 stroke-[2.5]" />
                    <span>No Login Required</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cover-letter shrink-0" />
                    <span>Privacy First &amp; Full Delete Control</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>Instant 300 DPI PDF</span>
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Clean Live Template Preview */}
              <div className="lg:col-span-5 mt-10 lg:mt-0 relative z-10">
                <div className="site-card rounded-3xl p-4 sm:p-5 space-y-4 max-w-md mx-auto lg:max-w-none">
                  {/* Live Preview Switcher */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl flex-1">
                      <button
                        type="button"
                        onClick={() => setActiveHeroCard('resume')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          activeHeroCard === 'resume'
                            ? 'bg-white text-resume shadow-xs'
                            : 'text-slate-600 hover:text-navy'
                        }`}
                      >
                        ATS Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHeroCard('matrimonial')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          activeHeroCard === 'matrimonial'
                            ? 'bg-white text-matrimonial shadow-xs'
                            : 'text-slate-600 hover:text-navy'
                        }`}
                      >
                        Matrimonial
                      </button>
                    </div>
                  </div>

                  {/* Live Rendered A4 Preview Frame (isolated from site fonts) */}
                  <div
                    onClick={() =>
                      onStartDocument(activeHeroCard === 'resume' ? 'resume' : 'biodata')
                    }
                    className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-slate-50 ${
                      activeHeroCard === 'resume'
                        ? 'border-resume/25 hover:border-resume/50'
                        : 'border-matrimonial-gold/50 hover:border-matrimonial/60'
                    }`}
                  >
                    <div
                      data-template-preview="true"
                      style={{ aspectRatio: '210 / 260' }}
                      className="w-full overflow-hidden bg-white"
                    >
                      <TemplatePreview template={activeHeroTemplate} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/45 to-transparent p-4 pt-10 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-white/80">
                          {activeHeroCard === 'resume' ? 'ATS-Certified Format' : 'Saffron & Gold Crest'}
                        </p>
                        <p className="text-sm font-bold text-white truncate site-heading">
                          {activeHeroTemplate.name}
                        </p>
                      </div>
                      <span className="px-3.5 py-2 bg-white text-navy rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 shrink-0 group-hover:bg-slate-50 transition-colors">
                        <span>{activeHeroCard === 'resume' ? 'Build ATS Resume' : 'Customize Profile'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Three Large Document-Type Entry Cards */}
        <motion.section {...fadeUpProps} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
            <p className="text-xs font-semibold text-brand">Our Creation Suite</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy text-balance">
              Craft Every Identity Milestone with Precision
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              From corporate career ladders to traditional family alliances, {BUSINESS.name} delivers purpose-built design systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entry Card 1: Resume (#0066FF) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="site-card site-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-resume/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-resume/10 text-resume flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-resume tabular-nums">
                    {resumeTotalCount} templates
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-navy group-hover:text-resume transition-colors">
                    Career Architecture
                  </h3>
                  <span className="text-xs font-semibold text-resume block mt-0.5">CVs &amp; Resumes</span>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-2.5 leading-relaxed">
                    ATS-tested single-column formats, tech stack matrices, executive leadership layouts, and clean corporate styles designed to pass candidate filters.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => onStartDocument('resume')}
                  className="w-full py-3 px-4 bg-resume hover:bg-brand-hover text-white rounded-2xl text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Build Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onBrowseTemplates('resume')}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-navy transition-colors text-center cursor-pointer"
                >
                  Browse {resumeTotalCount} Resumes
                </button>
              </div>
            </motion.div>

            {/* Entry Card 2: Matrimonial Profile (Rose #E11D48 + Gold #C9A227) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="site-card site-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-matrimonial/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-matrimonial/10 text-matrimonial ring-1 ring-matrimonial-gold/35 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-matrimonial tabular-nums">
                    {biodataTotalCount} templates
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-navy group-hover:text-matrimonial transition-colors">
                    Matrimonial Suite
                  </h3>
                  <span className="text-xs font-semibold text-matrimonial-gold block mt-0.5">
                    Alliance Profiles &amp; Kundali
                  </span>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-2.5 leading-relaxed">
                    Culturally authentic Vedic formats, auspicious header chants, Kundali details, family hierarchy, gold borders &amp; optional WhatsApp QR codes.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => onStartDocument('biodata')}
                  className="w-full py-3 px-4 bg-matrimonial hover:bg-rose-700 text-white rounded-2xl text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Create Matrimonial Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onBrowseTemplates('biodata')}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-navy transition-colors text-center cursor-pointer"
                >
                  Browse {biodataTotalCount} Profiles
                </button>
              </div>
            </motion.div>

            {/* Entry Card 3: Cover Letter (Teal #0D9488) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="site-card site-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-cover-letter/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cover-letter/10 text-cover-letter flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-cover-letter tabular-nums">
                    {coverLetterTotalCount} templates
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-navy group-hover:text-cover-letter transition-colors">
                    Application Suite
                  </h3>
                  <span className="text-xs font-semibold text-cover-letter block mt-0.5">Executive Cover Letters</span>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-2.5 leading-relaxed">
                    Tailored executive, tech lead, and corporate letters designed to pair seamlessly with your resume letterhead and typography.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => onStartDocument('cover-letter')}
                  className="w-full py-3 px-4 bg-cover-letter hover:bg-teal-700 text-white rounded-2xl text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Write Cover Letter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onBrowseTemplates('cover-letter')}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-navy transition-colors text-center cursor-pointer"
                >
                  Browse {coverLetterTotalCount} Letters
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 3. Live Featured Template Showcase */}
        <motion.section {...fadeUpProps} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-brand">Handpicked Bestsellers</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                Featured Top-Selling Templates
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Instant live preview. Click any template to start customizing immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onBrowseTemplates()}
              className="text-xs sm:text-sm font-semibold text-brand hover:text-brand-hover transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
            >
              <span>Explore All 70+ Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTemplates.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onBrowseTemplates(t.type)}
                className="group site-card site-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between hover:border-brand/40"
              >
                <div
                  data-template-preview="true"
                  className="relative aspect-[210/297] bg-slate-50 overflow-hidden border-b border-slate-100"
                >
                  <TemplatePreview template={t} />
                  <div className="absolute inset-0 bg-navy/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="px-4 py-2.5 bg-white text-navy rounded-2xl text-xs font-semibold shadow-lg inline-flex items-center gap-1.5">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand" />
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-navy text-sm group-hover:text-brand transition-colors truncate">
                      {t.name}
                    </h3>
                    {t.priceINR > 0 ? (
                      <span className="text-xs font-bold text-navy bg-slate-100 px-2.5 py-0.5 rounded-xl border border-slate-200/80 shrink-0 tabular-nums">
                        ₹{t.priceINR}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-cover-letter bg-cover-letter/10 px-2.5 py-0.5 rounded-xl border border-cover-letter/20 shrink-0">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                  <div className="text-[11px] pt-2 border-t border-slate-100 flex items-center justify-between font-semibold">
                    <span className={`capitalize ${getTypeBadgeStyle(t.type)}`}>
                      {t.type === 'biodata' ? 'Matrimonial Profile' : t.type.replace('-', ' ')}
                    </span>
                    <span className="text-brand group-hover:underline">Customize &rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 4. 3-Step "How It Works" */}
        <motion.section {...fadeUpProps} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <p className="text-xs font-semibold text-brand">Effortless Workflow</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
              How {BUSINESS.name} Works in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              No redundant forms. Enter your profile data once and switch between designs effortlessly with zero retyping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((st) => (
              <motion.div
                key={st.num}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="site-card site-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-navy/20 tabular-nums site-heading">
                    {st.num}
                  </span>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${st.iconBg}`}>
                    {st.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-navy text-base tracking-tight">{st.title}</h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-2 leading-relaxed">{st.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cover-letter shrink-0" />
                  <span>Step {st.num}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 5. Transparent One-Time Export Pricing (INR) */}
        <motion.section {...fadeUpProps} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
            <p className="text-xs font-semibold text-brand">
              Transparent INR Pricing &middot; Zero Subscriptions
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy text-balance">
              Create &amp; Preview Free. Pay Once Only When You Export Premium Designs.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No monthly plans or hidden charges. Create and preview any document for free with watermarked preview on premium designs, or pay a single one-time fee in Indian Rupees (INR) to unlock watermark-free 300 DPI A4 PDF export and 30-day cloud recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Free Tier Card */}
            <div className="site-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border-cover-letter/25">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-cover-letter">Free Forever</span>
                  <span className="text-slate-500">No Login Required</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-navy tracking-tight tabular-nums site-heading">₹0</span>
                    <span className="text-xs font-medium text-slate-500">INR / starter templates</span>
                  </div>
                  <h3 className="text-base font-bold text-navy mt-2">
                    Free Creation, Live Preview &amp; Starter Exports
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cover-letter shrink-0 mt-0.5" />
                    <span><strong className="text-navy">Free creation &amp; editing</strong> across all {resumeTotalCount + biodataTotalCount + coverLetterTotalCount} templates with live preview (watermarked preview on premium templates).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cover-letter shrink-0 mt-0.5" />
                    <span><strong className="text-navy">Free watermark-free PDF export</strong> on 42 starter templates (12 Resumes, 20 Matrimonial Profiles, and all 10 Cover Letters).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cover-letter shrink-0 mt-0.5" />
                    <span>Switch templates anytime with 100% data preservation and zero payment required.</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onBrowseTemplates()}
                className="w-full py-3.5 px-5 bg-navy hover:bg-navy/90 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Start Creating Free (₹0)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Paid One-Time Export Card */}
            <div className="site-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 ring-2 ring-brand/90">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-brand">One-Time Export Pass</span>
                  <span className="text-slate-500">Per Template</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-navy tracking-tight tabular-nums site-heading">₹40 – ₹100</span>
                    <span className="text-xs font-medium text-slate-500">INR one-time</span>
                  </div>
                  <h3 className="text-base font-bold text-navy mt-2">
                    Premium Watermark-Free 300 DPI A4 PDF + 30-Day Recovery
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-navy">Exact template pricing in INR:</strong> Resumes (₹40, ₹60, ₹100) &bull; Matrimonial Profiles (₹40, ₹50, ₹60, ₹80, ₹100).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-navy">Instant watermark-free 300 DPI A4 PDF &amp; PNG download</strong> immediately after payment verification.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-navy">30-day cloud recovery</strong> across devices via Receipt ID &amp; Recovery Code, plus full user delete control anytime.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-navy">PCI-DSS compliant checkout via Cashfree Payments</strong> (UPI, Cards, NetBanking). Final INR price shown—zero recurring charges.</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onBrowseTemplates()}
                  className="w-full py-3.5 px-5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Browse All Templates &amp; Prices</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Covered by our{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('refund-policy')}
                    className="text-brand underline font-medium cursor-pointer"
                  >
                    Refund Policy
                  </button>{' '}
                  &amp;{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('privacy-policy')}
                    className="text-brand underline font-medium cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* SaaS Business Model & Non-Matchmaking Compliance Disclaimer */}
          <div className="max-w-5xl mx-auto mt-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-brand" />
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-xs sm:text-sm font-bold text-navy">
                Important Disclaimer: Self-Service PDF Formatting Software Only
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-navy">Genova Profile (genovaprofile.com)</strong> is strictly a self-service{' '}
                <strong className="text-navy">PDF Document &amp; Bio-Profile Formatting Software Tool (SaaS)</strong>. We are{' '}
                <strong className="text-navy">NOT a matchmaking, dating, marriage bureau, or matrimonial agency</strong>. We do not host public profile directories, broker introductions, connect users, or offer partner-search services. Users simply format their own details into templates and download PDF/PNG files for personal use.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 6. Accordion FAQ Section */}
        <motion.section {...fadeUpProps} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-1.5">
            <p className="text-xs font-semibold text-brand">Got Questions?</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about privacy, template persistence, and formats.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="site-card rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-navy hover:text-brand transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* 7. Final Call-to-Action (Clean Deep Navy Section with White Button) */}
        <motion.section {...fadeUpProps} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-[0_20px_50px_-20px_rgba(11,27,58,0.45)] border border-white/10">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Ready to build your profile? Start creating for free today
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Create standout resumes, matrimonial biodatas, cover letters, and designer invitations in minutes with instant digital downloads.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onBrowseTemplates()}
                className="px-8 py-3.5 bg-white text-navy hover:bg-slate-100 rounded-2xl text-sm font-semibold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Create Your Profile Now</span>
                <ArrowRight className="w-4 h-4 text-brand" />
              </button>
              <button
                type="button"
                onClick={() => onBrowseTemplates()}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse 70+ Templates</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-accent" /> Privacy First &amp; Full Delete Control
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" /> Instant PDF Generation
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Cashfree UPI Secured
              </span>
            </div>
          </div>
        </motion.section>
      </div>
    </MotionConfig>
  );
};
