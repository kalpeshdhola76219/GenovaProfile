import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ModernIndianBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#c2410c';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-t-8 bg-[#fffdf9]"
      style={{
        borderTopColor: primary,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-orange-200 mb-6">
        <p className="text-sm font-semibold tracking-widest text-orange-700 uppercase">॥ श्री गणेशाय नमः ॥</p>
        <span className="text-xs uppercase tracking-widest text-orange-600 font-bold block mt-1">Matrimonial Profile</span>
        <h1 className="text-3xl font-bold tracking-wide mt-1 text-stone-900 font-cinzel">
          {personal.fullName || 'Full Name'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-stone-600 mt-1">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-orange-300 shadow-sm shrink-0 p-1 bg-white">
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
          <div className="flex-1 bg-orange-50/40 p-4 rounded-xl border border-orange-200/60">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-orange-50/40 p-3 rounded-xl border border-orange-200/50">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            Education & Career
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2 rounded bg-white border border-stone-200">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            Family Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-orange-50/40 p-3 rounded-xl border border-orange-200/50">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-orange-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            Partner Expectations
          </h2>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-orange-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border border-stone-200">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="font-semibold text-stone-700">{i.key}:</span> {i.value}
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
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
                className="w-24 h-28 object-cover rounded border border-orange-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="mt-5 pt-3 border-t border-orange-200 text-center text-xs text-stone-700 avoid-break">
          <div className="font-bold text-orange-950 uppercase font-cinzel mb-1">Contact Details</div>
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
