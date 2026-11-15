import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const TraditionalRedBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const red = customization.primaryColor || '#b91c1c';
  const gold = customization.accentColor || '#d97706';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-stone-900 border-[10px] border-double relative bg-[#fffdfa]"
      style={{
        borderColor: red,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute top-2 right-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute bottom-2 left-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute bottom-2 right-2 text-2xl font-bold" style={{ color: gold }}>卐</div>

      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-sm font-bold tracking-widest uppercase" style={{ color: red }}>॥ श्री गणेशाय नमः ॥</p>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mt-1 font-cinzel" style={{ color: red }}>
          विवाह बायोडेटा
        </h1>
        <p className="text-2xl font-bold mt-1 text-stone-900 font-cinzel">
          {personal.fullName || 'Rahul Sharma'}
        </p>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-stone-600 mt-0.5">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div className="w-36 h-44 rounded border-2 p-1 bg-white shadow-sm" style={{ borderColor: red }}>
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-xs"
              />
            </div>
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1">
            <div
              className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between"
              style={{ color: red, borderColor: gold }}
            >
              <span>Personal Data</span>
              <span className="text-[11px] font-normal text-stone-500">व्यक्तिगत विवरण</span>
            </div>
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
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between"
            style={{ color: red, borderColor: gold }}
          >
            <span>Astrological Data</span>
            <span className="text-[11px] font-normal text-stone-500">ज्योतिष विवरण</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/50 p-3.5 rounded border border-amber-200/60">
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
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between"
            style={{ color: red, borderColor: gold }}
          >
            <span>Education & Professional Standing</span>
            <span className="text-[11px] font-normal text-stone-500">शिक्षा एवं व्यवसाय</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded bg-amber-50/50 border border-amber-200/60">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between"
            style={{ color: red, borderColor: gold }}
          >
            <span>Family Heritage</span>
            <span className="text-[11px] font-normal text-stone-500">पारिवारिक विवरण</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/50 p-3.5 rounded border border-amber-200/60">
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
          <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
            About & Lifestyle
          </div>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong style={{ color: red }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break">
          <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
            Partner Preferences
          </div>
          <div className="space-y-1 text-xs text-stone-800">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong style={{ color: red }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-3 avoid-break">
              <div className="border-b pb-1 mb-1.5 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
                {sec.title}
              </div>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((it) => (
                    <div key={it.id}>
                      <span className="font-semibold text-stone-700">{it.key}:</span> {it.value}
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
          <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
            Additional Photos
          </div>
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
          <div className="font-bold uppercase tracking-wider mb-1" style={{ color: red }}>Contact Details</div>
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
