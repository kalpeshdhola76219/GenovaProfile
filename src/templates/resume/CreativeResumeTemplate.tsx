import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  CONTACT_ROW_STYLE,
  formatResumeLocation,
  getValidCertifications,
  ResumeDescriptionBlock,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const CreativeResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience, education, skills, projects, certifications, customSections, customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const accent = customization.accentColor || '#ea580c'; // Vibrant Terracotta / Orange

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white min-h-[1123px]"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Creative Header */}
      <div className="border-b pb-6 mb-6 border-slate-200">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-white mb-1" style={{ backgroundColor: accent }}>
            {personal.professionalTitle || 'Creative Technologist'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personal.fullName || 'Full Name'}
          </h1>
          <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 no-justify" style={CONTACT_ROW_STYLE}>
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>&bull; {contact.phone}</span>}
            {displayLocation && <span>&bull; {displayLocation}</span>}
            {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
            {(contact.portfolio || contact.website) && <span className="font-semibold text-orange-600">&bull; {contact.portfolio || contact.website}</span>}
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-5 avoid-break">
          <p className="text-xs leading-relaxed text-slate-700 bg-orange-50/50 p-3 rounded-xl border border-orange-100">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: accent }}></span>
            Experience & Impact
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} data-entry="true" className="pl-3 border-l-2 border-orange-200">
                <ResumeSplitRow
                  className="text-xs font-bold"
                  leftClassName="text-slate-900"
                  left={<>{exp.jobTitle} &bull; <span className="text-orange-600">{exp.company}</span></>}
                  rightClassName="text-slate-400 text-[11px]"
                  right={<>{exp.startDate} - {(exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')) ? 'Present' : (exp.endDate || 'Present')}</>}
                />
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                <ResumeDescriptionBlock
                  text={exp.achievements}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-600"
                  paragraphClassName="text-xs text-slate-600 mt-0.5 whitespace-pre-line"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: accent }}></span>
            Portfolio & Selected Works
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/40 avoid-break">
                <div className="font-bold text-slate-900">{p.name}</div>
                {p.technologies && <div className="text-[11px] text-orange-600">{p.technologies}</div>}
                <p className="text-slate-600 mt-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(education.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-4 no-justify">
          {education.length > 0 && (
            <div className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Education</h2>
              <div className="space-y-1.5 text-xs">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold">{e.degree}</div>
                    <div className="text-slate-500">
                      {e.institute} &bull; {e.endYear}
                      {e.score ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div className="avoid-break no-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Toolkit</h2>
              <div className="flex flex-wrap gap-1 no-justify">
                {skills.map((s) => (
                  <span key={s.id} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {validCertifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Certifications & Accreditations
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {validCertifications.map((c) => (
              <div key={c.id} className="p-2 rounded-lg border border-slate-200 bg-slate-50/40 avoid-break">
                <div className="font-bold text-slate-900">{c.name}</div>
                {(c.issuer || c.issueDate) && (
                  <ResumeSplitRow
                    className="text-slate-500 text-[11px] mt-0.5"
                    left={c.issuer}
                    rightClassName="text-slate-400 font-mono text-[10px]"
                    right={c.issueDate}
                    rightWidth="88px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-2 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">{sec.title}</h2>
          {sec.items && sec.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
              {sec.items.map((it) => (
                <div key={it.id}><span className="font-bold">{it.key}:</span> {it.value}</div>
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

