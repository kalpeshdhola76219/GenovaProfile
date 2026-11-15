import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumCreativeLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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
  const terracotta = customization.primaryColor || '#c2410c'; // Burnt Terracotta
  const darkCharcoal = customization.secondaryColor || '#1c1917'; // Warm Black
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-playfair';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-10 bg-[#faf8f5] text-stone-900 shadow-sm relative ${baseFontSize}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 pointer-events-none"
        style={{ backgroundColor: terracotta }}
      />

      <div className="pb-6 mb-6 border-b border-stone-300">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-700 block mb-1">
              Creative Portfolio & Resume
            </span>
            <h1 className={`text-4xl font-black tracking-tight text-stone-900 ${fontClass}`}>
              {personal.fullName || 'CREATIVE DIRECTOR'}
            </h1>
            <p className="text-sm font-semibold text-stone-600 mt-1 font-sans no-justify">
              {personal.professionalTitle || 'Design Lead & Product Experience Strategist'}
            </p>
          </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-xs font-sans text-stone-500 space-y-1 no-justify">
            {contact.email && <div>✉ {contact.email}</div>}
            {contact.phone && <div>✆ {contact.phone}</div>}
            {(contact.city || contact.state || contact.country) && <div>📍 {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>}
            {contact.linkedin && <div>🔗 {contact.linkedin}</div>}
            {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
          </div>
        </div>
        </div>
      </div>

      {summary && (
        <div className="mb-6 avoid-break bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs text-stone-700 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-8 space-y-6">
          {experience.length > 0 && (
            <section className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                Professional Experience
              </h2>
              <div className="space-y-4 font-sans">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-stone-900">{exp.jobTitle}</span>
                      <span className="text-xs text-stone-500">{exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                    </div>
                    <div className="text-xs font-semibold text-orange-800">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
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
                      <div className="text-xs text-stone-700 mt-1 pl-3 border-l-2 border-orange-300">
                        {exp.achievements}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                Featured Projects & Case Studies
              </h2>
              <div className="grid grid-cols-2 gap-3 font-sans">
                {projects.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                    <div className="font-bold text-xs text-stone-900">{p.name}</div>
                    {p.role && <div className="text-[11px] text-orange-700 font-medium">{p.role}</div>}
                    {p.description && <p className="text-[11.5px] text-stone-600 mt-1 line-clamp-3">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-6 font-sans no-justify">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Skills & Toolkit
              </h2>
              <div className="flex flex-wrap gap-1.5 no-justify">
                {skills.map((s) => (
                  <span key={s.id} className="px-2 py-0.5 rounded text-[11px] bg-orange-50 text-orange-900 border border-orange-200/60 font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-semibold text-stone-900">{e.degree}</div>
                    <div className="text-stone-500 text-[11.5px]">{e.institute} {e.endYear ? `(${e.endYear})` : ''}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Certifications
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-stone-900">{c.name}</div>
                    <div className="text-stone-500 text-[11.5px] flex flex-wrap justify-between items-baseline gap-1">
                      <span>{c.issuer}</span>
                      {c.issueDate && <span className="text-stone-400 font-mono text-[10.5px]">{c.issueDate}</span>}
                    </div>
                    {c.credentialId && (
                      <div className="text-[10px] text-stone-400 font-mono">ID: {c.credentialId}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievements && achievements.length > 0 && (
            <section className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Awards & Recognition
              </h2>
              <div className="space-y-2 text-xs text-stone-700">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <div className="font-semibold text-stone-900">{a.title}</div>
                    {a.description && <div className="text-stone-500 text-[11px]">{a.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {customSections && customSections.length > 0 && (
            <div className="space-y-6">
              {customSections.map((sec) => (
                <section key={sec.id} className="avoid-break">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                    {sec.title}
                  </h2>
                  {sec.items && sec.items.length > 0 ? (
                    <div className="space-y-1 text-xs">
                      {sec.items.map((i) => (
                        <div key={i.id} className="flex justify-between text-[11.5px]">
                          <span className="text-stone-500 font-medium">{i.key}:</span>
                          <span className="font-semibold text-stone-900">{i.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">{sec.content}</p>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
