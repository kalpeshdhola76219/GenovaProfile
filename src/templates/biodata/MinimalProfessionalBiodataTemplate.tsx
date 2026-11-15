import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const MinimalProfessionalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">Matrimonial Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5 font-matrimonial-heading">
            {personal.fullName || 'Full Name'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-semibold text-slate-600">{personal.professionalTitle}</p>
          )}
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover object-top rounded-lg shadow-sm border border-slate-200"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 space-y-4">
          {sections.personal.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Personal Details
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.personal.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{item.label}:</span>
                    <span className="font-semibold text-slate-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Horoscope Details
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.astrology.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{item.label}:</span>
                    <span className="font-semibold text-slate-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.contact.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Contact & Address
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <strong className="text-slate-700">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7 space-y-4">
          {sections.careerEducation.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Education & Experience
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.careerEducation.map((item) => (
                  <div key={item.key}>
                    <strong className="text-slate-700">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.family.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Family Details
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-500">{item.label}:</span> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                About & Lifestyle
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.expectations.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Partner Preferences
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {sections.expectations.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((sec) => (
                <div key={sec.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-matrimonial-heading">{sec.title}</h2>
                  {sec.items ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {sec.items.map((i) => (
                        <div key={i.id}>
                          <span className="text-slate-500">{i.key}:</span> {i.value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700">{sec.content}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {personal.extraPhotos && personal.extraPhotos.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
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
                    className="w-20 h-24 object-cover rounded border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
