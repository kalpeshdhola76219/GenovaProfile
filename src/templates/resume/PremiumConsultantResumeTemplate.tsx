import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  CONTACT_CENTER_ROW_STYLE,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumConsultantResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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

  const navy = customization.primaryColor || '#172554'; // Deep Oxford Navy
  const charcoal = customization.secondaryColor || '#334155'; // Clean Slate
  const fontClass = getStaticFontClass(customization.fontFamily, 'cormorant');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'cormorant');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-10 bg-white text-stone-900 shadow-sm ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}
    >
      <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: navy }}>
        <h1 className={`text-3xl font-extrabold uppercase tracking-widest text-slate-900 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
          {personal.fullName || 'STRATEGY CONSULTANT'}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-1 font-sans">
          {personal.professionalTitle || 'Engagement Manager | Management & Strategy Consulting'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-slate-600 font-sans no-justify" style={CONTACT_CENTER_ROW_STYLE}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && (
            <span>• {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>
          )}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>• {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Executive Summary & Advisory Focus
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-5 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Management Consulting & Advisory Engagements
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  wrapRight
                  leftClassName="font-bold text-sm text-slate-900"
                  left={
                    <>
                      {exp.company} • <span className="font-semibold text-slate-700">{exp.jobTitle}</span>
                    </>
                  }
                  rightClassName="text-xs text-slate-500 font-medium"
                  right={
                    <>
                      {exp.location ? `${exp.location} | ` : ''}
                      {exp.startDate} –{' '}
                      {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                        ? 'Present'
                        : exp.endDate || 'Present'}
                    </>
                  }
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1.5 pl-4 border-l-2 border-slate-300 space-y-1">
                    <ResumeDescriptionBlock
                      text={exp.achievements}
                      wrapperClassName="space-y-1 text-xs text-slate-800"
                      markerClassName="text-slate-500"
                      paragraphClassName="text-xs text-slate-800 whitespace-pre-line leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-5 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Education & Academic Honors
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} data-entry="true">
                <ResumeSplitRow
                  left={
                    <>
                      <span className="font-bold text-slate-900">{e.institute}</span>
                      <span className="text-slate-600"> — {e.degree}</span>
                    </>
                  }
                  rightClassName="text-slate-500"
                  right={
                    <>
                      {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-5 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Key Client Engagements & Strategic Programs
          </h2>
          <div className="space-y-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true">
                <ResumeSplitRow
                  className="font-bold text-slate-900"
                  wrapRight
                  left={p.name}
                  rightClassName="font-normal text-slate-500 text-[11px]"
                  right={p.technologies}
                />
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 avoid-break font-sans no-justify">
        {skills && skills.length > 0 && (
          <div className="no-justify">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Functional Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs no-justify">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Certifications & Affiliations
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <strong>{c.name}</strong> ({c.issuer})
                </div>
              ))}
              {achievements.map((a) => (
                <div key={a.id}>
                  <strong>{a.title}</strong>{a.description ? `: ${a.description}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections && customSections.length > 0 && (
        <div className="mt-5 space-y-4 avoid-break font-sans">
          {customSections.map((sec) => (
            <div key={sec.id} className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {sec.title}
              </h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id} className="py-0.5 border-b border-slate-100">
                      <ResumeSplitRow
                        wrapRight
                        leftClassName="text-slate-500 font-medium"
                        left={`${i.key}:`}
                        rightClassName="font-semibold text-slate-900"
                        right={i.value}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
