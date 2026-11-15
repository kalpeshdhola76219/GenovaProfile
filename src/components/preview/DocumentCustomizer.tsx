import React from 'react';
import { DocumentData } from '../../types/document';
import { getTemplatesByType, templateSupportsPhoto } from '../../templates/registry';
import { Check, SlidersHorizontal } from 'lucide-react';

interface DocumentCustomizerProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
  onClose?: () => void;
}

const PRESET_COLORS = [
  '#0f172a', // Slate 900
  '#1e3a8a', // Deep Blue
  '#0369a1', // Sky 700
  '#065f46', // Emerald 800
  '#991b1b', // Traditional Maroon
  '#c2410c', // Terracotta Saffron
  '#701a75', // Wine Fuchsia
  '#450a0a', // Deep Burgundy
  '#1c1917', // Neutral Stone
];

export const DocumentCustomizer: React.FC<DocumentCustomizerProps> = ({ data, onChange, onClose }) => {
  const currentTemplates = getTemplatesByType(data.type);

  const updateCustomization = (field: string, value: any) => {
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
    <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-5 space-y-5 text-xs animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Design & Template Customizer</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-semibold px-2 py-0.5 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            Done
          </button>
        )}
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
          Active Template (Data is Preserved 100%)
        </label>
        <select
          value={data.templateId}
          onChange={(e) => switchTemplate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
        >
          {currentTemplates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} {t.isATS ? '(ATS Friendly)' : ''} {t.priceINR > 0 ? `(₹${t.priceINR})` : '(Free)'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
          Accent / Theme Color
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateCustomization('primaryColor', color)}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center shadow-xs cursor-pointer"
              style={{
                backgroundColor: color,
                borderColor: data.customization.primaryColor === color ? '#ffffff' : 'transparent',
                outline: data.customization.primaryColor === color ? '2px solid #6366f1' : 'none',
              }}
            >
              {data.customization.primaryColor === color && (
                <Check className="w-3 h-3 text-white stroke-[3]" />
              )}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
            Font Family
          </label>
          <select
            value={data.customization.fontFamily}
            onChange={(e) => updateCustomization('fontFamily', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium text-slate-800"
          >
            {data.type === 'biodata' ? (
              <>
                <option value="playfair">Royal Heritage (Playfair Display + Jakarta Sans)</option>
                <option value="jakarta">Modern Executive (Plus Jakarta Sans — Clean & Crisp)</option>
                <option value="cinzel">Auspicious Vedic (Cinzel / Rozha Headings + Jakarta Body)</option>
                <option value="cormorant">Classic Regal (Cormorant Display + Crisp Body)</option>
              </>
            ) : (
              <>
                <option value="jakarta">Plus Jakarta Sans (Modern Executive)</option>
                <option value="playfair">Playfair Display (Editorial Serif)</option>
                <option value="cormorant">Cormorant Garamond (Classic Regal)</option>
                <option value="cinzel">Cinzel (Formal & Auspicious)</option>
                <option value="inter">Inter (Clean Corporate)</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
            Base Text Size
          </label>
          <select
            value={data.customization.fontSize}
            onChange={(e) => updateCustomization('fontSize', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
          >
            <option value="sm">Compact (Fits More Content)</option>
            <option value="base">Standard (Balanced)</option>
            <option value="lg">Spacious (High Legibility)</option>
          </select>
        </div>
      </div>

      {templateSupportsPhoto(data.templateId, data.type) && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
          <div>
            <span className="font-semibold text-slate-800 block">Display Profile Photo</span>
            <span className="text-[10px] text-slate-500">Toggle photo in templates that support photo layouts.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.customization.showPhoto !== false}
              onChange={(e) => updateCustomization('showPhoto', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      )}
    </div>
  );
};
