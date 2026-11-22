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
} from 'lucide-react';
import { GenovaDocLogo } from '../common/GenovaDocLogo';
import { BUSINESS } from '../../config/business';
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
  iconColor: string;
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
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
    },
    {
      id: 'cover-letter-templates',
      label: 'Cover Letter',
      description: 'Tailored executive and job application letters',
      icon: Mail,
      iconBg: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      id: 'biodata-templates',
      label: 'Matrimonial Profile',
      description: 'Culturally authentic matrimonial & alliance portfolios',
      icon: Heart,
      iconBg: 'bg-rose-50 text-rose-600',
      iconColor: 'text-rose-600',
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: GenovaProfile Custom Logo with explicit right margin */}
          <div className="flex items-center mr-8 lg:mr-10 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="group flex items-center hover:opacity-95 transition-opacity cursor-pointer focus:outline-hidden"
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
                className={`py-2 px-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer text-sm font-semibold ${
                  isDocumentsActive
                    ? 'text-[#0066FF] bg-blue-50/80'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
                aria-expanded={isDropdownOpen}
              >
                <span>Create Profile</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-[#0066FF]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Glassmorphic Dropdown Card */}
              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-100px)] overflow-y-auto"
                  role="menu"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border border-blue-200/70'
                              : 'hover:bg-slate-50 border border-transparent'
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
                                  isSelected ? 'text-[#0066FF]' : 'text-slate-900 group-hover:text-[#0066FF]'
                                }`}
                              >
                                {cat.label}
                              </span>
                              {cat.isNew && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider leading-none">
                                  New
                                </span>
                              )}
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
              className={`py-2 px-2.5 rounded-lg transition-colors cursor-pointer text-sm font-semibold ${
                currentPage === 'resume-templates'
                  ? 'text-[#0066FF] bg-indigo-50/70 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Templates
            </a>
          </nav>

          {/* RIGHT: Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Restore Purchase Link */}
            <a
              href="/restore"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('restore');
              }}
              className={`text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'restore'
                  ? 'text-[#0066FF] font-bold'
                  : 'text-indigo-600 hover:text-indigo-800'
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
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'text-[#0066FF]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Documents
            </a>

            {/* Primary Gradient CTA */}
            <button
              type="button"
              onClick={onStartCreating || (() => onNavigate('resume-templates'))}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0066FF] via-[#007CF0] to-[#00C2CB] hover:from-[#0055D6] hover:to-[#00B4BD] rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create</span>
            </button>
          </div>

          {/* Mobile Right Controls: Create + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onStartCreating || (() => onNavigate('templates'))}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0066FF] to-[#00C2CB] rounded-lg flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <GenovaDocLogo size="sm" showTagline />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Create Profile Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5">
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
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-[#0066FF] border border-indigo-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cat.iconBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span>{cat.label}</span>
                        {cat.isNew && (
                          <span className="px-1 py-0.2 rounded-full text-[8px] font-black bg-amber-500 text-slate-950 uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-normal text-slate-500 truncate">{cat.description}</p>
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
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold cursor-pointer block ${
                currentPage === 'resume-templates'
                  ? 'text-[#0066FF] font-bold bg-blue-50'
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
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold cursor-pointer block ${
                currentPage === 'dashboard'
                  ? 'text-[#0066FF] font-bold bg-blue-50'
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
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 ${
                currentPage === 'restore'
                  ? 'text-[#0066FF] font-bold bg-blue-50'
                  : 'text-blue-600 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-[#0066FF]" />
              <span>Restore purchase</span>
            </a>
          </div>

          {/* Mobile Bottom CTA */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (onStartCreating) onStartCreating();
                else onNavigate('templates');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0066FF] via-[#007CF0] to-[#00C2CB] rounded-xl flex items-center justify-center gap-1.5 shadow-xs shadow-blue-500/20"
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
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#0066FF]" />
                <span>Try Interactive Demo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
