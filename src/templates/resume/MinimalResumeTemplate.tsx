import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  RESUME_SHEET_BASE_STYLE,
  ResumeBulletItem,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const MinimalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  const educationBlock = education.length > 0 ? (
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
  ) : null;

  const skillsBlock = skills.length > 0 ? (
    <div className="avoid-break no-justify">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
      <p className="text-xs text-slate-700 leading-relaxed no-justify">
        {skills.map((s) => s.name).join(' • ')}
      </p>
    </div>
  ) : null;

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        padding: '40px',
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <ResumeHeaderTable
        className="border-b border-slate-200 pb-5 mb-6"
        left={
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personal.fullName || 'Full Name'}
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest no-justify">
              {personal.professionalTitle || 'Software Engineer'}
            </p>
          </>
        }
        rightClassName="text-right text-xs text-slate-500 space-y-0.5 no-justify"
        right={
          <>
            {contact.email && <div>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {(contact.city || contact.state || contact.country) && <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>}
            {contact.linkedin && <div>{contact.linkedin}</div>}
            {(contact.portfolio || contact.website) && <div>{contact.portfolio || contact.website}</div>}
          </>
        }
      />

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
              <div key={exp.id} data-entry="true" className="relative pl-4 border-l border-slate-200">
                <ResumeSplitRow
                  className="text-xs"
                  leftClassName="font-semibold text-slate-900"
                  left={<>{exp.jobTitle} <span className="text-slate-500 font-normal">at</span> {exp.company}</>}
                  rightClassName="text-[11px] text-slate-400"
                  right={<>{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
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

      {(educationBlock || skillsBlock) && (
        <div className="mb-6 no-justify" style={{ marginBottom: '24px' }}>
          {educationBlock && skillsBlock ? (
            <ResumeTwoColumnTable
              leftWidth="50%"
              rightWidth="50%"
              gapPx={32}
              left={educationBlock}
              right={skillsBlock}
            />
          ) : (
            educationBlock || skillsBlock
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Projects</h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-semibold"
                  wrapRight
                  left={p.name}
                  rightClassName="text-slate-400 font-normal"
                  right={p.link}
                />
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
          <ResumeCustomSectionBody
            items={sec.items}
            content={sec.content}
            textClassName="text-xs text-slate-600"
            keyClassName="text-slate-500 font-medium"
            columns={2}
          />
        </div>
      ))}
    </div>
  );
};
