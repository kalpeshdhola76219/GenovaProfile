import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const CircularPhotoBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
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
      className={`document-page-sheet p-7 font-jakarta text-stone-900 bg-[#fffdfa] border-4 border-stone-200 flex flex-col justify-between overflow-hidden ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
      }}
    >
      {/* Top Circular Header */}
      <div className="text-center pb-4 border-b border-stone-200 mb-3 shrink-0">
        {customization.showPhoto !== false && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-500 shadow-md mx-auto mb-2 p-0.5 bg-white">
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt={personal.fullName || 'Candidate'}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-800">
                {personal.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>
        )}
        <span className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold">Matrimonial Biodata</span>
        <h1 className="text-2xl font-extrabold uppercase mt-0.5 font-cinzel text-stone-900">
          {personal.fullName || 'MATRIMONIAL PROFILE'}
        </h1>
      </div>

      {/* Main Content Sections */}
      <div className="flex-1 space-y-2.5">
        {/* Personal Details */}
        {personalItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              Personal Profile
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {personalItems.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-2 border-b border-stone-100 pb-0.5">
                  <span className="text-stone-500 font-medium shrink-0">{item.label}:</span>
                  <span className="font-semibold text-stone-900 text-right break-words flex-1 pl-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Astrology Details */}
        {astrologyItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              Kundali & Astrology
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {astrologyItems.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-2 border-b border-stone-100 pb-0.5">
                  <span className="text-stone-500 font-medium shrink-0">{item.label}:</span>
                  <span className="font-semibold text-stone-900 text-right break-words flex-1 pl-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Career */}
        {careerItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              Education & Professional Career
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {careerItems.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-2 border-b border-stone-100 pb-0.5">
                  <span className="text-stone-500 font-medium shrink-0">{item.label}:</span>
                  <span className="font-semibold text-stone-900 text-right break-words flex-1 pl-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Details */}
        {familyItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              Family Heritage
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {familyItems.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-2 border-b border-stone-100 pb-0.5">
                  <span className="text-stone-500 font-medium shrink-0">{item.label}:</span>
                  <span className="font-semibold text-stone-900 text-right break-words flex-1 pl-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About & Interests */}
        {aboutItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              About & Lifestyle
            </h2>
            <div className="space-y-1 text-xs">
              {aboutItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-700">{item.label}:</span>{' '}
                  <span className="text-stone-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expectations */}
        {expectationsItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1 font-cinzel">
              Partner Preferences
            </h2>
            <div className="space-y-1 text-xs italic text-stone-700">
              {expectationsItems.map((item) => (
                <p key={item.key}>"{item.value}"</p>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {contactItems.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1.5 font-cinzel">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {contactItems.map((item) => {
                const isFullWidth =
                  item.key.toLowerCase().includes('address') ||
                  item.label.toLowerCase().includes('address') ||
                  item.value.length > 30;
                return (
                  <div
                    key={item.key}
                    className={`flex items-start justify-between gap-2 border-b border-stone-100 pb-0.5 ${
                      isFullWidth ? 'col-span-2' : ''
                    }`}
                  >
                    <span className="text-stone-500 font-medium shrink-0">{item.label}:</span>
                    <span className="font-semibold text-stone-900 text-right break-words flex-1 pl-2">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Photos */}
        {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
          <div className="pt-1">
            <div className="flex gap-2">
              {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-stone-200 shadow-xs">
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
      <div className="mt-3 pt-2 border-t border-stone-300 text-center text-xs text-stone-600 font-sans shrink-0">
        Confidential Matrimonial Document
      </div>
    </div>
  );
};
