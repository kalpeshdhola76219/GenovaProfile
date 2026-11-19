import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  RESUME_SHEET_BASE_STYLE,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  ResumeTwoColGrid,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumTechLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const {
    personal,
    contact,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    customSections = [],
    customization,
  } = sanitizeDocumentTextFields(data);

  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[14.5px]' : 'text-[13px]';

  const educationBlock = education.length > 0 ? (
    <div className="avoid-break">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
        // Education
      </h2>
      <div className="space-y-1.5 text-xs">
        {education.map((e) => (
          <div key={e.id}>
            <div className="font-bold text-slate-900">{e.degree}</div>
            <div className="text-slate-500">
              {e.institute} • {e.endYear}
              {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const certBlock = certifications.length > 0 ? (
    <div className="avoid-break">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
        // Cloud & Security Accreditations
      </h2>
      <div className="space-y-1.5 text-xs">
        {certifications.map((c) => (
          <div key={c.id}>
            <strong className="text-slate-900">{c.name}</strong>
            <div className="text-slate-500 text-[11px]">{c.issuer}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div
      className={`document-page-sheet p-9 bg-white text-slate-900 shadow-sm ${baseFontSize}`}
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        padding: '36px',
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
      }}
    >
      {/* Header */}
      <ResumeHeaderTable
        className="pb-5 mb-5 border-b-2 border-slate-900"
        left={
          <>
            <h1 className={`text-3xl font-black uppercase tracking-tight text-slate-950 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
              {personal.fullName || 'ENGINEERING ARCHITECT'}
            </h1>
            <p className="text-sm font-semibold text-indigo-900 font-mono mt-0.5 no-justify">
              {personal.professionalTitle || 'Staff Software Engineer & Distributed Systems Lead'}
            </p>
          </>
        }
        rightClassName="text-right text-xs font-mono text-slate-600 space-y-0.5 no-justify"
        right={
          <>
            {contact.email && <div>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {(contact.portfolio || contact.website || contact.github) && (
              <div className="text-indigo-600 font-semibold">{contact.portfolio || contact.website || contact.github}</div>
            )}
            {contact.linkedin && <div>{contact.linkedin}</div>}
            {(contact.city || contact.state || contact.country) && (
              <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>
            )}
          </>
        }
      />

      {/* Summary */}
      {summary && (
        <div className="mb-5 avoid-break bg-slate-50 p-3.5 rounded border border-slate-200">
          <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5 avoid-break no-justify">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
            // Core Technical Proficiencies & Infrastructure
          </h2>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs no-justify" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded font-medium"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200 font-mono">
            // Engineering Experience & Architectural Impact
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  leftClassName="font-bold text-sm text-slate-950"
                  left={
                    <>
                      {exp.jobTitle} <span className="font-normal text-slate-400">@</span>{' '}
                      <span className="text-indigo-900 font-semibold">{exp.company}</span>
                    </>
                  }
                  rightClassName="text-xs font-mono text-slate-500"
                  right={
                    <>
                      {exp.startDate} –{' '}
                      {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                        ? 'Present'
                        : exp.endDate || 'Present'}
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
                  <div className="text-xs text-slate-800 mt-1 pl-3 border-l-2 border-indigo-400 whitespace-pre-line leading-relaxed">
                    <ResumeDescriptionBlock
                      text={exp.achievements}
                      wrapperClassName="space-y-1 text-xs text-slate-800"
                      markerClassName="text-indigo-400"
                      paragraphClassName="text-xs text-slate-800 whitespace-pre-line leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 pb-1 border-b border-slate-200 font-mono">
            // Key Systems & Open Source Projects
          </h2>
          <ResumeTwoColGrid
            className="text-xs"
            gapX={12}
            gapY={12}
            items={projects.map((p) => (
              <div key={p.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 font-mono">{p.name}</div>
                {p.technologies && <div className="text-[11px] text-indigo-700 font-mono mt-0.5">{p.technologies}</div>}
                {p.description && <p className="text-slate-600 text-[11.5px] mt-1">{p.description}</p>}
              </div>
            ))}
          />
        </div>
      )}

      {/* Education & Certifications */}
      {(educationBlock || certBlock) && (
        <div className="pt-2 border-t border-slate-200 mb-5 no-justify" style={{ marginBottom: '20px' }}>
          {educationBlock && certBlock ? (
            <ResumeTwoColumnTable
              leftWidth="50%"
              rightWidth="50%"
              gapPx={24}
              left={educationBlock}
              right={certBlock}
            />
          ) : (
            educationBlock || certBlock
          )}
        </div>
      )}

      {/* Standalone Achievements / Accolades */}
      {achievements && achievements.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 pb-1 border-b border-slate-200 font-mono">
            // Key Accolades & Milestones
          </h2>
          <div className="space-y-1.5 text-xs">
            {achievements.map((a) => (
              <div key={a.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  left={
                    <>
                      <span className="font-semibold text-slate-900">{a.title}</span>
                      {a.description && <span className="text-slate-600 ml-1.5">— {a.description}</span>}
                    </>
                  }
                  rightClassName="text-xs font-mono text-slate-500"
                  right={a.date}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="mb-2">
          {customSections.map((sec, idx) => (
            <div key={sec.id} className="avoid-break" style={{ marginBottom: idx < customSections.length - 1 ? '16px' : '0px' }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 pb-1 border-b border-slate-200 font-mono">
                // {sec.title ? sec.title.toUpperCase() : 'ADDITIONAL DETAILS'}
              </h2>
              {sec.items && sec.items.length > 0 && (
                <ResumeTwoColGrid
                  className="text-xs"
                  gapX={16}
                  gapY={4}
                  items={sec.items.map((i) => (
                    <div key={i.id} className="py-0.5 border-b border-slate-100 font-mono">
                      <ResumeSplitRow
                        wrapRight
                        leftClassName="text-slate-500 text-[11px]"
                        left={`${i.key}:`}
                        rightClassName="font-medium text-slate-900"
                        right={i.value}
                      />
                    </div>
                  ))}
                />
              )}
              {sec.content && sec.content.trim() && (
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed mt-1">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
