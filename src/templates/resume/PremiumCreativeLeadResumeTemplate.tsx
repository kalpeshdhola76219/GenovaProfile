import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass, getFontFamilyCss, FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  formatDateRange,
  formatEducationScore,
  formatResumeLocation,
  getValidCertifications,
  joinNonEmpty,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const PremiumCreativeLeadResumeTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, summary, experience = [], education = [], skills = [], projects = [], certifications = [], customSections = [], customization } = sanitizeDocumentTextFields(data);
  const displayLocation = formatResumeLocation(contact);
  const validCertifications = getValidCertifications(certifications);
  const terracotta = customization.primaryColor || '#c2410c'; // Burnt Terracotta
  const fontClass = getStaticFontClass(customization.fontFamily, 'playfair');
  const fontFamilyCss = getFontFamilyCss(customization.fontFamily, 'playfair');
  const baseFontSize = customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet min-h-[1123px] p-10 bg-[#faf8f5] text-stone-900 shadow-sm relative ${baseFontSize}`}
      style={{ fontFamily: FONT_FAMILY_CSS_MAP.sans }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-2.5" style={{ backgroundColor: terracotta }}></div>

      <div className="pb-6 mb-6 border-b border-stone-300">
        <ResumeHeaderTable
          left={
            <>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-700 block mb-1">
                Creative Portfolio & Resume
              </span>
              <h1 className={`text-4xl font-black tracking-tight text-stone-900 ${fontClass}`} style={{ fontFamily: fontFamilyCss }}>
                {personal.fullName || 'CREATIVE DIRECTOR'}
              </h1>
              <p className="text-sm font-semibold text-stone-600 mt-1 font-sans no-justify">
                {personal.professionalTitle || 'Design Lead & Product Experience Strategist'}
              </p>
            </>
          }
          rightClassName="text-right text-xs font-sans text-stone-500 space-y-1 no-justify"
          right={
            <>
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.phone && <div>✆ {contact.phone}</div>}
              {displayLocation && <div>📍 {displayLocation}</div>}
              {contact.linkedin && <div>🔗 {contact.linkedin}</div>}
              {(contact.portfolio || contact.website) && <div>🌐 {contact.portfolio || contact.website}</div>}
            </>
          }
        />
      </div>

      {summary && (
        <div className="mb-6 avoid-break bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs text-stone-700 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                Professional Experience
              </h2>
              <div className="space-y-4 font-sans">
                {experience.map((exp) => (
                  <div key={exp.id} data-entry="true">
                    <ResumeSplitRow
                      leftClassName="font-bold text-sm text-stone-900"
                      left={exp.jobTitle}
                      rightClassName="text-xs text-stone-500"
                      right={formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking, ' – ')}
                    />
                    {joinNonEmpty([exp.company, exp.location], ' • ') && (
                      <div className="text-xs font-semibold text-orange-800">
                        {joinNonEmpty([exp.company, exp.location], ' • ')}
                      </div>
                    )}
                    <ResumeDescriptionBlock
                      text={exp.description}
                      wrapperClassName="mt-1 space-y-1 text-xs text-stone-700"
                      markerClassName="text-stone-400"
                      paragraphClassName="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed"
                    />
                    {exp.achievements && (
                      <div className="text-xs text-stone-700 mt-1 pl-3 border-l-2 border-orange-300">
                        <ResumeDescriptionBlock
                          text={exp.achievements}
                          wrapperClassName="space-y-1 text-xs text-stone-700"
                          markerClassName="text-stone-400"
                          paragraphClassName="text-xs text-stone-700 whitespace-pre-line leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3 pb-1 border-b border-stone-200 font-sans">
                Featured Projects & Case Studies
              </h2>
              <div className="grid grid-cols-2 gap-3 font-sans">
                {projects.map((p) => (
                  <div key={p.id} data-entry="true" className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs avoid-break">
                    <div className="font-bold text-xs text-stone-900">{p.name}</div>
                    {p.role && <div className="text-[11px] text-orange-700 font-medium">{p.role}</div>}
                    {p.description && <p className="text-[11.5px] text-stone-600 mt-1">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-6 font-sans no-justify">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Skills & Toolkit
              </h2>
              <div className="flex flex-wrap gap-1.5 no-justify">
                {skills.map((s) => (
                  <span key={s.id} className="px-2 py-0.5 rounded text-[11px] bg-orange-50 text-orange-900 border border-orange-200/60 font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((e) => {
                  const instYear = e.institute
                    ? `${e.institute}${e.endYear ? ` (${e.endYear})` : ''}`
                    : e.endYear || '';
                  const subline = joinNonEmpty([instYear, formatEducationScore(e.score)], ' • ');
                  return (
                    <div key={e.id} data-entry="true">
                      <div className="font-semibold text-stone-900">{e.degree}</div>
                      {subline && <div className="text-stone-500 text-[11.5px]">{subline}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {validCertifications.length > 0 && (
            <section className="avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                Certifications
              </h2>
              <div className="space-y-2 text-xs">
                {validCertifications.map((c) => (
                  <div key={c.id} data-entry="true">
                    <div className="font-semibold text-stone-900">{c.name}</div>
                    {(c.issuer || c.issueDate) && (
                      <ResumeSplitRow
                        className="text-stone-500 text-[11.5px]"
                        wrapRight
                        left={c.issuer}
                        rightClassName="text-stone-400 font-mono text-[10.5px]"
                        right={c.issueDate}
                      />
                    )}
                    {c.credentialId && <div className="text-[10px] text-stone-400 font-mono">ID: {c.credentialId}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {customSections && customSections.length > 0 && (
            <div className="space-y-5">
              {customSections.map((sec) => (
                <section key={sec.id} className="avoid-break">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
                    {sec.title}
                  </h2>
                  {sec.items && sec.items.length > 0 ? (
                    <div className="space-y-1 text-[11.5px]">
                      {sec.items.map((it) => (
                        <div key={it.id}>
                          <ResumeSplitRow
                            wrapRight
                            leftClassName="text-stone-500 font-medium"
                            left={`${it.key}:`}
                            rightClassName="text-stone-800 font-semibold"
                            right={it.value}
                            rightWidth="52%"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11.5px] text-stone-700 whitespace-pre-line leading-relaxed">{sec.content}</p>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
