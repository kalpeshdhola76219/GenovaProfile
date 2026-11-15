import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const FloralBorderBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-[12px] border-amber-100/80 relative bg-[#fffdf9]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-xl opacity-60">🌺</div>
      <div className="absolute top-2 right-2 text-xl opacity-60">🌺</div>
      <div className="absolute bottom-2 left-2 text-xl opacity-60">🌺</div>
      <div className="absolute bottom-2 right-2 text-xl opacity-60">🌺</div>

      <div className="text-center pb-3 border-b-2 border-amber-300 mb-5">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-sans font-semibold">Biodata For Marriage</span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-1 font-playfair">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs text-stone-600 mt-0.5 font-sans">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-5 items-center">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-40 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs shrink-0 p-1 bg-white">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded-xl"
            />
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2 font-playfair">Personal Details</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-800">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">
            Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-800">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">
            Education & Career
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded-xl bg-white border border-amber-100">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">
            Family Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-800">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-1 font-playfair">
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-amber-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-1 font-playfair">
            Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-amber-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-3 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-1 font-playfair">
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">
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
        <div className="mt-5 pt-3 border-t border-amber-300 text-center text-xs text-stone-700 avoid-break font-sans">
          <div className="flex justify-center flex-wrap gap-4">
            {sections.contact.map((item) => (
              <span key={item.key}>
                <strong className="text-amber-950">{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
