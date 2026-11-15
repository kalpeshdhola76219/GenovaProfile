import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumInternationalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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

  const primary = customization.primaryColor || '#1e3a8a';
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const displayFullName = personal.fullName || '';
  const displayTitle = personal.professionalTitle || '';
  const displayEmail = contact.email || '';
  const displayPhone = contact.phone || '';
  const displayLocation = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');
  const displayLinkedin = contact.linkedin || '';
  const displaySummary = summary || '';

  return (
    <div
      className={`document-page-sheet flex flex-col bg-white text-slate-800 shadow-sm ${baseFontSize}`}
    >
      {/* Header Banner */}
      <div
        className="p-8 text-white flex justify-between items-center"
        style={{ backgroundColor: primary }}
      >
        <div className="flex items-center gap-5">
          <div>
            <h1 className={`text-2xl font-extrabold uppercase tracking-wide text-white ${fontClass}`}>
              {displayFullName || 'FULL NAME'}
            </h1>
            {displayTitle && (
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest mt-0.5 no-justify">
                {displayTitle}
              </p>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-blue-100 space-y-1 no-justify">
          {displayEmail && <div>✉ {displayEmail}</div>}
          {displayPhone && <div>✆ {displayPhone}</div>}
          {displayLocation && (
            <div>📍 {displayLocation}</div>
          )}
          {displayLinkedin && <div>🔗 {displayLinkedin}</div>}
          {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[32%] bg-slate-50 p-6 border-r border-slate-200 space-y-6 no-justify">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Core Competencies
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((s) => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">{s.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{s.level || 'Expert'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Education & Degrees
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-600">{e.institute}</div>
                    <div className="text-[11px] text-slate-400">
                      {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Accreditations
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Honors & Awards
              </h2>
              <div className="space-y-2 text-xs">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    {a.description && <div className="text-slate-500 text-[11px]">{a.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className="w-[68%] p-7 space-y-6">
          {displaySummary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{displaySummary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primary }}>
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-sm text-slate-900">{exp.jobTitle}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
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
                      <div className="text-xs text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                        {exp.achievements}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Key Initiatives & Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((p) => (
                  <div key={p.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{p.name}</span>
                      {p.role && <span className="text-slate-500 text-[11px]">{p.role}</span>}
                    </div>
                    {p.technologies && <div className="text-[11px] text-slate-500">Tech: {p.technologies}</div>}
                    {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections.length > 0 && (
            <div className="space-y-4">
              {customSections.map((sec) => (
                <div key={sec.id}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    {sec.title}
                  </h2>
                  {sec.items ? (
                    <div className="space-y-1 text-xs">
                      {sec.items.map((it) => (
                        <div key={it.id}><strong>{it.key}:</strong> {it.value}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
