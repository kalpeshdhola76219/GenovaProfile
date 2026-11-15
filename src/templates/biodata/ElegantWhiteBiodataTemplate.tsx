import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ElegantWhiteBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-6 border-b border-slate-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-sans">Matrimonial Profile</span>
        <h1 className="text-3xl font-normal tracking-wide text-slate-900 mt-2 font-playfair italic">
          {personal.fullName || 'Full Name'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1 font-sans">
            {[personal.religion, personal.caste, personal.subCaste].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-8 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded overflow-hidden shadow-sm shrink-0 border border-slate-200">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Horoscope / Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Education & Career
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.careerEducation.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Family Information
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-sm">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Partner Expectations
          </h2>
          <div className="space-y-1 text-sm">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500 font-sans text-xs">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="text-slate-500">{i.key}:</span> {i.value}
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
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
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
                className="w-24 h-28 object-cover rounded border border-slate-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-sans avoid-break">
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
