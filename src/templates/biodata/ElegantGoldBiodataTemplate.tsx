import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ElegantGoldBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const accent = customization.accentColor || '#d97706';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-4 border-double"
      style={{
        borderColor: accent,
        backgroundColor: '#fffcf7',
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-amber-200 mb-6">
        <div className="text-2xl mb-1 text-amber-600">॥ ॐ श्री गणेशाय नमः ॥</div>
        <h1 className="text-3xl font-bold tracking-wide uppercase font-cinzel text-amber-950">
          Matrimonial Profile
        </h1>
        <p className="text-2xl font-bold mt-1 text-amber-900 font-cinzel">
          {personal.fullName || 'Full Name'}
        </p>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-amber-800 mt-1">
            {[personal.religion, personal.caste, personal.subCaste].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-lg overflow-hidden border-2 border-amber-300 shadow-md shrink-0 p-1 bg-white">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded"
            />
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
              Personal Details
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            Horoscope / Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-amber-50/60 p-3 rounded border border-amber-200/40">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            Educational & Professional Background
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            Family Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-amber-50/60 p-3 rounded border border-amber-200/40">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-sm">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-amber-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            Partner Preferences
          </h2>
          <div className="space-y-1 text-sm">
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
            <div key={sec.id} className="mb-4 avoid-break">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
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
        <div className="mt-6 pt-3 border-t border-amber-200 text-center text-xs text-stone-700 avoid-break">
          <div className="font-bold text-amber-950 uppercase font-cinzel mb-1">Contact Information</div>
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
