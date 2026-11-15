import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const IslamicNikahBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const emerald = '#065f46';
  const gold = '#d97706';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-8 border-double relative bg-[#fcfdfd]"
      style={{
        borderColor: emerald,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-lg font-bold tracking-widest text-emerald-800 font-serif">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p className="text-xs uppercase tracking-widest font-sans font-semibold mt-1" style={{ color: gold }}>
          In the Name of Allah, the Most Beneficent, the Most Merciful
        </p>
        <h1 className="text-3xl font-extrabold uppercase mt-2 font-cinzel text-emerald-950">
          Matrimonial Nikah Biodata
        </h1>
        <p className="text-2xl font-bold text-stone-900 font-cinzel mt-1">
          {personal.fullName || 'Zaid Khan'}
        </p>
        {(personal.religion || personal.caste) && (
          <p className="text-xs text-stone-600 font-sans mt-0.5">
            {[personal.religion || 'Islam', personal.caste || 'Sunni', personal.subCaste ? `(${personal.subCaste})` : null]
              .filter(Boolean)
              .join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div className="w-36 h-44 rounded-xl border-2 p-1 bg-white shadow-md" style={{ borderColor: emerald }}>
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
        {personalItems.length > 0 && (
          <div className="flex-1 bg-white p-4 rounded-xl border shadow-xs" style={{ borderColor: '#a7f3d0' }}>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel text-emerald-900 border-b pb-1 border-emerald-100 flex items-center justify-between">
              <span>Personal Details</span>
              <span className="text-[10px] text-emerald-700 font-sans">Deen & Values</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-600">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: emerald, borderColor: gold }}>
            Astrology / Additional Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3 rounded-xl border border-emerald-100">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-600">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: emerald, borderColor: gold }}>
            Education & Professional Career
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <span className="font-bold text-emerald-950">{item.label}:</span>{' '}
                <span className="text-stone-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: emerald }}>
            Respected Family Background
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-600">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs">
          <span className="font-bold uppercase tracking-wider block mb-1 text-emerald-900 font-cinzel">About & Lifestyle</span>
          <div className="space-y-1 text-stone-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-emerald-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs">
          <span className="font-bold uppercase tracking-wider block mb-1 text-emerald-900 font-cinzel">Partner Expectations</span>
          <div className="space-y-1 text-stone-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-emerald-950">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break p-3 bg-white rounded-xl border border-emerald-100 text-xs">
              <span className="font-bold uppercase tracking-wider block mb-1 text-emerald-900 font-cinzel">{sec.title}</span>
              <p className="text-stone-700 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: emerald, borderColor: gold }}>
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
                className="w-24 h-28 object-cover rounded border border-emerald-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="pt-3 border-t-2 flex justify-between items-center text-xs" style={{ borderColor: gold }}>
          <div className="text-stone-600 font-sans flex flex-wrap gap-3">
            {sections.contact.map((item) => (
              <span key={item.key}>
                <strong>{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
          <div className="text-emerald-800 font-bold uppercase tracking-widest text-[10px] font-sans shrink-0">
            Alhamdulillah
          </div>
        </div>
      )}
    </div>
  );
};
