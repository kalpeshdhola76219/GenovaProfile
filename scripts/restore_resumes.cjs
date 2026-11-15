const fs = require('fs');
const path = require('path');

function save(file, content) {
  const p = path.resolve(file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log('Wrote:', file);
}

// 1. ClassicResumeTemplate.tsx
save('src/templates/resume/ClassicResumeTemplate.tsx', `import React from 'react';
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
        <div className="text-xs font-sans text-stone-600 mt-1 flex justify-center gap-3">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.city && <span>• {contact.city}, {contact.state}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
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
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>{exp.jobTitle}, <em>{exp.company}</em></span>
                  <span className="font-sans font-normal text-stone-500 text-[11px]">{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-xs text-stone-700 mt-0.5">{exp.description}</p>}
                {exp.achievements && <p className="text-xs text-stone-700 mt-0.5 whitespace-pre-line pl-2 border-l border-stone-300">{exp.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-4">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="space-y-1 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold">{e.degree}</div>
                  <div className="text-stone-600 font-sans">{e.institute} • {e.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
              Skills
            </h2>
            <p className="text-xs text-stone-800 leading-relaxed">
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
`);

// 2. PremiumConsultantResumeTemplate.tsx
save('src/templates/resume/PremiumConsultantResumeTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumConsultantResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const navy = customization.primaryColor || '#172554'; // Deep Oxford Navy
  const charcoal = customization.secondaryColor || '#334155'; // Clean Slate
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={\`document-page-sheet p-10 bg-white text-stone-900 shadow-sm \${baseFontSize}\`}
    >
      <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: navy }}>
        <h1 className={\`text-3xl font-extrabold uppercase tracking-widest text-slate-900 \${fontClass}\`}>
          {personal.fullName || 'STRATEGY CONSULTANT'}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-1 font-sans">
          {personal.professionalTitle || 'Engagement Manager | Management & Strategy Consulting'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-slate-600 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.city && <span>• {contact.city}{contact.state ? \`, \${contact.state}\` : ''}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
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

      {experience.length > 0 && (
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
                    {exp.location ? \`\${exp.location} | \` : ''}{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-slate-700 mt-1">{exp.description}</p>}
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1.5 pl-4 border-l-2 border-slate-300 space-y-1">
                    {exp.achievements.split('\\n').map((line, idx) => (
                      <p key={idx} className="leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
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
                <div className="text-slate-500">{e.endYear} {e.score ? \`• \${e.score}\` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 avoid-break font-sans">
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Functional Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
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
                  <strong>{a.title}</strong>: {a.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`);

// 3. PremiumCreativeLeadResumeTemplate.tsx
save('src/templates/resume/PremiumCreativeLeadResumeTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumCreativeLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const terracotta = customization.primaryColor || '#c2410c'; // Burnt Terracotta
  const darkCharcoal = customization.secondaryColor || '#1c1917'; // Warm Black
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-playfair';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={\`document-page-sheet p-10 bg-[#faf8f5] text-stone-900 shadow-sm relative \${baseFontSize}\`}
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
            <h1 className={\`text-4xl font-black tracking-tight text-stone-900 \${fontClass}\`}>
              {personal.fullName || 'CREATIVE DIRECTOR'}
            </h1>
            <p className="text-sm font-semibold text-stone-600 mt-1 font-sans">
              {personal.professionalTitle || 'Design Lead & Product Experience Strategist'}
            </p>
          </div>
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-stone-300 shadow-sm shrink-0">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-right text-xs font-sans text-stone-500 space-y-1">
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.city && <div>📍 {contact.city}{contact.state ? \`, \${contact.state}\` : ''}</div>}
              {contact.linkedin && <div>🔗 {contact.linkedin}</div>}
            </div>
          )}
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
                      <span className="text-xs text-stone-500">{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-xs font-semibold text-orange-800">{exp.company} {exp.location ? \`• \${exp.location}\` : ''}</div>
                    {exp.description && <p className="text-xs text-stone-600 mt-1">{exp.description}</p>}
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

        <div className="col-span-4 space-y-6 font-sans">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Skills & Toolkit
              </h2>
              <div className="flex flex-wrap gap-1.5">
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
                    <div className="text-stone-500 text-[11.5px]">{e.institute} {e.endYear ? \`(\${e.endYear})\` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Awards & Recognition
              </h2>
              <div className="space-y-2 text-xs text-stone-700">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <div className="font-semibold text-stone-900">{a.title}</div>
                    <div className="text-stone-500 text-[11px]">{a.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
`);

// 4. PremiumInternationalResumeTemplate.tsx
save('src/templates/resume/PremiumInternationalResumeTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumInternationalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const primary = customization.primaryColor || '#1e3a8a'; // International Blue / European Navy
  const accent = customization.secondaryColor || '#3b82f6'; // Bright Accent Blue
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const displayFullName = personal.fullName || 'Priya Patel';
  const displayTitle = personal.professionalTitle || 'Staff Software Engineer & Solutions Architect';
  const displayEmail = contact.email || 'priya.patel@example.com';
  const displayPhone = contact.phone || '+1 (415) 555-0192';
  const displayCity = contact.city || 'San Francisco';
  const displayCountry = contact.country || 'United States';
  const displayLinkedin = contact.linkedin || 'linkedin.com/in/priyapatel';

  const displaySummary =
    summary ||
    'Experienced technology lead with a proven track record architecting high-throughput distributed systems, cross-functional engineering teams, and scalable cloud infrastructure.';

  const displayExperience =
    experience.length > 0
      ? experience
      : [
          {
            id: 'ph_exp_1',
            company: 'Stripe, Inc.',
            jobTitle: 'Staff Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2022',
            endDate: 'Present',
            currentlyWorking: true,
            description:
              'Lead technical architect for merchant settlement infrastructure, processing high-volume transactions with 99.999% reliability.',
            achievements:
              '• Re-architected batch settlement pipelines, reducing reconciliation latency by 68%.\\n• Mentored 8 junior and mid-level engineers, establishing engineering quality rubrics.',
          },
          {
            id: 'ph_exp_2',
            company: 'Twilio Inc.',
            jobTitle: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2019',
            endDate: '2022',
            currentlyWorking: false,
            description:
              'Engineered mission-critical real-time voice and communication routing APIs handling 15,000+ requests per second.',
            achievements:
              '• Reduced p99 API latency from 180ms to 42ms through distributed caching layers.',
          },
        ];

  const displaySkills =
    skills.length > 0
      ? skills
      : [
          { id: 'ph_sk_1', name: 'Distributed Systems', category: 'technical', level: 'Expert' },
          { id: 'ph_sk_2', name: 'Cloud Architecture (AWS/GCP)', category: 'tool', level: 'Expert' },
          { id: 'ph_sk_3', name: 'TypeScript / React / Node.js', category: 'technical', level: 'Expert' },
          { id: 'ph_sk_4', name: 'System Design & Scalability', category: 'technical', level: 'Expert' },
          { id: 'ph_sk_5', name: 'Engineering Leadership', category: 'soft', level: 'Expert' },
        ];

  const displayEducation =
    education.length > 0
      ? education
      : [
          {
            id: 'ph_edu_1',
            degree: 'Master of Science in Computer Science',
            institute: 'Stanford University',
            location: 'Stanford, CA',
            endYear: '2017',
          },
          {
            id: 'ph_edu_2',
            degree: 'Bachelor of Technology in Computer Science',
            institute: 'IIT Bombay',
            location: 'Mumbai, India',
            endYear: '2015',
          },
        ];

  return (
    <div
      className={\`document-page-sheet flex flex-col bg-white text-slate-800 shadow-sm \${baseFontSize}\`}
    >
      <div
        className="p-8 text-white flex justify-between items-center"
        style={{ backgroundColor: primary }}
      >
        <div className="flex items-center gap-5">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/60 shrink-0">
              <img
                src={personal.profilePhoto}
                alt={displayFullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className={\`text-2xl font-extrabold uppercase tracking-wide text-white \${fontClass}\`}>
              {displayFullName}
            </h1>
            <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
              {displayTitle}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-blue-100 space-y-1">
          <div>✉ {displayEmail}</div>
          <div>✆ {displayPhone}</div>
          <div>📍 {displayCity}{displayCountry ? \`, \${displayCountry}\` : ''}</div>
          {displayLinkedin && <div>🔗 {displayLinkedin}</div>}
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-[32%] bg-slate-50 p-6 border-r border-slate-200 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
              Core Competencies
            </h2>
            <div className="space-y-1.5 text-xs">
              {displaySkills.map((s) => (
                <div key={s.id} className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{s.level || 'Expert'}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
              Education & Degrees
            </h2>
            <div className="space-y-3 text-xs">
              {displayEducation.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institute}</div>
                  <div className="text-[11px] text-slate-400">{e.endYear}</div>
                </div>
              ))}
            </div>
          </div>

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
        </div>

        <div className="w-[68%] p-7 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Executive Profile
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{displaySummary}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {displayExperience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primary }}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-sm text-slate-900">{exp.jobTitle}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    {exp.company} {exp.location ? \`• \${exp.location}\` : ''}
                  </div>
                  {exp.description && <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>}
                  {exp.achievements && (
                    <div className="text-xs text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                      {exp.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                    {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`);

// 5. PremiumMinimalExecutiveResumeTemplate.tsx
save('src/templates/resume/PremiumMinimalExecutiveResumeTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumMinimalExecutiveResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const primary = customization.primaryColor || '#0f172a'; // Deep Executive Slate
  const accent = customization.secondaryColor || '#475569'; // Muted Slate
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const displayFullName = personal.fullName || 'Vikramaditya Singhania';
  const displayTitle = personal.professionalTitle || 'Chief Executive Officer / Managing Director';
  const displayEmail = contact.email || 'v.singhania@executive-holdings.com';
  const displayPhone = contact.phone || '+1 (212) 555-0188';
  const displayCity = contact.city || 'New York, NY';
  const displayLinkedin = contact.linkedin || 'linkedin.com/in/v-singhania-exec';

  const displaySummary =
    summary ||
    'Distinguished executive leader with 15+ years of general management, enterprise scaling, and board-level governance. Demonstrated track record guiding multinational enterprises through market expansion, accretive M&A, and digital transformation.';

  const displaySkills =
    skills.length > 0
      ? skills
      : [
          { id: 'ph_s1', name: 'Enterprise Strategy & P&L', category: 'soft' },
          { id: 'ph_s2', name: 'Mergers & Acquisitions (M&A)', category: 'soft' },
          { id: 'ph_s3', name: 'Board & Investor Governance', category: 'soft' },
          { id: 'ph_s4', name: 'Global Market Expansion', category: 'soft' },
          { id: 'ph_s5', name: 'Digital Transformation', category: 'technical' },
          { id: 'ph_s6', name: 'Executive Team Mentorship', category: 'soft' },
        ];

  const displayExperience =
    experience.length > 0
      ? experience
      : [
          {
            id: 'ph_e1',
            jobTitle: 'Chief Executive Officer',
            company: 'Apex Global Holdings, Inc.',
            startDate: '2020',
            endDate: 'Present',
            currentlyWorking: true,
            description:
              'Accountable for $450M global enterprise P&L spanning North America, EMEA, and APAC across 2,400 employees.',
            achievements:
              '• Expanded enterprise EBITDA margin from 14% to 26% over a three-year strategic horizon.\\n• Closed three strategic accretive acquisitions unlocking $80M in synergistic annual revenues.',
          },
          {
            id: 'ph_e2',
            jobTitle: 'Chief Operating Officer',
            company: 'Vanguard Industrial Technologies',
            startDate: '2016',
            endDate: '2020',
            currentlyWorking: false,
            description:
              'Directed global supply chain, cloud transformation, and commercial operations across 12 manufacturing facilities.',
            achievements:
              '• Restructured operational workflows, mitigating $32M in cost inefficiencies.\\n• Spearheaded digital automation initiative modernizing enterprise ERP infrastructure.',
          },
        ];

  const displayEducation =
    education.length > 0
      ? education
      : [
          {
            id: 'ph_ed1',
            degree: 'Master of Business Administration (MBA)',
            institute: 'Harvard Business School',
            endYear: '2012',
          },
          {
            id: 'ph_ed2',
            degree: 'Bachelor of Science in Industrial Engineering',
            institute: 'Columbia University',
            endYear: '2008',
          },
        ];

  return (
    <div
      className={\`document-page-sheet p-10 bg-white text-slate-900 shadow-sm \${baseFontSize}\`}
    >
      <div className="border-b-2 pb-5 mb-6" style={{ borderColor: primary }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={\`text-3xl font-extrabold uppercase tracking-wider text-slate-950 \${fontClass}\`}>
              {displayFullName}
            </h1>
            <p className="text-sm font-semibold tracking-wide text-slate-600 mt-0.5 font-sans">
              {displayTitle}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-0.5 font-sans">
            <div>{displayEmail}</div>
            <div>{displayPhone}</div>
            <div>{displayCity}</div>
            {displayLinkedin && <div>{displayLinkedin}</div>}
          </div>
        </div>
      </div>

      <div className="mb-6 avoid-break bg-slate-50 p-4 rounded border-l-4" style={{ borderColor: primary }}>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
          Executive Profile & Strategic Scope
        </h2>
        <p className="text-xs text-slate-800 leading-relaxed font-sans font-normal">{displaySummary}</p>
      </div>

      <div className="mb-6 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5 font-sans">
          Core Leadership & Strategic Competencies
        </h2>
        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {displaySkills.map((s) => (
            <span key={s.id} className="px-2.5 py-1 bg-slate-100 rounded text-slate-800 font-medium">
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3.5 font-sans">
          Executive & Leadership Experience
        </h2>
        <div className="space-y-4 font-sans">
          {displayExperience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-950">
                  {exp.jobTitle} <span className="font-normal text-slate-500">|</span> <span className="font-semibold text-slate-700">{exp.company}</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-xs text-slate-700 mt-1 leading-relaxed">{exp.description}</p>}
              {exp.achievements && (
                <div className="text-xs text-slate-800 mt-1.5 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-300">
                  {exp.achievements}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 font-sans">
        <div className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Education & Degrees
          </h2>
          <div className="space-y-2 text-xs">
            {displayEducation.map((e) => (
              <div key={e.id}>
                <div className="font-bold text-slate-900">{e.degree}</div>
                <div className="text-slate-600">{e.institute} {e.endYear ? \`(\${e.endYear})\` : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {(certifications.length > 0 || achievements.length > 0) ? (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
              Certifications & Board Honors
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900">{c.name}</strong> • {c.issuer} {c.issueDate ? \`(\${c.issueDate})\` : ''}
                </div>
              ))}
              {achievements.map((a) => (
                <div key={a.id}>
                  <strong className="text-slate-900">{a.title}</strong>: {a.description}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
              Governance & Accreditations
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">National Association of Corporate Directors</strong> – Fellow
              </div>
              <div>
                <strong className="text-slate-900">Stanford Executive Program</strong>: Certificate in Strategic Leadership
              </div>
            </div>
          </div>
        )}
      </div>

      {customSections && customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
            {sec.title}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{sec.content}</p>
        </div>
      ))}
    </div>
  );
};
`);

// 6. PremiumTechLeadResumeTemplate.tsx
save('src/templates/resume/PremiumTechLeadResumeTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumTechLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const techIndigo = customization.primaryColor || '#312e81'; // Deep Silicon Indigo
  const cyanCode = customization.secondaryColor || '#0284c7'; // Code Cyan
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[14.5px]' : 'text-[13px]';

  return (
    <div
      className={\`document-page-sheet p-9 bg-white text-slate-900 shadow-sm \${baseFontSize}\`}
    >
      <div className="flex justify-between items-start pb-5 mb-5 border-b-2 border-slate-900">
        <div>
          <h1 className={\`text-3xl font-black uppercase tracking-tight text-slate-950 \${fontClass}\`}>
            {personal.fullName || 'ENGINEERING ARCHITECT'}
          </h1>
          <p className="text-sm font-semibold text-indigo-900 font-mono mt-0.5">
            {personal.professionalTitle || 'Staff Software Engineer & Distributed Systems Lead'}
          </p>
        </div>
        <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {contact.github && <div className="text-indigo-600 font-semibold">{contact.github}</div>}
          {contact.linkedin && <div>{contact.linkedin}</div>}
          {contact.city && <div>{contact.city}{contact.state ? \`, \${contact.state}\` : ''}</div>}
        </div>
      </div>

      {summary && (
        <div className="mb-5 avoid-break bg-slate-50 p-3.5 rounded border border-slate-200">
          <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
            // Core Technical Proficiencies & Infrastructure
          </h2>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {skills.map((s) => (
              <span key={s.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200 font-mono">
            // Engineering Experience & Architectural Impact
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-950">
                    {exp.jobTitle} <span className="font-normal text-slate-400">@</span> <span className="text-indigo-900 font-semibold">{exp.company}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-slate-700 mt-1 leading-relaxed">{exp.description}</p>}
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1 pl-3 border-l-2 border-indigo-400 whitespace-pre-line leading-relaxed">
                    {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 pb-1 border-b border-slate-200 font-mono">
            // Key Systems & Open Source Projects
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 font-mono">{p.name}</div>
                {p.technologies && <div className="text-[11px] text-indigo-700 font-mono mt-0.5">{p.technologies}</div>}
                {p.description && <p className="text-slate-600 text-[11.5px] mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 avoid-break pt-2 border-t border-slate-200">
        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
              // Education
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-500">{e.institute} • {e.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
              // Cloud & Security Accreditations
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900">{c.name}</strong>
                  <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`);

console.log('Restored all 6 resume templates.');
