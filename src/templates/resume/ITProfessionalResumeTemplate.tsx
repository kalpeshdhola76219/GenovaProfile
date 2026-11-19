import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  RESUME_SHEET_BASE_STYLE,
  ResumeBulletItem,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ITProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);

  const educationBlock = education.length > 0 ? (
    <div className="avoid-break">
      <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">
        // Education
      </h2>
      <div className="space-y-1 text-xs">
        {education.map((e) => (
          <div key={e.id}>
            <div className="font-bold">{e.degree}</div>
            <div className="text-slate-500">{e.institute} &bull; {e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const certBlock = (certifications.length > 0 || achievements.length > 0) ? (
    <div className="avoid-break">
      <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">
        // Certifications
      </h2>
      <div className="text-xs space-y-1 text-slate-700" style={BULLET_LIST_STYLE}>
        {certifications.map((c) => (
          <ResumeBulletItem key={c.id}>{c.name} ({c.issuer})</ResumeBulletItem>
        ))}
        {achievements.map((a) => (
          <ResumeBulletItem key={a.id}>{a.title}: {a.description}</ResumeBulletItem>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div
      className="document-page-sheet p-8 font-jetbrains text-slate-900 bg-white"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#ffffff',
        padding: '32px',
        fontFamily: FONT_FAMILY_CSS_MAP.jetbrains,
        fontSize: customization.fontSize === 'sm' ? '11px' : customization.fontSize === 'lg' ? '14px' : '12px',
      }}
    >
      <ResumeHeaderTable
        className="border-b-2 border-slate-900 pb-3 mb-4"
        nowrapRight={false}
        rightWidth="48%"
        left={
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans" style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}>
              {personal.fullName || 'FULL NAME'}
            </h1>
            <p className="text-xs text-indigo-700 font-bold mt-0.5 font-sans no-justify" style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}>
              {personal.professionalTitle || 'Senior Software Engineer / DevOps Architect'}
            </p>
          </>
        }
        rightClassName="text-right text-[11px] text-slate-600 no-justify"
        right={
          <>
            <div>{[contact.email, contact.phone].filter(Boolean).join(' | ')}</div>
            <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')} {contact.linkedin ? `| ${contact.linkedin}` : ''} {(contact.portfolio || contact.website) ? `| ${contact.portfolio || contact.website}` : ''}</div>
          </>
        }
      />

      {summary && (
        <div className="mb-4 avoid-break bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs leading-relaxed text-slate-800">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4 avoid-break no-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Tech Stack & Tooling
          </h2>
          <div className="flex flex-wrap gap-1.5 no-justify">
            {skills.map((s) => (
              <span key={s.id} className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Work History
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  left={<>{exp.jobTitle} @ {exp.company}</>}
                  rightClassName="text-slate-500 font-normal text-[11px]"
                  right={<>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700 pl-2 border-l-2 border-indigo-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-indigo-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-2 font-sans">
            // Engineering Projects & Repositories
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} data-entry="true" className="text-xs avoid-break">
                <ResumeSplitRow
                  className="font-bold"
                  wrapRight
                  left={proj.name}
                  rightClassName="text-indigo-600 font-normal"
                  right={proj.link}
                />
                {proj.technologies && <div className="text-[11px] text-slate-500">[{proj.technologies}]</div>}
                <p className="text-slate-700 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(educationBlock || certBlock) && (
        <div className="mb-3 no-justify" style={{ marginBottom: '12px' }}>
          {educationBlock && certBlock ? (
            <ResumeTwoColumnTable
              leftWidth="50%"
              rightWidth="50%"
              gapPx={16}
              left={educationBlock}
              right={certBlock}
            />
          ) : (
            educationBlock || certBlock
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 mb-1 font-sans">// {sec.title}</h2>
          <ResumeCustomSectionBody
            items={sec.items}
            content={sec.content}
            textClassName="text-xs text-slate-700"
            keyClassName="font-bold text-slate-900"
            columns={2}
          />
        </div>
      ))}
    </div>
  );
};
