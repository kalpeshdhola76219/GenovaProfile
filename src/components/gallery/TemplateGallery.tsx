import React, { useState, useMemo } from 'react';
import { TEMPLATE_REGISTRY, getTemplateCategories } from '../../templates/registry';
import { TemplateMetadata, DocumentType, DocumentData } from '../../types/document';
import { TemplatePreview } from './TemplatePreview';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { TemplateCompareModal } from './TemplateCompareModal';
import {
  Search,
  Heart,
  FileText,
  ArrowRight,
  Eye,
  ShieldCheck,
  Mail,
  Camera,
  Layers,
  ArrowUpDown,
  Check,
  Sparkles,
} from 'lucide-react';

interface TemplateGalleryProps {
  initialType?: DocumentType | 'all';
  onSelectTemplate: (template: TemplateMetadata) => void;
  onPreviewTemplate?: (template: TemplateMetadata) => void;
  currentDocumentData?: DocumentData | null;
}

const getTemplateSubtitle = (template: TemplateMetadata): string => {
  return template.description;
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  initialType = 'resume',
  onSelectTemplate,
  onPreviewTemplate,
  currentDocumentData,
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType>(initialType === 'all' ? 'resume' : initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [atsFilterOnly, setAtsFilterOnly] = useState(false);
  const [coverLetterFormatFilter, setCoverLetterFormatFilter] = useState<'all' | 'ats' | 'normal'>('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [photoFilter, setPhotoFilter] = useState<'all' | 'photo' | 'no-photo'>('all');
  const [biodataStyle, setBiodataStyle] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'popular' | 'newest' | 'az'>('recommended');

  // Keep selectedType synced when initialType prop changes (e.g. from Create Profile navbar links)
  React.useEffect(() => {
    setSelectedType(initialType === 'all' ? 'resume' : initialType);
    setSelectedCategory('All');
    setBiodataStyle('All');
    setCoverLetterFormatFilter('all');
  }, [initialType]);

  // Comparison & Preview state
  const [previewModalTemplate, setPreviewModalTemplate] = useState<TemplateMetadata | null>(null);
  const [compareList, setCompareList] = useState<TemplateMetadata[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Dynamic counts computed directly from TEMPLATE_REGISTRY
  const biodataCount = useMemo(() => TEMPLATE_REGISTRY.filter((t) => t.type === 'biodata').length, []);
  const resumeCount = useMemo(() => TEMPLATE_REGISTRY.filter((t) => t.type === 'resume').length, []);
  const coverLetterCount = useMemo(() => TEMPLATE_REGISTRY.filter((t) => t.type === 'cover-letter').length, []);
  const coverLetterAtsCount = useMemo(
    () => TEMPLATE_REGISTRY.filter((t) => t.type === 'cover-letter' && t.isATS).length,
    []
  );
  const coverLetterNormalCount = useMemo(
    () => TEMPLATE_REGISTRY.filter((t) => t.type === 'cover-letter' && !t.isATS).length,
    []
  );

  // Biodata Style options
  const biodataStyles = [
    'All',
    'Traditional',
    'Modern',
    'Royal',
    'Minimal',
    'Floral',
    'Photo Focus',
    'Contemporary',
  ];

  const categories = useMemo(() => {
    return getTemplateCategories(selectedType);
  }, [selectedType]);

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_REGISTRY.filter((t) => {
      // Type filter
      if (t.type !== selectedType) return false;
      // Category filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
      // ATS filter (Resume checkbox or Cover Letter segmented toggle)
      if (selectedType === 'cover-letter') {
        if (coverLetterFormatFilter === 'ats' && !t.isATS) return false;
        if (coverLetterFormatFilter === 'normal' && t.isATS) return false;
      } else {
        if (atsFilterOnly && !t.isATS) return false;
        // Photo filter (never applied to cover-letter)
        if (photoFilter === 'photo' && !t.supportsPhoto) return false;
        if (photoFilter === 'no-photo' && t.supportsPhoto) return false;
      }
      // Free / Paid filters
      if (freeOnly && t.priceINR > 0) return false;
      if (premiumOnly && t.priceINR === 0) return false;

      // Biodata Style Filter
      if (selectedType === 'biodata' && biodataStyle !== 'All') {
        const sty = biodataStyle.toLowerCase();
        const matchesCategory = t.category.toLowerCase().includes(sty);
        const matchesName = t.name.toLowerCase().includes(sty);
        const matchesDesc = t.description.toLowerCase().includes(sty);
        if (!matchesCategory && !matchesName && !matchesDesc) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return (b.priceINR > 0 ? 1 : 0) - (a.priceINR > 0 ? 1 : 0);
      if (sortBy === 'popular') return (b.popularity || 50) - (a.popularity || 50);
      return 0; // Default recommended
    });
  }, [
    selectedType,
    selectedCategory,
    atsFilterOnly,
    coverLetterFormatFilter,
    freeOnly,
    premiumOnly,
    photoFilter,
    biodataStyle,
    searchQuery,
    sortBy,
  ]);

  const handleOpenPreviewModal = (template: TemplateMetadata) => {
    if (onPreviewTemplate) {
      onPreviewTemplate(template);
    }
    setPreviewModalTemplate(template);
  };

  const [compareWarning, setCompareWarning] = useState<string | null>(null);

  const handleToggleCompare = (template: TemplateMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some((t) => t.id === template.id)) {
      setCompareList(compareList.filter((t) => t.id !== template.id));
      setCompareWarning(null);
    } else {
      if (compareList.length >= 3) {
        setCompareWarning('You can compare up to 3 templates at a time.');
        setTimeout(() => setCompareWarning(null), 3500);
        return;
      }
      setCompareList([...compareList, template]);
      setCompareWarning(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        {/* Document Type Selector Segmented Control with DYNAMIC COUNTS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full scrollbar-none py-1">
            <button
              type="button"
              onClick={() => {
                setSelectedType('resume');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                selectedType === 'resume' ? 'bg-white text-[#0066FF] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Resume ({resumeCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType('cover-letter');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                selectedType === 'cover-letter' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cover Letter ({coverLetterCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType('biodata');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                selectedType === 'biodata' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Matrimonial Profile ({biodataCount})</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Price Filter Segments */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setFreeOnly(false);
                  setPremiumOnly(false);
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  !freeOnly && !premiumOnly
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Prices
              </button>
              <button
                type="button"
                onClick={() => {
                  setFreeOnly(true);
                  setPremiumOnly(false);
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  freeOnly
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free (₹0)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFreeOnly(false);
                  setPremiumOnly(true);
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  premiumOnly
                    ? 'bg-[#0066FF] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid (₹40 - ₹100)
              </button>
            </div>

            {selectedType === 'resume' && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
                <input
                  type="checkbox"
                  checked={atsFilterOnly}
                  onChange={(e) => setAtsFilterOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#0066FF] focus:ring-indigo-500"
                />
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ATS-Friendly
                </span>
              </label>
            )}

            {selectedType === 'cover-letter' && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setCoverLetterFormatFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    coverLetterFormatFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  onClick={() => setCoverLetterFormatFilter('ats')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${
                    coverLetterFormatFilter === 'ats'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>ATS-Friendly ({coverLetterAtsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverLetterFormatFilter('normal')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    coverLetterFormatFilter === 'normal'
                      ? 'bg-[#0066FF] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Normal ({coverLetterNormalCount})
                </button>
              </div>
            )}

            {selectedType !== 'cover-letter' && (
              <select
                value={photoFilter}
                onChange={(e) => setPhotoFilter(e.target.value as any)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium cursor-pointer"
              >
                <option value="all">Any Photo Setup</option>
                <option value="photo">Photo Layout</option>
                <option value="no-photo">No Photo Required</option>
              </select>
            )}
          </div>
        </div>

        {/* Search, Category & Sorting */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by name, style, layout..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="az">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Biodata Style Chips */}
        {selectedType === 'biodata' && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0">Style:</span>
            {biodataStyles.map((sty) => (
              <button
                key={sty}
                type="button"
                onClick={() => setBiodataStyle(sty)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-xs font-medium ${
                  biodataStyle === sty
                    ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sty}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const isCompared = compareList.some((t) => t.id === template.id);
          return (
            <div
              key={template.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Template Real Miniature Rendered Preview */}
              <div
                style={{ aspectRatio: '210 / 297' }}
                className="relative aspect-[210/297] bg-slate-100 overflow-hidden border-b border-slate-100"
              >
                <TemplatePreview template={template} />

                {/* Hover Overlay with Action Buttons */}
                <div className="absolute inset-0 bg-slate-900/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-10 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className="w-full py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreviewModal(template)}
                    className="w-full py-2 bg-slate-800/90 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Top Corner Quick Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow-2xs"
                    style={{ backgroundColor: template.primaryColorSample }}
                    title="Theme Accent"
                  />
                  <div className="flex items-center gap-1">
                    {template.isATS && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs border border-emerald-200">
                        ATS-Friendly
                      </span>
                    )}
                    {template.priceINR > 0 ? (
                      <span className="text-[10px] font-bold text-violet-900 bg-violet-100/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-violet-200">
                        ₹{template.priceINR}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
                        Free (₹0)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Info Card */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3
                    onClick={() => onSelectTemplate(template)}
                    className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors truncate cursor-pointer"
                  >
                    {template.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {getTemplateSubtitle(template)}
                </p>

                {/* Footer Attributes & Compare Toggle */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-medium text-slate-600 capitalize">{template.category}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleCompare(template, e)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isCompared ? '✓ Compare' : '+ Compare'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPreviewModal(template)}
                      className="text-[#0066FF] hover:text-[#0055D6] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                  </div>
                </div>

                {/* Mobile Touch Quick Action Bar (Visible on mobile screens) */}
                <div className="flex sm:hidden items-center gap-2 pt-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#0066FF] to-indigo-600 active:from-[#0055D6] active:to-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreviewModal(template)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 text-sm">No templates found matching your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedType('resume');
              setSelectedCategory('All');
              setSearchQuery('');
              setAtsFilterOnly(false);
              setCoverLetterFormatFilter('all');
              setFreeOnly(false);
              setPremiumOnly(false);
              setPhotoFilter('all');
              setBiodataStyle('All');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Comparison Bar & Notice */}
      {(compareList.length > 0 || compareWarning) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-[95vw]">
          {compareWarning && (
            <div className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-full shadow-lg border border-amber-400 animate-in fade-in slide-in-from-bottom-2">
              {compareWarning}
            </div>
          )}
          {compareList.length > 0 && (
            <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 animate-in slide-in-from-bottom-3 duration-200 border border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold">{compareList.length} / 3</span>
                <span className="text-slate-300 hidden sm:inline">Templates Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-3 sm:px-4 py-1.5 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-[#0055D6] cursor-pointer shadow-xs"
                >
                  Compare Now
                </button>
                <button
                  type="button"
                  onClick={() => setCompareList([])}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewModalTemplate && (
        <TemplatePreviewModal
          template={previewModalTemplate}
          isOpen={Boolean(previewModalTemplate)}
          onClose={() => setPreviewModalTemplate(null)}
          onSelect={(t) => {
            setPreviewModalTemplate(null);
            onSelectTemplate(t);
          }}
          currentDocumentData={currentDocumentData}
        />
      )}

      {/* Comparison Modal */}
      <TemplateCompareModal
        templates={compareList}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectTemplate={(t) => {
          setIsCompareModalOpen(false);
          onSelectTemplate(t);
        }}
      />
    </div>
  );
};
