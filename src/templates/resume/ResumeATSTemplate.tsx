import React from 'react';
import { DocumentData } from '../../types/document';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { FONT_FAMILY_CSS_MAP } from '../../utils/fontClassMap';
import {
  METADATA_ROW_STYLE,
  METADATA_LEFT_STYLE,
  METADATA_RIGHT_STYLE,
  METADATA_WIDE_RIGHT_STYLE,
  CONTACT_ROW_STYLE,
  ResumeDescriptionBlock,
  sanitizeDocumentTextFields,
} from './resumeTemplateUtils';

export const ResumeATSTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const safeData = sanitizeDocumentTextFields(data);
  const {
    personal,
    contact,
    summary = '',
    education = [],
    experience = [],
    skills = [],
    projects = [],
    certifications = [],
    customSections = [],
    customization,
  } = safeData;
  const primary = customization?.primaryColor || '#0f172a';
  const paperColor = customization?.paperColor || '#ffffff';

  return (
    <div
      className="document-page-sheet p-8 font-sans text-slate-800 shadow-sm"
      style={{
        fontFamily: FONT_FAMILY_CSS_MAP.sans,
        backgroundColor: paperColor,
        fontSize: customization?.fontSize === 'sm' ? '13px' : customization?.fontSize === 'lg' ? '15px' : '14px',
        lineHeight: '1.5',
      }}
    >
      {/* Header */}
      <header className="border-b-2 pb-4 mb-5" style={{ borderColor: primary }}>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
          {personal.fullName || 'YOUR NAME'}
        </h1>
        {personal.professionalTitle && (
          <p className="text-sm font-semibold text-slate-700 mt-0.5 no-justify">{personal.professionalTitle}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 no-justify" style={CONTACT_ROW_STYLE}>
          {contact?.email && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', columnGap: '4px' }}>
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{contact.email}</span>
            </span>
          )}
          {contact?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{contact.phone}</span>
            </span>
          )}
          {contact?.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {contact.city}
                {contact.state ? `, ${contact.state}` : ''}
                {contact.country ? `, ${contact.country}` : ''}
              </span>
            </span>
          )}
          {contact?.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-500" />
              <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </span>
          )}
          {contact?.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-500" />
              <span>{contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            </span>
          )}
          {(contact?.portfolio || contact?.website) && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{(contact.portfolio || contact.website)!.replace(/^https?:\/\//, '')}</span>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 text-justify leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} data-entry="true">
                <div className="text-xs" style={METADATA_ROW_STYLE}>
                  <span className="font-bold text-slate-900" style={METADATA_LEFT_STYLE}>{exp.jobTitle || 'Role'}</span>
                  <span className="text-slate-500 font-medium" style={METADATA_RIGHT_STYLE}>
                    {exp.startDate || ''} –{' '}
                    {exp.currentlyWorking && (!exp.endDate || exp.endDate.trim().toLowerCase() === 'present')
                      ? 'Present'
                      : exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 italic" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</span>
                </div>
                <ResumeDescriptionBlock
                  text={exp.description}
                  wrapperClassName="mt-1 space-y-1 text-xs text-slate-700"
                  markerClassName="text-slate-400"
                  paragraphClassName="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed"
                />
                {exp.achievements && (
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
                    Key Achievement: {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} data-entry="true" className="text-xs">
                <div className="font-bold text-slate-900" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{edu.degree}</span>
                  <span className="text-slate-500 font-normal" style={METADATA_RIGHT_STYLE}>
                    {edu.startYear || ''}{edu.startYear && edu.endYear ? ' – ' : ''}{edu.endYear || ''}
                  </span>
                </div>
                <div className="text-slate-600" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>
                    {[edu.institute, edu.location].filter(Boolean).join(', ')}
                    {edu.score ? ` • ${/^[0-9./\s]+$/.test(edu.score.trim()) ? `GPA: ${edu.score.trim()}` : edu.score.trim()}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4 no-justify">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Key Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 text-xs no-justify">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded text-xs font-medium border border-slate-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} data-entry="true" className="text-xs">
                <div className="font-bold text-slate-900" style={METADATA_ROW_STYLE}>
                  <span style={METADATA_LEFT_STYLE}>{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-[11px]"
                      style={METADATA_RIGHT_STYLE}
                    >
                      View Project
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-slate-500 font-medium no-justify">Tech: {proj.technologies}</p>
                )}
                {proj.description && <p className="text-slate-700 mt-0.5 leading-snug">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
            style={{ color: primary, borderColor: '#e2e8f0' }}
          >
            Certifications
          </h2>
          <div className="space-y-1 text-xs">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} style={METADATA_ROW_STYLE}>
                <span className="font-semibold text-slate-800" style={METADATA_LEFT_STYLE}>
                  {cert.name} {cert.issuer ? `— ${cert.issuer}` : ''}
                </span>
                {cert.issueDate && <span className="text-slate-500" style={METADATA_RIGHT_STYLE}>{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((sec) => (
            <section key={sec.id} className="avoid-break">
              <h2
                className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
                style={{ color: primary, borderColor: '#e2e8f0' }}
              >
                {sec.title}
              </h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id} className="py-0.5 border-b border-slate-100" style={METADATA_ROW_STYLE}>
                      <span className="text-slate-500 font-medium" style={METADATA_LEFT_STYLE}>{i.key}:</span>
                      <span className="font-semibold text-slate-900" style={METADATA_WIDE_RIGHT_STYLE}>{i.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{sec.content}</p>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
