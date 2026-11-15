import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const TwoColumnBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800 flex"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
        <div>
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-32 h-36 mx-auto rounded-xl overflow-hidden border-2 border-violet-400 mb-4 shadow-md">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}

          {sections.personal.length > 0 && (
            <>
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-300 border-b border-violet-800 pb-1 mb-3 font-matrimonial-heading">
                Personal Details
              </h2>
              <div className="space-y-2 text-xs text-slate-300 mb-6">
                {sections.personal.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400 block">{item.label}:</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {sections.contact.length > 0 && (
            <>
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-300 border-b border-violet-800 pb-1 mb-3 font-matrimonial-heading">
                Contact Info
              </h2>
              <div className="space-y-2 text-xs text-slate-300">
                {sections.contact.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-400 block">{item.label}:</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800">
          Confidential Matrimonial Profile
        </div>
      </div>

      <div className="w-2/3 p-8 bg-white flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-violet-900 pb-4 mb-6">
            <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">Matrimonial Profile</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1 font-matrimonial-heading">
              {personal.fullName || 'Full Name'}
            </h1>
            {personal.professionalTitle && (
              <p className="text-sm font-medium text-slate-600 mt-0.5">{personal.professionalTitle}</p>
            )}
            {(personal.religion || personal.caste) && (
              <p className="text-xs text-slate-500 mt-1">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          <div className="space-y-5">
            {sections.astrology.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
                  Astrology Details
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
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
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
                  Education & Career
                </h2>
                <div className="space-y-2 text-xs">
                  {sections.careerEducation.map((item) => (
                    <div key={item.key} className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                      <span className="text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.family.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
                  Family Background
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
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
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
                  About & Lifestyle
                </h2>
                <div className="space-y-1 text-xs text-slate-700">
                  {sections.aboutAndInterests.map((item) => (
                    <div key={item.key}>
                      <strong className="text-violet-900">{item.label}:</strong> {item.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.expectations.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
                  Partner Preferences
                </h2>
                <div className="space-y-1 text-xs bg-violet-50/50 p-2.5 rounded border border-violet-100">
                  {sections.expectations.map((item) => (
                    <div key={item.key}>
                      <strong className="text-violet-900">{item.label}:</strong> {item.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customSections && customSections.length > 0 && (
              <>
                {customSections.map((sec) => (
                  <div key={sec.id}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">{sec.title}</h2>
                    {sec.items ? (
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded">
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
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
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
    </div>
  );
};
