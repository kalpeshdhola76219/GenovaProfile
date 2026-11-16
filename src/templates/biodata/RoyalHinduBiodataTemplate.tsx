import React from 'react';
import { DocumentData } from '../../types/document';
import { getStaticFontClass } from '../../utils/fontClassMap';
import {
  User,
  Users,
  GraduationCap,
  Heart,
  UserCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  GaneshaVector,
  LotusVector,
  OmLotusVector,
  CornerFiligreeVector,
  DiyaLampVector,
} from './decorativeAssets';
import {
  BIODATA_HEADER_LEFT_STYLE,
  BIODATA_HEADER_RIGHT_STYLE,
  BIODATA_HEADER_ROW_STYLE,
  getBiodataSections,
  sanitizeDocumentTextFields,
} from './biodataFields';

export const RoyalHinduBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data: rawData }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const sections = getBiodataSections(data);
  const { personal, customization } = data;

  const maroon = customization.primaryColor || '#7a1414'; // Traditional Deep Maroon
  const gold = customization.accentColor || '#b45309'; // Warm Royal Gold / Amber
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

  return (
    <div
      className={`document-page-sheet relative bg-[#fffdf9] text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden font-jakarta ${baseFontSize} ${fontClass}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '14mm 13mm 10mm 13mm',
      }}
    >
      {/* Royal Gold Frame Border with Inset Double Stroke */}
      <div
        className="absolute inset-3 border-2 pointer-events-none"
        style={{ borderColor: `${gold}99` }}
      />
      <div
        className="absolute inset-[15px] border pointer-events-none"
        style={{ borderColor: `${gold}44` }}
      />

      {/* Ornate Corner Filigrees */}
      <CornerFiligreeVector
        position="top-left"
        size={50}
        color={gold}
        className="absolute top-3 left-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="top-right"
        size={50}
        color={gold}
        className="absolute top-3 right-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="bottom-left"
        size={50}
        color={gold}
        className="absolute bottom-3 left-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="bottom-right"
        size={50}
        color={gold}
        className="absolute bottom-3 right-3 pointer-events-none"
      />

      {/* Hanging Brass Diya Lamp on the Right */}
      <div className="absolute top-5 right-7 pointer-events-none">
        <DiyaLampVector size={22} color={gold} />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 mb-3 px-2" style={BIODATA_HEADER_ROW_STYLE}>
        {/* Left Side: Circular Photo with Concentric Rings */}
        {customization.showPhoto !== false && (
          <div style={{ ...BIODATA_HEADER_LEFT_STYLE, verticalAlign: 'middle', width: '144px', paddingRight: '16px' }}>
            <div className="relative w-32 h-32">
              {personal.profilePhoto ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: gold }}
                  />
                  <div
                    className="absolute inset-1.5 rounded-full border"
                    style={{ borderColor: `${gold}66` }}
                  />
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-md bg-amber-50">
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
                  className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center text-amber-700 bg-amber-50"
                  style={{ borderColor: gold }}
                >
                  <User size={32} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side: Royal Hindu Title */}
        <div className="text-center pr-4" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          <div className="flex justify-center mb-0.5">
            <LotusVector size={32} color={gold} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-[0.14em] uppercase leading-tight font-serif"
            style={{ color: maroon }}
          >
            {personal.fullName || 'HINDU MARRIAGE BIODATA'}
          </h1>
          {/* Subtitle with decorative diamond line */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-10 h-px" style={{ backgroundColor: gold }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
            <span
              className="text-xs font-semibold tracking-wider font-serif uppercase italic"
              style={{ color: gold }}
            >
              {[
                personal.caste || personal.religion,
                personal.gotra ? `Gotra: ${personal.gotra}` : null,
                'Matrimonial Profile',
              ]
                .filter(Boolean)
                .join(' • ')}
            </span>
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
            <div className="w-10 h-px" style={{ backgroundColor: gold }} />
          </div>
        </div>
      </div>

      {/* Main Content: Two Balanced Columns */}
      <div className="relative z-10 grid grid-cols-2 gap-x-5 gap-y-3 flex-1 mb-2 px-1">
        {/* LEFT COLUMN */}
        <div className="space-y-3 flex flex-col justify-start">
          {/* Personal Details */}
          {personalItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <User size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  PERSONAL DETAILS
                </h2>
              </div>
              <div className="space-y-0.5 pl-1">
                {personalItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[100px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Kundali & Astrology */}
          {astrologyItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Sparkles size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  KUNDALI & ASTROLOGY
                </h2>
              </div>
              <div className="space-y-0.5 pl-1">
                {astrologyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[100px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Family Details */}
          {familyItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Users size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  FAMILY DETAILS
                </h2>
              </div>
              <div className="space-y-0.5 pl-1">
                {familyItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[100px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-3 flex flex-col justify-start">
          {/* Education & Career */}
          {careerItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <GraduationCap size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  EDUCATION & CAREER
                </h2>
              </div>
              <div className="space-y-0.5 pl-1">
                {careerItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* About & Lifestyle */}
          {aboutItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Heart size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  ABOUT & LIFESTYLE
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {aboutItems.map((item) =>
                  item.key === 'aboutMe' ? (
                    <div key={item.key} className="mb-1.5 bg-amber-50/50 p-2 rounded border border-amber-200/60">
                      <span className="font-bold text-zinc-800 text-[11px] block mb-0.5">About Me:</span>
                      <p className="text-xs text-zinc-800 leading-relaxed text-justify">{item.value}</p>
                    </div>
                  ) : (
                    <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
                      <span className="font-semibold text-zinc-700">{item.label}</span>
                      <span className="text-zinc-500 font-bold">:</span>
                      <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* Partner Preference */}
          {expectationsItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <UserCheck size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  PARTNER PREFERENCE
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {expectationsItems.map((item) => (
                  <div key={item.key} className="bg-amber-50/50 p-2 rounded border border-amber-200/60">
                    <span className="font-bold text-zinc-800 text-[11px] block mb-0.5">{item.label}:</span>
                    <p className="text-xs italic text-zinc-800 leading-relaxed">"{item.value}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Details */}
          {contactItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Phone size={10} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  CONTACT DETAILS
                </h2>
              </div>
              <div className="space-y-0.5 pl-1">
                {contactItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[110px_10px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Bottom Footer Section: Ganesha + Sacred Om + Blessing Note */}
      <div
        className="relative z-10 rounded-lg p-2.5 border mt-auto"
        style={{
          ...BIODATA_HEADER_ROW_STYLE,
          backgroundColor: '#faede1',
          borderColor: `${gold}55`,
        }}
      >
        <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '48px', textAlign: 'center' }}>
          <div className="w-12 h-12 flex items-center justify-center">
            <GaneshaVector size={38} color={maroon} variant="line" />
          </div>
        </div>
        <div className="text-center px-4" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          <p className="text-[11px] font-semibold text-zinc-800 font-serif">
            Thank you for visiting my profile.
          </p>
          <p className="text-[10px] text-zinc-600 italic">
            Looking forward to a meaningful, blessed connection.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5 text-zinc-400">
            <span className="text-xs text-amber-600">卐</span>
            <span className="text-xs font-serif font-bold text-amber-800">शुभं भवतु</span>
            <span className="text-xs text-amber-600">卐</span>
          </div>
        </div>
        <div style={{ ...BIODATA_HEADER_RIGHT_STYLE, verticalAlign: 'middle', width: '48px', textAlign: 'center' }}>
          <div className="w-12 h-12 flex items-center justify-center">
            <OmLotusVector size={38} color={maroon} />
          </div>
        </div>
      </div>
    </div>
  );
};
