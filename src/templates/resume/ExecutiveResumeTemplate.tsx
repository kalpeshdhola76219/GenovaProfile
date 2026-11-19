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
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ExecutiveResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  const educationBlock = education.length > 0 ? (
    <div className="avoid-break">
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
        Education & Credentials
      </h2>
      <div className="space-y-2">
        {education.map((e) => (
          <div key={e.id}>
            <div className="font-bold text-stone-950 text-sm">{e.degree}</div>
            <div className="text-xs text-stone-600">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const skillsBlock = skills.length > 0 ? (
    <div className="avoid-break no-justify">
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
        Strategic Competencies
      </h2>
      <p className="text-xs text-stone-800 leading-relaxed no-justify">
        {skills.map((s) => s.name).join(' • ')}
      </p>
    </div>
  ) : null;

  return (
    <div
      className="document-page-sheet p-10 font-cormorant text-stone-900 bg-white"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        padding: '40px',
        fontFamily: FONT_FAMILY_CSS_MAP.cormorant,
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Executive Header */}
      <div className="text-center pb-5 border-b-2 border-stone-800 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-stone-900 font-cinzel" style={{ fontFamily: FONT_FAMILY_CSS_MAP.cinzel }}>
          {personal.fullName || 'FULL NAME'}
        </h1>
        <p className="text-base font-semibold text-stone-700 tracking-wider mt-1 font-playfair italic" style={{ fontFamily: FONT_FAMILY_CSS_MAP.playfair }}>
          {personal.professionalTitle || 'Executive Leadership & Strategic Direction'}
        </p>
        <div className="text-xs font-sans text-stone-600 mt-2 flex flex-wrap justify-center gap-4 no-justify" style={CONTACT_CENTER_ROW_STYLE}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>&bull; {contact.phone}</span>}
          {(contact.city || contact.state || contact.country) && <span>&bull; {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>}
          {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
          {(contact.portfolio || contact.website) && <span>&bull; {contact.portfolio || contact.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6 avoid-break bg-stone-50 p-4 border-l-4 border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel mb-1">
            Executive Profile
          </h2>
          <p className="text-sm leading-relaxed text-stone-800 font-cormorant">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-3">
            Career Experience & Leadership
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  leftClassName="font-bold text-stone-950 text-base"
                  left={<>{exp.jobTitle} &bull; <span className="font-normal italic">{exp.company}</span></>}
                  rightClassName="text-xs font-sans text-stone-500"
                  right={<>{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-700"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-800 pl-3 border-l-2 border-stone-200"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-800 mt-1 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-stone-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
            Strategic Programs & Key Initiatives
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
                <ResumeSplitRow
                  className="font-bold text-stone-900"
                  wrapRight
                  left={p.name}
                  rightClassName="font-normal text-stone-500"
                  right={p.technologies}
                />
                {p.description && <p className="text-stone-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(educationBlock || skillsBlock) && (
        <div className="mb-6 no-justify" style={{ marginBottom: '24px' }}>
          {educationBlock && skillsBlock ? (
            <ResumeTwoColumnTable
              leftWidth="50%"
              rightWidth="50%"
              gapPx={24}
              left={educationBlock}
              right={skillsBlock}
            />
          ) : (
            educationBlock || skillsBlock
          )}
        </div>
      )}

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
            Board Positions, Honors & Patents
          </h2>
          <div className="text-xs space-y-1 text-stone-800" style={BULLET_LIST_STYLE}>
            {certifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-stone-400">
                {c.name} &bull; {c.issuer}
              </ResumeBulletItem>
            ))}
            {achievements.map((a) => (
              <ResumeBulletItem key={a.id} markerClassName="text-stone-400">
                {a.title}: {a.description}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-1">{sec.title}</h2>
          <ResumeCustomSectionBody
            items={sec.items}
            content={sec.content}
            textClassName="text-xs text-stone-700"
            keyClassName="font-semibold text-stone-900"
            columns={2}
          />
        </div>
      ))}
    </div>
  );
};
