import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  HEADER_LEFT_STYLE,
  HEADER_RIGHT_STYLE,
  HEADER_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  METADATA_ROW_STYLE,
  METADATA_WIDE_RIGHT_STYLE,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const MinimalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="border-b border-slate-200 pb-5 mb-6" style={HEADER_ROW_STYLE}>
        <div style={HEADER_LEFT_STYLE}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest no-justify">
            {personal.professionalTitle || 'Software Engineer'}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-0.5 no-justify" style={HEADER_RIGHT_STYLE}>
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
              <div key={exp.id} data-entry className="relative pl-4 border-l border-slate-200">
                <div className="text-xs" style={METADATA_ROW_STYLE}>
                  <span className="font-semibold text-slate-900" style={METADATA_LEFT_STYLE}>{exp.jobTitle} <span className="text-slate-500 font-normal">at</span> {exp.company}</span>
                  <span className="text-[11px] text-slate-400" style={METADATA_RIGHT_STYLE}>{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                </div>
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-600"
                  paragraphClassName="text-xs text-slate-600 mt-1 whitespace-pre-line"
                />
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
              <div key={p.id} data-entry>
                <div className="font-semibold" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{p.name}</span>
                  {p.link && <span className="text-slate-400 font-normal" style={METADATA_WIDE_RIGHT_STYLE}>{p.link}</span>}
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
          <div className="text-xs text-slate-600 space-y-1" style={BULLET_LIST_STYLE}>
            {certifications.map((c) => (
              <ResumeBulletItem key={c.id}>{c.name} ({c.issuer})</ResumeBulletItem>
            ))}
            {achievements.map((a) => (
              <ResumeBulletItem key={a.id}>{a.title}: {a.description}</ResumeBulletItem>
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
