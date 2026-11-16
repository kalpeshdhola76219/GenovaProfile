import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  BIODATA_HEADER_LEFT_STYLE,
  BIODATA_HEADER_RIGHT_STYLE,
  BIODATA_HEADER_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const PremiumRoyalPortraitTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#064e3b';
  const gold = customization.secondaryColor || '#b45309';
  const fontClass = getStaticFontClass(customization.fontFamily, 'cinzel');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fafaf9] text-stone-900 border-t-8 shadow-sm relative ${baseFontSize}`}
      style={{
        borderTopColor: primary,
      }}
    >
      <div className="flex gap-7 mb-7 items-stretch bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div
            className="w-44 h-56 rounded-lg overflow-hidden border-2 p-1.5 bg-stone-50 shadow-md shrink-0 flex flex-col justify-center items-center"
            style={{ borderColor: gold }}
          >
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: gold }}>
                ❖ Matrimonial Alliance ❖
              </span>
            </div>
            <h1 className={`text-3xl font-extrabold uppercase tracking-tight text-stone-900 ${fontClass}`}>
              {personal.fullName || 'Royal Portrait Candidate'}
            </h1>
            {(personal.religion || personal.caste) && (
              <p className="text-xs font-semibold text-stone-600 mt-1 uppercase tracking-wider">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          {sections.personal.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-3 border-t border-stone-100">
              {sections.personal.map((item) => (
                <div key={item.key}>
                  <span className="text-stone-500">{item.label}:</span>{' '}
                  <strong className="text-stone-800">{item.value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-5">
          {sections.astrology.length > 0 && (
            <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
                style={{ color: primary, borderColor: gold }}
              >
                <span>❖</span> Astrology Details
              </h2>
              <div className="space-y-2 text-xs">
                {sections.astrology.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-500">{item.label}:</span>{' '}
                    <strong className="text-stone-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.careerEducation.length > 0 && (
            <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
                style={{ color: primary, borderColor: gold }}
              >
                <span>❖</span> Education & Professional Profile
              </h2>
              <div className="space-y-2 text-xs">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="font-bold text-stone-900">{item.label}</div>
                    <div className="text-stone-600">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          {sections.family.length > 0 && (
            <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
                style={{ color: primary, borderColor: gold }}
              >
                <span>❖</span> Family Details
              </h2>
              <div className="space-y-2 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-500 block text-[11px]">{item.label}:</span>
                    <strong className="text-stone-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <section className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: primary }}>
                About & Lifestyle
              </h2>
              <div className="space-y-1 text-xs text-stone-700">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong className="text-stone-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.expectations.length > 0 && (
            <section className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: primary }}>
                Partner Preferences
              </h2>
              <div className="space-y-1 text-xs text-stone-700">
                {sections.expectations.map((item) => (
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
                <section key={sec.id} className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: primary }}>
                    {sec.title}
                  </h2>
                  <p className="text-xs text-stone-700">{sec.content}</p>
                </section>
              ))}
            </>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
                style={{ color: primary, borderColor: gold }}
              >
                <span>❖</span> Additional Photos
              </h2>
              <div className="flex gap-3">
                {personal.extraPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded border border-stone-200"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {sections.contact.length > 0 && (
        <div className="pt-3 border-t border-stone-200 text-xs text-stone-500" style={BIODATA_HEADER_ROW_STYLE}>
          <span className="font-cinzel uppercase text-[11px] tracking-wider" style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'middle', color: gold }}>
            Royal Portrait Dignity Edition
          </span>
          <div className="flex justify-end flex-wrap gap-4" style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'middle' }}>
            {sections.contact.map((item) => (
              <span key={item.key}>
                <strong>{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
