import React from 'react';
import { DocumentData } from '../../types/document';
import {
  BIODATA_LEFT_STYLE,
  BIODATA_RIGHT_STYLE,
  BIODATA_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const PhotoFocusedBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const { personal, customSections, customization } = data;
  const sections = getBiodataSections(data);

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex gap-8 items-center bg-gradient-to-r from-emerald-50 to-teal-50/40 p-6 rounded-2xl border border-emerald-100 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto ? (
          <div className="w-40 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white shrink-0">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-32 h-36 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-800 shrink-0">
            {personal.fullName?.charAt(0) || 'B'}
          </div>
        )}
        <div className="flex-1">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Matrimonial Biodata</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1 font-matrimonial-heading">
            {personal.fullName || 'Full Name'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-semibold text-emerald-800 mt-0.5">{personal.professionalTitle}</p>
          )}
          {(personal.religion || personal.caste) && (
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="space-y-4">
          {sections.personal.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Personal Details
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.personal.map((item) => (
                  <div key={item.key} style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.astrology.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Astrological Details
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.astrology.map((item) => (
                  <div key={item.key} style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.family.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Family Background
              </h2>
              <div className="space-y-1.5 text-xs">
                {sections.family.map((item) => (
                  <div key={item.key}>
                    <span className="text-slate-500">{item.label}:</span>{' '}
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {sections.careerEducation.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
                Education & Career
              </h2>
              <div className="space-y-2 text-xs">
                {sections.careerEducation.map((item) => (
                  <div key={item.key} className="pb-1 border-b border-slate-200 last:border-0">
                    <div className="font-bold text-slate-900">{item.label}</div>
                    <div className="text-slate-600">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.aboutAndInterests.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
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
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1 font-matrimonial-heading">
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
        </div>
      </div>

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4 avoid-break bg-slate-50 p-3 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 font-matrimonial-heading">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="text-slate-500">{i.key}:</span> <span className="font-medium">{i.value}</span>
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
        <div className="mb-4 avoid-break bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 font-matrimonial-heading">
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

      {sections.contact.length > 0 && (
        <div className="mt-5 pt-3 border-t border-slate-200 text-center text-xs text-slate-600 avoid-break flex justify-center flex-wrap gap-6">
          {sections.contact.map((item) => (
            <span key={item.key}>
              {item.label}: <strong className="text-slate-900">{item.value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
