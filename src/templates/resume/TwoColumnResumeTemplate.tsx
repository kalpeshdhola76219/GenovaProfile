import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  RESUME_SHEET_BASE_STYLE,
  ResumeBulletItem,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const TwoColumnResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Full-height Left Dark Sidebar Backdrop across all pages */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '35%',
          backgroundColor: '#0f172a',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <ResumeTwoColumnTable
        leftWidth="35%"
        rightWidth="65%"
        gapPx={0}
        style={{ position: 'relative', zIndex: 1 }}
        leftClassName="text-white no-justify"
        leftStyle={{ padding: '28px', color: '#ffffff' }}
        rightStyle={{ padding: '28px' }}
        left={
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                {personal.fullName || 'Full Name'}
              </h1>
              <p className="text-xs text-sky-400 mt-1 font-medium no-justify">
                {personal.professionalTitle || 'Software Engineer'}
              </p>
            </div>
            <div className="text-xs text-slate-300">
              <div className="no-justify" style={{ marginBottom: '16px' }}>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  Contact
                </h2>
                <div className="space-y-1 text-slate-300">
                  {contact.email && <div>{contact.email}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                  {(contact.city || contact.state || contact.country) && (
                    <div>📍 {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>
                  )}
                  {contact.linkedin && <div>{contact.linkedin}</div>}
                  {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
                </div>
              </div>
              {skills.length > 0 && (
                <div className="no-justify" style={{ marginBottom: '16px' }}>
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                    Skills
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }} className="no-justify">
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
                    {education.map((e) => (
                      <div key={e.id}>
                        <div className="font-semibold text-white">{e.degree}</div>
                        <div className="text-slate-400 text-[11px]">
                          {e.institute} • {e.endYear}
                          {e.score
                            ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}`
                            : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        right={
          <div>
            {summary && (
              <div className="avoid-break" style={{ marginBottom: '20px' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Profile Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
              </div>
            )}
            {experience.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                  Work Experience
                </h2>
                <div>
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      data-entry="true"
                      style={{ marginBottom: idx < experience.length - 1 ? '14px' : '0px' }}
                    >
                      <ResumeSplitRow
                        className="text-xs font-bold"
                        leftClassName="text-slate-900"
                        left={exp.jobTitle}
                        rightClassName="text-slate-500 font-normal text-[11px]"
                        rightWidth="136px"
                        right={
                          <>
                            {exp.startDate} -{' '}
                            {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                              ? 'Present'
                              : exp.endDate || 'Present'}
                          </>
                        }
                      />
                      <div className="text-xs font-medium text-sky-800">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </div>
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
              <div style={{ marginBottom: '20px' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Key Projects
                </h2>
                <div className="text-xs">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      data-entry="true"
                      className="avoid-break"
                      style={{ marginBottom: idx < projects.length - 1 ? '8px' : '0px' }}
                    >
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
            {(certifications.length > 0 || achievements.length > 0) && (
              <div className="avoid-break" style={{ marginBottom: customSections.length > 0 ? '20px' : '0px' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Certifications & Honors
                </h2>
                <div className="space-y-1 text-xs text-slate-700">
                  {certifications.map((c) => (
                    <ResumeBulletItem key={c.id} markerClassName="text-slate-400">
                      <strong>{c.name}</strong> ({c.issuer})
                    </ResumeBulletItem>
                  ))}
                  {achievements.map((a) => (
                    <ResumeBulletItem key={a.id} markerClassName="text-slate-400">
                      <strong>{a.title}</strong>: {a.description}
                    </ResumeBulletItem>
                  ))}
                </div>
              </div>
            )}
            {customSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="avoid-break"
                style={{ marginBottom: idx < customSections.length - 1 ? '16px' : '0px' }}
              >
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  {sec.title}
                </h2>
                <ResumeCustomSectionBody
                  items={sec.items}
                  content={sec.content}
                  columns={2}
                  textClassName="text-xs text-slate-700"
                />
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

