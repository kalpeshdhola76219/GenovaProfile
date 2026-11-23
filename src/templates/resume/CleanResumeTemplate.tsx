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

export const CleanResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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
        className="border-b pb-4 mb-5 border-slate-200"
        nowrapRight={false}
        rightWidth="48%"
        left={
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personal.fullName || 'Full Name'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5 no-justify">
              {personal.professionalTitle || 'Software Engineer'}
            </p>
          </>
        }
        rightClassName="text-right text-xs text-slate-500 no-justify"
        right={
          <>
            {primaryContactLine && <div>{primaryContactLine}</div>}
            {secondaryContactLine && <div>{secondaryContactLine}</div>}
          </>
        }
      />

      {summary && (
        <div className="mb-4 avoid-break">
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2.5">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs"
                  leftClassName="font-bold text-slate-900"
                  left={joinNonEmpty([exp.jobTitle, exp.company], ', ')}
                  rightClassName="text-slate-500 text-[11px]"
                  right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' - ')}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-600"
                  paragraphClassName="text-xs text-slate-600 mt-0.5 whitespace-pre-line"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
                Education
              </h2>
              <div className="space-y-1.5 text-xs">
                {education.map((e) => {
                  const subline = joinNonEmpty([e.institute, e.endYear, formatEducationScore(e.score)], ' • ');
                  return (
                    <div key={e.id} data-entry="true">
                      <div className="font-bold">{e.degree}</div>
                      {subline && <div className="text-slate-500">{subline}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
                Skills
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed no-justify">
                {joinNonEmpty(skills.map((s) => s.name), ' • ')}
              </p>
            </div>
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
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
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-slate-700 space-y-0.5" style={BULLET_LIST_STYLE}>
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id}>
                {joinNonEmpty([c.name ? `${c.name}${c.issuer ? ` (${c.issuer})` : ''}` : c.issuer, c.issueDate], ' • ')}
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
                <div key={it.id}><span className="font-bold">{it.key}:</span> {it.value}</div>
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

