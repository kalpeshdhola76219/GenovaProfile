import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  GraduationCap,
  Users,
  Heart,
  Phone,
  User,
} from 'lucide-react';
import { getBiodataSections } from './biodataFields';

export const ModernTealBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const sections = getBiodataSections(data);
  const { personal, marriage, contact, customization } = data;

  const tealBg = customization.primaryColor || '#123940'; // Deep Dark Teal
  const goldAccent = customization.secondaryColor || customization.accentColor || '#eab308'; // Radiant Warm Gold
  const fontClass = getStaticFontClass(customization.fontFamily, 'jakarta');
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const personalItems = sections.personal;
  const astrologyItems = sections.astrology;
  const familyItems = sections.family;
  const careerItems = sections.careerEducation;
  const aboutItems = sections.aboutAndInterests;
  const expectationsItems = sections.expectations;
  const contactItems = sections.contact;

  // Separate aboutMe text from other aboutAndInterests items (hobbies, interests, lifestyle)
  const aboutMeItem = aboutItems.find((item) => item.key === 'aboutMe');
  const secondaryAboutItems = aboutItems.filter((item) => item.key !== 'aboutMe');

  return (
    <div
      className={`document-page-sheet relative bg-white text-zinc-800 shadow-sm flex flex-col overflow-hidden font-jakarta ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '0',
      }}
    >
      {/* Top Header Banner: Cursive Name, Bio & Profile Photo */}
      <div className="pt-7 px-8 pb-5 flex items-center justify-between gap-6 bg-white relative">
        <div className="flex-1 max-w-[65%]">
          {/* Script / Stylized Name */}
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-1 font-serif italic"
            style={{ color: '#2d3748' }}
          >
            {personal.fullName || 'MATRIMONIAL BIODATA'}
          </h1>
          {/* Subtitle / Personal Intro if aboutMe exists */}
          {aboutMeItem ? (
            <p className="text-[11.5px] leading-relaxed text-zinc-600 font-medium line-clamp-3">
              {aboutMeItem.value}
            </p>
          ) : (
            <p className="text-[11px] leading-relaxed text-zinc-500 font-medium italic">
              {[
                personal.caste || personal.religion,
                personal.occupation || personal.professionalTitle,
                contact.city ? `Living in ${contact.city}` : null,
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          )}
        </div>

        {/* Top-Right Circular Photo with Concentric Gold Rings */}
        {customization.showPhoto !== false && (
          <div className="relative shrink-0 w-32 h-32">
            {/* Dark teal flourish in top-right corner */}
            <div
              className="absolute -top-7 -right-8 w-20 h-20 rounded-bl-full pointer-events-none"
              style={{ backgroundColor: tealBg }}
            />
            {personal.profilePhoto ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Gold concentric decorative rings */}
                <div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: goldAccent }}
                />
                <div
                  className="absolute inset-1.5 rounded-full border"
                  style={{ borderColor: `${goldAccent}88` }}
                />
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg bg-zinc-100">
                  <img
                    src={personal.profilePhoto}
                    alt={personal.fullName || 'Profile'}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            ) : (
              <div
                className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center text-teal-800 bg-teal-50"
                style={{ borderColor: goldAccent }}
              >
                <User size={32} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Two-Tone Split Layout */}
      <div className="flex-1 grid grid-cols-12 min-h-0">
        {/* LEFT COLUMN: Dark Teal Sidebar with Rounded Top-Right Corner */}
        <div
          className="col-span-5 p-6 text-white flex flex-col justify-between rounded-tr-3xl space-y-4"
          style={{ backgroundColor: tealBg }}
        >
          <div className="space-y-4">
            {/* Personal Details Section */}
            {personalItems.length > 0 && (
              <section>
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest pb-1 mb-2.5 border-b border-teal-700/60 font-matrimonial-heading"
                  style={{ color: goldAccent }}
                >
                  PERSONAL DETAILS
                </h2>
                <div className="space-y-1.5 text-[11.5px]">
                  {personalItems.map((item) => (
                    <div key={item.key} className="grid grid-cols-[90px_8px_1fr] items-baseline leading-tight">
                      <span className="text-zinc-300 font-medium shrink-0">{item.label}</span>
                      <span className="text-zinc-400 font-bold shrink-0">:</span>
                      <span className="font-semibold text-white break-words pl-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Astrology / Kundali Details */}
            {astrologyItems.length > 0 && (
              <section className="pt-2 border-t border-teal-700/60">
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest pb-1 mb-2 border-b border-teal-700/60 font-matrimonial-heading"
                  style={{ color: goldAccent }}
                >
                  HOROSCOPE & KUNDALI
                </h2>
                <div className="space-y-1.5 text-[11.5px]">
                  {astrologyItems.map((item) => (
                    <div key={item.key} className="grid grid-cols-[90px_8px_1fr] items-baseline leading-tight">
                      <span className="text-zinc-300 font-medium shrink-0">{item.label}</span>
                      <span className="text-zinc-400 font-bold shrink-0">:</span>
                      <span className="font-semibold text-white break-words pl-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Secondary Hobbies / Lifestyle Items */}
            {secondaryAboutItems.length > 0 && (
              <section className="pt-2 border-t border-teal-700/60">
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest pb-1 mb-2 border-b border-teal-700/60 font-matrimonial-heading"
                  style={{ color: goldAccent }}
                >
                  INTERESTS & LIFESTYLE
                </h2>
                <div className="space-y-1.5 text-[11.5px]">
                  {secondaryAboutItems.map((item) => (
                    <div key={item.key} className="space-y-0.5">
                      <span className="text-amber-300 font-bold text-[11px] block">{item.label}:</span>
                      <span className="text-zinc-200 block text-[11px] leading-snug">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Footer Note */}
          <div className="pt-3 border-t border-teal-700/50 text-[10.5px] text-teal-200 text-center italic">
            Confidential Matrimonial Profile
          </div>
        </div>

        {/* RIGHT COLUMN: Crisp White Main Content */}
        <div className="col-span-7 p-6 flex flex-col justify-between space-y-4">
          {/* CAREER & EDUCATION */}
          {careerItems.length > 0 && (
            <section>
              <h2
                className="text-xs font-extrabold uppercase tracking-wider pb-1 mb-2.5 border-b-2 font-matrimonial-heading flex items-center gap-2"
                style={{ color: tealBg, borderColor: `${tealBg}30` }}
              >
                <GraduationCap size={14} style={{ color: tealBg }} />
                EDUCATION & CAREER
              </h2>
              <div className="space-y-1.5 text-[11.5px]">
                {careerItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
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
              <h2
                className="text-xs font-extrabold uppercase tracking-wider pb-1 mb-2.5 border-b-2 font-matrimonial-heading flex items-center gap-2"
                style={{ color: tealBg, borderColor: `${tealBg}30` }}
              >
                <Users size={14} style={{ color: tealBg }} />
                FAMILY DETAILS
              </h2>
              <div className="space-y-1.5 text-[11.5px]">
                {familyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-800 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PARTNER PREFERENCES */}
          {expectationsItems.length > 0 && (
            <section>
              <h2
                className="text-xs font-extrabold uppercase tracking-wider pb-1 mb-2 border-b-2 font-matrimonial-heading flex items-center gap-2"
                style={{ color: tealBg, borderColor: `${tealBg}30` }}
              >
                <Heart size={14} style={{ color: tealBg }} />
                PARTNER EXPECTATIONS
              </h2>
              <div className="space-y-1.5">
                {expectationsItems.map((item) => (
                  <div key={item.key} className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-2.5 text-[11px] text-zinc-700 leading-relaxed text-justify">
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT DETAILS */}
          {contactItems.length > 0 && (
            <section className="mt-auto">
              <h2
                className="text-xs font-extrabold uppercase tracking-wider pb-1 mb-2 border-b-2 font-matrimonial-heading flex items-center gap-2"
                style={{ color: tealBg, borderColor: `${tealBg}30` }}
              >
                <Phone size={14} style={{ color: tealBg }} />
                CONTACT DETAILS
              </h2>
              <div className="space-y-1.5 text-[11.5px]">
                {contactItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-600">{item.label}</span>
                    <span className="text-zinc-400 font-bold">:</span>
                    <span className="font-semibold text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Photos if present */}
          {marriage?.additionalPhotos && marriage.additionalPhotos.filter(Boolean).length > 0 && (
            <section className="pt-2">
              <div className="flex gap-2">
                {marriage.additionalPhotos.filter(Boolean).slice(0, 3).map((imgUrl, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-md overflow-hidden border border-zinc-200 shadow-xs shrink-0">
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
    </div>
  );
};
