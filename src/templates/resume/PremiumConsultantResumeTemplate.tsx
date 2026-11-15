import React from 'react';
import { DocumentData } from '../../types/document';

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
  } = data;

  const navy = customization.primaryColor || '#172554'; // Deep Oxford Navy
  const charcoal = customization.secondaryColor || '#334155'; // Clean Slate
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-10 bg-white text-stone-900 shadow-sm ${baseFontSize}`}
    >
      <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: navy }}>
        <h1 className={`text-3xl font-extrabold uppercase tracking-widest text-slate-900 ${fontClass}`}>
          {personal.fullName || 'STRATEGY CONSULTANT'}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-1 font-sans">
          {personal.professionalTitle || 'Engagement Manager | Management & Strategy Consulting'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-slate-600 font-sans no-justify">
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
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900">
                    {exp.company} • <span className="font-semibold text-slate-700">{exp.jobTitle}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.location ? `${exp.location} | ` : ''}
                    {exp.startDate} –{' '}
                    {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                      ? 'Present'
                      : exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description &&
                  (exp.description.includes('\n') ||
                  exp.description.trim().startsWith('-') ||
                  exp.description.trim().startsWith('•') ? (
                    <div className="mt-1 space-y-1 text-xs text-slate-700">
                      {exp.description
                        .split('\n')
                        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
                        .filter(Boolean)
                        .map((line, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-slate-400 select-none">•</span>
                            <span>{line}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  ))}
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1.5 pl-4 border-l-2 border-slate-300 space-y-1">
                    {exp.achievements.split('\n').map((line, idx) => (
                      <p key={idx} className="leading-relaxed">{line}</p>
                    ))}
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
              <div key={e.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{e.institute}</span>
                  <span className="text-slate-600"> — {e.degree}</span>
                </div>
                <div className="text-slate-500">
                  {e.endYear}
                  {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                </div>
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
              <div key={p.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.name}</span>
                  {p.technologies && <span className="font-normal text-slate-500 text-[11px]">{p.technologies}</span>}
                </div>
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
                    <div key={i.id} className="flex justify-between items-baseline py-0.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">{i.key}:</span>
                      <span className="font-semibold text-slate-900">{i.value}</span>
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
