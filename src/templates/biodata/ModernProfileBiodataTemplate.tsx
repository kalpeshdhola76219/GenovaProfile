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

export const ModernProfileBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
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
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl mb-6 shadow-sm" style={BIODATA_HEADER_ROW_STYLE}>
        <div style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'middle' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Personal & Marriage Profile</span>
          <h1 className="text-3xl font-black text-white mt-1 font-matrimonial-heading">
            {personal.fullName || 'Rahul Sharma'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-xs font-medium text-slate-300 mt-0.5">{personal.professionalTitle}</p>
          )}
          {(personal.religion || personal.caste) && (
            <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
              <span className="bg-white/10 px-2 py-0.5 rounded">
                {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'middle', width: '104px' }}>
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-24 h-28 object-cover object-top rounded-xl border-2 border-white/80 shadow-md inline-block"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        {sections.personal.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
              Personal Profile
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
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
              Astrological & Physical
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
            Education & Profession
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                <span className="text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-matrimonial-heading">
            Family Information
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
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-matrimonial-heading">
            About & Lifestyle
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
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-matrimonial-heading">
            Partner Expectations
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
            <div key={sec.id} className="mb-3 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-matrimonial-heading">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
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
        <div className="mb-5 avoid-break">
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
