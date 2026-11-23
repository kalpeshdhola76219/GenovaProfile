import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  CONTACT_ROW_STYLE,
  formatDateRange,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ATSProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const safeData = sanitizeDocumentTextFields(data);
  const {
    personal = {} as any,
    contact = {} as any,
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    customSections = [],
    customization = {} as any,
  } = safeData || {};
  const validCertifications = getValidCertifications(certifications);
  const primary = customization.primaryColor || '#0f172a';

  return (
    <div
      className="document-page-sheet min-h-[1123px] p-9 font-jakarta text-slate-900 bg-white"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: primary }}>
        <ResumeHeaderTable
          left={
            <>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: primary }}>
                {personal.fullName || 'FULL NAME'}
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-0.5 no-justify">
                {personal.professionalTitle || 'Software Engineer / Professional'}
              </p>
            </>
          }
          rightClassName="text-right text-xs text-slate-600 space-y-0.5 no-justify"
          right={
            <>
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {formatResumeLocation(contact) && <div>{formatResumeLocation(contact)}</div>}
            </>
          }
        />
        {(contact.linkedin || contact.portfolio || contact.website) && (
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4 no-justify" style={CONTACT_ROW_STYLE}>
            {contact.linkedin && <span>LinkedIn: {contact.linkedin}</span>}
            {contact.portfolio && <span>Portfolio: {contact.portfolio}</span>}
            {contact.website && contact.website !== contact.portfolio && <span>GitHub/Web: {contact.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || `exp-${idx}`} data-entry="true">
                <ResumeSplitRow
                  className="text-xs"
                  leftClassName="font-bold text-slate-900"
                  left={<>{exp.jobTitle}{exp.jobTitle && exp.company ? <> &bull; </> : ''}{exp.company && <span className="font-medium text-slate-700">{exp.company}</span>}</>}
                  rightClassName="text-slate-500 font-mono text-[11px]"
                  right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' – ')}
                />
                {exp.location && <div className="text-[11px] text-slate-500">{exp.location}</div>}
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Grouped */}
      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Core Competencies & Skills
          </h2>
          <div className="text-xs text-slate-800 leading-relaxed no-justify">
            <span className="font-semibold">Technical & Domain Skills: </span>
            {joinNonEmpty(skills.map((s) => s.name), ' • ')}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu, idx) => {
              const years = edu.startYear && edu.endYear
                ? `${edu.startYear} – ${edu.endYear}`
                : edu.endYear || edu.startYear || '';

              const scoreStr = edu.score ? String(edu.score).trim() : '';
              const formattedScore = scoreStr
                ? /^[0-9./\s]+$/.test(scoreStr)
                  ? `GPA: ${scoreStr}`
                  : scoreStr
                : '';

              const hasDegree = Boolean(edu.degree && edu.degree.trim());
              const hasInstitute = Boolean(edu.institute && edu.institute.trim());

              return (
                <div key={edu.id || `edu-${idx}`} data-entry="true" className="text-xs">
                  <ResumeSplitRow
                    left={
                      <>
                        {hasDegree && (
                          <span className="font-bold text-slate-900">{edu.degree}</span>
                        )}
                        {hasDegree && hasInstitute && (
                          <span className="text-slate-400"> &bull; </span>
                        )}
                        {hasInstitute && (
                          <span className={`text-slate-700 ${!hasDegree ? 'font-bold text-slate-900' : 'font-medium'}`}>
                            {edu.institute}
                          </span>
                        )}
                        {edu.location && (
                          <span className="text-slate-500"> ({edu.location})</span>
                        )}
                        {formattedScore && (
                          <span className="text-slate-600">
                            {(hasDegree || hasInstitute) && <span className="text-slate-400"> &bull; </span>}
                            {formattedScore}
                          </span>
                        )}
                      </>
                    }
                    rightClassName="text-slate-500 font-mono text-[11px]"
                    right={years}
                  />
                  {edu.description && (
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed whitespace-pre-line">
                      {edu.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Featured Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj, idx) => (
              <div key={proj.id || `proj-${idx}`} data-entry="true" className="text-xs">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={<>{proj.name} {proj.role ? `(${proj.role})` : ''}</>}
                  rightClassName="font-mono text-[11px] font-normal text-blue-700"
                  right={proj.link}
                />
                {proj.technologies && <div className="text-[11px] text-slate-500 italic">Stack: {proj.technologies}</div>}
                <p className="text-slate-700 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {validCertifications.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            Certifications & Recognition
          </h2>
          <div className="text-xs space-y-1 text-slate-700">
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-slate-500">
                {c.name && <strong className="text-slate-900">{c.name}</strong>}
                {c.name && c.issuer ? <> &bull; </> : ''}
                {c.issuer}
                {c.issueDate ? ` (${c.issueDate})` : ''}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-200" style={{ color: primary }}>
            {sec.title}
          </h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs">
              {sec.items.map((it) => (
                <div key={it.id}>
                  <span className="font-semibold text-slate-700">{it.key}:</span> {it.value}
                </div>
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
