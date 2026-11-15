import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const PremiumLuxuryGoldTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const goldPrimary = customization.primaryColor || '#b45309';
  const deepCharcoal = customization.secondaryColor || '#292524';
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet p-9 bg-[#fffefb] text-stone-900 border-2 shadow-sm relative ${baseFontSize}`}
      style={{
        borderColor: `${goldPrimary}60`,
      }}
    >
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: goldPrimary }} />

      <div className="text-center pb-5 mb-6 border-b" style={{ borderColor: `${goldPrimary}40` }}>
        <div className="inline-flex items-center gap-3 mb-1">
          <span className="h-px w-10" style={{ backgroundColor: goldPrimary }} />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: goldPrimary }}>
            EXCLUSIVE MATRIMONIAL ALLIANCE
          </span>
          <span className="h-px w-10" style={{ backgroundColor: goldPrimary }} />
        </div>
        <h1 className={`text-3xl font-extrabold uppercase tracking-wide mt-1 ${fontClass}`} style={{ color: deepCharcoal }}>
          {personal.fullName || 'Varun Deshmukh'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-7 mb-6">
        <div className="col-span-5 space-y-5">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-full flex justify-center">
              <div
                className="w-40 h-48 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-md"
                style={{ borderColor: goldPrimary }}
              >
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>
            </div>
          )}

          {sections.personal.length > 0 && (
            <div className="bg-amber-50/40 p-4 rounded-xl border" style={{ borderColor: `${goldPrimary}30` }}>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b ${fontClass}`}
                style={{ color: deepCharcoal, borderColor: `${goldPrimary}40` }}
              >
                Personal Bio
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.personal.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div className="bg-amber-50/40 p-4 rounded-xl border" style={{ borderColor: `${goldPrimary}30` }}>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b ${fontClass}`}
                style={{ color: deepCharcoal, borderColor: `${goldPrimary}40` }}
              >
                Horoscope Details
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.astrology.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.contact.length > 0 && (
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
              <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 text-stone-700 ${fontClass}`}>
                Communication
              </h3>
              <div className="space-y-1.5 text-xs text-stone-600">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7 space-y-5">
          {sections.careerEducation.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${goldPrimary}40` }}>
                <span className="text-sm" style={{ color: goldPrimary }}>❖</span>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${fontClass}`} style={{ color: deepCharcoal }}>
                  Education & Career
                </h2>
              </div>
              <div className="space-y-2.5">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="text-xs bg-white p-2.5 rounded border border-stone-200/80">
                    <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                    <span className="text-stone-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.family.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${goldPrimary}40` }}>
                <span className="text-sm" style={{ color: goldPrimary }}>❖</span>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${fontClass}`} style={{ color: deepCharcoal }}>
                  Family Background
                </h2>
              </div>
              <div className="bg-white p-3 rounded border border-stone-200/80 space-y-2 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-stone-500">{item.label}:</span> <strong className="text-stone-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <section className="bg-amber-50/30 p-3.5 rounded border border-amber-200/60">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: deepCharcoal }}>
                About & Lifestyle
              </h2>
              <div className="space-y-1 text-xs text-stone-700">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong style={{ color: goldPrimary }}>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.expectations.length > 0 && (
            <section className="bg-amber-50/30 p-3.5 rounded border border-amber-200/60">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: deepCharcoal }}>
                Partner Preferences
              </h2>
              <div className="space-y-1 text-xs text-stone-700">
                {sections.expectations.map((item) => (
                  <div key={item.key}>
                    <strong style={{ color: goldPrimary }}>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((sec) => (
                <section key={sec.id} className="bg-white p-3 rounded border border-stone-200/80">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: deepCharcoal }}>
                    {sec.title}
                  </h2>
                  <p className="text-xs text-stone-700">{sec.content}</p>
                </section>
              ))}
            </>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${goldPrimary}40` }}>
                <span className="text-sm" style={{ color: goldPrimary }}>❖</span>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${fontClass}`} style={{ color: deepCharcoal }}>
                  Additional Photos
                </h2>
              </div>
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

      <div className="pt-3 border-t text-center text-[11px] uppercase tracking-widest text-stone-400 font-cinzel" style={{ borderColor: `${goldPrimary}30` }}>
        Gold Prestige Dignity Portfolio
      </div>
    </div>
  );
};
