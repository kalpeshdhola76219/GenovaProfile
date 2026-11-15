import React from 'react';
import { DocumentData } from '../../types/document';

export const ClassicResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  return (
    <div
      className="document-page-sheet p-10 font-cormorant text-stone-900 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="text-center pb-4 border-b border-stone-400 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-stone-900 font-cinzel">
          {personal.fullName || 'FULL NAME'}
        </h1>
        {personal.professionalTitle && (
          <p className="text-sm font-semibold tracking-wider text-stone-700 italic mt-0.5">{personal.professionalTitle}</p>
        )}
        <div className="text-xs font-sans text-stone-600 mt-1 flex justify-center gap-3 no-justify">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && <span>• {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>• {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-stone-800 text-justify">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>{exp.jobTitle}, <em>{exp.company}</em></span>
                  <span className="font-sans font-normal text-stone-500 text-[11px]">{exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                </div>
                {exp.description && (
                  exp.description.includes('\n') || exp.description.trim().startsWith('-') || exp.description.trim().startsWith('•') ? (
                    <div className="mt-1 space-y-1 text-xs text-stone-700">
                      {exp.description
                        .split('\n')
                        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
                        .filter(Boolean)
                        .map((line, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-stone-400 select-none">•</span>
                            <span>{line}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  )
                )}
                {exp.achievements && <p className="text-xs text-stone-700 mt-0.5 whitespace-pre-line pl-2 border-l border-stone-300">{exp.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="space-y-1 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold">{e.degree}</div>
                  <div className="text-stone-600 font-sans">{e.institute} • {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
              Skills
            </h2>
            <p className="text-xs text-stone-800 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Projects
          </h2>
          <div className="space-y-1 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-bold">
                  <span>{p.name}</span>
                  {p.link && <span className="font-sans font-normal text-stone-500">{p.link}</span>}
                </div>
                <p className="text-stone-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-stone-700 space-y-0.5">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><strong>{i.key}:</strong> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
