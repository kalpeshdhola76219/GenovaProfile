import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  CONTACT_CENTER_ROW_STYLE,
  formatResumeLocation,
  getValidCertifications,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ClassicResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);

  return (
    <div
      className="document-page-sheet p-10 font-cormorant text-stone-900 bg-white min-h-[1123px]"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.cormorant,
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="text-center pb-4 border-b border-stone-400 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-stone-900 font-cinzel" style={{ fontFamily: FONT_FAMILY_CSS_MAP.cinzel }}>
          {personal.fullName || 'FULL NAME'}
        </h1>
        {personal.professionalTitle && (
          <p className="text-sm font-semibold tracking-wider text-stone-700 italic mt-0.5">{personal.professionalTitle}</p>
        )}
        <div className="text-xs font-sans text-stone-600 mt-1 flex flex-wrap justify-center gap-3 no-justify" style={CONTACT_CENTER_ROW_STYLE}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {displayLocation && <span>• {displayLocation}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>• {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-stone-800 text-justify">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  left={<>{exp.jobTitle}, <em>{exp.company}</em></>}
                  rightClassName="font-sans font-normal text-stone-500 text-[11px]"
                  right={<>{exp.startDate} – {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-700"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-700 pl-2 border-l border-stone-300"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-700 mt-0.5 whitespace-pre-line pl-2 border-l border-stone-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="space-y-1 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold">{e.degree}</div>
                    <div className="text-stone-600 font-sans">
                      {e.institute} • {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1.5">
                Skills
              </h2>
              <p className="text-xs text-stone-800 leading-relaxed no-justify">
                {skills.map((s) => s.name).join(' • ')}
              </p>
            </div>
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Projects
          </h2>
          <div className="space-y-1 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={p.name}
                  rightClassName="font-sans font-normal text-stone-500"
                  right={p.link}
                />
                <p className="text-stone-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {validCertifications.length > 0 && (
        <div className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-stone-700 space-y-0.5" style={BULLET_LIST_STYLE}>
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-stone-400">
                {c.name}{c.issuer ? ` (${c.issuer})` : ''}{c.issueDate ? ` • ${c.issueDate}` : ''}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-0.5 mb-1">{sec.title}</h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs text-stone-700">
              {sec.items.map((it) => (
                <div key={it.id}><span className="font-bold">{it.key}:</span> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-700 whitespace-pre-line">{sec.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

