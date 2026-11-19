import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  RESUME_SHEET_BASE_STYLE,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  ResumeTwoColGrid,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumCreativeLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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
  const terracotta = customization.primaryColor || '#c2410c'; // Burnt Terracotta
  const fontClass = getStaticFontClass(customization.fontFamily, 'playfair');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'playfair');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-10 bg-[#faf8f5] text-stone-900 shadow-sm relative ${baseFontSize}`}
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#faf8f5',
        padding: '40px',
        fontFamily: FONT_FAMILY_CSS_MAP.sans,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '10px',
          backgroundColor: terracotta,
          pointerEvents: 'none',
        }}
      />

      <div className="pb-6 mb-6 border-b border-stone-300" style={{ paddingBottom: '22px', marginBottom: '22px', borderBottom: '1px solid #d6d3d1' }}>
        <ResumeHeaderTable
          left={
            <>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-700 block mb-1">
                Creative Portfolio & Resume
              </span>
              <h1 className={`text-4xl font-black tracking-tight text-stone-900 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
                {personal.fullName || 'CREATIVE DIRECTOR'}
              </h1>
              <p className="text-sm font-semibold text-stone-600 mt-1 font-sans no-justify">
                {personal.professionalTitle || 'Design Lead & Product Experience Strategist'}
              </p>
            </>
          }
          rightClassName="text-right text-xs font-sans text-stone-500 space-y-1 no-justify"
          right={
            <>
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.phone && <div>✆ {contact.phone}</div>}
              {(contact.city || contact.state || contact.country) && (
                <div>📍 {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>
              )}
              {contact.linkedin && <div>🔗 {contact.linkedin}</div>}
              {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
            </>
          }
        />
      </div>

      {summary && (
        <div
          className="mb-6 avoid-break bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs"
          style={{ marginBottom: '22px' }}
        >
          <p className="text-xs text-stone-700 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      <ResumeTwoColumnTable
        leftWidth="65%"
        rightWidth="35%"
        gapPx={28}
        left={
          <div>
            {experience.length > 0 && (
              <section style={{ marginBottom: projects.length > 0 ? '24px' : '0px' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                  Professional Experience
                </h2>
                <div className="font-sans">
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      data-entry="true"
                      style={{ marginBottom: idx < experience.length - 1 ? '16px' : '0px' }}
                    >
                      <ResumeSplitRow
                        leftClassName="font-bold text-sm text-stone-900"
                        left={exp.jobTitle}
                        rightClassName="text-xs text-stone-500"
                        right={
                          <>
                            {exp.startDate} –{' '}
                            {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                              ? 'Present'
                              : exp.endDate || 'Present'}
                          </>
                        }
                      />
                      <div className="text-xs font-semibold text-orange-800">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </div>
                      <ResumeDescriptionBlock
                        text={exp.description}
                        wrapperClassName="mt-1 space-y-1 text-xs text-stone-700"
                        markerClassName="text-stone-400"
                        paragraphClassName="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed"
                      />
                      {exp.achievements && (
                        <div className="text-xs text-stone-700 mt-1 pl-3 border-l-2 border-orange-300">
                          <ResumeDescriptionBlock
                            text={exp.achievements}
                            wrapperClassName="space-y-1 text-xs text-stone-700"
                            markerClassName="text-stone-400"
                            paragraphClassName="text-xs text-stone-700 whitespace-pre-line leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                  Featured Projects & Case Studies
                </h2>
                <ResumeTwoColGrid
                  className="font-sans"
                  gapX={12}
                  gapY={12}
                  items={projects.map((p) => (
                    <div key={p.id} className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs avoid-break">
                      <div className="font-bold text-xs text-stone-900">{p.name}</div>
                      {p.role && <div className="text-[11px] text-orange-700 font-medium">{p.role}</div>}
                      {p.description && <p className="text-[11.5px] text-stone-600 mt-1">{p.description}</p>}
                    </div>
                  ))}
                />
              </section>
            )}
          </div>
        }
        rightClassName="font-sans no-justify"
        right={
          <div>
            {skills.length > 0 && (
              <section style={{ marginBottom: '22px' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                  Skills & Toolkit
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} className="no-justify">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[11px] bg-orange-50 text-orange-900 border border-orange-200/60 font-medium"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section style={{ marginBottom: '22px' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                  Education
                </h2>
                <div className="space-y-2 text-xs">
                  {education.map((e) => (
                    <div key={e.id}>
                      <div className="font-semibold text-stone-900">{e.degree}</div>
                      <div className="text-stone-500 text-[11.5px]">
                        {e.institute} {e.endYear ? `(${e.endYear})` : ''}
                        {e.score
                          ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}`
                          : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications && certifications.length > 0 && (
              <section className="avoid-break" style={{ marginBottom: '22px' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                  Certifications
                </h2>
                <div className="space-y-2 text-xs">
                  {certifications.map((c) => (
                    <div key={c.id}>
                      <div className="font-semibold text-stone-900">{c.name}</div>
                      <ResumeSplitRow
                        className="text-stone-500 text-[11.5px]"
                        wrapRight
                        left={c.issuer}
                        rightClassName="text-stone-400 font-mono text-[10.5px]"
                        right={c.issueDate}
                      />
                      {c.credentialId && <div className="text-[10px] text-stone-400 font-mono">ID: {c.credentialId}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {achievements && achievements.length > 0 && (
              <section className="avoid-break" style={{ marginBottom: '22px' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                  Awards & Recognition
                </h2>
                <div className="space-y-2 text-xs text-stone-700">
                  {achievements.map((a) => (
                    <div key={a.id}>
                      <div className="font-semibold text-stone-900">{a.title}</div>
                      {a.description && <div className="text-stone-500 text-[11px]">{a.description}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {customSections && customSections.length > 0 && (
              <div>
                {customSections.map((sec, idx) => (
                  <section
                    key={sec.id}
                    className="avoid-break"
                    style={{ marginBottom: idx < customSections.length - 1 ? '20px' : '0px' }}
                  >
                    <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                      {sec.title}
                    </h2>
                    <ResumeCustomSectionBody
                      items={sec.items}
                      content={sec.content}
                      columns={1}
                      textClassName="text-[11.5px] text-stone-700"
                      keyClassName="text-stone-500 font-medium"
                    />
                  </section>
                ))}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

