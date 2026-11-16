import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  CONTACT_CENTER_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  METADATA_ROW_STYLE,
  ResumeBulletItem,
  ResumeDescriptionBlock,
} from './resumeTemplateUtils';

export const ATSBasicResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-10 font-sans text-black bg-white leading-normal"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.sans,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* ATS Header: Center Aligned, Pure Text, Standard Contact */}
      <div className="text-center pb-4 border-b border-black mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
          {personal.fullName || 'FULL NAME'}
        </h1>
        {personal.professionalTitle && (
          <p className="text-sm font-semibold uppercase mt-0.5">{personal.professionalTitle}</p>
        )}
        <div className="text-xs mt-1 flex flex-wrap justify-center gap-x-3 text-black no-justify" style={CONTACT_CENTER_ROW_STYLE}>
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
          {(contact.city || contact.state || contact.country) && <span>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>{contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs leading-relaxed text-justify text-black">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry>
                <div className="flex justify-between items-baseline text-xs font-bold" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{exp.jobTitle}, {exp.company}</span>
                  <span style={METADATA_RIGHT_STYLE}>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                </div>
                {exp.location && <div className="text-[11px] italic text-neutral-800">{exp.location}</div>}
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-black"
                  markerClassName="text-black"
                  paragraphClassName="text-xs mt-1 whitespace-pre-line leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            EDUCATION
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} data-entry>
                <div className="flex justify-between items-baseline text-xs font-bold" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{edu.degree} - {edu.institute}{edu.score ? ` • ${/^[0-9./\s]+$/.test(edu.score.trim()) ? `GPA: ${edu.score.trim()}` : edu.score.trim()}` : ''}</span>
                  <span style={METADATA_RIGHT_STYLE}>{edu.endYear}</span>
                </div>
                {edu.description && <div className="text-[11px]">{edu.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            SKILLS & COMPETENCIES
          </h2>
          <p className="text-xs leading-relaxed no-justify">
            {skills.map((s) => s.name).join(' &bull; ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            KEY PROJECTS
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} data-entry>
                <div className="flex justify-between items-baseline text-xs font-bold" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{proj.name} {proj.role ? `(${proj.role})` : ''}</span>
                  {proj.link && <span className="font-normal text-neutral-700" style={METADATA_RIGHT_STYLE}>{proj.link}</span>}
                </div>
                {proj.technologies && <div className="text-[11px] italic">Technologies: {proj.technologies}</div>}
                <p className="text-xs mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            CERTIFICATIONS & HONORS
          </h2>
          <div className="text-xs space-y-1 text-black" style={BULLET_LIST_STYLE}>
            {certifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-black">
                <strong>{c.name}</strong> - {c.issuer} ({c.issueDate || 'Verified'})
              </ResumeBulletItem>
            ))}
            {achievements.map((a) => (
              <ResumeBulletItem key={a.id} markerClassName="text-black">
                <strong>{a.title}</strong>: {a.description}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            {sec.title.toUpperCase()}
          </h2>
          {sec.items ? (
            <div className="text-xs space-y-1">
              {sec.items.map((it) => (
                <div key={it.id}><strong>{it.key}:</strong> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs">{sec.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};
