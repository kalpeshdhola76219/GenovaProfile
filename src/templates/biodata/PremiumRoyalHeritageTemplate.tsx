import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import { getBiodataSections } from './biodataFields';

export const PremiumRoyalHeritageTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, customSections, customization } = data;
  const primary = customization.primaryColor || '#831843';
  const gold = customization.secondaryColor || '#d97706';
  const fontClass = getStaticFontClass(customization.fontFamily, 'cinzel');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  const sections = getBiodataSections(data);

  return (
    <div
      className={`document-page-sheet p-9 relative bg-[#fdfbf7] text-stone-900 border-[10px] border-double shadow-sm ${baseFontSize}`}
      style={{
        borderColor: primary,
      }}
    >
      <div
        className="absolute inset-2 border pointer-events-none"
        style={{ borderColor: gold, opacity: 0.8 }}
      />
      <div className="text-center relative z-10 mb-5">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${gold})` }} />
          <span className="text-sm font-semibold tracking-widest uppercase font-cinzel" style={{ color: gold }}>
            ॥ श्री गणेशाय नमः ॥
          </span>
          <span className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${gold})` }} />
        </div>

        <h1
          className={`text-3xl font-extrabold uppercase tracking-wide mt-1 ${fontClass}`}
          style={{ color: primary }}
        >
          {personal.fullName || 'Royal Heritage Alliance'}
        </h1>
        {(personal.religion || personal.caste) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs uppercase tracking-wider text-stone-600">
            {[personal.religion, personal.caste, personal.subCaste ? `(${personal.subCaste})` : null].filter(Boolean).join(' • ')}
          </div>
        )}
      </div>

      <div className="flex gap-6 mb-5 items-stretch bg-white/80 p-4 rounded-lg border shadow-sm relative z-10" style={{ borderColor: `${gold}55` }}>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-48 rounded-lg overflow-hidden border-2 p-1 bg-white shadow shrink-0 flex flex-col justify-center items-center" style={{ borderColor: gold }}>
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded"
            />
          </div>
        )}
        {sections.personal.length > 0 && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-1.5 mb-2.5" style={{ borderColor: `${gold}40` }}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
                  Personal Attributes & Details
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {sections.personal.map((item) => (
                  <div key={item.key}>
                    <span className="font-semibold text-stone-500">{item.label}:</span>{' '}
                    <span className="font-medium text-stone-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {sections.astrology.length > 0 && (
        <div className="mb-5 avoid-break relative z-10">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
            <span className="text-base" style={{ color: primary }}>❖</span>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Horoscope Details
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white/90 p-3.5 rounded border border-stone-200/80">
            {sections.astrology.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-500">{item.label}:</span>{' '}
                <span className="font-medium text-stone-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.careerEducation.length > 0 && (
        <div className="mb-5 avoid-break relative z-10">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
            <span className="text-base" style={{ color: primary }}>❖</span>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Education & Professional Credentials
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {sections.careerEducation.map((item) => (
              <div key={item.key} className="p-2.5 rounded bg-white border border-stone-200/80 shadow-2xs">
                <span className="font-bold text-stone-900">{item.label}:</span>{' '}
                <span className="text-stone-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.family.length > 0 && (
        <div className="mb-5 avoid-break relative z-10">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
            <span className="text-base" style={{ color: primary }}>❖</span>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Family Background & Lineage
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white/90 p-3.5 rounded border border-stone-200/80">
            {sections.family.map((item) => (
              <div key={item.key}>
                <span className="font-semibold text-stone-500">{item.label}:</span>{' '}
                <span className="font-semibold text-stone-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.aboutAndInterests.length > 0 && (
        <div className="mb-4 avoid-break relative z-10 bg-amber-50/50 p-3.5 rounded border border-amber-200/70">
          <div className="flex items-center gap-2 mb-1.5 pb-1 border-b" style={{ borderColor: `${gold}40` }}>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              About & Lifestyle
            </h2>
          </div>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.aboutAndInterests.map((item) => (
              <div key={item.key}>
                <strong style={{ color: primary }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.expectations.length > 0 && (
        <div className="mb-4 avoid-break relative z-10 bg-amber-50/50 p-3.5 rounded border border-amber-200/70">
          <div className="flex items-center gap-2 mb-1.5 pb-1 border-b" style={{ borderColor: `${gold}40` }}>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Partner Preferences
            </h2>
          </div>
          <div className="space-y-1 text-xs text-stone-700">
            {sections.expectations.map((item) => (
              <div key={item.key}>
                <strong style={{ color: primary }}>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break relative z-10">
          <h2 className={`text-xs font-bold uppercase tracking-widest mb-1 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
            {sec.title}
          </h2>
          <p className="text-xs text-stone-800 leading-relaxed">{sec.content}</p>
        </div>
      ))}

      {personal.extraPhotos && personal.extraPhotos.length > 0 && (
        <div className="mb-5 avoid-break relative z-10">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
            <span className="text-base" style={{ color: primary }}>❖</span>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Additional Photos
            </h2>
          </div>
          <div className="flex gap-3">
            {personal.extraPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Photo ${idx + 1}`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-20 h-24 object-cover rounded border border-stone-200"
              />
            ))}
          </div>
        </div>
      )}

      {sections.contact.length > 0 && (
        <div className="text-center pt-3 mt-4 border-t relative z-10" style={{ borderColor: `${gold}30` }}>
          <div className="flex justify-center flex-wrap gap-4 text-xs text-stone-700">
            {sections.contact.map((item) => (
              <span key={item.key}>
                <strong>{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
