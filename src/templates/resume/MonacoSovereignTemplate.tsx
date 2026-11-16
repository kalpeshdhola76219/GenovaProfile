import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  METADATA_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  ResumeDescriptionBlock,
} from './resumeTemplateUtils';

export const MonacoSovereignTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const {
    personal,
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    customSections,
    customization,
    executiveMetrics,
    showExecutiveMetrics,
  } = data;
  const primary = customization.primaryColor || '#0a0a0c'; // Sovereign Obsidian
  const gold = customization.accentColor || '#c5a059';    // Monaco Champagne Gold

  // Executive Scorecard Metrics (user editable with Monaco Sovereign defaults)
  const metricsToDisplay =
    executiveMetrics && executiveMetrics.length > 0
      ? executiveMetrics
      : [
          { id: 'm1', value: '12+', label: 'Years Experience' },
          { id: 'm2', value: '$180M+', label: 'Portfolio Managed' },
          { id: 'm3', value: '18', label: 'Global Markets' },
          { id: 'm4', value: '99.99%', label: 'Delivery Rigor' },
        ];

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-[#fdfdfd] relative"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Top Luxury Gold Accent Hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mb-6"></div>

      {/* Hero Header */}
      <div className="flex justify-between items-start border-b border-slate-200/80 pb-6 mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', columnGap: '16px' }}>
        <div style={METADATA_LEFT_STYLE}>
          <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#c5a059] block mb-1">
            Global Leadership Dossier
          </span>
          <h1 className="text-3xl font-black tracking-tight uppercase font-cinzel" style={{ color: primary, fontFamily: FONT_FAMILY_CSS_MAP.cinzel }}>
            {personal.fullName || 'ALEXANDER STERLING'}
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-1 tracking-wide font-playfair italic text-sm no-justify" style={{ fontFamily: FONT_FAMILY_CSS_MAP.playfair }}>
            {personal.professionalTitle || 'Chief Strategy Officer • Cross-Border Enterprise Architect'}
          </p>
        </div>

        {/* Global Coordinates */}
        <div className="text-right text-xs text-slate-500 space-y-1 shrink-0 font-sans no-justify">
          {contact.email && <div className="font-medium text-slate-800">{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          <div>
            {[contact.city, contact.state, contact.country].filter(Boolean).join(' • ') || 'London • New York • Singapore'}
          </div>
          {contact.linkedin && <div className="text-[#c5a059] font-medium">{contact.linkedin}</div>}
          {(contact.portfolio || contact.website) && <div className="text-[#c5a059]">{contact.portfolio || contact.website}</div>}
        </div>
      </div>

      {/* Executive Scorecard Metric Strip */}
      {showExecutiveMetrics !== false && metricsToDisplay.length > 0 && (
        <div
          className="grid gap-3 bg-slate-900 text-white rounded-xl p-4 mb-6 shadow-sm avoid-break"
          style={{
            gridTemplateColumns: `repeat(${metricsToDisplay.length}, minmax(0, 1fr))`,
          }}
        >
          {metricsToDisplay.map((metric, idx) => (
            <div
              key={metric.id || idx}
              className={`text-center ${idx < metricsToDisplay.length - 1 ? 'border-r border-slate-800' : ''} px-2`}
            >
              <div className="text-lg font-black text-[#c5a059] tracking-tight">{metric.value}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 leading-tight">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Executive Summary */}
      {summary && (
        <div className="mb-6 avoid-break bg-amber-50/30 border-l-2 border-[#c5a059] p-4 rounded-r-xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] mb-1.5 font-sans">
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Work History & Leadership (8 cols) */}
        <div className="col-span-8 space-y-6">
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between" style={{ color: primary }}>
                <span>Executive Experience</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} data-entry="true" className="relative pl-3 border-l border-slate-200 avoid-break">
                    <div className="flex justify-between items-baseline" style={METADATA_ROW_STYLE}>
                      <span className="font-extrabold text-slate-900 text-xs" style={METADATA_LEFT_STYLE}>{exp.jobTitle}</span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono" style={METADATA_RIGHT_STYLE}>
                        {exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#c5a059] mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <ResumeDescriptionBlock
                      text={exp.description}
                      wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                      markerClassName="text-slate-400"
                      paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                    />
                    {exp.achievements && (
                      <div className="text-xs text-slate-700 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                        <ResumeDescriptionBlock
                          text={exp.achievements}
                          wrapperClassName="space-y-1 text-xs text-slate-700"
                          markerClassName="text-slate-500"
                          paragraphClassName="text-xs text-slate-700 whitespace-pre-line leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Projects / Engagements */}
          {projects.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between" style={{ color: primary }}>
                <span>Key Engagements & Board Advisory</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
              </h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} data-entry="true" className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900" style={METADATA_ROW_STYLE}>
                      <span style={METADATA_LEFT_STYLE}>{p.name}</span>
                      {p.link && <span className="text-[#c5a059] font-normal text-[11px]" style={METADATA_RIGHT_STYLE}>{p.link}</span>}
                    </div>
                    {p.technologies && <div className="text-[10px] text-slate-400 italic">Domain: {p.technologies}</div>}
                    <p className="text-slate-600 mt-0.5">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Strategic Toolkit & Credentials (4 cols) */}
        <div className="col-span-4 space-y-6 no-justify">
          {skills.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3" style={{ color: primary }}>
                Strategic Toolkit
              </h2>
              <div className="flex flex-wrap gap-1.5 no-justify">
                {skills.map((s) => (
                  <span key={s.id} className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200/80 px-2.5 py-1 rounded-md font-semibold">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3" style={{ color: primary }}>
                Academic Pedigree
              </h2>
              <div className="space-y-2.5 text-xs">
                {education.map((e) => (
                  <div key={e.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-600 text-[11px]">{e.institute}</div>
                    <div className="text-slate-400 text-[10px] font-mono mt-0.5">{e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3" style={{ color: primary }}>
                Credentials
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id} className="text-[11px]">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-500 block text-[10px]">{c.issuer} ({c.issueDate || 'Active'})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id} className="avoid-break">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-2" style={{ color: primary }}>
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="space-y-1 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id} className="flex justify-between text-[11px]" style={METADATA_ROW_STYLE}>
                      <span className="text-slate-500 font-medium" style={METADATA_LEFT_STYLE}>{i.key}:</span>
                      <span className="font-semibold text-slate-800" style={METADATA_RIGHT_STYLE}>{i.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
