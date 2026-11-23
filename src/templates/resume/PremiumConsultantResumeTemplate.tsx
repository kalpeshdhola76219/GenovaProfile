import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  CONTACT_CENTER_ROW_STYLE,
  formatDateRange,
  formatEducationScore,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumConsultantResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience = [], education = [], skills = [], projects = [], certifications = [], customSections = [], customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const contactItems = [contact.email, contact.phone, displayLocation, contact.linkedin, contact.portfolio || contact.website].filter(Boolean) as string[];
  const navy = customization.primaryColor || '#172554'; // Deep Oxford Navy
  const fontClass = getStaticFontClass(customization.fontFamily, 'cormorant');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'cormorant');
  const baseFontSize = customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet min-h-[1123px] p-10 bg-white text-stone-900 shadow-sm ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}
    >
      <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: navy }}>
        <h1 className={`text-3xl font-extrabold uppercase tracking-widest text-slate-900 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
          {personal.fullName || 'STRATEGY CONSULTANT'}
        </h1>
        {personal.professionalTitle && (
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-1 font-sans">
            {personal.professionalTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-slate-600 font-sans no-justify" style={CONTACT_CENTER_ROW_STYLE}>
            {contactItems.map((item, idx) => (
              <span key={idx}>{idx > 0 ? `• ${item}` : item}</span>
            ))}
          </div>
        )}
      </div>

      {summary && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Executive Summary & Advisory Focus
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-5 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Management Consulting & Advisory Engagements
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  wrapRight
                  leftClassName="font-bold text-sm text-slate-900"
                  left={<>{exp.company}{exp.company && exp.jobTitle ? ' • ' : ''}{exp.jobTitle && <span className="font-semibold text-slate-700">{exp.jobTitle}</span>}</>}
                  rightClassName="text-xs text-slate-500 font-medium"
                  right={joinNonEmpty([exp.location, formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' – ')], ' | ')}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <div className="text-xs text-slate-800 mt-1.5 pl-4 border-l-2 border-slate-300 space-y-1">
                    <ResumeDescriptionBlock
                      text={exp.achievements}
                      wrapperClassName="space-y-1 text-xs text-slate-800"
                      markerClassName="text-slate-500"
                      paragraphClassName="text-xs text-slate-800 whitespace-pre-line leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-5 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Education & Academic Honors
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} data-entry="true">
                <ResumeSplitRow
                  left={
                    <>
                      {e.institute && <span className="font-bold text-slate-900">{e.institute}</span>}
                      {e.institute && e.degree ? <span className="text-slate-600"> — </span> : ''}
                      {e.degree && <span className="text-slate-600">{e.degree}</span>}
                    </>
                  }
                  rightClassName="text-slate-500"
                  right={joinNonEmpty([e.endYear, formatEducationScore(e.score)], ' • ')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-5 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Key Client Engagements & Strategic Programs
          </h2>
          <div className="space-y-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true">
                <ResumeSplitRow
                  className="font-bold text-slate-900"
                  wrapRight
                  left={p.name}
                  rightClassName="font-normal text-slate-500 text-[11px]"
                  right={p.technologies}
                />
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(skills.length > 0 || validCertifications.length > 0) && (
        <div className="grid grid-cols-2 gap-6 font-sans no-justify">
          {skills && skills.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Functional Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 text-xs no-justify">
                {skills.map((s) => (
                  <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {validCertifications.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Certifications & Affiliations
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {validCertifications.map((c) => (
                  <div key={c.id} data-entry="true">
                    {c.name && <strong>{c.name}</strong>}
                    {c.issuer ? `${c.name ? ' ' : ''}(${c.issuer})` : ''}
                    {c.issueDate ? `${c.name || c.issuer ? ' • ' : ''}${c.issueDate}` : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <div className="mt-5 space-y-4 font-sans">
          {customSections.map((sec) => (
            <div key={sec.id} className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {sec.title}
              </h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id} className="py-0.5 border-b border-slate-100">
                      <ResumeSplitRow
                        wrapRight
                        leftClassName="text-slate-500 font-medium"
                        left={`${i.key}:`}
                        rightClassName="font-semibold text-slate-900"
                        right={i.value}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                sec.content && <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
