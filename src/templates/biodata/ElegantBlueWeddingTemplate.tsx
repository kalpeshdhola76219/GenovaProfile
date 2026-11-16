import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  GaneshaVector,
  WeddingRingsVector,
  CornerFiligreeVector,
} from './decorativeAssets';
import {
  User,
  Heart,
  Users,
  Phone,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { getBiodataSections } from './biodataFields';

export const ElegantBlueWeddingTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const royalNavy = customization.primaryColor || '#0c4a6e';
  const gold = customization.accentColor || '#b45309';
  const fontClass = getStaticFontClass(customization.fontFamily, 'cormorant');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const personalItems = sections.personal;
  const astrologyItems = sections.astrology;
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  // Filter out fullName from personalItems for section rendering since it's in the header
  const personalDetails = personalItems.filter((item) => item.key !== 'fullName');

  return (
    <div
      className={`document-page-sheet relative bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#e6f4f8] text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden font-jakarta ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '10mm 11mm 8mm 11mm',
      }}
    >
      {/* Decorative Border & Corner Filigrees */}
      <div className="absolute inset-3 border-2 pointer-events-none" style={{ borderColor: `${gold}99` }} />
      <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: `${gold}55` }} />
      <CornerFiligreeVector position="top-left" size={55} color={gold} className="absolute top-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="top-right" size={55} color={gold} className="absolute top-3 right-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-left" size={55} color={gold} className="absolute bottom-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-right" size={55} color={gold} className="absolute bottom-3 right-3 pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 text-center mb-2">
        <div className="flex justify-center mb-0.5">
          <div className="p-1 rounded-full bg-white/70 border border-amber-300/80 shadow-xs">
            <GaneshaVector size={38} color={gold} variant="gold" />
          </div>
        </div>
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase font-serif" style={{ color: gold }}>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] uppercase font-serif" style={{ color: royalNavy }}>
          {personal.fullName || 'MARRIAGE BIODATA'}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <div className="w-12 h-px bg-amber-400/80" />
          <span className="text-[10.5px] font-semibold tracking-widest uppercase italic text-amber-800">
            Shubh Vivah • Sacred Matrimonial Union
          </span>
          <div className="w-12 h-px bg-amber-400/80" />
        </div>
      </div>

      {/* Candidate Profile Highlight Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-sky-200/90 shadow-xs flex items-center gap-4 mb-2">
        {customization.showPhoto !== false && (
          <div className="relative shrink-0 w-24 h-24">
            {personal.profilePhoto ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: gold }} />
                <div className="w-24 h-24 rounded-full overflow-hidden p-0.5 bg-white shadow-sm">
                  <img
                    src={personal.profilePhoto}
                    alt={personal.fullName || 'Candidate'}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center text-sky-800 bg-sky-50"
                style={{ borderColor: gold }}
              >
                <User size={30} />
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold font-serif tracking-wide truncate" style={{ color: royalNavy }}>
            {personal.fullName || 'Matrimonial Profile'}
          </h2>
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1.5 truncate">
            {[
              personal.occupation || personal.professionalTitle,
              personal.education,
              personal.caste || personal.religion,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
          <div className="grid grid-cols-4 gap-2 pt-1.5 border-t border-sky-100 text-[11px]">
            <div>
              <span className="text-zinc-500 block text-[9.5px] uppercase font-bold">DOB / Age</span>
              <span className="font-semibold text-zinc-900 truncate block">
                {personal.dateOfBirth || '-'}{personal.age ? ` (${personal.age} Yrs)` : ''}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9.5px] uppercase font-bold">Height</span>
              <span className="font-semibold text-zinc-900 truncate block">{personal.height || '-'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9.5px] uppercase font-bold">Religion</span>
              <span className="font-semibold text-zinc-900 truncate block">{personal.religion || '-'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9.5px] uppercase font-bold">Caste</span>
              <span className="font-semibold text-zinc-900 truncate block">{personal.caste || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 flex-1 mb-1">
        {/* LEFT COLUMN */}
        <div className="space-y-2 flex flex-col justify-start">
          {/* Personal Information */}
          {personalDetails.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <User size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Personal Details
                </h3>
              </div>
              <div className="space-y-0.5 text-[11px]">
                {personalDetails.map((item) => (
                  <div key={item.key} className="grid grid-cols-[100px_10px_1fr] items-baseline leading-tight">
                    <span className="text-zinc-600 font-medium">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Horoscope & Astrology */}
          {astrologyItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <Sparkles size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Kundali & Astrology
                </h3>
              </div>
              <div className="space-y-0.5 text-[11px]">
                {astrologyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[100px_10px_1fr] items-baseline leading-tight">
                    <span className="text-zinc-600 font-medium">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About & Lifestyle */}
          {aboutItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <Heart size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  About & Interests
                </h3>
              </div>
              <div className="space-y-1 text-[11px]">
                {aboutItems.map((item) => (
                  <div key={item.key} className="space-y-0.5">
                    <span className="font-bold text-amber-900 text-[10.5px] block">{item.label}:</span>
                    <p className="text-zinc-800 leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-2 flex flex-col justify-start">
          {/* Education & Career */}
          {careerItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <GraduationCap size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Education & Career
                </h3>
              </div>
              <div className="space-y-0.5 text-[11px]">
                {careerItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_10px_1fr] items-baseline leading-tight">
                    <span className="text-zinc-600 font-medium">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family Details */}
          {familyItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <Users size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Family Details
                </h3>
              </div>
              <div className="space-y-0.5 text-[11px]">
                {familyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_10px_1fr] items-baseline leading-tight">
                    <span className="text-zinc-600 font-medium">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner Preferences */}
          {expectationsItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <Heart size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Partner Preference
                </h3>
              </div>
              <div className="space-y-0.5">
                {expectationsItems.map((item) => (
                  <p key={item.key} className="text-[11px] text-zinc-800 leading-snug italic">
                    "{item.value}"
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {contactItems.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-sky-200/80 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
                <Phone size={13} style={{ color: gold }} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>
                  Contact Information
                </h3>
              </div>
              <div className="space-y-0.5 text-[11px]">
                {contactItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_10px_1fr] items-baseline leading-tight">
                    <span className="text-zinc-600 font-medium">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Photos if present */}
          {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
            <div className="pt-1">
              <div className="flex gap-2 justify-center">
                {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                  <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-sky-200 shadow-xs">
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

      {/* Bottom Footer Decoration */}
      <div className="relative z-10 flex justify-center my-0.5 pointer-events-none">
        <WeddingRingsVector size={42} goldColor={gold} />
      </div>
    </div>
  );
};
