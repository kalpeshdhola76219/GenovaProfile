import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const PortraitFocusBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800 bg-white flex min-h-[297mm]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      <div className="w-[32%] bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400 mb-5 shadow-lg">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] rounded-2xl bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400 mb-5 border border-slate-700">
              {personal.fullName?.charAt(0) || 'R'}
            </div>
          )}

          {sections.personal.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 mb-2 font-matrimonial-heading">
                Personal Details
              </h2>
              <div className="space-y-1.5 text-xs text-slate-300 mb-5">
                {sections.personal.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400 block text-[11px]">{item.label}:</span>
                    <span className="text-slate-200 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {sections.contact.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 mb-2 font-matrimonial-heading">
                Contact Info
              </h2>
              <div className="space-y-1.5 text-xs text-slate-300">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400 block text-[11px]">{item.label}:</span>
                    <span className="text-slate-200 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800">
          Private Matrimonial Record
        </div>
      </div>

      <div className="w-[68%] p-7 space-y-5">
        <div className="border-b-2 border-slate-900 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Matrimonial Biodata</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1 font-matrimonial-heading">
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

        {sections.astrology.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5 font-matrimonial-heading">
              Astrology Details
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {sections.astrology.map((item) => (
                <div key={item.key}>
                  <span className="text-slate-500">{item.label}:</span>{' '}
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.careerEducation.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5 font-matrimonial-heading">
              Education & Career
            </h2>
            <div className="space-y-2 text-xs">
              {sections.careerEducation.map((item) => (
                <div key={item.key} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                  <span className="text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.family.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5 font-matrimonial-heading">
              Family Background
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {sections.family.map((item) => (
                <div key={item.key}>
                  <span className="text-slate-500">{item.label}:</span>{' '}
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.aboutAndInterests.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
              About & Lifestyle
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {sections.aboutAndInterests.map((item) => (
                <div key={item.key}>
                  <strong className="text-amber-900">{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.expectations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
              Partner Preferences
            </h2>
            <div className="space-y-1 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 text-slate-700">
              {sections.expectations.map((item) => (
                <div key={item.key}>
                  <strong className="text-amber-900">{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {customSections && customSections.length > 0 && (
          <>
            {customSections.map((sec) => (
              <div key={sec.id}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1 font-matrimonial-heading">{sec.title}</h2>
                {sec.items ? (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
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
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
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
  );
};
