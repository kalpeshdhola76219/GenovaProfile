import React from 'react';
import { TemplateMetadata } from '../../types/document';
import { TemplatePreview } from './TemplatePreview';
import { X, Check, ArrowRight, ShieldCheck, Camera, Sparkles } from 'lucide-react';

interface TemplateCompareModalProps {
  templates: TemplateMetadata[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateMetadata) => void;
}

export const TemplateCompareModal: React.FC<TemplateCompareModalProps> = ({
  templates,
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen || templates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Compare Templates</h3>
            <p className="text-xs text-slate-500">
              Comparing {templates.length} selected template{templates.length > 1 ? 's' : ''} side-by-side
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={`grid gap-4 sm:gap-6 ${templates.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : templates.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
            {templates.map((tpl) => (
              <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  {/* Miniature Component Preview */}
                  <div className="relative aspect-[210/297] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3 shadow-2xs">
                    <TemplatePreview template={tpl} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider capitalize">
                        {tpl.category}
                      </span>
                      {tpl.priceINR > 0 ? (
                        <span className="text-[10px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                          ₹{tpl.priceINR}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Free (₹0)
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{tpl.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tpl.description}</p>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Document Type</span>
                      <span className="font-semibold text-slate-800 capitalize">{tpl.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-50">
                      <span className="text-slate-500">Layout Structure</span>
                      <span className="font-semibold text-slate-800 capitalize">{tpl.layout.replace('-', ' ')}</span>
                    </div>
                    {tpl.type !== 'cover-letter' && (
                      <div className="flex items-center justify-between py-1 border-t border-slate-50">
                        <span className="text-slate-500">Photo Support</span>
                        <span className="font-semibold text-slate-800 inline-flex items-center gap-1">
                          {tpl.supportsPhoto ? (
                            <>
                              <Camera className="w-3.5 h-3.5 text-indigo-600" /> Supported
                            </>
                          ) : (
                            <span className="text-slate-400">No Photo</span>
                          )}
                        </span>
                      </div>
                    )}
                    {(tpl.type === 'resume' || tpl.type === 'cover-letter') && (
                      <div className="flex items-center justify-between py-1 border-t border-slate-50">
                        <span className="text-slate-500">ATS Optimization</span>
                        <span className="font-semibold inline-flex items-center gap-1">
                          {tpl.isATS ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold text-[10px]">
                              ATS-Friendly
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px] font-semibold">
                              {tpl.type === 'cover-letter' ? 'Normal Layout' : 'Visual Layout'}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  className="w-full py-2.5 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-[#0055D6] transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
