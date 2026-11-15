import React from 'react';
import { DocumentData } from '../../types/document';

export const ITProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-jetbrains text-slate-900 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '11px' : customization.fontSize === 'lg' ? '14px' : '12px',
      }}
    >
      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            {personal.fullName || 'FULL NAME'}
          </h1>
          <p className="text-xs text-indigo-700 font-bold mt-0.5 font-sans no-justify">
            {personal.professionalTitle || 'Senior Software Engineer / DevOps Architect'}
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-600 no-justify">
          <div>{contact.email} | {contact.phone}</div>
          <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')} {contact.linkedin ? `| ${contact.linkedin}` : ''} {(contact.portfolio || contact.website) ? `| ${contact.portfolio || contact.website}` : ''}</div>
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs leading-relaxed text-slate-800">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Tech Stack & Tooling
          </h2>
          <div className="flex flex-wrap gap-1.5 no-justify">
            {skills.map((s) => (
              <span key={s.id} className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Work History
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>{exp.jobTitle} @ {exp.company}</span>
                  <span className="text-slate-500 font-normal text-[11px]">{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
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
                {exp.achievements && (
                  <div className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-indigo-400">
                    {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Engineering Projects & Repositories
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold">
                  <span>{proj.name}</span>
                  {proj.link && <span className="text-indigo-600 font-normal">{proj.link}</span>}
                </div>
                {proj.technologies && <div className="text-[11px] text-slate-500">[{proj.technologies}]</div>}
                <p className="text-slate-700 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-3 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">
              // Education
            </h2>
            <div className="space-y-1 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold">{e.degree}</div>
                  <div className="text-slate-500">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">
              // Certifications
            </h2>
            <div className="text-xs space-y-1 text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>&bull; {c.name} ({c.issuer})</div>
              ))}
              {achievements.map((a) => (
                <div key={a.id}>&bull; {a.title}: {a.description}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">// {sec.title}</h2>
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
