import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  formatResumeLocation,
  getValidCertifications,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ModernMinimalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const primaryContactLine = [contact.email, contact.phone].filter(Boolean).join(' • ');
  const secondaryContactLine = [displayLocation, contact.linkedin, contact.portfolio || contact.website].filter(Boolean).join(' • ');

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white min-h-[1123px]"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <ResumeHeaderTable
        className="border-b-2 border-slate-900 pb-3 mb-4"
        nowrapRight={false}
        rightWidth="48%"
        left={
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personal.fullName || 'FULL NAME'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5 no-justify">
              {personal.professionalTitle || 'Software Professional'}
            </p>
          </>
        }
        rightClassName="text-right text-xs text-slate-600 no-justify"
        right={
          <>
            {primaryContactLine && <div>{primaryContactLine}</div>}
            {secondaryContactLine && <div>{secondaryContactLine}</div>}
          </>
        }
      />

      {summary && (
        <div className="mb-4 avoid-break">
          <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  left={<>{exp.jobTitle} • <span className="font-medium text-slate-600">{exp.company}</span></>}
                  rightClassName="text-slate-400 text-[11px]"
                  right={<>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <ResumeDescriptionBlock
                    text={exp.achievements}
                    wrapperClassName="mt-0.5 space-y-1 text-xs text-slate-600"
                    markerClassName="text-slate-400"
                    paragraphClassName="text-xs text-slate-600 mt-0.5 whitespace-pre-line"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="space-y-1 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold">{e.degree}</div>
                    <div className="text-slate-500">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
                Skills
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed no-justify">
                {skills.map((s) => s.name).join(' • ')}
              </p>
            </div>
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
            Projects
          </h2>
          <div className="space-y-1.5 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={p.name}
                  rightClassName="font-normal text-slate-500"
                  right={p.link}
                />
                <p className="text-slate-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {validCertifications.length > 0 && (
        <div className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">
            Certifications & Recognition
          </h2>
          <div className="text-xs text-slate-700 space-y-0.5">
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-slate-400">
                {c.name}{c.issuer ? ` (${c.issuer})` : ''}{c.issueDate ? ` • ${c.issueDate}` : ''}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">{sec.title}</h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
              {sec.items.map((it) => (
                <div key={it.id}><span className="font-bold text-slate-900">{it.key}:</span> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-700 whitespace-pre-line">{sec.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};
