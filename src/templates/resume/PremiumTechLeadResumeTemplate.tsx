import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  HEADER_LEFT_STYLE,
  HEADER_RIGHT_STYLE,
  HEADER_ROW_STYLE,
  METADATA_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  METADATA_WIDE_RIGHT_STYLE,
  ResumeDescriptionBlock,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumTechLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const {
    personal,
    contact,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    customSections = [],
    customization,
  } = sanitizeDocumentTextFields(data);

  const techIndigo = customization.primaryColor || '#312e81'; // Deep Silicon Indigo
  const cyanCode = customization.secondaryColor || '#0284c7'; // Code Cyan
  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[14.5px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-9 bg-white text-slate-900 shadow-sm ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.jakarta }}
    >
      {/* Header */}
      <div className="pb-5 mb-5 border-b-2 border-slate-900" style={HEADER_ROW_STYLE}>
        <div style={HEADER_LEFT_STYLE}>
          <h1 className={`text-3xl font-black uppercase tracking-tight text-slate-950 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
            {personal.fullName || 'ENGINEERING ARCHITECT'}
          </h1>
          <p className="text-sm font-semibold text-indigo-900 font-mono mt-0.5 no-justify">
            {personal.professionalTitle || 'Staff Software Engineer & Distributed Systems Lead'}
          </p>
        </div>
        <div className="text-right text-xs font-mono text-slate-600 space-y-0.5 no-justify" style={HEADER_RIGHT_STYLE}>
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {(contact.portfolio || contact.website || contact.github) && (
            <div className="text-indigo-600 font-semibold">{contact.portfolio || contact.website || contact.github}</div>
          )}
          {contact.linkedin && <div>{contact.linkedin}</div>}
          {(contact.city || contact.state || contact.country) && (
            <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5 avoid-break bg-slate-50 p-3.5 rounded border border-slate-200">
          <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5 avoid-break no-justify">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
            // Core Technical Proficiencies & Infrastructure
          </h2>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs no-justify">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded font-medium"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200 font-mono">
            // Engineering Experience & Architectural Impact
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <div style={METADATA_ROW_STYLE}>
                  <span className="font-bold text-sm text-slate-950" style={METADATA_LEFT_STYLE}>
                    {exp.jobTitle} <span className="font-normal text-slate-400">@</span>{' '}
                    <span className="text-indigo-900 font-semibold">{exp.company}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500" style={METADATA_RIGHT_STYLE}>
                    {exp.startDate} –{' '}
                    {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                      ? 'Present'
                      : exp.endDate || 'Present'}
                  </span>
                </div>
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1 pl-3 border-l-2 border-indigo-400 whitespace-pre-line leading-relaxed">
                    <ResumeDescriptionBlock
                      text={exp.achievements}
                      wrapperClassName="space-y-1 text-xs text-slate-800"
                      markerClassName="text-indigo-400"
                      paragraphClassName="text-xs text-slate-800 whitespace-pre-line leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 pb-1 border-b border-slate-200 font-mono">
            // Key Systems & Open Source Projects
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 font-mono">{p.name}</div>
                {p.technologies && <div className="text-[11px] text-indigo-700 font-mono mt-0.5">{p.technologies}</div>}
                {p.description && <p className="text-slate-600 text-[11.5px] mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      {(education.length > 0 || certifications.length > 0) && (
        <div className="grid grid-cols-2 gap-6 avoid-break pt-2 border-t border-slate-200 mb-5 no-justify">
          {education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                // Education
              </h2>
              <div className="space-y-1.5 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-500">
                      {e.institute} • {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                // Cloud & Security Accreditations
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <strong className="text-slate-900">{c.name}</strong>
                    <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone Achievements / Accolades */}
      {achievements && achievements.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 pb-1 border-b border-slate-200 font-mono">
            // Key Accolades & Milestones
          </h2>
          <div className="space-y-1.5 text-xs">
            {achievements.map((a) => (
              <div key={a.id} style={METADATA_ROW_STYLE}>
                <div style={METADATA_LEFT_STYLE}>
                  <span className="font-semibold text-slate-900">{a.title}</span>
                  {a.description && <span className="text-slate-600 ml-1.5">— {a.description}</span>}
                </div>
                {a.date && <div className="text-xs font-mono text-slate-500" style={METADATA_RIGHT_STYLE}>{a.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4 mb-2 avoid-break">
          {customSections.map((sec) => (
            <div key={sec.id} className="avoid-break">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 pb-1 border-b border-slate-200 font-mono">
                // {sec.title ? sec.title.toUpperCase() : 'ADDITIONAL DETAILS'}
              </h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id} className="py-0.5 border-b border-slate-100 font-mono" style={METADATA_ROW_STYLE}>
                      <span className="text-slate-500 text-[11px]" style={METADATA_LEFT_STYLE}>{i.key}:</span>
                      <span className="font-medium text-slate-900" style={METADATA_WIDE_RIGHT_STYLE}>{i.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
