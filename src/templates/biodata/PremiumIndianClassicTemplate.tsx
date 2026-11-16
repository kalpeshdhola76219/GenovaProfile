import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { getBiodataSections, sanitizeDocumentTextFields } from './biodataFields';

export const PremiumIndianClassicTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#991b1b';
  const gold = customization.secondaryColor || '#d97706';
  const fontClass = getStaticFontClass(customization.fontFamily, 'cinzel');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fffefb] text-stone-900 border-[6px] border-double shadow-sm relative ${baseFontSize}`}
      style={{
        borderColor: primary,
      }}
    >
      <div className="text-center pb-3 border-b-2 mb-5" style={{ borderColor: gold }}>
        <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel">॥ श्री गणेशाय नमः ॥</p>
        <p className="text-[11px] text-stone-500 italic font-cormorant">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>
        <div className="mt-3 flex items-center justify-center gap-6">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-28 h-36 rounded-md overflow-hidden border-2 p-0.5 bg-white shadow-sm shrink-0" style={{ borderColor: primary }}>
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-xs"
              />
            </div>
          )}
          <div className="text-left">
            <h1 className={`text-3xl font-extrabold uppercase tracking-wide ${fontClass}`} style={{ color: primary }}>
              {personal.fullName || 'Rahul Sharma'}
            </h1>
            {(personal.religion || personal.caste) && (
              <p className="text-xs font-semibold text-stone-700 mt-1">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </p>
            )}
            {personal.gotra && (
              <p className="text-xs text-stone-600">Gotra: <strong className="text-stone-900">{personal.gotra}</strong></p>
            )}
            {personal.professionalTitle && (
              <p className="text-xs text-stone-600 mt-0.5">
                Profession: <strong className="text-stone-900">{personal.professionalTitle}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {sections.personal.length > 0 && (
        <div className="mb-5 bg-amber-50/40 p-3 rounded border border-amber-200/80">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            Personal Details (व्यक्तिगत विवरण)
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
            {sections.personal.map((item) => (
              <div key={item.key}>
                <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-800">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.astrology.length > 0 && (
        <div className="mb-5 bg-amber-50/40 p-3 rounded border border-amber-200/80">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            Astrological Details (ज्योतिष विवरण)
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-800">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            Education & Career Details (शिक्षा एवं व्यवसाय)
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="bg-white p-2.5 rounded border border-stone-200">
                <span className="font-semibold text-stone-800">{item.label}:</span>{' '}
                <span className="text-stone-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            Family Details (पारिवारिक परिचय)
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3 rounded border border-stone-200">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-900">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break bg-stone-50 p-3 rounded border border-stone-200">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: primary }}>
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong className="text-stone-900">{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break bg-stone-50 p-3 rounded border border-stone-200">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: primary }}>
            Expectations & Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong className="text-stone-900">{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break bg-white p-3 rounded border border-stone-200">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: primary }}>
                {sec.title}
              </h2>
              <p className="text-xs text-stone-700">{sec.content}</p>
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            Additional Photos
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
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="pt-3 border-t-2 flex items-center justify-between flex-wrap gap-4 text-xs" style={{ borderColor: gold }}>
          <div className="flex flex-wrap gap-4 font-semibold" style={{ color: primary }}>
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
