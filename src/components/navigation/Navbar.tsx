import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  FileText,
  Mail,
  Sparkles,
  Plus,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { PAGE_TO_PATH_MAP } from '../../utils/routes';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onTryDemo?: (type: 'biodata' | 'resume' | 'cover-letter') => void;
  onStartCreating?: () => void;
}

interface DocumentCategoryItem {
  id: string;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  activeBorder: string;
  activeText: string;
  isNew?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onTryDemo,
  onStartCreating,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const documentCategories: DocumentCategoryItem[] = [
    {
      id: 'resume-templates',
      label: 'Resume',
      description: 'ATS-friendly corporate and tech resumes',
      icon: FileText,
      iconBg: 'bg-resume/10 text-resume',
      activeBorder: 'bg-resume/5 border-resume/25',
      activeText: 'text-resume',
    },
    {
      id: 'cover-letter-templates',
      label: 'Cover Letter',
      description: 'Tailored executive and job application letters',
      icon: Mail,
      iconBg: 'bg-cover-letter/10 text-cover-letter',
      activeBorder: 'bg-cover-letter/5 border-cover-letter/25',
      activeText: 'text-cover-letter',
    },
    {
      id: 'biodata-templates',
      label: 'Matrimonial Profile',
      description: 'Culturally authentic matrimonial & alliance portfolios',
      icon: Heart,
      iconBg: 'bg-matrimonial/10 text-matrimonial ring-1 ring-matrimonial-gold/30',
      activeBorder: 'bg-matrimonial/5 border-matrimonial/25',
      activeText: 'text-matrimonial',
    },
  ];

  const isDocumentsActive = documentCategories.some((cat) => cat.id === currentPage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleSelectCategory = (categoryId: string) => {
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate(categoryId);
  };

  const handlePrimaryCreate = () => {
    if (onStartCreating) {
      onStartCreating();
    } else {
      onNavigate('resume-templates');
    }
  };

  return (
    <>
      <header className="site-shell sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT: GenovaProfile Custom Logo with responsive right margin */}
            <div className="flex items-center mr-2 sm:mr-8 lg:mr-10 shrink-0">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home');
                }}
                className="group flex items-center hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl"
                aria-label="GenovaProfile Home"
              >
                <GenovaDocLogo size="md" />
              </a>
            </div>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
              {/* Create Profile Dropdown Menu */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`py-2 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isDocumentsActive
                      ? 'text-brand bg-brand/6'
                      : 'text-slate-700 hover:text-navy hover:bg-slate-100/70'
                  }`}
                  aria-expanded={isDropdownOpen}
                >
                  <span>Create Profile</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-brand' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Clean Dropdown Card */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-[0_12px_32px_-8px_rgba(11,27,58,0.16)] p-2 z-50 max-h-[calc(100vh-100px)] overflow-y-auto"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Create Profile
                      </span>
                    </div>
                    <div className="space-y-1">
                      {documentCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = currentPage === cat.id;
                        const targetPath = PAGE_TO_PATH_MAP[cat.id] || `/${cat.id}`;
                        return (
                          <a
                            key={cat.id}
                            href={targetPath}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectCategory(cat.id);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group cursor-pointer border ${
                              isSelected
                                ? cat.activeBorder
                                : 'hover:bg-slate-50 border-transparent'
                            }`}
                            role="menuitem"
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${cat.iconBg}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs font-bold leading-tight ${
                                    isSelected ? cat.activeText : 'text-navy group-hover:text-brand'
                                  }`}
                                >
                                  {cat.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5 truncate">
                                {cat.description}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Templates Link */}
              <a
                href="/resume-templates"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('resume-templates');
                }}
                className={`py-2 px-3 rounded-xl transition-colors cursor-pointer text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  currentPage === 'resume-templates'
                    ? 'text-brand bg-brand/6'
                    : 'text-slate-700 hover:text-navy hover:bg-slate-100/70'
                }`}
              >
                Templates
              </a>
            </nav>

            {/* RIGHT: Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-5 shrink-0">
              {/* Restore Purchase Link */}
              <a
                href="/restore"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('restore');
                }}
                className={`text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg px-1 py-1 ${
                  currentPage === 'restore'
                    ? 'text-brand'
                    : 'text-slate-600 hover:text-brand'
                }`}
                title="Restore a purchased template on this device"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore purchase</span>
              </a>

              {/* My Documents Link */}
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dashboard');
                }}
                className={`text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg px-1 py-1 ${
                  currentPage === 'dashboard'
                    ? 'text-brand'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                My Documents
              </a>

              {/* Primary Solid Brand CTA */}
              <button
                type="button"
                onClick={handlePrimaryCreate}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create</span>
              </button>
            </div>

            {/* Mobile Right Controls: Create + Hamburger */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onStartCreating || (() => onNavigate('templates'))}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-2xl flex items-center gap-1 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-navy rounded-xl hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <GenovaDocLogo size="sm" showTagline />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Profile Section */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 px-2.5">
                Create Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {documentCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = currentPage === cat.id;
                  const targetPath = PAGE_TO_PATH_MAP[cat.id] || `/${cat.id}`;
                  return (
                    <a
                      key={cat.id}
                      href={targetPath}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectCategory(cat.id);
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? `${cat.activeBorder} ${cat.activeText}`
                          : 'text-slate-700 hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-navy">{cat.label}</div>
                        <p className="text-[11px] font-normal text-slate-500 truncate">{cat.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Standard Navigation Pages */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <a
                href="/resume-templates"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('resume-templates');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold cursor-pointer block ${
                  currentPage === 'resume-templates'
                    ? 'text-brand bg-brand/6'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Templates Catalog
              </a>
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold cursor-pointer block ${
                  currentPage === 'dashboard'
                    ? 'text-brand bg-brand/6'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                My Documents
              </a>
              <a
                href="/restore"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('restore');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-2 ${
                  currentPage === 'restore'
                    ? 'text-brand bg-brand/6'
                    : 'text-brand hover:bg-slate-50'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-brand" />
                <span>Restore purchase</span>
              </a>
            </div>

            {/* Mobile Drawer CTA */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onStartCreating) onStartCreating();
                  else onNavigate('templates');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-2xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create Profile</span>
              </button>
              {onTryDemo && (
                <button
                  type="button"
                  onClick={() => {
                    onTryDemo('resume');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 hover:text-navy bg-slate-100 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand" />
                  <span>Try Interactive Demo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile-Only Fixed Bottom "Start free" Bar (hidden inside Builder & Desktop) */}
      {currentPage !== 'builder' && !mobileMenuOpen && (
        <div className="site-shell lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-6px_24px_-8px_rgba(11,27,58,0.12)] no-print">
          <button
            type="button"
            onClick={handlePrimaryCreate}
            className="w-full py-3 px-5 bg-brand hover:bg-brand-hover active:scale-[0.99] text-white rounded-2xl text-sm font-semibold transition-all shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
