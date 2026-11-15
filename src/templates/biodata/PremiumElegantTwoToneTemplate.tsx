import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const PremiumElegantTwoToneTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sapphireNavy = customization.primaryColor || '#0f172a';
  const champagneGold = customization.secondaryColor || '#d97706';
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet flex flex-row bg-[#fafaf9] text-stone-900 shadow-sm overflow-hidden ${baseFontSize}`}
    >
      <div
        className="w-[38%] p-7 text-white flex flex-col justify-between"
        style={{ backgroundColor: sapphireNavy }}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {customization.showPhoto !== false && personal.profilePhoto ? (
              <div
                className="w-36 h-44 rounded-xl overflow-hidden border-2 p-1 shadow-lg mb-3"
                style={{ borderColor: champagneGold }}
              >
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-full border-2 flex items-center justify-center mb-3 bg-white/10"
                style={{ borderColor: champagneGold }}
              >
                <span className="text-3xl">👤</span>
              </div>
            )}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: champagneGold }}>
                Matrimonial Profile
              </span>
              {(personal.religion || personal.caste) && (
                <div className="text-xs text-stone-300 mt-0.5">
                  {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
                </div>
              )}
            </div>
          </div>

          {sections.personal.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/15">
              <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel" style={{ color: champagneGold }}>
                Personal Details
              </h3>
              <div className="space-y-1.5 text-xs text-stone-200">
                {sections.personal.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-stone-300">{item.label}:</span>
                    <strong className="text-white text-right">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/15">
              <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel" style={{ color: champagneGold }}>
                Horoscope Details
              </h3>
              <div className="space-y-1.5 text-xs text-stone-200">
                {sections.astrology.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-stone-300">{item.label}:</span>
                    <strong className="text-white text-right">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.contact.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-white/15 text-xs text-stone-300">
              <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel" style={{ color: champagneGold }}>
                Reach Out
              </h3>
              {sections.contact.map((item) => (
                <div key={item.key}>
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-4 border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-stone-400 font-cinzel">
          Private & Confidential
        </div>
      </div>

      <div className="w-[62%] p-8 bg-[#fffdf9] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h1 className={`text-3xl font-extrabold uppercase tracking-wide text-stone-900 ${fontClass}`}>
              {personal.fullName || 'Rohan Sengupta'}
            </h1>
            {personal.professionalTitle && (
              <p className="text-sm font-semibold text-amber-800 mt-1">{personal.professionalTitle}</p>
            )}
          </div>

          {sections.careerEducation.length > 0 && (
            <div>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`}
                style={{ color: sapphireNavy }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
                Education & Professional Career
              </h2>
              <div className="space-y-2 text-xs">
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
            <div>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`}
                style={{ color: sapphireNavy }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
                Family Details
              </h2>
              <div className="bg-white p-3 rounded border border-stone-200 space-y-1.5 text-xs">
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
            <div className="bg-amber-50/50 p-3.5 rounded border border-amber-200/80">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: sapphireNavy }}>
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
            <div className="bg-amber-50/50 p-3.5 rounded border border-amber-200/80">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: sapphireNavy }}>
                Partner Preferences
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
                <div key={sec.id} className="bg-white p-3 rounded border border-stone-200">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: sapphireNavy }}>
                    {sec.title}
                  </h2>
                  <p className="text-xs text-stone-700">{sec.content}</p>
                </div>
              ))}
            </>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <div>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`}
                style={{ color: sapphireNavy }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
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
        </div>
      </div>
    </div>
  );
};
