import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const FinanceProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, achievements, customSections, customization } = sanitizeDocumentTextFields(data);
  const primary = customization.primaryColor || '#064e3b'; // Deep Emerald / Green

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-900 bg-white"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <ResumeHeaderTable
        className="border-b-2 border-emerald-900 pb-3 mb-4"
        nowrapRight={false}
        rightWidth="48%"
        left={
          <>
            <h1 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">
              {personal.fullName || 'FULL NAME'}
            </h1>
            <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase mt-0.5 no-justify">
              {personal.professionalTitle || 'Finance & Investment Analyst / Quant'}
            </p>
          </>
        }
        rightClassName="text-right text-xs text-slate-600 font-mono no-justify"
        right={
          <>
            <div>{[contact.phone, contact.email].filter(Boolean).join(' | ')}</div>
            <div>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')} {contact.linkedin ? `| ${contact.linkedin}` : ''} {(contact.portfolio || contact.website) ? `| ${contact.portfolio || contact.website}` : ''}</div>
          </>
        }
      />

      {summary && (
        <div className="mb-4 avoid-break">
          <p className="text-xs leading-relaxed text-justify text-slate-800">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
            Professional Experience & Quantitative Track Record
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry>
                <ResumeSplitRow
                  className="text-xs font-bold"
                  left={<>{exp.jobTitle}, <span className="font-semibold text-emerald-900">{exp.company}</span></>}
                  rightClassName="font-mono text-[11px] text-slate-600"
                  right={<>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                {exp.location && <div className="text-[11px] text-slate-500 italic">{exp.location}</div>}
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-0.5 space-y-1 text-xs text-slate-700 pl-2 border-l border-emerald-300"
                  paragraphClassName="text-xs text-slate-700 mt-0.5 whitespace-pre-line leading-relaxed pl-2 border-l border-emerald-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
            Key Financial Projects & Transactions
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry>
                <ResumeSplitRow
                  className="font-bold text-slate-900"
                  wrapRight
                  left={p.name}
                  rightClassName="font-normal text-slate-500 font-mono text-[11px]"
                  right={p.technologies}
                />
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
        {education.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
              Education & Honors
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold">{e.degree} &bull; {e.institute}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{e.endYear}{e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="avoid-break no-justify">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
              Financial Modeling & Skills
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed no-justify">
              {skills.map((s) => s.name).join(' &bull; ')}
            </p>
          </div>
        )}
      </div>

      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-1.5 border-l-4 border-emerald-800">
            Certifications (CFA / FRM / Licensures)
          </h2>
          <div className="text-xs space-y-1 text-slate-800" style={BULLET_LIST_STYLE}>
            {certifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-emerald-700">
                <strong>{c.name}</strong> &bull; {c.issuer}
              </ResumeBulletItem>
            ))}
            {achievements.map((a) => (
              <ResumeBulletItem key={a.id} markerClassName="text-emerald-700">
                <strong>{a.title}</strong>: {a.description}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-1 border-l-4 border-emerald-800">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}
    </div>
  );
};
