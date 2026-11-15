import React from 'react';
import { DocumentData } from '../../types/document';
import {
  User,
  Users,
  GraduationCap,
  Heart,
  Phone,
  Sparkles,
} from 'lucide-react';
import { getBiodataSections } from './biodataFields';

export const MonochromeModernBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, customization } = data;

  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-sans';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const personalItems = sections.personal;
  const astrologyItems = sections.astrology;
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  // Filter out fullName from personalItems for section list since it is in the top header
  const personalDetails = personalItems.filter((item) => item.key !== 'fullName');

  return (
    <div
      className={`document-page-sheet relative bg-white text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden font-jakarta ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '0',
      }}
    >
      {/* Top Banner with Monochrome Wave SVG */}
      <div className="relative w-full h-48 bg-white overflow-hidden shrink-0">
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          <path
            d="M0 0 L450 0 C400 70 350 160 160 185 C80 195 0 150 0 150 Z"
            fill="#111827"
          />
        </svg>

        {/* Top Header Title */}
        <div className="absolute top-4 left-8 z-20">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-zinc-400">
            CONFIDENTIAL MATRIMONIAL BIODATA
          </p>
        </div>

        {/* Candidate Name & Subtitle */}
        <div className="absolute top-11 left-8 z-20 max-w-[320px]">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug font-matrimonial-heading">
            {personal.fullName || 'MATRIMONIAL PROFILE'}
          </h1>
          <p className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mt-1 leading-normal">
            {[
              personal.occupation || personal.professionalTitle,
              personal.caste || personal.religion,
              personal.education,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </div>

        {/* Circular Profile Photo */}
        {customization.showPhoto !== false && (
          <div className="absolute top-5 right-8 z-20 w-36 h-36">
            {personal.profilePhoto ? (
              <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-zinc-200">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName || 'Candidate'}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-full border-4 border-white shadow-lg flex items-center justify-center text-zinc-400 bg-zinc-100">
                <User size={40} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Two-Column Grid */}
      <div className="px-8 py-2 grid grid-cols-12 gap-6 flex-1 relative z-10 min-h-0">
        {/* LEFT COLUMN */}
        <div className="col-span-5 space-y-3.5 flex flex-col justify-start">
          {/* PERSONAL DETAILS */}
          {personalDetails.length > 0 && (
            <section>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white font-bold text-[10.5px] uppercase tracking-wider mb-2">
                <User size={12} />
                <span>PERSONAL DETAILS</span>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {personalDetails.map((item) => (
                  <div key={item.key} className="grid grid-cols-[95px_8px_1fr] items-baseline leading-tight">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-bold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ASTROLOGY & KUNDALI */}
          {astrologyItems.length > 0 && (
            <section>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 text-zinc-900 font-bold text-[10.5px] uppercase tracking-wider mb-2">
                <Sparkles size={12} />
                <span>KUNDALI & ASTROLOGY</span>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {astrologyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[95px_8px_1fr] items-baseline leading-tight">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-bold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ABOUT & LIFESTYLE */}
          {aboutItems.length > 0 && (
            <section>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 text-zinc-900 font-bold text-[10.5px] uppercase tracking-wider mb-2">
                <Heart size={12} />
                <span>ABOUT & INTERESTS</span>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {aboutItems.map((item) => (
                  <div key={item.key} className="space-y-0.5">
                    <span className="font-bold text-zinc-900 text-[10.5px] block">{item.label}:</span>
                    <p className="text-zinc-700 leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-7 space-y-3.5 flex flex-col justify-start">
          {/* EDUCATION & CAREER */}
          {careerItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
                <GraduationCap size={14} className="text-zinc-900" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 font-matrimonial-heading">
                  EDUCATION & CAREER
                </h3>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {careerItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_8px_1fr] items-baseline leading-tight">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-bold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAMILY DETAILS */}
          {familyItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
                <Users size={14} className="text-zinc-900" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 font-matrimonial-heading">
                  FAMILY DETAILS
                </h3>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {familyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_8px_1fr] items-baseline leading-tight">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-bold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PARTNER EXPECTATIONS */}
          {expectationsItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
                <Heart size={14} className="text-zinc-900" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 font-matrimonial-heading">
                  PARTNER PREFERENCES
                </h3>
              </div>
              <div className="space-y-1 pl-1">
                {expectationsItems.map((item) => (
                  <div key={item.key} className="bg-zinc-100 p-2 rounded border border-zinc-200">
                    <p className="text-[11px] text-zinc-800 leading-snug italic">"{item.value}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT DETAILS */}
          {contactItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
                <Phone size={14} className="text-zinc-900" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 font-matrimonial-heading">
                  CONTACT DETAILS
                </h3>
              </div>
              <div className="space-y-1 text-[11px] pl-1">
                {contactItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[105px_8px_1fr] items-baseline leading-tight">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-bold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Photos if present */}
          {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
            <section className="pt-1">
              <div className="flex gap-2">
                {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                  <div key={idx} className="w-14 h-14 rounded-md overflow-hidden border border-zinc-300 shadow-xs">
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
            </section>
          )}
        </div>
      </div>

      {/* Bottom Wave Footer */}
      <div className="relative w-full h-24 overflow-hidden mt-auto shrink-0">
        <svg
          viewBox="0 0 600 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          <path
            d="M220 100 C320 40 420 10 600 0 L600 100 Z"
            fill="#111827"
          />
        </svg>

        <div className="absolute bottom-3 right-8 z-20 text-white text-right text-[10.5px]">
          <p className="font-semibold italic text-zinc-300">Thank you for viewing this profile</p>
        </div>
      </div>
    </div>
  );
};
