import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const PremiumRoyalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const royalBlue = '#1e1b4b';
  const gold = '#ca8a04';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-[8px] border-double relative bg-[#fcfbfa]"
      style={{
        borderColor: royalBlue,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-xs uppercase tracking-widest font-cinzel font-bold text-amber-700">
          ❖ Royal Alliance Biodata ❖
        </p>
        <h1 className="text-3xl font-extrabold uppercase mt-1 font-cinzel" style={{ color: royalBlue }}>
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-stone-600 mt-1">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-md shrink-0" style={{ borderColor: gold }}>
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
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: royalBlue }}>
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            Astrology Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3.5 rounded-xl border border-amber-100">
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            Education & Career History
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded-lg bg-white border border-amber-100">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            Family Lineage
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3.5 rounded-xl border border-amber-100">
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong style={{ color: royalBlue }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong style={{ color: royalBlue }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-3 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
                {sec.title}
              </h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="font-semibold">{i.key}:</span> {i.value}
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
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
                className="w-20 h-24 object-cover rounded border border-amber-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="mt-5 pt-3 border-t-2 text-center text-xs text-stone-700 avoid-break" style={{ borderColor: gold }}>
          <div className="font-bold uppercase font-cinzel mb-1" style={{ color: royalBlue }}>Contact Details</div>
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
