import React from 'react';
import { DocumentData } from '../../types/document';
import {
  BIODATA_HEADER_LEFT_STYLE,
  BIODATA_HEADER_RIGHT_STYLE,
  BIODATA_HEADER_ROW_STYLE,
  BIODATA_LEFT_STYLE,
  BIODATA_RIGHT_STYLE,
  BIODATA_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const PremiumDarkBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
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
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-md" style={BIODATA_HEADER_ROW_STYLE}>
        <div style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'middle' }}>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Matrimonial Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white font-cinzel">
            {personal.fullName || 'Full Name'}
          </h1>
          {(personal.religion || personal.caste) && (
            <p className="text-sm text-slate-300 mt-1">
              {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'middle', width: '104px' }}>
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-24 h-28 object-cover object-top rounded-xl border-2 border-amber-400 shadow-md inline-block"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        {sections.personal.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
              <span className="text-amber-500">✦</span> Personal Details
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
              <span className="text-amber-500">✦</span> Astrology Details
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
      </div>

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
            <span className="text-amber-500">✦</span> Education & Career
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                <span className="text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
            <span className="text-amber-500">✦</span> Family Details
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="text-slate-500">{item.label}:</span>{' '}
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
            <span className="text-amber-500">✦</span> About & Lifestyle
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong className="text-slate-900">{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
            <span className="text-amber-500">✦</span> Partner Preferences
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
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
            <div key={sec.id} className="mb-4 avoid-break bg-slate-50 p-3 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-matrimonial-heading">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((i) => (
                    <div key={i.id}>
                      <span className="text-slate-500">{i.key}:</span> <span className="font-medium text-slate-900">{i.value}</span>
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
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5 font-matrimonial-heading">
            <span className="text-amber-500">✦</span> Additional Photos
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
