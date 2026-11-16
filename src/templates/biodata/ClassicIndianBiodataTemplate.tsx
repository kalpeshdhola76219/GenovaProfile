import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { getBiodataSections } from './biodataFields';

export const ClassicIndianBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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
      className={`document-page-sheet p-7 font-jakarta text-stone-900 border-4 border-stone-800 relative bg-[#fdfdfc] flex flex-col justify-between overflow-hidden ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
      }}
    >
      {/* Top Header */}
      <div className="text-center pb-3 border-b-2 border-stone-800 mb-3 shrink-0">
        <div className="text-xl font-bold font-cinzel text-stone-900 mb-0.5">॥ श्री गणेशाय नमः ॥</div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-stone-900 font-cinzel">
          Marriage Biodata (बायोडाटा)
        </h1>
        <p className="text-xl font-bold mt-0.5 text-stone-900 font-cinzel">
          {personal.fullName || 'MATRIMONIAL PROFILE'}
        </p>
      </div>

      {/* Profile Photo + Personal Details */}
      <div className="flex gap-5 mb-3 items-start shrink-0">
        {customization.showPhoto !== false && (
          <div className="shrink-0">
            {personal.profilePhoto ? (
              <div className="w-32 h-40 border border-stone-400 p-1 bg-white shadow-xs">
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

        {personalItems.length > 0 && (
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Personal Particulars
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Body Content */}
      <div className="flex-1 space-y-3 min-h-0">
        {/* Astrology Details */}
        {astrologyItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Kundali & Horoscope
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {astrologyItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Career */}
        {careerItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Educational Qualifications & Career
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {careerItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Details */}
        {familyItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Family Details
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {familyItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About & Lifestyle */}
        {aboutItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              About & Interests
            </h2>
            <div className="space-y-1 text-xs text-stone-800">
              {aboutItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-900">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expectations */}
        {expectationsItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Partner Preferences
            </h2>
            <div className="space-y-1 text-xs italic text-stone-800">
              {expectationsItems.map((item) => (
                <p key={item.key}>"{item.value}"</p>
              ))}
            </div>
          </div>
        )}

        {/* Contact Details */}
        {contactItems.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1.5 border-l-2 border-stone-800 font-cinzel">
              Contact Particulars
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {contactItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
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
                <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-stone-300 shadow-xs">
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
      <div className="mt-3 pt-2 border-t-2 border-stone-800 text-center text-xs text-stone-700 shrink-0 font-sans">
        Confidential Indian Matrimonial Document
      </div>
    </div>
  );
};
