import React, { useState } from 'react';
import { DocumentData } from '../../types/document';
import { analyzeResumeATS, ATSAnalysisResult } from '../../services/atsAnalyzer';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
} from 'lucide-react';

interface ATSCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentData;
  onApplyRecommendation?: (rec: string) => void;
}

export const ATSCheckerModal: React.FC<ATSCheckerModalProps> = ({
  isOpen,
  onClose,
  documentData,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult>(() =>
    analyzeResumeATS(documentData)
  );

  if (!isOpen) return null;

  const handleReanalyze = () => {
    setAnalysis(analyzeResumeATS(documentData, jobDescription));
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-indigo-600 border-indigo-500 bg-indigo-50';
    if (score >= 50) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ATS-Friendly Scanner
            </span>
            <span className="text-slate-400 text-xs">• Real Algorithmic Analysis</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h2 className="text-xl font-black tracking-tight">Resume ATS Score & Audit</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Evaluates parseability, section hierarchy, quantifiable impact, and recruiter visibility.
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-2xl border-2 flex items-center gap-2.5 shrink-0 ${getScoreColor(
                analysis.overallScore
              )}`}
            >
              <div className="text-2xl font-black">{analysis.overallScore}</div>
              <div className="text-[10px] leading-tight text-slate-700 font-bold uppercase">
                <div>/ 100</div>
                <div className="font-extrabold">{analysis.rating}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-600" />
                Optional: Compare with Job Description
              </span>
              <span className="text-[10px] text-slate-400">Keyword Scanner</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job requirements / description here to check keyword matching..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-white"
            />
            {jobDescription && (
              <button
                type="button"
                onClick={handleReanalyze}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Scan Job Keywords
              </button>
            )}
            {analysis.matchedKeywords.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-emerald-800 block">Matched Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedKeywords.map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold"
                    >
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {analysis.recommendations.length > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Top Priority Fixes ({analysis.recommendations.length}):
              </span>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Great job! Your resume passes all fundamental ATS parseability requirements.</span>
            </div>
          )}

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Detailed Section Audit
            </span>
            <div className="space-y-2.5">
              {analysis.checks.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {c.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                      {c.title}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700">
                      {c.score} / {c.maxScore} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5.5 leading-relaxed">{c.detail}</p>
                  {c.fixSuggestion && (
                    <div className="ml-5.5 text-[11px] text-indigo-700 font-medium bg-indigo-50/80 p-2 rounded-lg">
                      💡 Fix Tip: {c.fixSuggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
