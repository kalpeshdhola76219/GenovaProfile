import React from 'react';
import { DocumentData } from '../../types/document';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  RESUME_SHEET_BASE_STYLE,
  ResumeCustomSectionBody,
  ResumeDescriptionBlock,
  ResumeHeaderTable,
  ResumeSplitRow,
  ResumeTwoColumnTable,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const MonacoSovereignTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const {
    personal,
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    customSections,
    customization,
    executiveMetrics,
    showExecutiveMetrics,
  } = sanitizeDocumentTextFields(data);
  const primary = customization.primaryColor || '#0a0a0c'; // Sovereign Obsidian
  const gold = customization.accentColor || '#c5a059'; // Monaco Champagne Gold

  // Executive Scorecard Metrics (user editable with Monaco Sovereign defaults)
  const metricsToDisplay =
    executiveMetrics && executiveMetrics.length > 0
      ? executiveMetrics
      : [
          { id: 'm1', value: '12+', label: 'Years Experience' },
          { id: 'm2', value: '$180M+', label: 'Portfolio Managed' },
          { id: 'm3', value: '18', label: 'Global Markets' },
          { id: 'm4', value: '99.99%', label: 'Delivery Rigor' },
        ];

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-[#fdfdfd] relative"
      style={{
        ...RESUME_SHEET_BASE_STYLE,
        backgroundColor: '#fdfdfd',
        padding: '38px 40px',
        fontFamily: FONT_FAMILY_CSS_MAP.jakarta,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Top Luxury Gold Accent Hairline */}
      <div
        className="h-1 w-full bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mb-5"
        style={{
          height: '4px',
          width: '100%',
          background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
          marginBottom: '20px',
        }}
      />

      {/* Hero Header */}
      <ResumeHeaderTable
        className="border-b border-slate-200/80 pb-5 mb-5"
        style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}
        left={
          <>
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-extrabold block mb-1"
              style={{ color: gold }}
            >
              Global Leadership Dossier
            </span>
            <h1
              className="text-3xl font-black tracking-tight uppercase font-cinzel"
              style={{ color: primary, fontFamily: FONT_FAMILY_CSS_MAP.cinzel }}
            >
              {personal.fullName || 'ALEXANDER STERLING'}
            </h1>
            <p
              className="text-xs font-semibold text-slate-600 mt-1 tracking-wide font-playfair italic text-sm no-justify"
              style={{ fontFamily: FONT_FAMILY_CSS_MAP.playfair }}
            >
              {personal.professionalTitle || 'Chief Strategy Officer • Cross-Border Enterprise Architect'}
            </p>
          </>
        }
        rightClassName="text-right text-xs text-slate-500 space-y-1 font-sans no-justify"
        right={
          <>
            {contact.email && <div className="font-medium text-slate-800">{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            <div>
              {[contact.city, contact.state, contact.country].filter(Boolean).join(' • ') || 'London • New York • Singapore'}
            </div>
            {contact.linkedin && <div style={{ color: gold, fontWeight: 500 }}>{contact.linkedin}</div>}
            {(contact.portfolio || contact.website) && (
              <div style={{ color: gold }}>{contact.portfolio || contact.website}</div>
            )}
          </>
        }
      />

      {/* Executive Scorecard Metric Strip (Inline CSS Table for production consistency) */}
      {showExecutiveMetrics !== false && metricsToDisplay.length > 0 && (
        <div
          className="bg-slate-900 text-white rounded-xl p-4 mb-5 shadow-sm avoid-break"
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '14px 12px',
            marginBottom: '20px',
          }}
        >
          <table
            data-layout-table="true"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              margin: 0,
              padding: 0,
              border: 'none',
            }}
          >
            <tbody>
              <tr>
                {metricsToDisplay.map((metric, idx) => (
                  <td
                    key={metric.id || idx}
                    style={{
                      width: `${100 / metricsToDisplay.length}%`,
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      padding: '0 8px',
                      border: 'none',
                      borderRight: idx < metricsToDisplay.length - 1 ? '1px solid #1e293b' : 'none',
                      background: 'transparent',
                    }}
                  >
                    <div className="text-lg font-black tracking-tight" style={{ color: gold }}>
                      {metric.value}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 leading-tight">
                      {metric.label}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Executive Summary */}
      {summary && (
        <div
          className="mb-5 avoid-break bg-amber-50/30 p-4 rounded-r-xl"
          style={{
            marginBottom: '20px',
            borderLeft: `2px solid ${gold}`,
            backgroundColor: 'rgba(255, 251, 235, 0.45)',
            padding: '14px 16px',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        >
          <h2
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 font-sans"
            style={{ color: gold }}
          >
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 text-justify">{summary}</p>
        </div>
      )}

      {/* Main Two-Column Structure (Inline CSS Table - immune to Tailwind purge) */}
      <ResumeTwoColumnTable
        leftWidth="64%"
        rightWidth="36%"
        gapPx={28}
        left={
          <div>
            {experience.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}
                >
                  <ResumeSplitRow
                    left="Executive Experience"
                    right={
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: gold }}
                      />
                    }
                    rightWidth="16px"
                    verticalAlign="middle"
                  />
                </h2>
                <div>
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      data-entry="true"
                      className="relative pl-3 border-l border-slate-200"
                      style={{
                        borderLeft: '1px solid #e2e8f0',
                        paddingLeft: '12px',
                        marginBottom: idx < experience.length - 1 ? '16px' : '0px',
                      }}
                    >
                      <ResumeSplitRow
                        leftClassName="font-extrabold text-slate-900 text-xs"
                        left={exp.jobTitle}
                        rightClassName="text-[10px] font-semibold text-slate-400 font-mono"
                        right={
                          <>
                            {exp.startDate} &ndash;{' '}
                            {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                              ? 'Present'
                              : exp.endDate || 'Present'}
                          </>
                        }
                      />
                      <div className="text-xs font-semibold mb-1" style={{ color: gold }}>
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </div>
                      <ResumeDescriptionBlock
                        text={exp.description}
                        wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                        markerClassName="text-slate-400"
                        paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                      />
                      {exp.achievements && (
                        <div className="text-xs text-slate-700 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                          <ResumeDescriptionBlock
                            text={exp.achievements}
                            wrapperClassName="space-y-1 text-xs text-slate-700"
                            markerClassName="text-slate-500"
                            paragraphClassName="text-xs text-slate-700 whitespace-pre-line leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Projects / Engagements */}
            {projects.length > 0 && (
              <div>
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}
                >
                  <ResumeSplitRow
                    left="Key Engagements & Board Advisory"
                    right={
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: gold }}
                      />
                    }
                    rightWidth="16px"
                    verticalAlign="middle"
                  />
                </h2>
                <div>
                  {projects.map((p, idx) => (
                    <div
                      key={p.id}
                      data-entry="true"
                      className="text-xs avoid-break"
                      style={{ marginBottom: idx < projects.length - 1 ? '12px' : '0px' }}
                    >
                      <ResumeSplitRow
                        className="font-bold text-slate-900"
                        wrapRight
                        left={p.name}
                        rightStyle={{ color: gold }}
                        rightClassName="font-normal text-[11px]"
                        right={p.link}
                      />
                      {p.technologies && <div className="text-[10px] text-slate-400 italic">Domain: {p.technologies}</div>}
                      <p className="text-slate-600 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        rightClassName="no-justify"
        right={
          <div>
            {skills.length > 0 && (
              <div className="avoid-break" style={{ marginBottom: '20px' }}>
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}
                >
                  Strategic Toolkit
                </h2>
                <div
                  className="no-justify"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                >
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200/80 px-2.5 py-1 rounded-md font-semibold"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="avoid-break" style={{ marginBottom: '20px' }}>
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}
                >
                  Academic Pedigree
                </h2>
                <div className="text-xs">
                  {education.map((e, idx) => (
                    <div
                      key={e.id}
                      className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                      style={{ marginBottom: idx < education.length - 1 ? '10px' : '0px' }}
                    >
                      <div className="font-bold text-slate-900">{e.degree}</div>
                      <div className="text-slate-600 text-[11px]">{e.institute}</div>
                      <div className="text-slate-400 text-[10px] font-mono mt-0.5">
                        {e.endYear}
                        {e.score
                          ? ` • ${/^[0-9./\s]+$/.test(e.score.trim()) ? `GPA: ${e.score.trim()}` : e.score.trim()}`
                          : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="avoid-break" style={{ marginBottom: '20px' }}>
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-3"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}
                >
                  Credentials
                </h2>
                <div className="text-xs text-slate-700">
                  {certifications.map((c, idx) => (
                    <div
                      key={c.id}
                      className="text-[11px]"
                      style={{ marginBottom: idx < certifications.length - 1 ? '6px' : '0px' }}
                    >
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-slate-500 block text-[10px]">
                        {c.issuer} ({c.issueDate || 'Active'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="avoid-break"
                style={{ marginBottom: idx < customSections.length - 1 ? '20px' : '0px' }}
              >
                <h2
                  className="text-xs font-black uppercase tracking-[0.18em] border-b border-slate-200 pb-1.5 mb-2"
                  style={{ color: primary, borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '8px' }}
                >
                  {sec.title}
                </h2>
                <ResumeCustomSectionBody
                  items={sec.items}
                  content={sec.content}
                  columns={1}
                  textClassName="text-[11px] text-slate-600"
                  keyClassName="text-slate-500 font-medium"
                />
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

