import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  BULLET_LIST_STYLE,
  formatDateRange,
  formatEducationScore,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeBulletItem,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const FinanceProfessionalResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const primaryContactLine = [contact.phone, contact.email].filter(Boolean).join(' | ');
  const secondaryContactLine = [displayLocation, contact.linkedin, contact.portfolio || contact.website].filter(Boolean).join(' | ');

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-900 bg-white min-h-[1123px]"
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
            {primaryContactLine && <div>{primaryContactLine}</div>}
            {secondaryContactLine && <div>{secondaryContactLine}</div>}
          </>
        }
      />

      {summary && (
        <div className="mb-4 avoid-break">
          <p className="text-xs leading-relaxed text-justify text-slate-800">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
            Professional Experience & Quantitative Track Record
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  left={<>{exp.jobTitle}{exp.jobTitle && exp.company ? ', ' : ''}{exp.company && <span className="font-semibold text-emerald-900">{exp.company}</span>}</>}
                  rightClassName="font-mono text-[11px] text-slate-600"
                  right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' - ')}
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
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
            Key Financial Projects & Transactions
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id} data-entry="true" className="avoid-break">
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

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
                Education & Honors
              </h2>
              <div className="space-y-1.5 text-xs">
                {education.map((e) => {
                  const titleLine = joinNonEmpty([e.degree, e.institute], ' • ');
                  const metaLine = joinNonEmpty([e.endYear, formatEducationScore(e.score)], ' • ');
                  return (
                    <div key={e.id} data-entry="true">
                      {titleLine && <div className="font-bold">{titleLine}</div>}
                      {metaLine && <div className="text-slate-500 font-mono text-[11px]">{metaLine}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-2 border-l-4 border-emerald-800">
                Financial Modeling & Skills
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed no-justify">
                {joinNonEmpty(skills.map((s) => s.name), ' • ')}
              </p>
            </div>
          )}
        </div>
      )}

      {validCertifications.length > 0 && (
        <div className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-1.5 border-l-4 border-emerald-800">
            Certifications (CFA / FRM / Licensures)
          </h2>
          <div className="text-xs space-y-1 text-slate-800" style={BULLET_LIST_STYLE}>
            {validCertifications.map((c) => (
              <ResumeBulletItem key={c.id} markerClassName="text-emerald-700">
                {c.name && <strong>{c.name}</strong>}
                {c.name && c.issuer ? <> &bull; </> : ''}
                {c.issuer}
                {c.issueDate ? ` (${c.issueDate})` : ''}
              </ResumeBulletItem>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-2 py-0.5 mb-1 border-l-4 border-emerald-800">{sec.title}</h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
              {sec.items.map((it) => (
                <div key={it.id}><span className="font-semibold text-slate-900">{it.key}:</span> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-700 whitespace-pre-line">{sec.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};
