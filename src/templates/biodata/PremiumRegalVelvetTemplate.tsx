import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { getBiodataSections, sanitizeDocumentTextFields } from './biodataFields';

export const PremiumRegalVelvetTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const { personal, customSections, customization } = data;
  const regalEmerald = customization.primaryColor || '#064e3b';
  const royalGold = customization.secondaryColor || '#ca8a04';
  const fontClass = getStaticFontClass(customization.fontFamily, 'cinzel');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fdfcf9] text-stone-900 border-[12px] border-double shadow-md relative ${baseFontSize}`}
      style={{
        borderColor: regalEmerald,
      }}
    >
      <div
        className="absolute inset-1.5 border pointer-events-none"
        style={{ borderColor: royalGold, opacity: 0.85 }}
      />

      <div className="text-center pb-4 mb-5 border-b" style={{ borderColor: `${royalGold}60` }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm" style={{ color: royalGold }}>❖</span>
          <span className="text-xs uppercase font-bold tracking-[0.25em]" style={{ color: royalGold }}>
            REGAL MATRIMONIAL ALLIANCE
          </span>
          <span className="text-sm" style={{ color: royalGold }}>❖</span>
        </div>
        <h1 className={`text-4xl font-extrabold uppercase tracking-wider mt-1 ${fontClass}`} style={{ color: regalEmerald }}>
          {personal.fullName || 'Vikramaditya Rathore'}
        </h1>
        {(personal.religion || personal.caste) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs uppercase tracking-widest text-stone-600">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </div>
        )}
      </div>

      <div className="flex gap-6 mb-5 items-center bg-white p-4 rounded-xl border" style={{ borderColor: `${royalGold}40` }}>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div
            className="w-36 h-44 rounded-lg overflow-hidden border-2 p-1 bg-white shadow-md shrink-0"
            style={{ borderColor: royalGold }}
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
        {sections.personal.length > 0 && (
          <div className="flex-1">
            <h2
              className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`}
              style={{ color: regalEmerald, borderColor: `${royalGold}40` }}
            >
              Personal Details
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {sections.personal.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-500">{item.label}:</span>{' '}
                  <span className="font-semibold text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2
            className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
            style={{ color: regalEmerald, borderColor: royalGold }}
          >
            <span>❖</span> Horoscopic Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3 rounded-lg border border-stone-200">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-500">{item.label}:</span>{' '}
                <span className="font-semibold text-stone-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2
            className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
            style={{ color: regalEmerald, borderColor: royalGold }}
          >
            <span>❖</span> Educational Accreditations & Career History
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded bg-white border border-stone-200 shadow-2xs">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2
            className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
            style={{ color: regalEmerald, borderColor: royalGold }}
          >
            <span>❖</span> Family Lineage
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3 rounded-lg border border-stone-200">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="text-stone-500">{item.label}:</span>{' '}
                <strong className="text-stone-900">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break bg-emerald-50/40 p-3.5 rounded border border-emerald-200/70">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: regalEmerald }}>
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong style={{ color: regalEmerald }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break bg-emerald-50/40 p-3.5 rounded border border-emerald-200/70">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: regalEmerald }}>
            Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong style={{ color: regalEmerald }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break bg-white p-3 rounded border border-stone-200">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: regalEmerald }}>
                {sec.title}
              </h2>
              <p className="text-xs text-stone-700">{sec.content}</p>
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2
            className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`}
            style={{ color: regalEmerald, borderColor: royalGold }}
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
        </div>
      )}

      {sections.contact.length > 0 && (
        <div
          className="pt-3 border-t flex items-center justify-between flex-wrap gap-4 text-xs text-stone-600"
          style={{ borderColor: `${royalGold}40` }}
        >
          <div className="flex flex-wrap gap-4 font-semibold" style={{ color: regalEmerald }}>
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
