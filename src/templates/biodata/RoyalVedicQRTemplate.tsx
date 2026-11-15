import React from 'react';
import { DocumentData } from '../../types/document';
import { GaneshaVector, ToranArchPattern } from './decorativeAssets';
import { User, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const RoyalVedicQRTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const bgCream = '#fffcf7';
  const deepMaroon = customization.primaryColor || '#6b1111';
  const saffron = customization.secondaryColor || '#b45309';
  const gold = customization.accentColor || '#c29b38';
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11.5px]' : customization.fontSize === 'lg' ? 'text-[13.5px]' : 'text-[12.5px]';

  const kundaliItems: { label: string; value?: string }[] = [
    { label: 'Date of Birth', value: personal.dateOfBirth },
    { label: 'Time of Birth', value: personal.timeOfBirth },
    { label: 'Place of Birth', value: personal.placeOfBirth },
    { label: 'Rashi / Moon Sign', value: personal.rashi },
    { label: 'Nakshatra', value: personal.nakshatra },
    { label: 'Gotra', value: personal.gotra },
    { label: 'Manglik Status', value: personal.manglik },
    { label: 'Sub-Caste', value: personal.subCaste },
    { label: 'Mother Tongue', value: personal.motherTongue },
  ].filter((item) => item.value && item.value.trim() !== '');

  const physicalItems: { label: string; value?: string }[] = [
    { label: 'Height', value: personal.height },
    { label: 'Weight', value: personal.weight },
    { label: 'Complexion', value: personal.complexion },
    { label: 'Blood Group', value: personal.bloodGroup },
    { label: 'Marital Status', value: personal.maritalStatus },
    { label: 'Lifestyle / Diet', value: marriage.lifestyle },
  ].filter((item) => item.value && item.value.trim() !== '');

  const primaryEducation = education[0];
  const primaryCareer = experience[0];

  return (
    <div
      className={`document-page-sheet relative shadow-md flex flex-col justify-between overflow-hidden text-slate-800 font-jakarta ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        maxWidth: '210mm',
        backgroundColor: bgCream,
        padding: '8mm 9mm',
      }}
    >
      <div
        className="w-full h-full flex flex-col justify-between relative p-5 rounded-lg"
        style={{
          border: `2px solid ${gold}`,
          outline: `1px solid ${deepMaroon}33`,
          outlineOffset: '-5px',
          backgroundColor: '#fffdfa',
        }}
      >
        <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: deepMaroon }} />
        <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: deepMaroon }} />
        <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: deepMaroon }} />
        <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: deepMaroon }} />

        <div className="relative text-center pb-2 border-b" style={{ borderColor: `${gold}55` }}>
          <div className="w-full mb-1 flex justify-center opacity-85">
            <ToranArchPattern color={gold} />
          </div>
          <div className="flex items-center justify-center gap-3">
            <GaneshaVector size={38} color={deepMaroon} variant="maroon" />
            <div>
              <p
                className="text-xl sm:text-2xl font-black tracking-[0.18em] uppercase font-serif"
                style={{ color: deepMaroon }}
              >
                ॥ श्री गणेशाय नमः ॥
              </p>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="w-8 h-px" style={{ backgroundColor: gold }} />
                <span className="text-[10.5px] uppercase tracking-widest font-bold font-serif" style={{ color: saffron }}>
                  शुभ विवाह Shubh Vivah Biodata
                </span>
                <span className="w-8 h-px" style={{ backgroundColor: gold }} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3.5 mb-3 flex items-center justify-between gap-6 px-2">
          <div className="flex-1">
            <div
              className="inline-block px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-wider mb-1"
              style={{ backgroundColor: `${deepMaroon}12`, color: deepMaroon }}
            >
              {personal.caste || personal.religion || 'Hindu'} • {personal.gotra ? `Gotra: ${personal.gotra}` : 'Matrimonial Profile'}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black font-serif tracking-wide leading-tight"
              style={{ color: deepMaroon }}
            >
              {personal.fullName || 'Candidate Name'}
            </h1>
            <p className="text-sm font-semibold mt-0.5" style={{ color: saffron }}>
              {[
                personal.professionalTitle || primaryCareer?.jobTitle,
                primaryEducation?.degree,
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          </div>
          {customization.showPhoto !== false && (
            <div className="shrink-0">
              {personal.profilePhoto ? (
                <div
                  className="w-28 h-36 rounded-md p-1 shadow-md relative overflow-hidden"
                  style={{
                    backgroundColor: '#fff',
                    border: `2px solid ${gold}`,
                    outline: `1px solid ${deepMaroon}40`,
                  }}
                >
                  <img
                    src={personal.profilePhoto}
                    alt={personal.fullName}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top rounded-sm"
                  />
                </div>
              ) : (
                <div
                  className="w-28 h-36 rounded-md flex flex-col items-center justify-center text-slate-400 bg-amber-50/60"
                  style={{ border: `1.5px dashed ${gold}` }}
                >
                  <User size={36} className="opacity-60 mb-1" style={{ color: deepMaroon }} />
                  <span className="text-[10px] font-serif uppercase tracking-wider text-slate-500">Photo</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 px-1">
          {kundaliItems.length > 0 && (
            <div className="avoid-break mb-5">
              <div className="flex items-center gap-2 pb-1 mb-2 border-b" style={{ borderColor: `${gold}66` }}>
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deepMaroon }} />
                <h2 className="text-sm font-extrabold uppercase tracking-wider font-serif" style={{ color: deepMaroon }}>
                  Kundali & Astrological Details (कुंडली विवरण)
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {kundaliItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">{item.label}:</span>
                    <span className="font-semibold text-slate-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(education.length > 0 || experience.length > 0 || personal.professionalTitle) && (
            <div className="avoid-break mb-5">
              <div className="flex items-center gap-2 pb-1 mb-2 border-b" style={{ borderColor: `${gold}66` }}>
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deepMaroon }} />
                <h2 className="text-sm font-extrabold uppercase tracking-wider font-serif" style={{ color: deepMaroon }}>
                  Education & Profession (शैक्षणिक आणि नोकरी)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx} className="bg-amber-50/40 p-2 rounded border border-amber-200/50">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-700 font-medium">
                      {edu.institute} {edu.endYear ? `(${edu.endYear})` : ''}
                    </div>
                  </div>
                ))}
                {experience.map((exp, idx) => (
                  <div key={idx} className="bg-amber-50/40 p-2 rounded border border-amber-200/50">
                    <div className="font-bold text-slate-900">{exp.jobTitle}</div>
                    <div className="text-slate-700 font-medium">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    {exp.achievements && (
                      <div className="text-[11px] font-semibold text-amber-900 mt-0.5">
                        Income / Notes: {exp.achievements}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(family.fatherName || family.motherName || family.brothersCount || family.sistersCount || family.nativePlace) && (
            <div className="avoid-break mb-5">
              <div className="flex items-center gap-2 pb-1 mb-2 border-b" style={{ borderColor: `${gold}66` }}>
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deepMaroon }} />
                <h2 className="text-sm font-extrabold uppercase tracking-wider font-serif" style={{ color: deepMaroon }}>
                  Family Details (कौटुंबिक माहिती)
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {family.fatherName && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Father's Name:</span>
                    <span className="font-semibold text-slate-900">{family.fatherName}</span>
                  </div>
                )}
                {family.fatherOccupation && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Father's Occupation:</span>
                    <span className="font-semibold text-slate-900">{family.fatherOccupation}</span>
                  </div>
                )}
                {family.motherName && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Mother's Name:</span>
                    <span className="font-semibold text-slate-900">{family.motherName}</span>
                  </div>
                )}
                {family.motherOccupation && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Mother's Occupation:</span>
                    <span className="font-semibold text-slate-900">{family.motherOccupation}</span>
                  </div>
                )}
                {(family.brothersCount || family.sistersCount) && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Siblings:</span>
                    <span className="font-semibold text-slate-900">
                      {[
                        family.brothersCount ? `${family.brothersCount} Brother(s)` : null,
                        family.sistersCount ? `${family.sistersCount} Sister(s)` : null,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                {family.nativePlace && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Native Place:</span>
                    <span className="font-semibold text-slate-900">{family.nativePlace}</span>
                  </div>
                )}
                {family.familyType && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Family Type:</span>
                    <span className="font-semibold text-slate-900">{family.familyType}</span>
                  </div>
                )}
                {family.familyStatus && (
                  <div className="grid grid-cols-[130px_1fr] items-baseline">
                    <span className="font-bold text-slate-700">Family Status:</span>
                    <span className="font-semibold text-slate-900">{family.familyStatus}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(physicalItems.length > 0 || marriage.aboutMe || marriage.partnerExpectations) && (
            <div className="avoid-break mb-5">
              <div className="flex items-center gap-2 pb-1 mb-2 border-b" style={{ borderColor: `${gold}66` }}>
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deepMaroon }} />
                <h2 className="text-sm font-extrabold uppercase tracking-wider font-serif" style={{ color: deepMaroon }}>
                  Profile & Expectations (अपेक्षा)
                </h2>
              </div>
              {marriage.aboutMe && (
                <div className="mb-2 bg-amber-50/40 p-2.5 rounded border border-amber-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: deepMaroon }}>
                    About Myself:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {marriage.aboutMe}
                  </p>
                </div>
              )}
              {physicalItems.length > 0 && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs mb-2">
                  {physicalItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[130px_1fr] items-baseline">
                      <span className="font-bold text-slate-700">{item.label}:</span>
                      <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {marriage.partnerExpectations && (
                <div className="bg-amber-50/60 p-2.5 rounded border border-amber-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: deepMaroon }}>
                    Partner Expectation:
                  </span>
                  <p className="text-xs italic text-slate-700 leading-relaxed">
                    "{marriage.partnerExpectations}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="avoid-break mt-auto pt-3 border-t-2 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 p-3 rounded-lg flex items-center justify-between gap-4"
          style={{ borderColor: gold }}
        >
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-serif text-[11px]" style={{ color: deepMaroon }}>
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Contact & Residence (संपर्क पत्ता)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-800">
              {contact.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="font-bold">{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {(contact.address || family.familyAddress) && (
                <div className="flex items-start gap-1.5 sm:col-span-2 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="text-[11.5px] leading-snug">
                    {contact.address || family.familyAddress}
                    {contact.city ? `, ${contact.city}` : ''}
                    {contact.state ? `, ${contact.state}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center text-center p-2 rounded-lg bg-white border shadow-xs" style={{ borderColor: `${gold}99` }}>
            <div className="w-18 h-18 p-1 relative flex items-center justify-center bg-white">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <rect x="5" y="5" width="26" height="26" rx="2" stroke={deepMaroon} strokeWidth="3" />
                <rect x="11" y="11" width="14" height="14" fill={deepMaroon} />
                <rect x="69" y="5" width="26" height="26" rx="2" stroke={deepMaroon} strokeWidth="3" />
                <rect x="75" y="11" width="14" height="14" fill={deepMaroon} />
                <rect x="5" y="69" width="26" height="26" rx="2" stroke={deepMaroon} strokeWidth="3" />
                <rect x="11" y="75" width="14" height="14" fill={deepMaroon} />
                <g fill={deepMaroon}>
                  <rect x="36" y="8" width="5" height="5" />
                  <rect x="46" y="8" width="5" height="5" />
                  <rect x="56" y="8" width="5" height="5" />
                  <rect x="8" y="36" width="5" height="5" />
                  <rect x="8" y="46" width="5" height="5" />
                  <rect x="8" y="56" width="5" height="5" />
                  <rect x="36" y="20" width="5" height="5" />
                  <rect x="46" y="24" width="6" height="6" />
                  <rect x="58" y="20" width="5" height="5" />
                  <rect x="36" y="36" width="7" height="7" />
                  <rect x="48" y="36" width="6" height="6" />
                  <rect x="60" y="36" width="6" height="6" />
                  <rect x="74" y="36" width="6" height="6" />
                  <rect x="86" y="36" width="6" height="6" />
                  <rect x="22" y="48" width="6" height="6" />
                  <rect x="36" y="48" width="6" height="6" />
                  <rect x="64" y="48" width="6" height="6" />
                  <rect x="78" y="48" width="6" height="6" />
                  <rect x="24" y="60" width="6" height="6" />
                  <rect x="38" y="60" width="6" height="6" />
                  <rect x="52" y="60" width="6" height="6" />
                  <rect x="68" y="60" width="6" height="6" />
                  <rect x="84" y="60" width="6" height="6" />
                  <rect x="38" y="76" width="6" height="6" />
                  <rect x="50" y="76" width="6" height="6" />
                  <rect x="64" y="76" width="6" height="6" />
                  <rect x="80" y="76" width="6" height="6" />
                  <rect x="44" y="86" width="6" height="6" />
                  <rect x="58" y="86" width="6" height="6" />
                  <rect x="72" y="86" width="6" height="6" />
                </g>
                <circle cx="50" cy="50" r="10" fill="#fff" stroke={gold} strokeWidth="1.5" />
                <circle cx="50" cy="50" r="6" fill={saffron} />
              </svg>
            </div>
            <div className="mt-1 text-[9px] font-bold text-slate-700 leading-tight max-w-[100px]">
              Scan to connect on WhatsApp / View Full Kundali
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-500 font-serif flex items-center justify-center gap-3">
          <span>卐</span>
          <span className="text-amber-600 font-bold">शुभं भवतु</span>
          <span>GenovaProfile Royal Matrimonial Record</span>
        </div>
      </div>
    </div>
  );
};
