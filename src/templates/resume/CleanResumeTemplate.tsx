import React from 'react';
import { DocumentData } from '../../types/document';

export const CleanResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="flex justify-between items-end border-b pb-4 mb-5 border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5 no-justify">
            {personal.professionalTitle || 'Software Engineer'}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 no-justify">
          <div>{contact.email} {contact.phone ? `• ${contact.phone}` : ''}</div>
          <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')} {contact.linkedin ? `• ${contact.linkedin}` : ''} {(contact.portfolio || contact.website) ? `• ${contact.portfolio || contact.website}` : ''}</div>
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break">
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2.5">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.jobTitle}, {exp.company}</span>
                  <span className="text-slate-500 text-[11px]">{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
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
                {exp.achievements && <p className="text-xs text-slate-600 mt-0.5 whitespace-pre-line">{exp.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold">{e.degree}</div>
                  <div className="text-slate-500">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
              Skills
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Projects
          </h2>
          <div className="space-y-1.5 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-bold">
                  <span>{p.name}</span>
                  {p.link && <span className="font-normal text-slate-500">{p.link}</span>}
                </div>
                <p className="text-slate-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-slate-700 space-y-0.5">
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
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><strong>{i.key}:</strong> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
