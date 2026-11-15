import React from 'react';
import { DocumentData } from '../../types/document';

export const ExecutiveResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const primary = customization.primaryColor || '#450a0a'; // Rich Burgundy / Charcoal

  return (
    <div
      className="document-page-sheet p-10 font-cormorant text-stone-900 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Executive Header */}
      <div className="text-center pb-5 border-b-2 border-stone-800 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-stone-900 font-cinzel">
          {personal.fullName || 'FULL NAME'}
        </h1>
        <p className="text-base font-semibold text-stone-700 tracking-wider mt-1 font-playfair italic">
          {personal.professionalTitle || 'Executive Leadership & Strategic Direction'}
        </p>
        <div className="text-xs font-sans text-stone-600 mt-2 flex justify-center gap-4 no-justify">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>&bull; {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && <span>&bull; {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>&bull; {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6 avoid-break bg-stone-50 p-4 border-l-4 border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel mb-1">
            Executive Profile
          </h2>
          <p className="text-sm leading-relaxed text-stone-800 font-cormorant">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-3">
            Career Experience & Leadership
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-stone-950 text-base">{exp.jobTitle} &bull; <span className="font-normal italic">{exp.company}</span></span>
                  <span className="text-xs font-sans text-stone-500">{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
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
                {exp.achievements && (
                  <div className="text-xs text-stone-800 mt-1 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-stone-200">
                    {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
            Strategic Programs & Key Initiatives
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>{p.name}</span>
                  {p.technologies && <span className="font-normal text-stone-500">{p.technologies}</span>}
                </div>
                {p.description && <p className="text-stone-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
              Education & Credentials
            </h2>
            <div className="space-y-2">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-stone-950 text-sm">{e.degree}</div>
                  <div className="text-xs text-stone-600">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
              Strategic Competencies
            </h2>
            <p className="text-xs text-stone-800 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' &bull; ')}
            </p>
          </div>
        )}
      </div>

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
            Board Positions, Honors & Patents
          </h2>
          <div className="text-xs space-y-1 text-stone-800">
            {certifications.map((c) => (
              <div key={c.id}>&bull; {c.name} &bull; {c.issuer}</div>
            ))}
            {achievements.map((a) => (
              <div key={a.id}>&bull; {a.title}: {a.description}</div>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
