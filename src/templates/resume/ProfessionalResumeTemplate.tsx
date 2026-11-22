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

export const ProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const primary = customization.primaryColor || '#0369a1'; // Sky 700

  return (
    <div
      className="document-page-sheet p-9 font-jakarta text-slate-800 bg-white min-h-[1123px]"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Header Accent Line */}
      <div className="h-1.5 w-full rounded mb-6" style={{ backgroundColor: primary }}></div>

      <ResumeHeaderTable
        className="border-b border-slate-200 pb-4 mb-5"
        left={
          <>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {personal.fullName || 'FULL NAME'}
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-0.5 no-justify">
              {personal.professionalTitle || 'Software Engineer / Consultant'}
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
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
            Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  leftClassName="text-slate-900"
                  left={
                    <>
                      {exp.jobTitle} • <span className="font-medium text-slate-600">{exp.company}</span>
                    </>
                  }
                  rightClassName="text-slate-500 font-normal text-[11px]"
                  right={
                    <>
                      {exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
                    </>
                  }
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <div className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
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

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-5 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu) => {
                  const scoreLabel = edu.score ? (/^[0-9./\s]+$/.test(edu.score.trim()) ? `GPA: ${edu.score.trim()}` : edu.score.trim()) : '';
                  const subline = [edu.institute, edu.endYear, scoreLabel].filter(Boolean).join(' • ');
                  return (
                    <div key={edu.id} data-entry="true">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      {subline && <div className="text-slate-600">{subline}</div>}
                      {edu.description && <div className="text-[11px] text-slate-500 mt-0.5">{edu.description}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
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
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={p.name}
                  rightClassName="text-sky-700 font-normal"
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1">
            Certifications
          </h2>
          <div className="text-xs space-y-1 text-slate-700">
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-slate-400">
                {c.name}{c.issuer ? ` (${c.issuer})` : ''}{c.issueDate ? ` • ${c.issueDate}` : ''}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1">{sec.title}</h2>
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
