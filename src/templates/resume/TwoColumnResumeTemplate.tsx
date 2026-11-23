import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  formatDateRange,
  formatEducationScore,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const TwoColumnResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);

  return (
    <div
      className="document-page-sheet min-h-[1123px] font-jakarta text-slate-800 bg-white flex"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Left Dark Sidebar (35%) */}
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
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                Contact
              </h2>
              <div className="space-y-1 text-slate-300">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {displayLocation && <div>📍 {displayLocation}</div>}
                {contact.linkedin && <div>{contact.linkedin}</div>}
                {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
              </div>
            </div>
            {skills.length > 0 && (
              <div className="no-justify">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  Skills
                </h2>
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
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((e) => {
                    const subline = joinNonEmpty([e.institute, e.endYear, formatEducationScore(e.score)], ' • ');
                    return (
                      <div key={e.id} data-entry="true">
                        <div className="font-semibold text-white">{e.degree}</div>
                        {subline && <div className="text-slate-400 text-[11px]">{subline}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Main Column (65%) */}
      <div className="w-[65%] p-7 space-y-5">
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
                  <ResumeSplitRow
                    className="text-xs font-bold"
                    leftClassName="text-slate-900"
                    left={exp.jobTitle}
                    rightClassName="text-slate-500 font-normal text-[11px]"
                    rightWidth="145px"
                    right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' - ')}
                  />
                  {joinNonEmpty([exp.company, exp.location], ' • ') && (
                    <div className="text-xs font-medium text-sky-800">{joinNonEmpty([exp.company, exp.location], ' • ')}</div>
                  )}
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
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-2 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} data-entry="true" className="avoid-break">
                  <ResumeSplitRow
                    className="font-bold"
                    wrapRight
                    left={proj.name}
                    rightClassName="text-sky-700 font-normal"
                    right={proj.link}
                  />
                  {proj.technologies && <div className="text-[11px] text-slate-500">{proj.technologies}</div>}
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {validCertifications.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Certifications & Honors
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {validCertifications.map((c) => (
                <ResumeBulletItem key={c.id} markerClassName="text-slate-400">
                  {c.name && <strong>{c.name}</strong>}
                  {c.issuer ? `${c.name ? ' ' : ''}(${c.issuer})` : ''}
                  {c.issueDate ? `${c.name || c.issuer ? ' • ' : ''}${c.issueDate}` : ''}
                </ResumeBulletItem>
              ))}
            </div>
          </div>
        )}
        {customSections.map((sec) => (
          <div key={sec.id} className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">{sec.title}</h2>
            {sec.items && sec.items.length > 0 ? (
              <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
                {sec.items.map((it) => (
                  <div key={it.id}>
                    <span className="font-semibold">{it.key}:</span> {it.value}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{sec.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
