import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const LuxuryBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#701a75';
  const gold = customization.accentColor || '#ca8a04';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-900 border-8 border-double bg-[#faf7f9]"
      style={{
        borderColor: gold,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: primary }}>
        <div className="text-xl font-bold tracking-widest uppercase font-cinzel text-amber-600">
          ❖ Matrimonial Portfolio ❖
        </div>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mt-1 font-cinzel" style={{ color: primary }}>
          {personal.fullName || 'Full Name'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-slate-600 mt-1 font-sans">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-amber-500 shadow-md shrink-0 p-1 bg-white">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded-lg"
            />
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1 bg-white p-4 rounded-xl border border-amber-200">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: primary }}>
              Personal Bio
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-slate-700">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-white p-3 rounded-xl border border-amber-100">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-slate-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            Academics & Profession
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded-lg bg-white border border-amber-100">
                <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                <span className="text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            Family Heritage
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-white p-3 rounded-xl border border-amber-100">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-slate-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-purple-900">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-purple-900">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="font-semibold">{i.key}:</span> {i.value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs">{sec.content}</p>
              )}
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
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
                className="w-24 h-28 object-cover rounded border border-amber-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="mt-5 pt-3 border-t-2 text-center text-xs text-slate-600 avoid-break" style={{ borderColor: gold }}>
          <div className="flex justify-center flex-wrap gap-4">
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
