import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ModernMinimalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#0f172a';
  const accent = customization.accentColor || '#0284c7';
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-end border-b pb-6 mb-8" style={{ borderColor: '#e2e8f0' }}>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">Marriage Biodata</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 font-matrimonial-heading" style={{ color: primary }}>
            {personal.fullName || 'Full Name'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-medium text-slate-600 mt-1">{personal.professionalTitle}</p>
          )}
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover object-top rounded-xl shadow-sm border border-slate-200"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5 space-y-6">
          {sections.personal.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Personal Profile
              </h2>
              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {sections.personal.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{item.label}:</span>
                    <span className="font-medium text-slate-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Astrology Details
              </h2>
              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {sections.astrology.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{item.label}:</span>
                    <span className="font-medium text-slate-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.contact.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Contact Details
              </h2>
              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {sections.contact.map((item) => (
                  <div key={item.key} className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{item.label}:</span>
                    <span className="font-medium text-slate-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7 space-y-6">
          {sections.careerEducation.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Education & Career
              </h2>
              <div className="space-y-3">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="border-l-2 pl-3 py-0.5" style={{ borderColor: accent }}>
                    <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                    <div className="text-xs text-slate-600">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.family.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Family Background
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-xs text-slate-500 block">{item.label}:</span>
                    <span className="font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                About & Lifestyle
              </h2>
              <div className="text-sm space-y-2 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {sections.aboutAndInterests.map((item) => (
                  <div key={item.key}>
                    <strong className="text-slate-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.expectations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                Partner Expectations
              </h2>
              <div className="text-sm space-y-2 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
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
                <div key={sec.id}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-matrimonial-heading">{sec.title}</h2>
                  {sec.items ? (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg">
                      {sec.items.map((it) => (
                        <div key={it.id}>
                          <span className="text-slate-500">{it.key}:</span>{' '}
                          <span className="font-medium text-slate-800">{it.value}</span>
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-matrimonial-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
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
