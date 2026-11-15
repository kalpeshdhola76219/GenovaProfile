import React from 'react';
import { DocumentData } from '../../types/document';

export const FreshGraduateResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const primary = customization.primaryColor || '#1d4ed8'; // Royal Blue

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="text-center pb-4 border-b border-slate-200 mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {personal.fullName || 'FULL NAME'}
        </h1>
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mt-0.5">
          {personal.professionalTitle || 'Graduate Candidate'}
        </p>
        <div className="text-xs text-slate-500 mt-1 flex justify-center gap-3 no-justify">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>&bull; {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && <span>&bull; {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>&bull; {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Career Objective
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education First for fresh graduates */}
      {education.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Education & Academic Background
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{e.degree} &bull; {e.institute}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</span>
                  <span className="text-slate-500 font-normal">{e.endYear}</span>
                </div>
                {e.description && <p className="text-slate-600 mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Spotlight */}
      {projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Academic & Capstone Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-bold">
                  <span>{p.name}</span>
                  {p.link && <span className="text-blue-700 font-normal">{p.link}</span>}
                </div>
                {p.technologies && <div className="text-[11px] text-slate-500 italic">Tools: {p.technologies}</div>}
                <p className="text-slate-700 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Technical & Soft Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 no-justify">
            {skills.map((s) => (
              <span key={s.id} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Internship & Experience if any */}
      {experience.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Internships & Work Experience
          </h2>
          <div className="space-y-2 text-xs">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{exp.jobTitle} at {exp.company}</span>
                  <span className="text-slate-500 font-normal">{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
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
                {exp.achievements && <p className="text-slate-600 mt-0.5 whitespace-pre-line">{exp.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-slate-700 space-y-0.5">
            {certifications.map((c) => (
              <div key={c.id}>&bull; {c.name} ({c.issuer})</div>
            ))}
            {achievements.map((a) => (
              <div key={a.id}>&bull; {a.title}: {a.description}</div>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1">{sec.title}</h2>
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
