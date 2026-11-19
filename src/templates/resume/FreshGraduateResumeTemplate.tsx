import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  CONTACT_CENTER_ROW_STYLE,
  RESUME_SHEET_BASE_STYLE,
  ResumeBulletItem,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const FreshGraduateResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        padding: '32px',
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="text-center pb-4 border-b border-slate-200 mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {personal.fullName || 'FULL NAME'}
        </h1>
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mt-0.5">
          {personal.professionalTitle || 'Graduate Candidate'}
        </p>
        <div className="text-xs text-slate-500 mt-1 flex flex-wrap justify-center gap-3 no-justify" style={CONTACT_CENTER_ROW_STYLE}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>&bull; {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && <span>&bull; {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>&bull; {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Career Objective
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education First for fresh graduates */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Education & Academic Background
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold text-slate-900"
                  left={<>{e.degree} &bull; {e.institute}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</>}
                  rightClassName="text-slate-500 font-normal"
                  right={e.endYear}
                />
                {e.description && <p className="text-slate-600 mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Spotlight */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Academic & Capstone Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={p.name}
                  rightClassName="text-blue-700 font-normal"
                  right={p.link}
                />
                {p.technologies && <div className="text-[11px] text-slate-500 italic">Tools: {p.technologies}</div>}
                <p className="text-slate-700 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Technical & Soft Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 no-justify">
            {skills.map((s) => (
              <span key={s.id} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Internship & Experience if any */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-2">
            Internships & Work Experience
          </h2>
          <div className="space-y-2 text-xs">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="font-bold"
                  left={<>{exp.jobTitle} at {exp.company}</>}
                  rightClassName="text-slate-500 font-normal"
                  right={<>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-0.5 space-y-1 text-xs text-slate-600"
                  paragraphClassName="text-slate-600 mt-0.5 whitespace-pre-line"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-slate-700 space-y-0.5" style={BULLET_LIST_STYLE}>
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
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-900 pb-0.5 mb-1">{sec.title}</h2>
          <ResumeCustomSectionBody
            items={sec.items}
            content={sec.content}
            textClassName="text-xs text-slate-700"
            keyClassName="font-semibold text-slate-900"
            columns={2}
          />
        </div>
      ))}
    </div>
  );
};
