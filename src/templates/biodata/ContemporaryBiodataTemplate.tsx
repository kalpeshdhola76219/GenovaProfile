import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  BIODATA_LEFT_STYLE,
  BIODATA_RIGHT_STYLE,
  BIODATA_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const ContemporaryBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const personalItems = sections.personal.filter((item) => item.key !== 'fullName');
  const astrologyItems = sections.astrology;
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  return (
    <div
      className={`document-page-sheet p-7 font-jakarta text-slate-800 bg-white flex flex-col justify-between overflow-hidden ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
      }}
    >
      {/* Top Banner Header */}
      <div className="flex gap-6 items-center border-b-2 border-teal-800 pb-4 mb-3 shrink-0">
        {customization.showPhoto !== false && (
          <div className="shrink-0">
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt={personal.fullName || 'Candidate'}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-24 h-28 object-cover object-top rounded-2xl border-2 border-teal-600 shadow-sm"
              />
            ) : null}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            Matrimonial Biodata
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-matrimonial-heading truncate">
            {personal.fullName || 'MATRIMONIAL PROFILE'}
          </h1>
          <p className="text-xs font-semibold text-teal-800 mt-0.5 truncate">
            {[
              personal.occupation || personal.professionalTitle,
              personal.caste || personal.religion,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Personal Details */}
          {personalItems.length > 0 && (
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-1.5 font-matrimonial-heading">
                Personal Particulars
              </h2>
              <div className="space-y-1 text-xs">
                {personalItems.map((item) => (
                  <div key={item.key} className="border-b border-teal-100/60 pb-0.5" style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500 font-medium" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Astrology & Kundali */}
          {astrologyItems.length > 0 && (
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-1.5 font-matrimonial-heading">
                Horoscope & Kundali
              </h2>
              <div className="space-y-1 text-xs">
                {astrologyItems.map((item) => (
                  <div key={item.key} className="border-b border-teal-100/60 pb-0.5" style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500 font-medium" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About & Interests */}
          {aboutItems.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1 font-matrimonial-heading">
                About & Interests
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {aboutItems.map((item) => (
                  <div key={item.key}>
                    <strong className="text-slate-900">{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Education & Career */}
          {careerItems.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5 font-matrimonial-heading">
                Education & Career
              </h2>
              <div className="space-y-1 text-xs">
                {careerItems.map((item) => (
                  <div key={item.key} className="border-b border-slate-200/60 pb-0.5" style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500 font-medium" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family Details */}
          {familyItems.length > 0 && (
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-1.5 font-matrimonial-heading">
                Family Background
              </h2>
              <div className="space-y-1 text-xs">
                {familyItems.map((item) => (
                  <div key={item.key} className="border-b border-teal-100/60 pb-0.5" style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500 font-medium" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner Expectations */}
          {expectationsItems.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1 font-matrimonial-heading">
                Partner Preferences
              </h2>
              <div className="space-y-1 text-xs italic text-slate-700">
                {expectationsItems.map((item) => (
                  <p key={item.key}>"{item.value}"</p>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          {contactItems.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5 font-matrimonial-heading">
                Contact Information
              </h2>
              <div className="space-y-1 text-xs">
                {contactItems.map((item) => (
                  <div key={item.key} className="border-b border-slate-200/60 pb-0.5" style={BIODATA_ROW_STYLE}>
                    <span className="text-slate-500 font-medium" style={{ ...BIODATA_LEFT_STYLE, width: '44%' }}>{item.label}:</span>
                    <span className="font-semibold text-slate-900" style={{ ...BIODATA_RIGHT_STYLE, width: '56%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Photos */}
          {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
            <div className="pt-1">
              <div className="flex gap-2">
                {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                  <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t-2 border-teal-800 text-center text-xs text-slate-600 shrink-0">
        Confidential Matrimonial Profile
      </div>
    </div>
  );
};
