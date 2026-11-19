import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  CONTACT_ROW_STYLE,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ModernCorporateResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  const displayFullName = personal.fullName || '';
  const displayTitle = personal.professionalTitle || '';
  const displayEmail = contact.email || '';
  const displayPhone = contact.phone || '';
  const displayLocation = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');
  const displayLinkedin = contact.linkedin || '';

  const displaySummary = summary || '';
  const displayExperience = experience || [];
  const displayEducation = education || [];
  const displaySkills = skills || [];

  return (
    <div
      className="document-page-sheet min-h-[1123px] p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Top Corporate Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl mb-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{displayFullName}</h1>
          <p className="text-sm font-medium text-blue-300 mt-0.5 no-justify">{displayTitle}</p>
          <div className="text-xs text-slate-300 mt-2 flex flex-wrap gap-x-4 gap-y-1 no-justify" style={CONTACT_ROW_STYLE}>
            {displayEmail && <span>✉ {displayEmail}</span>}
            {displayPhone && <span>✆ {displayPhone}</span>}
            {displayLocation && <span>📍 {displayLocation}</span>}
            {displayLinkedin && <span>🔗 {displayLinkedin}</span>}
            {(contact.portfolio || contact.website) && <span>🌐 {contact.portfolio || contact.website}</span>}
          </div>
        </div>
      </div>

      {displaySummary && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">{displaySummary}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="col-span-8 space-y-5">
          {displayExperience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {displayExperience.map((exp) => (
                  <div key={exp.id} data-entry="true">
                    <ResumeSplitRow
                      className="text-xs"
                      leftClassName="font-bold text-slate-900"
                      left={exp.jobTitle}
                      rightClassName="text-slate-500 font-medium text-[11px]"
                      right={
                        <>
                          {exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
                        </>
                      }
                    />
                    <div className="text-xs font-semibold text-blue-800">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                    <ResumeDescriptionBlock
                      text={exp.description}
                      wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                      paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                    />
                    <ResumeDescriptionBlock
                      text={exp.achievements}
                      wrapperClassName="mt-1 space-y-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100"
                      paragraphClassName="text-xs text-slate-600 mt-1 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-3">
                Key Initiatives & Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} data-entry="true" className="text-xs avoid-break">
                    <ResumeSplitRow
                      className="font-bold"
                      wrapRight
                      left={proj.name}
                      rightClassName="font-mono text-[11px] text-blue-700"
                      right={proj.link}
                    />
                    {proj.technologies && <div className="text-[11px] text-slate-500">Tech: {proj.technologies}</div>}
                    <p className="text-slate-700 mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-4 space-y-5 no-justify">
          {displayEducation.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {displayEducation.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institute}</div>
                    <div className="text-slate-400 text-[11px]">
                      {edu.endYear}
                      {edu.score ? ` • ${/^[0-9./\s]+$/.test(edu.score.trim()) ? `GPA: ${edu.score.trim()}` : edu.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displaySkills.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">
                Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 no-justify">
                {displaySkills.map((s) => (
                  <span key={s.id} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(certifications.length > 0 || achievements.length > 0) && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">
                Credentials
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}><strong>{c.name}</strong> ({c.issuer})</div>
                ))}
                {achievements.map((a) => (
                  <div key={a.id}><strong>{a.title}</strong></div>
                ))}
              </div>
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id} className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">{sec.title}</h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="space-y-1 text-xs text-slate-700">
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
    </div>
  );
};
