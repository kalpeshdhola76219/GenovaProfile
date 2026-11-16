import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { getBiodataSections } from './biodataFields';

export const PremiumContemporaryProfileTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const sections = getBiodataSections(data);

  return (
    <div className={`document-page-sheet p-9 bg-slate-50 text-slate-900 shadow-sm ${baseFontSize}`}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-6">
        <div className="flex gap-6 items-center">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-32 h-36 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-sm shrink-0">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
          <div className="flex-1">
            {(personal.religion || personal.caste) && (
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                  {personal.religion || 'Matrimonial Profile'}
                </span>
                {personal.caste && (
                  <span className="text-xs text-slate-500 font-medium">
                    {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''}
                  </span>
                )}
              </div>
            )}
            <h1 className={`text-3xl font-extrabold text-slate-900 tracking-tight ${fontClass}`}>
              {personal.fullName || 'Ananya Iyer'}
            </h1>
            {personal.professionalTitle && (
              <p className="text-xs font-semibold text-slate-600 mt-1">{personal.professionalTitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          {sections.personal.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span>✦</span> Personal Vitals
              </h2>
              <div className="space-y-2 text-xs">
                {sections.personal.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400">{item.label}:</span>{' '}
                    <strong className="text-slate-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-matrimonial-heading">
                Horoscope Details
              </h3>
              <div className="space-y-1.5 text-xs">
                {sections.astrology.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400">{item.label}:</span>{' '}
                    <strong className="text-slate-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.contact.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-matrimonial-heading">
                Contact Channels
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8 space-y-5">
          {sections.careerEducation.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span>✦</span> Professional & Academic Background
              </h2>
              <div className="space-y-2 text-xs">
                {sections.careerEducation.map((item) => (
                  <div key={item.key}>
                    <span className="font-semibold text-slate-900">{item.label}:</span>{' '}
                    <span className="text-slate-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.family.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span>✦</span> Family Background
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400">{item.label}:</span>{' '}
                    <strong className="text-slate-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-matrimonial-heading">
                <span>✦</span> About & Lifestyle
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong className="text-sky-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.expectations.length > 0 && (
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
              <span className="text-xl">💍</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1 font-matrimonial-heading">
                  Partner Preferences
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  {sections.expectations.map((item) => (
                    <div key={item.key}>
                      <strong className="text-sky-900">{item.label}:</strong> {item.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((sec) => (
                <div key={sec.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-matrimonial-heading">
                    {sec.title}
                  </h2>
                  <p className="text-xs text-slate-700">{sec.content}</p>
                </div>
              ))}
            </>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span>✦</span> Additional Photos
              </h2>
              <div className="flex gap-3">
                {personal.extraPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-xl border border-slate-200"
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
