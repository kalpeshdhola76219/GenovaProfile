import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  BIODATA_HEADER_LEFT_STYLE,
  BIODATA_HEADER_RIGHT_STYLE,
  BIODATA_HEADER_ROW_STYLE,
  BIODATA_LEFT_STYLE,
  BIODATA_RIGHT_STYLE,
  BIODATA_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const PremiumMinimalEditorialTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const { personal, customSections, customization } = data;
  const fontClass = getStaticFontClass(customization.fontFamily, 'cormorant');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  const sections = getBiodataSections(data);

  return (
    <div className={`document-page-sheet p-12 bg-[#faf9f6] text-stone-900 shadow-sm ${baseFontSize}`}>
      <div className="pb-6 mb-8 border-b border-stone-200">
        <div className="mb-3" style={BIODATA_HEADER_ROW_STYLE}>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-400" style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'baseline' }}>
            Matrimonial Profile
          </span>
          <span className="text-xs text-stone-500 italic font-cormorant" style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'baseline' }}>
            Private & Confidential
          </span>
        </div>
        <div style={BIODATA_HEADER_ROW_STYLE}>
          <div style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'bottom' }}>
            <h1 className={`text-5xl font-light tracking-tight text-stone-900 leading-none ${fontClass}`}>
              {personal.fullName || 'Devina Kapoor'}
            </h1>
            {personal.professionalTitle && (
              <p className="text-sm text-stone-500 font-light mt-2 tracking-wide font-sans">
                {personal.professionalTitle}
              </p>
            )}
            {(personal.religion || personal.caste) && (
              <p className="text-xs text-stone-400 font-light mt-1 tracking-wide font-sans">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'bottom', width: '120px' }}>
              <div className="w-28 h-36 overflow-hidden rounded-xs border border-stone-300 inline-block">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top contrast-110"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-8">
        <div className="col-span-4 space-y-6">
          {sections.personal.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Vital Details
              </h2>
              <div className="space-y-2 text-xs font-sans">
                {sections.personal.map((item) => (
                  <div key={item.key} style={BIODATA_ROW_STYLE}>
                    <span className="text-stone-400" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}</span>
                    <span className="font-medium text-stone-800" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.astrology.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Astrology
              </h2>
              <div className="space-y-2 text-xs font-sans">
                {sections.astrology.map((item) => (
                  <div key={item.key} style={BIODATA_ROW_STYLE}>
                    <span className="text-stone-400" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}</span>
                    <span className="font-medium text-stone-800" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.family.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Family Lineage
              </h2>
              <div className="space-y-2 text-xs font-sans">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-400 block text-[10.5px]">{item.label}</span>
                    <span className="font-medium text-stone-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-5 space-y-6">
          {sections.careerEducation.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Career & Academics
              </h2>
              <div className="space-y-3">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="text-xs">
                    <div className="font-bold text-stone-900 text-[13px]">{item.label}</div>
                    <div className="text-stone-500 font-sans">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                About & Lifestyle
              </h2>
              <div className="space-y-2 text-xs text-stone-700 font-sans">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong className="text-stone-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((sec) => (
                <section key={sec.id}>
                  <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                    {sec.title}
                  </h2>
                  <p className="text-xs text-stone-700 font-sans">{sec.content}</p>
                </section>
              ))}
            </>
          )}
        </div>

        <div className="col-span-3 space-y-6">
          {sections.expectations.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Partner Preferences
              </h2>
              <div className="space-y-2 text-xs text-stone-700 font-sans">
                {sections.expectations.map((item) => (
                  <div key={item.key}>
                    <strong className="text-stone-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.contact.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Communication
              </h2>
              <div className="space-y-2 text-xs font-sans text-stone-700">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Photos
              </h2>
              <div className="flex flex-col gap-2">
                {personal.extraPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover border border-stone-200"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-400 font-mono" style={BIODATA_HEADER_ROW_STYLE}>
        <span style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'middle' }}>EDITORIAL ALLIANCE DOSSIER</span>
        <span style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'middle' }}>STRICTLY CONFIDENTIAL</span>
      </div>
    </div>
  );
};
