import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const TraditionalIndianTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#991b1b';
  const accent = customization.accentColor || '#b45309';
  const sections = getBiodataSections(data);

  const personalItems = sections.personal.filter(
    (item) => item.key !== 'fullName' && item.key !== 'religion' && item.key !== 'caste' && item.key !== 'subCaste'
  );

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-900 border-8 border-double relative"
      style={{
        borderColor: primary,
        backgroundColor: customization.paperColor || '#fffdfa',
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-xl font-bold" style={{ color: accent }}>卐</div>
      <div className="absolute top-2 right-2 text-xl font-bold" style={{ color: accent }}>卐</div>
      <div className="absolute bottom-2 left-2 text-xl font-bold" style={{ color: accent }}>卐</div>
      <div className="absolute bottom-2 right-2 text-xl font-bold" style={{ color: accent }}>卐</div>

      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: accent }}>
        <p className="text-lg font-semibold tracking-wider" style={{ color: primary }}>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 className="text-3xl font-bold tracking-wide uppercase mt-1 font-matrimonial-heading" style={{ color: primary }}>
          Matrimonial Profile
        </h1>
        <p className="text-xl font-bold mt-1 text-slate-800 tracking-wide font-cinzel">
          {personal.fullName || 'Full Name'}
        </p>
        {(personal.religion || personal.caste) && (
          <p className="text-xs uppercase tracking-widest text-slate-600 mt-0.5">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      <div className="flex gap-6 items-start mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div
              className="w-36 h-44 rounded-md border-2 overflow-hidden shadow-sm p-1 bg-white"
              style={{ borderColor: accent }}
            >
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-sm"
              />
            </div>
          </div>
        )}
        {personalItems.length > 0 && (
          <div className="flex-1">
            <div
              className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm flex items-center justify-between"
              style={{ color: primary, borderColor: accent }}
            >
              <span>Personal Information</span>
              <span className="text-xs font-normal capitalize text-slate-500">वैयक्तिक माहिती</span>
            </div>
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
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm flex items-center justify-between"
            style={{ color: primary, borderColor: accent }}
          >
            <span>Astrological Details</span>
            <span className="text-xs font-normal capitalize text-slate-500">कुंडली विवरण</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
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
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm flex items-center justify-between"
            style={{ color: primary, borderColor: accent }}
          >
            <span>Education & Profession</span>
            <span className="text-xs font-normal capitalize text-slate-500">शिक्षण आणि नोकरी</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="bg-amber-50/40 p-2 rounded border border-amber-200/50">
                <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                <span className="text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break">
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm flex items-center justify-between"
            style={{ color: primary, borderColor: accent }}
          >
            <span>Family Details</span>
            <span className="text-xs font-normal capitalize text-slate-500">कौटुंबिक माहिती</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-slate-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-5 avoid-break">
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm"
            style={{ color: primary, borderColor: accent }}
          >
            About & Lifestyle
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong className="text-slate-900">{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-5 avoid-break">
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm"
            style={{ color: primary, borderColor: accent }}
          >
            Partner Preferences
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong className="text-slate-900">{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break">
              <div
                className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm"
                style={{ color: primary, borderColor: accent }}
              >
                {sec.title}
              </div>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {sec.items.map((item) => (
                    <div key={item.id}>
                      <span className="font-semibold text-slate-700">{item.key}:</span> {item.value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-700">{sec.content}</p>
              )}
            </div>
          ))}
        </>
      )}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break">
          <div
            className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-sm"
            style={{ color: primary, borderColor: accent }}
          >
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
        <div className="mt-6 pt-3 border-t-2 text-center text-sm avoid-break" style={{ borderColor: accent }}>
          <div className="font-bold tracking-wide uppercase mb-1" style={{ color: primary }}>
            Contact Information
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-800 font-medium">
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
