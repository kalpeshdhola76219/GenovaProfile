import React from 'react';
import { DocumentData } from '../../types/document';
import { ToranArchPattern } from './decorativeAssets';
import { User } from 'lucide-react';
import { getBiodataSections } from './biodataFields';

export const RoyalMaroonBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const bgMaroon = customization.primaryColor || '#450a0a'; // Rich Deep Royal Maroon
  const gold = customization.accentColor || '#fbbf24'; // Radiant Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const personalItems = sections.personal;
  const astrologyItems = sections.astrology;
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  return (
    <div
      className={`document-page-sheet relative text-amber-50 shadow-sm flex flex-col justify-between overflow-hidden font-jakarta ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        backgroundColor: bgMaroon,
        padding: '0',
      }}
    >
      {/* Background Watermark Mandala Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <svg viewBox="0 0 600 600" fill="none" className="w-[500px] h-[500px] stroke-amber-200 stroke-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="300" cy="300" r={i * 35 + 20} strokeDasharray="6 4" />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`spoke-${i}`}
              x1="300"
              y1="300"
              x2={300 + 280 * Math.cos((i * Math.PI) / 8)}
              y2={300 + 280 * Math.sin((i * Math.PI) / 8)}
            />
          ))}
        </svg>
      </div>

      {/* Top Toran Decorative Arch */}
      <div className="relative z-10 w-full pt-3 shrink-0">
        <ToranArchPattern color={gold} />
      </div>

      {/* Top Header Heading */}
      <div className="relative z-10 text-center py-1">
        <p
          className="text-xl md:text-2xl font-bold tracking-[0.16em] uppercase font-serif"
          style={{ color: '#fef08a' }}
        >
          ॥ श्री गणेशाय नमः ॥
        </p>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <div className="w-14 h-px" style={{ backgroundColor: gold }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
          <span className="text-[10.5px] uppercase tracking-widest font-semibold text-amber-200">
            Shubh Matrimonial Profile
          </span>
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
          <div className="w-14 h-px" style={{ backgroundColor: gold }} />
        </div>
      </div>

      {/* Main Body Content */}
      <div className="relative z-10 px-10 py-2 flex-1 flex flex-col justify-start space-y-3 min-h-0">
        {/* TOP SECTION: Personal Details + Candidate Photo */}
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-2 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Personal Details
            </h2>
            {personalItems.length > 0 && (
              <div className="space-y-1 text-[11.5px]">
                {personalItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_8px_1fr] items-baseline leading-tight">
                    <span className="font-bold text-[#fde047]">{item.label}</span>
                    <span className="text-amber-200/80 font-bold">:</span>
                    <span className="text-amber-100 font-medium break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Photo Frame */}
          {customization.showPhoto !== false && (
            <div className="shrink-0 w-36 pt-1">
              {personal.profilePhoto ? (
                <div
                  className="w-36 h-48 rounded-lg p-1.5 border-2 shadow-xl bg-amber-950/40 relative overflow-hidden"
                  style={{ borderColor: gold }}
                >
                  <div className="w-full h-full rounded overflow-hidden">
                    <img
                      src={personal.profilePhoto}
                      alt={personal.fullName || 'Candidate'}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="w-36 h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-amber-300 bg-amber-950/20"
                  style={{ borderColor: gold }}
                >
                  <User size={40} className="opacity-70 mb-1" />
                  <span className="text-[10px] uppercase font-serif">Profile Portrait</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* HOROSCOPE & KUNDALI */}
        {astrologyItems.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-2 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Horoscope & Kundali
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11.5px]">
              {astrologyItems.map((item) => (
                <div key={item.key} className="grid grid-cols-[120px_8px_1fr] items-baseline leading-tight">
                  <span className="font-bold text-[#fde047]">{item.label}</span>
                  <span className="text-amber-200/80 font-bold">:</span>
                  <span className="text-amber-100 font-medium break-words">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION & CAREER */}
        {careerItems.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-2 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Education & Career
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11.5px]">
              {careerItems.map((item) => (
                <div key={item.key} className="grid grid-cols-[120px_8px_1fr] items-baseline leading-tight">
                  <span className="font-bold text-[#fde047]">{item.label}</span>
                  <span className="text-amber-200/80 font-bold">:</span>
                  <span className="text-amber-100 font-medium break-words">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAMILY DETAILS */}
        {familyItems.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-2 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Family Details
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11.5px]">
              {familyItems.map((item) => (
                <div key={item.key} className="grid grid-cols-[120px_8px_1fr] items-baseline leading-tight">
                  <span className="font-bold text-[#fde047]">{item.label}</span>
                  <span className="text-amber-200/80 font-bold">:</span>
                  <span className="text-amber-100 font-medium break-words">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT & INTERESTS */}
        {aboutItems.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-1.5 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              About & Interests
            </h2>
            <div className="space-y-1 text-[11.5px]">
              {aboutItems.map((item) => (
                <div key={item.key} className="space-y-0.5">
                  <span className="font-bold text-[#fde047] block text-[11px]">{item.label}:</span>
                  <p className="text-amber-100/90 leading-relaxed text-justify">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARTNER EXPECTATIONS */}
        {expectationsItems.length > 0 && (
          <div className="p-2.5 rounded border border-amber-500/30 bg-amber-950/40">
            <span className="font-bold text-[#fde047] block text-xs uppercase mb-0.5 font-serif">
              Partner Expectation:
            </span>
            <div className="space-y-1">
              {expectationsItems.map((item) => (
                <p key={item.key} className="text-[11.5px] italic text-amber-100/90 leading-relaxed">
                  "{item.value}"
                </p>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT DETAILS */}
        {contactItems.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold tracking-wide font-serif pb-1 mb-2 border-b uppercase"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Contact Details
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11.5px]">
              {contactItems.map((item) => (
                <div key={item.key} className="grid grid-cols-[120px_8px_1fr] items-baseline leading-tight">
                  <span className="font-bold text-[#fde047]">{item.label}</span>
                  <span className="text-amber-200/80 font-bold">:</span>
                  <span className="text-amber-100 font-medium break-words">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Photos if present */}
        {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
          <div className="pt-1">
            <div className="flex gap-2">
              {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-amber-500/40 shadow-xs">
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

      {/* Bottom Toran Decorative Arch */}
      <div className="relative z-10 w-full pb-3 shrink-0">
        <ToranArchPattern color={gold} />
      </div>
    </div>
  );
};
