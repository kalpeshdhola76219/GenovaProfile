import React from 'react';
import { DocumentData } from '../../types/document';
import { getBiodataSections } from './biodataFields';

export const ChristianWeddingBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const royalNavy = customization.primaryColor || '#1e3a8a';
  const champagneGold = customization.accentColor || '#b45309';

  const personalItems = sections.personal.filter((item) => item.key !== 'fullName');
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  return (
    <div
      className="document-page-sheet p-7 font-jakarta text-stone-900 border-8 border-double relative bg-[#fbfcfd] flex flex-col justify-between overflow-hidden"
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        borderColor: royalNavy,
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '14px' : '13px',
      }}
    >
      {/* Top Christian Heading Banner */}
      <div className="text-center pb-3 border-b-2 mb-3 shrink-0" style={{ borderColor: champagneGold }}>
        <div className="text-2xl font-serif text-amber-700 font-bold leading-none">✝</div>
        <p className="text-[10.5px] uppercase tracking-widest font-sans font-semibold text-slate-500 italic mt-0.5">
          "Love is patient, love is kind. It always protects, always trusts, always hopes." (1 Corinthians 13:4-7)
        </p>
        <h1 className="text-2xl font-extrabold uppercase mt-1 font-cinzel text-blue-950">
          Matrimonial Profile
        </h1>
        <p className="text-xl font-bold text-stone-900 font-cinzel mt-0.5">
          {personal.fullName || 'CHRISTIAN MATRIMONIAL BIODATA'}
        </p>
      </div>

      {/* Top Personal Summary + Photo */}
      <div className="flex gap-5 mb-3 items-start shrink-0">
        {customization.showPhoto !== false && (
          <div className="shrink-0">
            {personal.profilePhoto ? (
              <div className="w-32 h-40 rounded-xl border-2 p-1 bg-white shadow-md" style={{ borderColor: royalNavy }}>
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName || 'Candidate'}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>
            ) : null}
          </div>
        )}

        {personalItems.length > 0 && (
          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-cinzel text-blue-900 border-b pb-1 border-slate-100 flex items-center justify-between">
              <span>Personal Profile</span>
              <span className="text-[10px] text-amber-700 font-sans">Sacred Covenant</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {personalItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-600">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 space-y-3 min-h-0">
        {/* Education & Career */}
        {careerItems.length > 0 && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-cinzel pb-1 border-b" style={{ color: royalNavy, borderColor: champagneGold }}>
              Education & Professional Career
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {careerItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-600">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Details */}
        {familyItems.length > 0 && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-cinzel" style={{ color: royalNavy }}>
              Family Details
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {familyItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-600">{item.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About & Hobbies */}
        {aboutItems.length > 0 && (
          <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-xs">
            <span className="font-bold uppercase tracking-wider block mb-1 text-blue-900 font-cinzel">About & Interests</span>
            <div className="space-y-1 text-stone-700">
              {aboutItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-blue-950">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expectations */}
        {expectationsItems.length > 0 && (
          <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-xs">
            <span className="font-bold uppercase tracking-wider block mb-1 text-blue-900 font-cinzel">Partner Expectations</span>
            <div className="space-y-1 text-stone-700 italic">
              {expectationsItems.map((item) => (
                <p key={item.key}>"{item.value}"</p>
              ))}
            </div>
          </div>
        )}

        {/* Contact Details */}
        {contactItems.length > 0 && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-cinzel text-blue-900">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {contactItems.map((item) => (
                <div key={item.key}>
                  <span className="font-semibold text-stone-600">{item.label}:</span>{' '}
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

      {/* Footer Note */}
      <div className="pt-2 mt-auto border-t-2 flex justify-between items-center text-xs shrink-0" style={{ borderColor: champagneGold }}>
        <div className="text-stone-600 font-sans text-[11px] italic">
          May Grace and Joy Fill This Union
        </div>
        <div className="text-amber-800 font-bold uppercase tracking-widest text-[10px] font-sans">
          God Bless Our Union
        </div>
      </div>
    </div>
  );
};
