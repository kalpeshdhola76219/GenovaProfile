import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  METADATA_ROW_STYLE,
  ResumeBulletItem,
  ResumeDescriptionBlock,
} from './resumeTemplateUtils';

export const ExecutivePremiumResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 bg-white"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.cormorant,
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-start border-b-2 border-stone-800 pb-4 mb-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', columnGap: '16px' }}>
        <div style={METADATA_LEFT_STYLE}>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-stone-900 font-cinzel" style={{ fontFamily: FONT_FAMILY_CSS_MAP.cinzel }}>
            {personal.fullName || 'FULL NAME'}
          </h1>
          <p className="text-sm font-semibold text-stone-600 mt-1 font-sans no-justify">
            {personal.professionalTitle || 'Executive Officer & Strategic Advisor'}
          </p>
        </div>
        <div className="text-right text-xs font-sans text-stone-600 space-y-0.5 no-justify" style={{ flexShrink: 0 }}>
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {(contact.city || contact.state || contact.country) && <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</div>}
          {contact.linkedin && <div>{contact.linkedin}</div>}
          {(contact.portfolio || contact.website) && <div>{contact.portfolio || contact.website}</div>}
        </div>
      </div>

      {summary && (
        <div className="mb-5 avoid-break bg-stone-50 p-3.5 border-l-4 border-stone-800">
          <p className="text-sm text-stone-800 leading-relaxed font-cormorant">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-3">
            Executive History
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-entry>
                <div className="flex justify-between items-baseline" style={METADATA_ROW_STYLE}>
                  <span className="font-bold text-base text-stone-950" style={METADATA_LEFT_STYLE}>{exp.jobTitle} • <span className="font-semibold text-stone-700">{exp.company}</span></span>
                  <span className="text-xs font-sans text-stone-500" style={METADATA_RIGHT_STYLE}>{exp.startDate} &ndash; {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</span>
                </div>
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-700"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-stone-800 pl-3 border-l-2 border-stone-300"
                  markerClassName="text-stone-400"
                  paragraphClassName="text-xs text-stone-800 mt-1 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-stone-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
            Key Initiatives & Strategic Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry>
                <div className="flex justify-between items-baseline font-bold text-stone-900" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{p.name}</span>
                  {p.technologies && <span className="font-normal text-stone-500" style={METADATA_RIGHT_STYLE}>{p.technologies}</span>}
                </div>
                {p.description && <p className="text-stone-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-sm text-stone-950">{e.degree}</div>
                  <div className="text-stone-600 font-sans">{e.institute} • {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-2">
              Core Competencies
            </h2>
            <p className="text-xs text-stone-800 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}
      </div>

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-1">
            Certifications & Honors
          </h2>
          <div className="text-xs text-stone-800 space-y-0.5" style={BULLET_LIST_STYLE}>
            {certifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-stone-400">
                {c.name} ({c.issuer})
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
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 font-cinzel border-b border-stone-300 pb-1 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><strong>{i.key}:</strong> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
