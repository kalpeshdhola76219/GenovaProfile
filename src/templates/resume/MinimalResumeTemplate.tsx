import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  formatDateRange,
  formatEducationScore,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const MinimalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white min-h-[1123px]"
      style={{
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
            {displayLocation && <div>{displayLocation}</div>}
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
                  left={<>{exp.jobTitle}{exp.jobTitle && exp.company ? <> <span className="text-slate-500 font-normal">at</span> </> : ''}{exp.company}</>}
                  rightClassName="text-[11px] text-slate-400"
                  right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' – ')}
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

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-8 mb-6 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
              <div className="space-y-2 text-xs">
                {education.map((e) => {
                  const subline = joinNonEmpty([e.institute, e.endYear, formatEducationScore(e.score)], ' • ');
                  return (
                    <div key={e.id} data-entry="true">
                      <div className="font-semibold text-slate-900">{e.degree}</div>
                      {subline && <div className="text-slate-500">{subline}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
              <p className="text-xs text-slate-700 leading-relaxed no-justify">
                {joinNonEmpty(skills.map((s) => s.name), ' • ')}
              </p>
            </div>
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

      {validCertifications.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Certifications</h2>
          <div className="text-xs text-slate-600 space-y-1" style={BULLET_LIST_STYLE}>
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id}>
                {joinNonEmpty([c.name ? `${c.name}${c.issuer ? ` (${c.issuer})` : ''}` : c.issuer, c.issueDate], ' • ')}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{sec.title}</h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
              {sec.items.map((it) => (
                <div key={it.id}><span className="text-slate-500 font-medium">{it.key}:</span> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 whitespace-pre-line">{sec.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};
