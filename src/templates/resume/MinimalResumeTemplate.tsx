import React from 'react';
import { DocumentData } from '../../types/document';

export const MinimalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="flex justify-between items-baseline border-b border-slate-200 pb-5 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest no-justify">
            {personal.professionalTitle || 'Software Engineer'}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-0.5 no-justify">
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {(contact.city || contact.state || contact.country) && <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>}
          {contact.linkedin && <div>{contact.linkedin}</div>}
          {(contact.portfolio || contact.website) && <div>{contact.portfolio || contact.website}</div>}
        </div>
      </div>

      {summary && (
        <div className="mb-6 avoid-break">
          <p className="text-xs leading-relaxed text-slate-600 max-w-2xl">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l border-slate-200">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-slate-900">{exp.jobTitle} <span className="text-slate-500 font-normal">at</span> {exp.company}</span>
                  <span className="text-[11px] text-slate-400">{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                </div>
                {exp.description && (
                  exp.description.includes('\n') || exp.description.trim().startsWith('-') || exp.description.trim().startsWith('•') ? (
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
                  )
                )}
                {exp.achievements && <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{exp.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mb-6 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-semibold text-slate-900">{e.degree}</div>
                  <div className="text-slate-500">{e.institute} • {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
            <p className="text-xs text-slate-700 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Projects</h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-semibold">
                  <span>{p.name}</span>
                  {p.link && <span className="text-slate-400 font-normal">{p.link}</span>}
                </div>
                <p className="text-slate-600 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Recognition</h2>
          <div className="text-xs text-slate-600 space-y-1">
            {certifications.map((c) => (
              <div key={c.id}>• {c.name} ({c.issuer})</div>
            ))}
            {achievements.map((a) => (
              <div key={a.id}>• {a.title}: {a.description}</div>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-slate-600">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
