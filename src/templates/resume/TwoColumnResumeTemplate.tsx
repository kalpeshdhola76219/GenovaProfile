import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  METADATA_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  ResumeBulletItem,
  ResumeDescriptionBlock,
} from './resumeTemplateUtils';

export const TwoColumnResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;
  const primary = customization.primaryColor || '#0f172a';

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800 flex"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Left Column (35%) */}
      <div className="w-[35%] bg-slate-900 text-white p-7 flex flex-col justify-between no-justify">
        <div>
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              {personal.fullName || 'Full Name'}
            </h1>
            <p className="text-xs text-sky-400 mt-1 font-medium no-justify">
              {personal.professionalTitle || 'Software Engineer'}
            </p>
          </div>
          <div className="space-y-4 text-xs text-slate-300">
            <div className="no-justify">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">Contact</h2>
              <div className="space-y-1 text-slate-300">
                {contact.email && <div>  {contact.email}</div>}
                {contact.phone && <div>  {contact.phone}</div>}
                {(contact.city || contact.state || contact.country) && <div>📍 {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>}
                {contact.linkedin && <div>  {contact.linkedin}</div>}
                {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
              </div>
            </div>
            {skills.length > 0 && (
              <div className="no-justify">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">Skills</h2>
                <div className="flex flex-wrap gap-1 no-justify">
                  {skills.map((s) => (
                    <span key={s.id} className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">Education</h2>
                <div className="space-y-2">
                  {education.map((e) => (
                    <div key={e.id}>
                      <div className="font-semibold text-white">{e.degree}</div>
                      <div className="text-slate-400 text-[11px]">{e.institute} • {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Right Column (65%) */}
      <div className="w-[65%] p-7 bg-white space-y-5">
        {summary && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Profile Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id} data-entry="true">
                  <div className="flex justify-between items-baseline text-xs font-bold" style={METADATA_ROW_STYLE}>
                    <span className="text-slate-900" style={METADATA_LEFT_STYLE}>{exp.jobTitle}</span>
                    <span className="text-slate-500 font-normal text-[11px]" style={METADATA_RIGHT_STYLE}>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                  </div>
                  <div className="text-xs font-medium text-sky-800">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                  <ResumeDescriptionBlock
                    text={exp.description}
                    wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                    markerClassName="text-slate-400"
                    paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                  />
                  {exp.achievements && (
                    <div className="text-xs text-slate-600 mt-1 whitespace-pre-line bg-slate-50 p-2 rounded">
                      <ResumeDescriptionBlock
                        text={exp.achievements}
                        wrapperClassName="space-y-1 text-xs text-slate-600"
                        markerClassName="text-slate-400"
                        paragraphClassName="text-xs text-slate-600 whitespace-pre-line leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {projects.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-2 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} data-entry="true">
                  <div className="font-bold flex justify-between" style={METADATA_ROW_STYLE}>
                    <span style={METADATA_LEFT_STYLE}>{proj.name}</span>
                    {proj.link && <span className="text-sky-700 font-normal" style={METADATA_RIGHT_STYLE}>{proj.link}</span>}
                  </div>
                  {proj.technologies && <div className="text-[11px] text-slate-500">{proj.technologies}</div>}
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {(certifications.length > 0 || achievements.length > 0) && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Certifications & Honors
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c) => (
                <ResumeBulletItem key={c.id} markerClassName="text-slate-400">
                  <strong>{c.name}</strong> ({c.issuer})
                </ResumeBulletItem>
              ))}
              {achievements.map((a) => (
                <ResumeBulletItem key={a.id} markerClassName="text-slate-400">
                  <strong>{a.title}</strong>: {a.description}
                </ResumeBulletItem>
              ))}
            </div>
          </div>
        )}
        {customSections.map((sec) => (
          <div key={sec.id} className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">{sec.title}</h2>
            {sec.items ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sec.items.map((i) => <div key={i.id}><strong>{i.key}:</strong> {i.value}</div>)}
              </div>
            ) : <p className="text-xs text-slate-700">{sec.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
