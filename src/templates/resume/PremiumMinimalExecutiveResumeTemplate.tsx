import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumMinimalExecutiveResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);
  const primary = customization.primaryColor || '#0f172a'; // Deep Executive Slate
  const fontClass = getStaticFontClass(customization.fontFamily, 'cormorant');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'cormorant');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const displayFullName = personal.fullName || '';
  const displayTitle = personal.professionalTitle || '';
  const displayEmail = contact.email || '';
  const displayPhone = contact.phone || '';
  const displayLocation = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');
  const displayLinkedin = contact.linkedin || '';

  const displaySummary = summary || '';
  const displaySkills = skills || [];
  const displayExperience = experience || [];
  const displayEducation = education || [];

  return (
    <div
      className={`document-page-sheet p-10 bg-white text-slate-900 shadow-sm ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}
    >
      <div className="border-b-2 pb-5 mb-6" style={{ borderColor: primary }}>
        <ResumeHeaderTable
          left={
            <>
              <h1 className={`text-3xl font-extrabold uppercase tracking-wider text-slate-950 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
                {displayFullName || 'FULL NAME'}
              </h1>
              {displayTitle && (
                <p className="text-sm font-semibold tracking-wide text-slate-600 mt-0.5 font-sans no-justify">
                  {displayTitle}
                </p>
              )}
            </>
          }
          rightClassName="text-right text-xs text-slate-600 space-y-0.5 font-sans no-justify"
          right={
            <>
              {displayEmail && <div>{displayEmail}</div>}
              {displayPhone && <div>{displayPhone}</div>}
              {displayLocation && <div>{displayLocation}</div>}
              {displayLinkedin && <div>{displayLinkedin}</div>}
              {(contact.portfolio || contact.website) && <div>{contact.portfolio || contact.website}</div>}
            </>
          }
        />
      </div>

      {displaySummary && (
        <div className="mb-6 avoid-break bg-slate-50 p-4 rounded border-l-4" style={{ borderColor: primary }}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
            Executive Profile & Strategic Scope
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-sans font-normal">{displaySummary}</p>
        </div>
      )}

      {displaySkills.length > 0 && (
        <div className="mb-6 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5 font-sans">
            Core Leadership & Strategic Competencies
          </h2>
          <div className="flex flex-wrap gap-2 text-xs font-sans no-justify">
            {displaySkills.map((s) => (
              <span key={s.id} className="px-2.5 py-1 bg-slate-100 rounded text-slate-800 font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {displayExperience.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3.5 font-sans">
            Executive & Leadership Experience
          </h2>
          <div className="space-y-4 font-sans">
            {displayExperience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  leftClassName="font-bold text-sm text-slate-950"
                  left={
                    <>
                      {exp.jobTitle} {exp.company ? <><span className="font-normal text-slate-500">|</span> <span className="font-semibold text-slate-700">{exp.company}</span></> : ''}
                    </>
                  }
                  rightClassName="text-xs text-slate-500 font-medium"
                  right={
                    <>
                      {exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}
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
                  <div className="text-xs text-slate-800 mt-1.5 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-300">
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

      {projects && projects.length > 0 && (
        <div className="mb-6 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Key Initiatives & Strategic Projects
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="text-xs">
                <ResumeSplitRow
                  wrapRight
                  leftClassName="font-bold text-slate-900"
                  left={<>{p.name} {p.role ? `(${p.role})` : ''}</>}
                  rightClassName="text-slate-500 font-normal text-[11px]"
                  right={p.link}
                />
                {p.technologies && <div className="text-[11px] text-slate-500 font-medium">Scope & Tools: {p.technologies}</div>}
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(displayEducation.length > 0 || (certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <div className={`grid ${displayEducation.length > 0 && ((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) ? 'grid-cols-2' : 'grid-cols-1'} gap-6 mb-6 font-sans no-justify`}>
          {displayEducation.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
                Education & Degrees
              </h2>
              <div className="space-y-2 text-xs">
                {displayEducation.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-600">{e.institute} {e.endYear ? `(${e.endYear})` : ''}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
                Certifications & Board Honors
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications && certifications.map((c) => (
                  <div key={c.id}>
                    <strong className="text-slate-900">{c.name}</strong> • {c.issuer} {c.issueDate ? `(${c.issueDate})` : ''}
                  </div>
                ))}
                {achievements && achievements.map((a) => (
                  <div key={a.id}>
                    <strong className="text-slate-900">{a.title}</strong>: {a.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {customSections && customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
            {sec.title}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{sec.content}</p>
        </div>
      ))}
    </div>
  );
};
