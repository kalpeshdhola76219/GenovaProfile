import React, { useMemo, useState } from 'react';
import { DocumentData } from '../../types/document';
import { getTemplatesByType } from '../../templates/registry';
import { Check, ShieldCheck, SlidersHorizontal, LayoutTemplate } from 'lucide-react';

interface CoverLetterCustomizerProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
  onClose?: () => void;
}

const PRESET_COLORS = [
  '#0f172a',
  '#1e3a8a',
  '#0284c7',
  '#064e3b',
  '#9a3412',
  '#312e81',
  '#1c1917',
];

export const CoverLetterCustomizer: React.FC<CoverLetterCustomizerProps> = ({
  data,
  onChange,
  onClose,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'ats' | 'normal'>('all');

  const allCoverLetterTemplates = useMemo(() => getTemplatesByType('cover-letter'), []);
  const atsTemplates = useMemo(
    () => allCoverLetterTemplates.filter((t) => t.isATS),
    [allCoverLetterTemplates]
  );
  const normalTemplates = useMemo(
    () => allCoverLetterTemplates.filter((t) => !t.isATS),
    [allCoverLetterTemplates]
  );

  const visibleTemplates =
    filterMode === 'ats'
      ? atsTemplates
      : filterMode === 'normal'
      ? normalTemplates
      : allCoverLetterTemplates;

  const updateCustomization = (field: string, value: string | boolean) => {
    onChange({
      ...data,
      customization: {
        ...data.customization,
        [field]: value,
      },
    });
  };

  const switchTemplate = (templateId: string) => {
    onChange({
      ...data,
      templateId,
    });
  };

  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-5 space-y-5 text-xs animate-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
          <h3 className="font-bold text-slate-900 text-sm">Cover Letter Templates & Styling</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#0055D6] active:bg-[#0044AD] text-white font-bold shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Done</span>
          </button>
        )}
      </div>

      {/* Template Switcher with All / ATS-Friendly / Normal Filter */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Switch Template (Your text stays intact)
          </label>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`min-h-[40px] px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              All ({allCoverLetterTemplates.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('ats')}
              className={`min-h-[40px] px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all inline-flex items-center gap-1 ${
                filterMode === 'ats' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>ATS-Friendly ({atsTemplates.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('normal')}
              className={`min-h-[40px] px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all inline-flex items-center gap-1 ${
                filterMode === 'normal' ? 'bg-[#0066FF] text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              <LayoutTemplate className="w-3 h-3" />
              <span>Normal ({normalTemplates.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
          {visibleTemplates.map((t) => {
            const isActive = data.templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => switchTemplate(t.id)}
                className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                  isActive
                    ? 'border-[#0066FF] bg-blue-50/50 ring-1 ring-[#0066FF]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: t.primaryColorSample }}
                    />
                    <span className="font-bold text-slate-900 truncate">{t.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className={t.isATS ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                      {t.isATS ? 'ATS-Friendly' : t.category}
                    </span>
                    <span>&middot;</span>
                    <span className="font-semibold text-slate-700">
                      {t.priceINR > 0 ? `₹${t.priceINR}` : 'Free'}
                    </span>
                  </div>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
          Accent Color (Normal & Accent Rules)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((color) => {
            const selected = data.customization.primaryColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => updateCustomization('primaryColor', color)}
                className="w-7 h-7 rounded-md border transition-transform hover:scale-105 flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: color,
                  borderColor: selected ? '#0f172a' : 'transparent',
                  outline: selected ? '2px solid #0066FF' : 'none',
                }}
              >
                {selected && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </button>
            );
          })}
          <div className="flex items-center gap-1.5 ml-1 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 min-h-[40px]">
            <input
              type="color"
              value={data.customization.primaryColor || '#0f172a'}
              onChange={(e) => updateCustomization('primaryColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-[10px] font-mono text-slate-600">Custom</span>
          </div>
        </div>
      </div>

      {/* Typography & Spacing Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
            Font Family
          </label>
          <select
            value={data.customization.fontFamily || 'jakarta'}
            onChange={(e) => updateCustomization('fontFamily', e.target.value)}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium text-slate-800"
          >
            <option value="jakarta">Plus Jakarta Sans</option>
            <option value="sans">Clean Corporate Sans</option>
            <option value="playfair">Playfair Display (Serif)</option>
            <option value="cormorant">Cormorant Garamond</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
            Text Size
          </label>
          <select
            value={data.customization.fontSize || 'base'}
            onChange={(e) => updateCustomization('fontSize', e.target.value)}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium text-slate-800"
          >
            <option value="sm">Compact</option>
            <option value="base">Standard</option>
            <option value="lg">Spacious</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
            Page Margins
          </label>
          <select
            value={data.customization.margins || 'normal'}
            onChange={(e) => updateCustomization('margins', e.target.value)}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium text-slate-800"
          >
            <option value="compact">Compact</option>
            <option value="normal">Standard</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>

      {/* Name Style, Handwritten Signature & Justify Controls */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
            Name Style (Header &amp; Signature)
          </label>
          <select
            value={data.customization.nameStyle || 'as-typed'}
            onChange={(e) => updateCustomization('nameStyle', e.target.value)}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium text-slate-800"
          >
            <option value="as-typed">As typed</option>
            <option value="title-case">Title Case</option>
            <option value="uppercase">UPPERCASE</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="inline-flex items-center gap-2.5 min-h-[40px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(data.customization.handwrittenSignature)}
              onChange={(e) => updateCustomization('handwrittenSignature', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
            />
            <span className="font-bold text-slate-800 text-[11px]">Handwritten style signature</span>
          </label>
        </div>
      </div>

    </div>
  );
};
