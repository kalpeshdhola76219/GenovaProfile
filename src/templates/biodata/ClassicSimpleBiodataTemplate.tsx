import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ClassicSimpleBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
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
      className={`document-page-sheet p-7 font-jakarta text-slate-800 bg-white border border-slate-300 flex flex-col justify-between overflow-hidden ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-3 mb-3 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900 font-matrimonial-heading">
            Matrimonial Profile
          </h1>
          <p className="text-xl font-semibold text-slate-700 mt-0.5">
            {personal.fullName || 'MATRIMONIAL BIODATA'}
          </p>
        </div>
        {customization.showPhoto !== false && (
          <div className="shrink-0">
            {personal.profilePhoto ? (
              <div className="w-24 h-28 border border-slate-300 p-1 bg-white">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName || 'Candidate'}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 min-h-0">
        {/* Personal Details */}
        {personalItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              1. Personal Details
            </h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {personalItems.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600 w-1/3">{item.label}</td>
                    <td className="py-1 font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kundali & Astrology */}
        {astrologyItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              2. Kundali & Horoscope
            </h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {astrologyItems.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600 w-1/3">{item.label}</td>
                    <td className="py-1 font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Education & Profession */}
        {careerItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              3. Education & Profession
            </h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {careerItems.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600 w-1/3">{item.label}</td>
                    <td className="py-1 font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Family Details */}
        {familyItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              4. Family Details
            </h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {familyItems.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600 w-1/3">{item.label}</td>
                    <td className="py-1 font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* About & Interests */}
        {aboutItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              5. About & Interests
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

        {/* Expectations */}
        {expectationsItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              6. Partner Preferences
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
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 text-slate-900 mb-1.5 border-l-4 border-slate-800 font-matrimonial-heading">
              7. Contact Details
            </h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {contactItems.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600 w-1/3">{item.label}</td>
                    <td className="py-1 font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Footer */}
      <div className="pt-2 border-t-2 border-slate-800 text-xs text-slate-600 shrink-0 text-center">
        Confidential Document
      </div>
    </div>
  );
};
