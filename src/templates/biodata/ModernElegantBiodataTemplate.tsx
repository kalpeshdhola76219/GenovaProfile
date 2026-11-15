import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ModernElegantBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet p-9 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-center border-b pb-6 mb-7 border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Matrimonial Profile
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1 font-matrimonial-heading">
            {personal.fullName || 'Rahul Sharma'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-semibold text-slate-600 mt-0.5">{personal.professionalTitle}</p>
          )}
          {(personal.religion || personal.caste) && (
            <div className="text-xs text-slate-500 mt-1">
              {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
            </div>
          )}
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover object-top rounded-2xl shadow-sm border border-slate-200 shrink-0"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-5 space-y-5">
          {sections.personal.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Personal Info
              </h2>
              <div className="space-y-2 text-xs">
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
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 font-matrimonial-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Astrology Details
              </h2>
              <div className="space-y-2 text-xs">
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
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-matrimonial-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Contact
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7 space-y-5">
          {sections.careerEducation.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-matrimonial-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Career & Academics
              </h2>
              <div className="space-y-2 text-xs">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                    <span className="text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.family.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-matrimonial-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Family Details
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-500">{item.label}:</span>{' '}
                    <span className="font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-matrimonial-heading">
                About & Lifestyle
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong className="text-indigo-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.expectations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-matrimonial-heading">
                Partner Preferences
              </h2>
              <div className="space-y-1 text-xs bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                {sections.expectations.map((item) => (
                  <div key={item.key}>
                    <strong className="text-indigo-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((sec) => (
                <div key={sec.id}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-matrimonial-heading">
                    {sec.title}
                  </h2>
                  {sec.items ? (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                      {sec.items.map((i) => (
                        <div key={i.id}>
                          <span className="text-slate-500">{i.key}:</span>{' '}
                          <span className="font-medium">{i.value}</span>
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
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-matrimonial-heading">
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
                    className="w-20 h-24 object-cover rounded-xl border border-slate-200"
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
