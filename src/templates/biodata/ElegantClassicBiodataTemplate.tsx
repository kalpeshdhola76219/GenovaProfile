import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ElegantClassicBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  // Exclude fields shown in header
  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-4 border-stone-300 relative bg-[#fffdfb]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-stone-200 mb-6">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">Matrimonial Biodata</span>
        <h1 className="text-3xl font-normal text-stone-900 mt-1 font-playfair italic">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-stone-500 mt-1 font-sans">
            {[personal.religion, personal.caste, personal.subCaste].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded overflow-hidden border border-stone-200 p-1 bg-white shadow-xs shrink-0">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
              Personal Details
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Horoscope / Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-stone-50 p-3 rounded">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Academics & Profession
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Family Lineage
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-stone-50 p-3 rounded">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Partner Preferences
          </h2>
          <div className="space-y-1 text-xs">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="font-semibold text-stone-700">{i.key}:</span> {i.value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-700">{sec.content}</p>
              )}
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
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
                className="w-24 h-28 object-cover rounded border border-stone-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="mt-5 pt-3 border-t border-stone-300 text-center text-xs text-stone-600 font-sans avoid-break">
          <div className="flex justify-center flex-wrap gap-4">
            {sections.contact.map((item) => (
              <span key={item.key}>
                <strong className="text-stone-700">{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
