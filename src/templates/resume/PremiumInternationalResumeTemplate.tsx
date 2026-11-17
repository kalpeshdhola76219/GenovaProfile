import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumInternationalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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

  const primary = customization.primaryColor || '#1e3a8a';
  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const displayFullName = personal.fullName || '';
  const displayTitle = personal.professionalTitle || '';
  const displayEmail = contact.email || '';
  const displayPhone = contact.phone || '';
  const displayLocation = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');
  const displayLinkedin = contact.linkedin || '';
  const displaySummary = summary || '';

  return (
    <div
      className={`document-page-sheet flex flex-col bg-white text-slate-800 shadow-sm ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.jakarta }}
    >
      {/* Header Banner */}
      <div
        className="p-8 text-white"
        style={{ backgroundColor: primary }}
      >
        <ResumeHeaderTable
          verticalAlign="middle"
          left={
            <>
              <h1 className={`text-2xl font-extrabold uppercase tracking-wide text-white ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
                {displayFullName || 'FULL NAME'}
              </h1>
              {displayTitle && (
                <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest mt-0.5 no-justify">
                  {displayTitle}
                </p>
              )}
            </>
          }
          rightClassName="text-right text-xs text-blue-100 space-y-1 no-justify"
          right={
            <>
              {displayEmail && <div>✉ {displayEmail}</div>}
              {displayPhone && <div>✆ {displayPhone}</div>}
              {displayLocation && (
                <div>📍 {displayLocation}</div>
              )}
              {displayLinkedin && <div>🔗 {displayLinkedin}</div>}
              {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
            </>
          }
        />
      </div>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[32%] bg-slate-50 p-6 border-r border-slate-200 space-y-6 no-justify">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Core Competencies
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((s) => (
                  <ResumeSplitRow
                    key={s.id}
                    wrapRight
                    leftClassName="font-medium text-slate-700"
                    left={s.name}
                    rightClassName="text-[10px] text-slate-400 capitalize"
                    right={s.level || 'Expert'}
                    rightWidth="68px"
                  />
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Education & Degrees
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-600">{e.institute}</div>
                    <div className="text-[11px] text-slate-400">
                      {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Accreditations
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                Honors & Awards
              </h2>
              <div className="space-y-2 text-xs">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    {a.description && <div className="text-slate-500 text-[11px]">{a.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className="w-[68%] p-7 space-y-6">
          {displaySummary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{displaySummary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} data-entry="true" className="relative pl-4 border-l-2" style={{ borderColor: primary }}>
                    <ResumeSplitRow
                      leftClassName="font-bold text-sm text-slate-900"
                      left={exp.jobTitle}
                      rightClassName="text-xs text-slate-500 font-medium"
                      right={
                        <>
                          {exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
                        </>
                      }
                    />
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <ResumeDescriptionBlock
                      text={exp.description}
                      wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                      markerClassName="text-slate-400"
                      paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                    />
                    {exp.achievements && (
                      <ResumeDescriptionBlock
                        text={exp.achievements}
                        wrapperClassName="mt-1 space-y-1 text-xs text-slate-800"
                        markerClassName="text-slate-500"
                        paragraphClassName="text-xs text-slate-800 mt-1 whitespace-pre-line leading-relaxed"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Key Initiatives & Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((p) => (
                  <div key={p.id} data-entry="true" className="text-xs">
                    <ResumeSplitRow
                      wrapRight
                      leftClassName="font-bold text-slate-900"
                      left={p.name}
                      rightClassName="text-slate-500 text-[11px]"
                      right={p.role}
                    />
                    {p.technologies && <div className="text-[11px] text-slate-500">Tech: {p.technologies}</div>}
                    {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections.length > 0 && (
            <div className="space-y-4">
              {customSections.map((sec) => (
                <div key={sec.id}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    {sec.title}
                  </h2>
                  {sec.items ? (
                    <div className="space-y-1 text-xs">
                      {sec.items.map((it) => (
                        <div key={it.id}><strong>{it.key}:</strong> {it.value}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
