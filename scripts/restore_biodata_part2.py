import os

def save(file_path, content):
    full_path = os.path.abspath(file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Wrote:', file_path)

# 16. ModernTealBiodataTemplate.tsx
save('src/templates/biodata/ModernTealBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';
import {
  Calendar,
  Ruler,
  Activity,
  Droplet,
  Sun,
  Shield,
  Briefcase,
  MapPin,
  GraduationCap,
  ChevronRight,
  Phone,
  Home,
} from 'lucide-react';

export const ModernTealBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const tealBg = customization.primaryColor || '#123940'; // Deep Dark Teal
  const goldAccent = customization.secondaryColor || '#eab308'; // Radiant Warm Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11.5px]' : customization.fontSize === 'lg' ? 'text-[13.5px]' : 'text-[12.5px]';

  // Personal items for the left dark teal panel
  const personalVitals = [
    { label: 'Birth Date', value: personal.dateOfBirth, icon: Calendar },
    { label: 'Height', value: personal.height, icon: Ruler },
    { label: 'Weight', value: personal.weight, icon: Activity },
    { label: 'Blood Type', value: personal.bloodGroup, icon: Droplet },
    { label: 'Religion', value: personal.religion, icon: Sun },
    { label: 'Caste', value: [personal.caste, personal.subCaste].filter(Boolean).join(', '), icon: Shield },
    { label: 'Profession', value: experience[0]?.jobTitle || personal.professionalTitle, icon: Briefcase },
    { label: 'Living in', value: [contact.city, contact.state].filter(Boolean).join(', '), icon: MapPin },
  ].filter((item) => item.value && item.value.trim() !== '');

  return (
    <div
      className={`document-page-sheet relative bg-white text-zinc-800 shadow-sm flex flex-col overflow-hidden ${fontClass} ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '0',
      }}
    >
      {/* Top Header Banner: Cursive Name, Bio & Profile Photo */}
      <div className="pt-8 px-10 pb-6 flex items-center justify-between gap-6 bg-white relative">
        <div className="flex-1 max-w-[62%]">
          {/* Script / Stylized Name */}
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-2 font-serif italic"
            style={{ color: '#57534e' }}
          >
            {personal.fullName || 'Shraddha Patel'}
          </h1>
          {/* Subtitle / Personal Intro */}
          <p className="text-[12px] leading-relaxed text-zinc-600 font-medium">
            {marriage.aboutMe ||
              "Hi, I'm a simple and positive person with strong family values. I'm passionate about continuous learning, meaningful conversations, and building a progressive, happy life together."}
          </p>
        </div>

        {/* Top-Right Circular Photo with Concentric Gold Rings */}
        <div className="relative shrink-0 w-36 h-36">
          {/* Dark teal flourish in top-right corner */}
          <div
            className="absolute -top-8 -right-10 w-24 h-24 rounded-bl-full pointer-events-none"
            style={{ backgroundColor: tealBg }}
          />
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Gold concentric decorative rings */}
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: goldAccent }}
              />
              <div
                className="absolute inset-2 rounded-full border"
                style={{ borderColor: `${goldAccent}88` }}
              />
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-zinc-100">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div
              className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center text-teal-800 bg-teal-50"
              style={{ borderColor: goldAccent }}
            >
              <Briefcase size={36} />
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Tone Split Layout */}
      <div className="flex-1 grid grid-cols-12 min-h-0">
        {/* LEFT COLUMN: Dark Teal Sidebar with Rounded Top-Right Corner */}
        <div
          className="col-span-5 p-8 text-white flex flex-col justify-between rounded-tr-3xl"
          style={{ backgroundColor: tealBg }}
        >
          {/* Personal Vitals Section */}
          <div className="space-y-3">
            {personalVitals.map((vital, idx) => {
              const Icon = vital.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-[12px]">
                  <Icon size={14} className="text-amber-300 shrink-0 opacity-80" />
                  <span className="w-24 text-zinc-300 font-medium shrink-0">{vital.label}</span>
                  <span className="text-zinc-400 font-bold shrink-0">:</span>
                  <span className="font-semibold text-white truncate">{vital.value}</span>
                </div>
              );
            })}

            {/* EDUCATION SECTION */}
            {education.length > 0 && (
              <div className="pt-4 border-t border-teal-700/60 mt-4">
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest mb-3"
                  style={{ color: goldAccent }}
                >
                  EDUCATION
                </h2>
                <div className="space-y-2.5">
                  {education.slice(0, 2).map((edu, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-start gap-1.5 font-bold text-white text-[12px]">
                        <ChevronRight size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{edu.degree || 'Degree'}</span>
                      </div>
                      {edu.institute && (
                        <div className="flex items-center gap-1.5 pl-4 text-[11px] text-zinc-300">
                          <GraduationCap size={12} className="text-teal-400 shrink-0" />
                          <span className="truncate">{edu.institute}</span>
                        </div>
                      )}
                      {edu.location && (
                        <div className="flex items-center gap-1.5 pl-4 text-[10.5px] text-zinc-400">
                          <MapPin size={11} className="text-teal-400 shrink-0" />
                          <span>{edu.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WORK / CAREER SECTION */}
            {experience.length > 0 && (
              <div className="pt-4 border-t border-teal-700/60 mt-4">
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest mb-3"
                  style={{ color: goldAccent }}
                >
                  WORK
                </h2>
                <div className="space-y-2.5">
                  {experience.slice(0, 2).map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-start gap-1.5 font-bold text-white text-[12px]">
                        <ChevronRight size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{exp.jobTitle || 'Professional'}</span>
                      </div>
                      {exp.company && (
                        <div className="flex items-center gap-1.5 pl-4 text-[11px] text-zinc-300">
                          <Briefcase size={12} className="text-teal-400 shrink-0" />
                          <span className="truncate">{exp.company}</span>
                        </div>
                      )}
                      {exp.location && (
                        <div className="flex items-center gap-1.5 pl-4 text-[10.5px] text-zinc-400">
                          <MapPin size={11} className="text-teal-400 shrink-0" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                      {exp.achievements && (
                        <div className="flex items-center gap-1.5 pl-4 text-[11px] font-semibold text-amber-300">
                          <span>{exp.achievements}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Astrological details if present */}
          {(personal.gotra || personal.rashi || personal.manglik) && (
            <div className="pt-3 border-t border-teal-700/50 text-[10.5px] text-teal-200">
              {personal.gotra && <div>Gotra: {personal.gotra}</div>}
              {personal.rashi && <div>Rashi: {personal.rashi}</div>}
              {personal.manglik && <div>Manglik: {personal.manglik}</div>}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Crisp White Main Content */}
        <div className="col-span-7 p-8 flex flex-col justify-between space-y-6">
          {/* FAMILY DETAILS */}
          <section>
            <h2
              className="text-sm font-extrabold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
              style={{ color: tealBg, borderColor: `${tealBg}30` }}
            >
              FAMILY DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              {family.fatherName && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Father</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-bold text-zinc-900">{family.fatherName}</span>
                </div>
              )}
              {family.fatherOccupation && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Occupation</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-medium text-zinc-800">{family.fatherOccupation}</span>
                </div>
              )}
              {family.motherName && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Mother</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-bold text-zinc-900">{family.motherName}</span>
                </div>
              )}
              {family.motherOccupation && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Occupation</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-medium text-zinc-800">{family.motherOccupation}</span>
                </div>
              )}
              {family.familyType && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Family Type</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-medium text-zinc-800">{family.familyType}</span>
                </div>
              )}
              {family.nativePlace && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Native Place</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-medium text-zinc-800">{family.nativePlace}</span>
                </div>
              )}
              {(family.familyAddress || contact.address) && (
                <div className="grid grid-cols-[100px_12px_1fr] items-baseline">
                  <span className="font-semibold text-zinc-600">Current Address</span>
                  <span className="text-zinc-400 font-bold">:</span>
                  <span className="font-medium text-zinc-800">
                    {family.familyAddress || `${contact.address || ''}, ${contact.city || ''}`}
                  </span>
                </div>
              )}
            </div>

            {/* Maternal / Extended Family Details if present */}
            {family.additionalMembers && family.additionalMembers.length > 0 && (
              <div className="mt-3 pt-2 border-t border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Maternal / Relatives:
                </span>
                <div className="space-y-1 pl-1 text-[11.5px] text-zinc-700">
                  {family.additionalMembers.map((m, i) => (
                    <div key={i}>
                      • <span className="font-semibold">{m.name}</span> ({m.relation}) - {m.occupation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* CONTACT DETAILS */}
          <section>
            <h2
              className="text-sm font-extrabold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
              style={{ color: tealBg, borderColor: `${tealBg}30` }}
            >
              CONTACT DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2 font-bold text-zinc-900">
                <ChevronRight size={13} style={{ color: tealBg }} />
                <span>{family.fatherName || personal.fullName || 'Contact Representative'}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 pl-4 text-zinc-700">
                  <Phone size={13} style={{ color: tealBg }} />
                  <span className="font-semibold">{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 pl-4 text-zinc-700">
                  <span className="font-medium">{contact.email}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-center gap-2 pl-4 text-zinc-700">
                  <Home size={13} style={{ color: tealBg }} />
                  <span>{contact.address}, {contact.city}</span>
                </div>
              )}
            </div>
          </section>

          {/* PARTNER PREFERENCES */}
          <section className="mt-auto">
            <h2
              className="text-sm font-extrabold uppercase tracking-wider pb-1.5 mb-2.5 border-b-2"
              style={{ color: tealBg, borderColor: `${tealBg}30` }}
            >
              PARTNER PREFERENCES
            </h2>
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 text-[11.5px] text-zinc-700 leading-relaxed text-justify">
              <p>
                {marriage.partnerExpectations ||
                  "Looking for a well-educated partner with a good family background, someone who leads a clean, balanced lifestyle, values mutual respect, trust, and understanding."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
''')

# 17. ModernFamilyProfileTemplate.tsx
save('src/templates/biodata/ModernFamilyProfileTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';
import { DEFAULT_MALE_AVATAR, DEFAULT_FEMALE_AVATAR } from '../../data/sampleData';
import {
  User,
  GraduationCap,
  Users,
  Phone,
  Home,
  Briefcase,
  Sparkles,
  Camera,
} from 'lucide-react';

export const ModernFamilyProfileTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const primary = customization.primaryColor || '#44403c'; // Warm Taupe Charcoal
  const accent = customization.secondaryColor || '#a8a29e'; // Soft Stone Accent
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  // Support multiple photos for the 3 gallery cards at the bottom
  const galleryPhotos =
    marriage.additionalPhotos && marriage.additionalPhotos.length > 0
      ? marriage.additionalPhotos
      : personal.profilePhoto
      ? [
          personal.profilePhoto,
          DEFAULT_FEMALE_AVATAR,
          DEFAULT_MALE_AVATAR,
        ]
      : [];

  return (
    <div
      className={`document-page-sheet relative bg-[#faf9f7] text-zinc-800 shadow-sm flex flex-col justify-between overflow-hidden ${fontClass} ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '12mm 14mm 10mm 14mm',
      }}
    >
      {/* Subtle Architectural Grid Motif on Top Right */}
      <div className="absolute top-0 right-0 w-52 h-44 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full stroke-zinc-400 stroke-[1]">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 28} x2="200" y2={i * 28} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 28} y1="0" x2={i * 28} y2="160" />
          ))}
        </svg>
      </div>

      {/* Modern Header Row: Left Photo + Name, Right Top Family Header */}
      <div className="relative z-10 flex gap-6 items-start mb-3">
        {/* Top-Left Circular Photo */}
        <div className="relative shrink-0 w-36 h-36">
          <div className="absolute -top-1 left-2 text-zinc-400">
            <Sparkles size={16} />
          </div>
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-zinc-300" />
              <div className="absolute inset-1.5 rounded-full border border-zinc-200" />
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-sm bg-zinc-200">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 bg-zinc-100">
              <User size={36} />
            </div>
          )}
        </div>

        {/* Name & Title Block */}
        <div className="flex-1 pt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-1">
            {personal.fullName || 'Khyati Shah'}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            {experience[0]?.jobTitle || personal.professionalTitle || 'Chartered Accountant'}
          </p>
          <div className="w-16 h-1 rounded-full bg-zinc-300 mt-2" />
        </div>
      </div>

      {/* Main Two-Column Structure */}
      <div className="relative z-10 grid grid-cols-12 gap-6 flex-1 mb-3">
        {/* LEFT COLUMN: Profile & Education */}
        <div className="col-span-5 space-y-4">
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3.5 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                MY PROFILE
              </span>
              <div className="w-2.5 h-px bg-zinc-300 flex-1" />
              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <User size={12} />
              </div>
            </div>
            <div className="space-y-1.5 text-[11.5px] text-zinc-700 pl-1">
              {personal.dateOfBirth && (
                <div>
                  <span className="font-semibold text-zinc-900">Date of Birth:</span> {personal.dateOfBirth}
                </div>
              )}
              {(personal.timeOfBirth || personal.placeOfBirth) && (
                <div>
                  <span className="font-semibold text-zinc-900">Birth Time & Place:</span>{' '}
                  {[personal.timeOfBirth, personal.placeOfBirth].filter(Boolean).join(', ')}
                </div>
              )}
              {personal.height && (
                <div>
                  <span className="font-semibold text-zinc-900">Height:</span> {personal.height}
                </div>
              )}
              {personal.caste && (
                <div>
                  <span className="font-semibold text-zinc-900">Caste:</span> {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''}
                </div>
              )}
              {personal.gotra && (
                <div>
                  <span className="font-semibold text-zinc-900">Gotra:</span> {personal.gotra}
                </div>
              )}
              {personal.rashi && (
                <div>
                  <span className="font-semibold text-zinc-900">Rashi:</span> {personal.rashi}
                </div>
              )}
              {personal.manglik && (
                <div>
                  <span className="font-semibold text-zinc-900">Manglik:</span> {personal.manglik}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3.5 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                EDUCATION
              </span>
              <div className="w-2.5 h-px bg-zinc-300 flex-1" />
              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <GraduationCap size={12} />
              </div>
            </div>
            <div className="space-y-2 text-[11.5px] text-zinc-700 pl-1">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-zinc-900">{edu.degree}</div>
                  {edu.institute && <div className="text-zinc-600 text-[11px]">{edu.institute}</div>}
                  {edu.location && <div className="text-zinc-500 text-[10.5px]">{edu.location}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Large Warm Gray Rounded Card */}
        <div className="col-span-7 bg-[#f3f1ee] border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-3.5 shadow-2xs">
          <section>
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300/60">
              <span className="px-3.5 py-1 rounded-full border border-zinc-300 bg-white text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                FAMILY
              </span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-2xs">
                <Users size={12} />
              </div>
            </div>
            <div className="space-y-1.5 text-[11.5px] text-zinc-800">
              {family.fatherName && (
                <div>
                  <span className="font-bold text-zinc-900">Father:</span> {family.fatherName}
                  {family.fatherOccupation && <span className="text-zinc-600">, {family.fatherOccupation}</span>}
                </div>
              )}
              {family.motherName && (
                <div>
                  <span className="font-bold text-zinc-900">Mother:</span> {family.motherName}
                  {family.motherOccupation && <span className="text-zinc-600">, {family.motherOccupation}</span>}
                </div>
              )}
              {(family.brothersCount || family.sistersCount) && (
                <div>
                  <span className="font-bold text-zinc-900">Siblings:</span>{' '}
                  {[
                    family.brothersCount ? `${family.brothersCount} Brother(s)` : null,
                    family.sistersCount ? `${family.sistersCount} Sister(s)` : null,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              )}
              {family.nativePlace && (
                <div>
                  <span className="font-bold text-zinc-900">Native Place:</span> {family.nativePlace}
                </div>
              )}
              {family.additionalMembers && family.additionalMembers.length > 0 && (
                <div className="pt-1.5 border-t border-zinc-200 text-[11px]">
                  {family.additionalMembers.map((member, i) => (
                    <div key={i} className="text-zinc-700">
                      <span className="font-semibold text-zinc-900">{member.relation}:</span> {member.name} ({member.occupation})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2 pt-2 border-t border-zinc-200">
            {contact.phone && (
              <div className="flex items-center gap-2.5 text-[11.5px] text-zinc-800">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-2xs shrink-0">
                  <Phone size={12} />
                </div>
                <span className="font-bold text-zinc-900">{contact.phone}</span>
              </div>
            )}
            {contact.address && (
              <div className="flex items-start gap-2.5 text-[11.5px] text-zinc-800">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-2xs shrink-0 mt-0.5">
                  <Home size={12} />
                </div>
                <span>{contact.address}, {contact.city}</span>
              </div>
            )}
            {experience[0]?.jobTitle && (
              <div className="flex items-center gap-2.5 text-[11.5px] text-zinc-800">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-2xs shrink-0">
                  <Briefcase size={12} />
                </div>
                <span>{experience[0].jobTitle} at {experience[0].company || 'Independent Practice'}</span>
              </div>
            )}
            {marriage.hobbies && (
              <div className="flex items-start gap-2.5 text-[11.5px] text-zinc-800">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-2xs shrink-0 mt-0.5">
                  <Sparkles size={12} />
                </div>
                <span>{marriage.hobbies}</span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* BOTTOM SECTION: 3 Photographs */}
      <div className="relative z-10 pt-2 border-t border-zinc-200">
        <div className="flex items-center gap-2 mb-2">
          <Camera size={13} className="text-zinc-500" />
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-500">
            PORTRAIT & LIFESTYLE GALLERY
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 h-40">
          {galleryPhotos.length > 0 ? (
            galleryPhotos.slice(0, 3).map((photoUrl, idx) => (
              <div
                key={idx}
                className="h-full rounded-xl overflow-hidden border border-zinc-300 shadow-xs bg-zinc-200 relative group"
              >
                <img
                  src={photoUrl}
                  alt={`Gallery photo ${idx + 1}`}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 h-28 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-xs">
              Multiple lifestyle photographs will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
''')

# 18. MonochromeModernBiodataTemplate.tsx
save('src/templates/biodata/MonochromeModernBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';
import {
  User,
  Users,
  GraduationCap,
  Briefcase,
  Heart,
  Phone,
  Mail,
  Home,
} from 'lucide-react';

export const MonochromeModernBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-sans';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  return (
    <div
      className={`document-page-sheet relative bg-white text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden ${fontClass} ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '0',
      }}
    >
      <div className="pt-6 pb-2 text-center relative z-20">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 font-sans">
          Marriage Bio-Data
        </h1>
      </div>

      <div className="relative w-full h-56 bg-white overflow-hidden">
        <svg
          viewBox="0 0 600 240"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          <path
            d="M0 0 L420 0 C380 70 340 180 160 210 C80 220 0 170 0 170 Z"
            fill="#111827"
          />
        </svg>

        <div className="absolute top-10 left-12 z-20 max-w-[280px]">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {personal.fullName || 'John Doe'}
          </h2>
          <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mt-1">
            {personal.gender || 'Groom'} • {personal.religion || 'Hindu'}
          </p>
        </div>

        <div className="absolute top-6 left-[340px] z-20 w-44 h-44">
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-zinc-200">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full border-4 border-white shadow-xl flex items-center justify-center text-zinc-400 bg-zinc-100">
              <User size={48} />
            </div>
          )}
        </div>
      </div>

      <div className="px-10 py-4 grid grid-cols-12 gap-8 flex-1 relative z-10">
        <div className="col-span-5 space-y-4">
          <section>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-200 text-zinc-900 font-bold text-[11px] uppercase tracking-wider mb-3">
              <User size={13} />
              <span>PERSONAL INFO</span>
            </div>
            <div className="space-y-1.5 text-[11.5px] pl-1">
              <div className="grid grid-cols-[90px_1fr]">
                <span className="font-bold text-zinc-700">Name</span>
                <span className="text-zinc-900">{personal.fullName || '-'}</span>
              </div>
              <div className="grid grid-cols-[90px_1fr]">
                <span className="font-bold text-zinc-700">Date of Birth</span>
                <span className="text-zinc-900">{personal.dateOfBirth || '-'}</span>
              </div>
              {personal.gender && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Gender</span>
                  <span className="text-zinc-900">{personal.gender}</span>
                </div>
              )}
              {personal.maritalStatus && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Marital Status</span>
                  <span className="text-zinc-900">{personal.maritalStatus}</span>
                </div>
              )}
              {personal.religion && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Religion</span>
                  <span className="text-zinc-900">{personal.religion}</span>
                </div>
              )}
              {personal.caste && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Caste</span>
                  <span className="text-zinc-900">{personal.caste}</span>
                </div>
              )}
              {personal.height && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Height</span>
                  <span className="text-zinc-900">{personal.height}</span>
                </div>
              )}
              {personal.complexion && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Complexion</span>
                  <span className="text-zinc-900">{personal.complexion}</span>
                </div>
              )}
              {personal.bloodGroup && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Blood Group</span>
                  <span className="text-zinc-900">{personal.bloodGroup}</span>
                </div>
              )}
              {personal.gotra && (
                <div className="grid grid-cols-[90px_1fr]">
                  <span className="font-bold text-zinc-700">Gotra</span>
                  <span className="text-zinc-900">{personal.gotra}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-7 space-y-4">
          <section>
            <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
              <Users size={14} className="text-zinc-900" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                FAMILY DETAILS
              </h3>
            </div>
            <div className="space-y-1 text-[11.5px] pl-1">
              {family.fatherName && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Father's Name</span>
                  <span className="font-medium text-zinc-900">{family.fatherName}</span>
                </div>
              )}
              {family.fatherOccupation && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Father's Job</span>
                  <span className="font-medium text-zinc-900">{family.fatherOccupation}</span>
                </div>
              )}
              {family.motherName && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Mother's Name</span>
                  <span className="font-medium text-zinc-900">{family.motherName}</span>
                </div>
              )}
              {family.motherOccupation && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Mother's Job</span>
                  <span className="font-medium text-zinc-900">{family.motherOccupation}</span>
                </div>
              )}
              {(family.brothersCount || family.sistersCount) && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Siblings</span>
                  <span className="font-medium text-zinc-900">
                    {[
                      family.brothersCount ? `${family.brothersCount} brothers` : null,
                      family.sistersCount ? `${family.sistersCount} sisters` : null,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
              <GraduationCap size={14} className="text-zinc-900" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                EDUCATION
              </h3>
            </div>
            <div className="space-y-1 text-[11.5px] pl-1">
              {education[0]?.degree && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Highest Degree</span>
                  <span className="font-medium text-zinc-900">{education[0].degree}</span>
                </div>
              )}
              {education[0]?.institute && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">College</span>
                  <span className="font-medium text-zinc-900">{education[0].institute}</span>
                </div>
              )}
              {education[0]?.endYear && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Graduation Year</span>
                  <span className="font-medium text-zinc-900">{education[0].endYear}</span>
                </div>
              )}
            </div>
          </section>

          {(marriage.hobbies || marriage.lifestyle) && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
                <Heart size={14} className="text-zinc-900" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  HOBBIES AND INTERESTS
                </h3>
              </div>
              <div className="space-y-1 text-[11.5px] pl-1">
                {marriage.hobbies && (
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold text-zinc-600">Hobbies</span>
                    <span className="font-medium text-zinc-900">{marriage.hobbies}</span>
                  </div>
                )}
                {marriage.interests && (
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold text-zinc-600">Interests</span>
                    <span className="font-medium text-zinc-900">{marriage.interests}</span>
                  </div>
                )}
                {marriage.lifestyle && (
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold text-zinc-600">Lifestyle</span>
                    <span className="font-medium text-zinc-900">{marriage.lifestyle}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 pb-1 border-b-2 border-zinc-900 mb-2">
              <Briefcase size={14} className="text-zinc-900" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                CAREER
              </h3>
            </div>
            <div className="space-y-1 text-[11.5px] pl-1">
              <div className="grid grid-cols-[110px_1fr]">
                <span className="font-semibold text-zinc-600">Job</span>
                <span className="font-medium text-zinc-900">
                  {experience[0]?.jobTitle || personal.professionalTitle || 'Software Engineer'}
                </span>
              </div>
              {experience[0]?.company && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Company</span>
                  <span className="font-medium text-zinc-900">{experience[0].company}</span>
                </div>
              )}
              {experience[0]?.location && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Work Location</span>
                  <span className="font-medium text-zinc-900">{experience[0].location}</span>
                </div>
              )}
              {experience[0]?.achievements && (
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold text-zinc-600">Yearly Income</span>
                  <span className="font-medium text-zinc-900">{experience[0].achievements}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="relative w-full h-44 overflow-hidden mt-auto">
        <svg
          viewBox="0 0 600 180"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          <path
            d="M260 180 C360 80 440 20 600 0 L600 180 Z"
            fill="#111827"
          />
        </svg>

        <div className="absolute bottom-5 right-10 z-20 text-white space-y-1.5 text-right text-[11.5px] max-w-xs">
          {contact.phone && (
            <div className="flex items-center justify-end gap-2">
              <span className="font-semibold">{contact.phone}</span>
              <Phone size={12} className="text-zinc-300" />
            </div>
          )}
          {contact.email && (
            <div className="flex items-center justify-end gap-2">
              <span className="font-medium">{contact.email}</span>
              <Mail size={12} className="text-zinc-300" />
            </div>
          )}
          {contact.address && (
            <div className="flex items-center justify-end gap-2">
              <span>{contact.address}, {contact.city}</span>
              <Home size={12} className="text-zinc-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
''')

# 19. RoyalMaroonBiodataTemplate.tsx
save('src/templates/biodata/RoyalMaroonBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';
import { ToranArchPattern } from './decorativeAssets';
import { User, Phone, MapPin, Sparkles } from 'lucide-react';

export const RoyalMaroonBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const bgMaroon = customization.primaryColor || '#450a0a'; // Rich Deep Royal Maroon
  const gold = customization.accentColor || '#fbbf24'; // Radiant Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11.5px]' : customization.fontSize === 'lg' ? 'text-[13.5px]' : 'text-[12.5px]';

  const personalItems: { label: string; value?: string }[] = [
    { label: 'Name', value: personal.fullName },
    { label: 'Date Of Birth', value: personal.dateOfBirth },
    { label: 'Time Of Birth', value: personal.timeOfBirth },
    { label: 'Place Of Birth', value: personal.placeOfBirth },
    { label: 'Complexion', value: personal.complexion },
    { label: 'Height', value: personal.height },
    {
      label: 'Gotra/Caste',
      value: [personal.gotra, personal.caste].filter(Boolean).join(' • '),
    },
    { label: 'Occupation', value: experience[0]?.jobTitle || personal.professionalTitle },
    { label: 'Income', value: experience[0]?.achievements },
    { label: 'Education', value: education[0]?.degree },
  ].filter((item) => item.value && item.value.trim() !== '');

  return (
    <div
      className={`document-page-sheet relative text-amber-50 shadow-sm flex flex-col justify-between overflow-hidden ${fontClass} ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        backgroundColor: bgMaroon,
        padding: '0',
      }}
    >
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

      <div className="relative z-10 w-full pt-4">
        <ToranArchPattern color={gold} />
      </div>

      <div className="relative z-10 text-center py-2">
        <p
          className="text-2xl md:text-3xl font-bold tracking-[0.16em] uppercase font-serif"
          style={{ color: '#fef08a' }}
        >
          ॥ श्री गणेशाय नमः ॥
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="w-16 h-px" style={{ backgroundColor: gold }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
          <span className="text-[11px] uppercase tracking-widest font-semibold text-amber-200">
            Shubh Matrimonial Profile
          </span>
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
          <div className="w-16 h-px" style={{ backgroundColor: gold }} />
        </div>
      </div>

      <div className="relative z-10 px-12 py-3 flex-1 flex flex-col justify-start space-y-4">
        <div className="flex gap-8 items-start">
          <div className="flex-1">
            <h2
              className="text-xl font-bold tracking-wide font-serif pb-1 mb-3 border-b"
              style={{ color: gold, borderColor: `${gold}55` }}
            >
              Personal Details
            </h2>
            <div className="space-y-1.5 text-[12.5px]">
              {personalItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[115px_1fr] items-baseline">
                  <span className="font-bold text-[#fde047]">{item.label}</span>
                  <span className="text-amber-100 font-medium break-words">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-44 pt-2">
            {customization.showPhoto !== false && personal.profilePhoto ? (
              <div
                className="w-44 h-56 rounded-lg p-1.5 border-2 shadow-xl bg-amber-950/40 relative overflow-hidden"
                style={{ borderColor: gold }}
              >
                <div className="w-full h-full rounded overflow-hidden">
                  <img
                    src={personal.profilePhoto}
                    alt={personal.fullName}
                    crossOrigin="anonymous" referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div
                className="w-44 h-56 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-amber-300 bg-amber-950/20"
                style={{ borderColor: gold }}
              >
                <User size={48} className="opacity-70 mb-2" />
                <span className="text-xs uppercase font-serif">Profile Portrait</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2
            className="text-xl font-bold tracking-wide font-serif pb-1 mb-3 border-b"
            style={{ color: gold, borderColor: `${gold}55` }}
          >
            Family Details
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[12.5px]">
            {family.fatherName && (
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Father's Name</span>
                <span className="text-amber-100 font-medium">{family.fatherName}</span>
              </div>
            )}
            {family.fatherOccupation && (
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Father's Occupation</span>
                <span className="text-amber-100 font-medium">{family.fatherOccupation}</span>
              </div>
            )}
            {family.motherName && (
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Mother's Name</span>
                <span className="text-amber-100 font-medium">{family.motherName}</span>
              </div>
            )}
            {family.motherOccupation && (
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Mother's Occupation</span>
                <span className="text-amber-100 font-medium">{family.motherOccupation}</span>
              </div>
            )}
            {(family.brothersCount || family.sistersCount) && (
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Siblings</span>
                <span className="text-amber-100 font-medium">
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
              <div className="grid grid-cols-[140px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Native Place</span>
                <span className="text-amber-100 font-medium">{family.nativePlace}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2
            className="text-xl font-bold tracking-wide font-serif pb-1 mb-3 border-b"
            style={{ color: gold, borderColor: `${gold}55` }}
          >
            Contact Details
          </h2>
          <div className="space-y-1.5 text-[12.5px]">
            <div className="grid grid-cols-[160px_1fr] items-baseline">
              <span className="font-bold text-[#fde047]">Contact Person</span>
              <span className="text-amber-100 font-medium">
                {family.fatherName || family.motherName || personal.fullName}
              </span>
            </div>
            {contact.phone && (
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Contact Number</span>
                <span className="text-amber-100 font-medium">{contact.phone}</span>
              </div>
            )}
            {(contact.address || family.familyAddress) && (
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold text-[#fde047]">Residential Address</span>
                <span className="text-amber-100 font-medium">
                  {contact.address || family.familyAddress}, {contact.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {marriage.partnerExpectations && (
          <div className="p-2.5 rounded border border-amber-500/30 bg-amber-950/30 mt-auto">
            <span className="font-bold text-[#fde047] block text-xs uppercase mb-0.5">
              Partner Expectation:
            </span>
            <p className="text-[11.5px] italic text-amber-200/90 leading-relaxed">
              "{marriage.partnerExpectations}"
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full pb-4">
        <ToranArchPattern color={gold} />
      </div>
    </div>
  );
};
''')

# 20. PremiumRoyalHeritageTemplate.tsx
save('src/templates/biodata/PremiumRoyalHeritageTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumRoyalHeritageTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#831843'; // Royal Burgundy / Crimson Wine
  const gold = customization.secondaryColor || '#d97706'; // Imperial Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

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
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs uppercase tracking-wider text-stone-600">
          {personal.religion && <span>{personal.religion}</span>}
          {personal.caste && <span>• {personal.caste}</span>}
          {personal.subCaste && <span>({personal.subCaste})</span>}
          {personal.gotra && <span>• Gotra: {personal.gotra}</span>}
        </div>
      </div>

      <div className="flex gap-6 mb-5 items-stretch bg-white/80 p-4 rounded-lg border shadow-sm relative z-10" style={{ borderColor: `${gold}55` }}>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-48 rounded-lg overflow-hidden border-2 p-1 bg-white shadow shrink-0 flex flex-col justify-center items-center" style={{ borderColor: gold }}>
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-1.5 mb-2.5" style={{ borderColor: `${gold}40` }}>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
                Personal Attributes & Horoscope
              </h2>
              {personal.age && (
                <span className="text-xs px-2 py-0.5 rounded font-semibold text-white" style={{ backgroundColor: primary }}>
                  Age {personal.age} Yrs
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {personal.dateOfBirth && (
                <div>
                  <span className="font-semibold text-stone-500">Date of Birth:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.dateOfBirth}</span>
                </div>
              )}
              {personal.timeOfBirth && (
                <div>
                  <span className="font-semibold text-stone-500">Time of Birth:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.timeOfBirth}</span>
                </div>
              )}
              {personal.placeOfBirth && (
                <div>
                  <span className="font-semibold text-stone-500">Place of Birth:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.placeOfBirth}</span>
                </div>
              )}
              {personal.height && (
                <div>
                  <span className="font-semibold text-stone-500">Height:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.height}</span>
                </div>
              )}
              {personal.complexion && (
                <div>
                  <span className="font-semibold text-stone-500">Complexion:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.complexion}</span>
                </div>
              )}
              {personal.bloodGroup && (
                <div>
                  <span className="font-semibold text-stone-500">Blood Group:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.bloodGroup}</span>
                </div>
              )}
              {personal.manglik && (
                <div>
                  <span className="font-semibold text-stone-500">Manglik Status:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.manglik}</span>
                </div>
              )}
              {personal.motherTongue && (
                <div>
                  <span className="font-semibold text-stone-500">Mother Tongue:</span>{' '}
                  <span className="font-medium text-stone-900">{personal.motherTongue}</span>
                </div>
              )}
            </div>
          </div>

          {(contact.phone || contact.email || contact.city) && (
            <div className="pt-2 mt-2 border-t flex flex-wrap items-center gap-3 text-[11px] text-stone-600" style={{ borderColor: `${gold}30` }}>
              {contact.phone && <span>✆ {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.city && <span>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 avoid-break relative z-10">
        <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
          <span className="text-base" style={{ color: primary }}>❖</span>
          <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
            Education & Professional Credentials
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded bg-white border border-stone-200/80 shadow-2xs">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
              {e.score && <div className="text-[11px] font-medium text-stone-500">Score: {e.score}</div>}
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded bg-white border border-stone-200/80 shadow-2xs">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
              {ex.achievements && (
                <div className="text-[11px] font-semibold mt-0.5" style={{ color: primary }}>
                  {ex.achievements}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break relative z-10">
        <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: gold }}>
          <span className="text-base" style={{ color: primary }}>❖</span>
          <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
            Family Background & Lineage
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white/90 p-3.5 rounded border border-stone-200/80">
          <div>
            <span className="font-semibold text-stone-500">Father's Name:</span>{' '}
            <span className="font-semibold text-stone-900">{family.fatherName || 'Not Specified'}</span>
            {family.fatherOccupation && <span className="text-stone-600 block text-[11.5px]">{family.fatherOccupation}</span>}
          </div>
          <div>
            <span className="font-semibold text-stone-500">Mother's Name:</span>{' '}
            <span className="font-semibold text-stone-900">{family.motherName || 'Not Specified'}</span>
            {family.motherOccupation && <span className="text-stone-600 block text-[11.5px]">{family.motherOccupation}</span>}
          </div>
          <div>
            <span className="font-semibold text-stone-500">Brothers:</span>{' '}
            <span className="text-stone-900">{family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers} Married)` : ''}</span>
          </div>
          <div>
            <span className="font-semibold text-stone-500">Sisters:</span>{' '}
            <span className="text-stone-900">{family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters} Married)` : ''}</span>
          </div>
          {family.nativePlace && (
            <div>
              <span className="font-semibold text-stone-500">Native Roots:</span>{' '}
              <span className="text-stone-900">{family.nativePlace}</span>
            </div>
          )}
          {family.familyStatus && (
            <div>
              <span className="font-semibold text-stone-500">Family Status:</span>{' '}
              <span className="text-stone-900">{family.familyStatus}</span>
            </div>
          )}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break relative z-10 bg-amber-50/50 p-3.5 rounded border border-amber-200/70">
          <div className="flex items-center gap-2 mb-1.5 pb-1 border-b" style={{ borderColor: `${gold}40` }}>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${fontClass}`} style={{ color: primary }}>
              Partner Expectations & Personal Values
            </h2>
          </div>
          {marriage.aboutMe && (
            <p className="text-xs text-stone-700 italic mb-1.5 leading-relaxed font-cormorant text-[14px]">
              "{marriage.aboutMe}"
            </p>
          )}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-800 leading-relaxed">
              <strong style={{ color: primary }}>Expectations:</strong> {marriage.partnerExpectations}
            </p>
          )}
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

      <div className="text-center pt-3 mt-4 border-t relative z-10" style={{ borderColor: `${gold}30` }}>
        <p className="text-[11px] uppercase tracking-widest text-stone-500 font-cinzel">
          With Best Compliments from Family & Well-Wishers
        </p>
      </div>
    </div>
  );
};
''')

# 21. PremiumElegantFloralTemplate.tsx
save('src/templates/biodata/PremiumElegantFloralTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumElegantFloralTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#9d174d'; // Romantic Deep Berry / Rose
  const accent = customization.secondaryColor || '#be185d'; // Soft Rose Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  return (
    <div
      className={`document-page-sheet p-10 relative bg-[#fffdfa] text-stone-800 shadow-sm ${baseFontSize}`}
      style={{
        border: `1.5px solid ${accent}40`,
      }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="h-px w-12 bg-rose-200" />
          <span className="text-xs uppercase tracking-widest font-medium text-stone-500">
            Matrimonial Biodata
          </span>
          <span className="h-px w-12 bg-rose-200" />
        </div>
        <h1 className={`text-4xl font-normal tracking-wide ${fontClass}`} style={{ color: primary }}>
          {personal.fullName || 'Pooja Patel'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs text-stone-500 font-light tracking-wide">
          {personal.religion && <span>{personal.religion}</span>}
          {personal.caste && <span>• {personal.caste}</span>}
          {personal.subCaste && <span>({personal.subCaste})</span>}
          {personal.gotra && <span>• Gotra: {personal.gotra}</span>}
        </div>
      </div>

      <div className="flex gap-6 mb-6 items-center p-4 rounded-2xl bg-white border border-rose-100 shadow-xs">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-32 h-40 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-sm shrink-0" style={{ borderColor: `${accent}60` }}>
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2.5 pb-1 border-b border-rose-100 ${fontClass}`} style={{ color: primary }}>
            Personal Profile & Horoscope
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-xs">
            {personal.dateOfBirth && (
              <div><span className="text-stone-400">Date of Birth:</span> <span className="font-medium text-stone-700">{personal.dateOfBirth} ({personal.age} yrs)</span></div>
            )}
            {personal.timeOfBirth && (
              <div><span className="text-stone-400">Time of Birth:</span> <span className="font-medium text-stone-700">{personal.timeOfBirth}</span></div>
            )}
            {personal.placeOfBirth && (
              <div><span className="text-stone-400">Birth Place:</span> <span className="font-medium text-stone-700">{personal.placeOfBirth}</span></div>
            )}
            {personal.height && (
              <div><span className="text-stone-400">Height:</span> <span className="font-medium text-stone-700">{personal.height}</span></div>
            )}
            {personal.complexion && (
              <div><span className="text-stone-400">Complexion:</span> <span className="font-medium text-stone-700">{personal.complexion}</span></div>
            )}
            {personal.bloodGroup && (
              <div><span className="text-stone-400">Blood Group:</span> <span className="font-medium text-stone-700">{personal.bloodGroup}</span></div>
            )}
            {personal.manglik && (
              <div><span className="text-stone-400">Manglik:</span> <span className="font-medium text-stone-700">{personal.manglik}</span></div>
            )}
            {personal.motherTongue && (
              <div><span className="text-stone-400">Mother Tongue:</span> <span className="font-medium text-stone-700">{personal.motherTongue}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b border-rose-100 ${fontClass}`} style={{ color: primary }}>
          Education & Professional Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-3 rounded-xl bg-white border border-rose-100 shadow-2xs">
              <div className="font-semibold text-stone-800">{e.degree}</div>
              <div className="text-stone-500 mt-0.5">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
              {e.score && <div className="text-[11px] text-stone-400 mt-0.5">Grade: {e.score}</div>}
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-3 rounded-xl bg-white border border-rose-100 shadow-2xs">
              <div className="font-semibold text-stone-800">{ex.jobTitle}</div>
              <div className="text-stone-500 mt-0.5">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
              {ex.achievements && (
                <div className="text-[11px] mt-1 text-rose-700 font-medium">{ex.achievements}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b border-rose-100 ${fontClass}`} style={{ color: primary }}>
          Family Tree & Ancestry
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3.5 rounded-xl border border-rose-100">
          <div>
            <span className="text-stone-400">Father:</span>{' '}
            <span className="font-semibold text-stone-800">{family.fatherName}</span>
            {family.fatherOccupation && <div className="text-[11.5px] text-stone-500">{family.fatherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-400">Mother:</span>{' '}
            <span className="font-semibold text-stone-800">{family.motherName}</span>
            {family.motherOccupation && <div className="text-[11.5px] text-stone-500">{family.motherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-400">Siblings:</span>{' '}
            <span className="text-stone-700">
              {family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)
            </span>
          </div>
          {family.nativePlace && (
            <div>
              <span className="text-stone-400">Native Town:</span>{' '}
              <span className="text-stone-700">{family.nativePlace}</span>
            </div>
          )}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break bg-rose-50/40 p-4 rounded-xl border border-rose-100/80">
          <h2 className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${fontClass}`} style={{ color: primary }}>
            About & Life Aspirations
          </h2>
          {marriage.aboutMe && (
            <p className="text-xs text-stone-600 leading-relaxed italic mb-1.5">
              "{marriage.aboutMe}"
            </p>
          )}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Partner Preference:</strong> {marriage.partnerExpectations}
            </p>
          )}
        </div>
      )}

      <div className="pt-4 mt-6 border-t border-rose-100 flex items-center justify-between text-xs text-stone-500">
        <div>
          {contact.address && <span>{contact.address}, </span>}
          {contact.city && <span>{contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
        </div>
        <div className="flex gap-4">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 22. PremiumModernLuxuryTemplate.tsx
save('src/templates/biodata/PremiumModernLuxuryTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumModernLuxuryTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#09090b'; // Deep Onyx Obsidian
  const accent = customization.secondaryColor || '#b45309'; // Warm Brass Amber
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-10 bg-white text-zinc-900 shadow-sm ${baseFontSize}`}
    >
      <div className="flex items-center justify-between border-b pb-4 mb-8" style={{ borderColor: '#e4e4e7' }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            CONFIDENTIAL MATRIMONIAL DOSSIER
          </span>
        </div>
        <span className="text-xs font-semibold text-zinc-500">
          Ref: {personal.dateOfBirth ? personal.dateOfBirth.slice(-4) : '2026'}
        </span>
      </div>

      <div className="flex gap-8 mb-8 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-40 h-48 rounded-lg overflow-hidden shrink-0 border border-zinc-200 shadow-sm relative group">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale-25 contrast-105"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ backgroundColor: `${accent}15`, color: accent }}>
            {personal.religion || 'Alliance Profile'} {personal.caste ? `• ${personal.caste}` : ''}
          </div>
          <h1 className={`text-4xl font-extrabold tracking-tight text-zinc-950 mb-2 ${fontClass}`}>
            {personal.fullName || 'Aarav Singhania'}
          </h1>
          <p className="text-sm font-medium text-zinc-600 mb-4">
            {experience[0]?.jobTitle || 'Executive Professional'}
            {experience[0]?.company ? ` at ${experience[0].company}` : ''}
            {contact.city ? ` • Based in ${contact.city}` : ''}
          </p>
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-100 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Age</div>
              <div className="font-semibold text-zinc-800">{personal.age || '-'} Yrs</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Height</div>
              <div className="font-semibold text-zinc-800">{personal.height || '-'}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Education</div>
              <div className="font-semibold text-zinc-800 truncate">{education[0]?.degree || '-'}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Horoscope</div>
              <div className="font-semibold text-zinc-800 truncate">{personal.manglik || 'Non-Manglik'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-6">
        <div className="col-span-5 space-y-6">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3 pb-1 border-b border-zinc-100">
              Personal Bio
            </h2>
            <div className="space-y-2 text-xs">
              {personal.dateOfBirth && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date of Birth</span>
                  <span className="font-medium text-zinc-900">{personal.dateOfBirth}</span>
                </div>
              )}
              {personal.timeOfBirth && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Time of Birth</span>
                  <span className="font-medium text-zinc-900">{personal.timeOfBirth}</span>
                </div>
              )}
              {personal.placeOfBirth && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Place of Birth</span>
                  <span className="font-medium text-zinc-900">{personal.placeOfBirth}</span>
                </div>
              )}
              {personal.complexion && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Complexion</span>
                  <span className="font-medium text-zinc-900">{personal.complexion}</span>
                </div>
              )}
              {personal.bloodGroup && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Blood Group</span>
                  <span className="font-medium text-zinc-900">{personal.bloodGroup}</span>
                </div>
              )}
              {personal.gotra && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gotra</span>
                  <span className="font-medium text-zinc-900">{personal.gotra}</span>
                </div>
              )}
              {personal.motherTongue && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mother Tongue</span>
                  <span className="font-medium text-zinc-900">{personal.motherTongue}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3 pb-1 border-b border-zinc-100">
              Family Lineage
            </h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-zinc-500 block text-[11px]">Father</span>
                <span className="font-semibold text-zinc-900">{family.fatherName || '-'}</span>
                {family.fatherOccupation && <span className="text-zinc-500 block text-[11px]">{family.fatherOccupation}</span>}
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Mother</span>
                <span className="font-semibold text-zinc-900">{family.motherName || '-'}</span>
                {family.motherOccupation && <span className="text-zinc-500 block text-[11px]">{family.motherOccupation}</span>}
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Siblings</span>
                <span className="font-medium text-zinc-900">
                  {family.brothersCount || 0} Brother(s) {family.marriedBrothers ? `(${family.marriedBrothers} m)` : ''}, {family.sistersCount || 0} Sister(s)
                </span>
              </div>
              {family.nativePlace && (
                <div>
                  <span className="text-zinc-500 block text-[11px]">Native City</span>
                  <span className="font-medium text-zinc-900">{family.nativePlace}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-7 space-y-6">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3 pb-1 border-b border-zinc-100">
              Career & Experience
            </h2>
            <div className="space-y-3">
              {experience.map((ex) => (
                <div key={ex.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900">{ex.jobTitle}</span>
                    <span className="text-[11px] text-zinc-400">{ex.location}</span>
                  </div>
                  <div className="text-zinc-600 font-medium">{ex.company}</div>
                  {ex.achievements && <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3 pb-1 border-b border-zinc-100">
              Academic Background
            </h2>
            <div className="space-y-2.5 text-xs">
              {education.map((e) => (
                <div key={e.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900">{e.degree}</span>
                    <span className="text-[11px] text-zinc-400">{e.endYear}</span>
                  </div>
                  <div className="text-zinc-600">{e.institute}</div>
                </div>
              ))}
            </div>
          </section>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <section className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Preferences & Values
              </h2>
              {marriage.aboutMe && (
                <p className="text-xs text-zinc-700 italic mb-2 leading-relaxed">
                  "{marriage.aboutMe}"
                </p>
              )}
              {marriage.partnerExpectations && (
                <p className="text-xs text-zinc-700 leading-relaxed">
                  <strong className="text-zinc-900">Partner Expectation:</strong> {marriage.partnerExpectations}
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
        <div>
          <span>{contact.city || 'Confidential'}</span>
          {contact.state && <span>, {contact.state}</span>}
        </div>
        <div className="flex gap-6 font-medium text-zinc-700">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 23. PremiumIndianClassicTemplate.tsx
save('src/templates/biodata/PremiumIndianClassicTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumIndianClassicTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#991b1b'; // Deep Saffron Maroon
  const gold = customization.secondaryColor || '#d97706'; // Vedic Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fffefb] text-stone-900 border-[6px] border-double shadow-sm relative ${baseFontSize}`}
      style={{
        borderColor: primary,
      }}
    >
      <div className="text-center pb-3 border-b-2 mb-5" style={{ borderColor: gold }}>
        <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel">॥ श्री गणेशाय नमः ॥</p>
        <p className="text-[11px] text-stone-500 italic font-cormorant">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>
        <div className="mt-3 flex items-center justify-center gap-6">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-28 h-36 rounded-md overflow-hidden border-2 p-0.5 bg-white shadow-sm shrink-0" style={{ borderColor: primary }}>
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xs"
              />
            </div>
          )}
          <div className="text-left">
            <h1 className={`text-3xl font-extrabold uppercase tracking-wide ${fontClass}`} style={{ color: primary }}>
              {personal.fullName || 'Rahul Sharma'}
            </h1>
            <p className="text-xs font-semibold text-stone-700 mt-1">
              {personal.religion || 'Hindu'} • {personal.caste || 'Brahmin'} {personal.subCaste ? `(${personal.subCaste})` : ''}
            </p>
            {personal.gotra && (
              <p className="text-xs text-stone-600">Gotra: <strong className="text-stone-900">{personal.gotra}</strong></p>
            )}
            <p className="text-xs text-stone-600 mt-0.5">
              Profession: <strong className="text-stone-900">{experience[0]?.jobTitle || 'Executive'}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 bg-amber-50/40 p-3 rounded border border-amber-200/80">
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
          Personal & Astrological Details (व्यक्तिगत विवरण)
        </h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="text-stone-500">Birth Date:</span> <strong className="text-stone-800">{personal.dateOfBirth}</strong></div>
          <div><span className="text-stone-500">Birth Time:</span> <strong className="text-stone-800">{personal.timeOfBirth || '-'}</strong></div>
          <div><span className="text-stone-500">Birth Place:</span> <strong className="text-stone-800">{personal.placeOfBirth || '-'}</strong></div>
          <div><span className="text-stone-500">Height:</span> <strong className="text-stone-800">{personal.height || '-'}</strong></div>
          <div><span className="text-stone-500">Complexion:</span> <strong className="text-stone-800">{personal.complexion || '-'}</strong></div>
          <div><span className="text-stone-500">Manglik:</span> <strong className="text-stone-800">{personal.manglik || 'Non-Manglik'}</strong></div>
          <div><span className="text-stone-500">Blood Group:</span> <strong className="text-stone-800">{personal.bloodGroup || '-'}</strong></div>
          <div><span className="text-stone-500">Mother Tongue:</span> <strong className="text-stone-800">{personal.motherTongue || '-'}</strong></div>
          <div><span className="text-stone-500">Age:</span> <strong className="text-stone-800">{personal.age ? `${personal.age} Years` : '-'}</strong></div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
          Education & Career Details (शिक्षा एवं व्यवसाय)
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded border border-stone-200">
            <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wide text-amber-900 mb-1">Academic Credentials</div>
            {education.map((e) => (
              <div key={e.id} className="mb-1.5 last:mb-0">
                <div className="font-semibold text-stone-800">{e.degree}</div>
                <div className="text-stone-500 text-[11.5px]">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-2.5 rounded border border-stone-200">
            <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wide text-amber-900 mb-1">Current Occupation</div>
            {experience.map((ex) => (
              <div key={ex.id} className="mb-1.5 last:mb-0">
                <div className="font-semibold text-stone-800">{ex.jobTitle}</div>
                <div className="text-stone-600 text-[11.5px]">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                {ex.achievements && <div className="text-amber-800 text-[11px] mt-0.5">{ex.achievements}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: primary, borderColor: gold }}>
          Family Details (पारिवारिक परिचय)
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3 rounded border border-stone-200">
          <div>
            <span className="text-stone-500">Father's Name:</span>{' '}
            <strong className="text-stone-900">{family.fatherName || '-'}</strong>
            {family.fatherOccupation && <div className="text-[11.5px] text-stone-600">{family.fatherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-500">Mother's Name:</span>{' '}
            <strong className="text-stone-900">{family.motherName || '-'}</strong>
            {family.motherOccupation && <div className="text-[11.5px] text-stone-600">{family.motherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-500">Brothers:</span>{' '}
            <strong className="text-stone-800">{family.brothersCount || 0}</strong> {family.marriedBrothers ? `(${family.marriedBrothers} Married)` : ''}
          </div>
          <div>
            <span className="text-stone-500">Sisters:</span>{' '}
            <strong className="text-stone-800">{family.sistersCount || 0}</strong> {family.marriedSisters ? `(${family.marriedSisters} Married)` : ''}
          </div>
          {family.nativePlace && (
            <div>
              <span className="text-stone-500">Native Place:</span> <strong className="text-stone-800">{family.nativePlace}</strong>
            </div>
          )}
          {family.familyStatus && (
            <div>
              <span className="text-stone-500">Family Values:</span> <strong className="text-stone-800">{family.familyStatus}</strong>
            </div>
          )}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break bg-stone-50 p-3 rounded border border-stone-200">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: primary }}>
            Expectations & Partner Preferences
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-700 italic mb-1">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-800">
              <strong>Preference:</strong> {marriage.partnerExpectations}
            </p>
          )}
        </div>
      )}

      <div className="pt-3 border-t-2 flex items-center justify-between text-xs" style={{ borderColor: gold }}>
        <div>
          <span className="font-semibold text-stone-700">Residential Address: </span>
          <span className="text-stone-600">{contact.city}{contact.state ? `, ${contact.state}` : ''}</span>
        </div>
        <div className="flex gap-4 font-semibold" style={{ color: primary }}>
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 24. PremiumRoyalPortraitTemplate.tsx
save('src/templates/biodata/PremiumRoyalPortraitTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumRoyalPortraitTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#064e3b'; // Royal Emerald Green
  const gold = customization.secondaryColor || '#b45309'; // Stately Bronze Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fafaf9] text-stone-900 border-t-8 shadow-sm relative ${baseFontSize}`}
      style={{
        borderTopColor: primary,
      }}
    >
      <div className="flex gap-7 mb-7 items-stretch bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
        <div className="w-44 h-56 rounded-lg overflow-hidden border-2 p-1.5 bg-stone-50 shadow-md shrink-0 flex flex-col justify-center items-center" style={{ borderColor: gold }}>
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <span className="text-3xl">👤</span>
              <span className="text-[11px] mt-1 uppercase font-semibold">Portrait</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: gold }}>
                ❖ Matrimonial Alliance ❖
              </span>
            </div>
            <h1 className={`text-3xl font-extrabold uppercase tracking-tight text-stone-900 ${fontClass}`}>
              {personal.fullName || 'Royal Portrait Candidate'}
            </h1>
            <p className="text-xs font-semibold text-stone-600 mt-1 uppercase tracking-wider">
              {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Kashyap'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-3 border-t border-stone-100">
            <div><span className="text-stone-500">Born:</span> <strong className="text-stone-800">{personal.dateOfBirth}</strong> ({personal.age} yrs)</div>
            <div><span className="text-stone-500">Height:</span> <strong className="text-stone-800">{personal.height || '-'}</strong></div>
            <div><span className="text-stone-500">Time:</span> <strong className="text-stone-800">{personal.timeOfBirth || '-'}</strong></div>
            <div><span className="text-stone-500">Complexion:</span> <strong className="text-stone-800">{personal.complexion || '-'}</strong></div>
            <div><span className="text-stone-500">Place:</span> <strong className="text-stone-800">{personal.placeOfBirth || '-'}</strong></div>
            <div><span className="text-stone-500">Manglik:</span> <strong className="text-stone-800">{personal.manglik || 'No'}</strong></div>
          </div>

          <div className="text-[11.5px] text-stone-600 pt-2 border-t border-stone-100 flex items-center justify-between">
            <span>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>
            <span className="font-semibold text-stone-900">{contact.phone}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-5">
          <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`} style={{ color: primary, borderColor: gold }}>
              <span>❖</span> Educational Qualifications
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id} className="pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="font-bold text-stone-900">{e.degree}</div>
                  <div className="text-stone-600">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`} style={{ color: primary, borderColor: gold }}>
              <span>❖</span> Professional Profile
            </h2>
            <div className="space-y-2 text-xs">
              {experience.map((ex) => (
                <div key={ex.id} className="pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="font-bold text-stone-900">{ex.jobTitle}</div>
                  <div className="text-stone-600">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                  {ex.achievements && <div className="text-[11px] font-medium text-emerald-800 mt-0.5">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5 ${fontClass}`} style={{ color: primary, borderColor: gold }}>
              <span>❖</span> Family Pedigree
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Father's Details:</span>
                <strong className="text-stone-900">{family.fatherName || '-'}</strong>
                {family.fatherOccupation && <span className="text-stone-600 block text-[11px]">{family.fatherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Mother's Details:</span>
                <strong className="text-stone-900">{family.motherName || '-'}</strong>
                {family.motherOccupation && <span className="text-stone-600 block text-[11px]">{family.motherOccupation}</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                <div>
                  <span className="text-stone-500 block text-[11px]">Brothers:</span>
                  <span className="text-stone-800 font-medium">{family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers} m)` : ''}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Sisters:</span>
                  <span className="text-stone-800 font-medium">{family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters} m)` : ''}</span>
                </div>
              </div>
              {family.nativePlace && (
                <div className="pt-1 border-t border-stone-100">
                  <span className="text-stone-500 text-[11px]">Native Roots: </span>
                  <strong className="text-stone-800">{family.nativePlace}</strong>
                </div>
              )}
            </div>
          </section>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <section className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: primary }}>
                Aspirations & Match Preference
              </h2>
              {marriage.aboutMe && <p className="text-xs text-stone-700 italic mb-2 leading-relaxed">"{marriage.aboutMe}"</p>}
              {marriage.partnerExpectations && (
                <p className="text-xs text-stone-800 leading-relaxed">
                  <strong className="text-stone-900">Ideal Partner:</strong> {marriage.partnerExpectations}
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
        <span className="font-cinzel uppercase text-[11px] tracking-wider" style={{ color: gold }}>
          Royal Portrait Dignity Edition
        </span>
        <div className="flex gap-4">
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>✆ {contact.phone}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 25. PremiumMinimalEditorialTemplate.tsx
save('src/templates/biodata/PremiumMinimalEditorialTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumMinimalEditorialTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#18181b'; // Editorial Charcoal
  const subtleAccent = customization.secondaryColor || '#71717a'; // Muted Slate
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  return (
    <div
      className={`document-page-sheet p-12 bg-[#faf9f6] text-stone-900 shadow-sm ${baseFontSize}`}
    >
      <div className="pb-6 mb-8 border-b border-stone-200">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-400">
            Matrimonial Profile • Issue {personal.dateOfBirth?.slice(-4) || '2026'}
          </span>
          <span className="text-xs text-stone-500 italic font-cormorant">
            {contact.city ? `Based in ${contact.city}` : 'Private & Confidential'}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className={`text-5xl font-light tracking-tight text-stone-900 leading-none ${fontClass}`}>
              {personal.fullName || 'Devina Kapoor'}
            </h1>
            <p className="text-sm text-stone-500 font-light mt-2 tracking-wide font-sans">
              {personal.religion || 'Alliance'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • {experience[0]?.jobTitle || 'Professional'}
            </p>
          </div>
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-28 h-36 overflow-hidden rounded-xs border border-stone-300 shrink-0">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>
          )}
        </div>
      </div>

      {marriage.aboutMe && (
        <div className="mb-8 pl-6 border-l-2 border-stone-400">
          <p className="text-lg italic text-stone-700 leading-relaxed font-cormorant font-normal">
            "{marriage.aboutMe}"
          </p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 mb-8">
        <div className="col-span-4 space-y-6">
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
              Vital Statistics
            </h2>
            <div className="space-y-2 text-xs font-sans">
              {personal.age && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Age</span>
                  <span className="font-medium text-stone-800">{personal.age} Years</span>
                </div>
              )}
              {personal.dateOfBirth && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Date of Birth</span>
                  <span className="font-medium text-stone-800">{personal.dateOfBirth}</span>
                </div>
              )}
              {personal.height && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Height</span>
                  <span className="font-medium text-stone-800">{personal.height}</span>
                </div>
              )}
              {personal.complexion && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Complexion</span>
                  <span className="font-medium text-stone-800">{personal.complexion}</span>
                </div>
              )}
              {personal.gotra && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Gotra</span>
                  <span className="font-medium text-stone-800">{personal.gotra}</span>
                </div>
              )}
              {personal.manglik && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Manglik</span>
                  <span className="font-medium text-stone-800">{personal.manglik}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
              Family Lineage
            </h2>
            <div className="space-y-2 text-xs font-sans">
              <div>
                <span className="text-stone-400 block text-[10.5px]">Father</span>
                <span className="font-medium text-stone-900">{family.fatherName}</span>
                {family.fatherOccupation && <span className="text-stone-500 block text-[11px]">{family.fatherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-400 block text-[10.5px]">Mother</span>
                <span className="font-medium text-stone-900">{family.motherName}</span>
                {family.motherOccupation && <span className="text-stone-500 block text-[11px]">{family.motherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-400 block text-[10.5px]">Siblings</span>
                <span className="font-medium text-stone-800">
                  {family.brothersCount || 0} Brother, {family.sistersCount || 0} Sister
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-5 space-y-6">
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
              Career Trajectory
            </h2>
            <div className="space-y-4">
              {experience.map((ex) => (
                <div key={ex.id} className="text-xs">
                  <div className="font-bold text-stone-900 text-[13px]">{ex.jobTitle}</div>
                  <div className="text-stone-500 font-sans">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                  {ex.achievements && <p className="text-stone-600 mt-1 leading-relaxed">{ex.achievements}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
              Academics
            </h2>
            <div className="space-y-3">
              {education.map((e) => (
                <div key={e.id} className="text-xs">
                  <div className="font-semibold text-stone-900">{e.degree}</div>
                  <div className="text-stone-500 font-sans">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-3 space-y-6">
          {marriage.partnerExpectations && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
                Partner Preferences
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                {marriage.partnerExpectations}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-3 pb-1 border-b border-stone-200">
              Communication
            </h2>
            <div className="space-y-2 text-xs font-sans text-stone-700">
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
            </div>
          </section>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-400 font-mono">
        <span>EDITORIAL ALLIANCE DOSSIER</span>
        <span>STRICTLY CONFIDENTIAL</span>
      </div>
    </div>
  );
};
''')

# 26. PremiumLuxuryGoldTemplate.tsx
save('src/templates/biodata/PremiumLuxuryGoldTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumLuxuryGoldTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const goldPrimary = customization.primaryColor || '#b45309'; // Warm Antique Gold
  const deepCharcoal = customization.secondaryColor || '#292524'; // Deep Stone
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-9 bg-[#fffefb] text-stone-900 border-2 shadow-sm relative ${baseFontSize}`}
      style={{
        borderColor: `${goldPrimary}60`,
      }}
    >
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: goldPrimary }} />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: goldPrimary }} />

      <div className="text-center pb-5 mb-6 border-b" style={{ borderColor: `${goldPrimary}40` }}>
        <div className="inline-flex items-center gap-3 mb-1">
          <span className="h-px w-10" style={{ backgroundColor: goldPrimary }} />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: goldPrimary }}>
            EXCLUSIVE MATRIMONIAL ALLIANCE
          </span>
          <span className="h-px w-10" style={{ backgroundColor: goldPrimary }} />
        </div>
        <h1 className={`text-3xl font-extrabold uppercase tracking-wide mt-1 ${fontClass}`} style={{ color: deepCharcoal }}>
          {personal.fullName || 'Varun Deshmukh'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Bharadwaj'}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-7 mb-6">
        <div className="col-span-5 space-y-5">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-full flex justify-center">
              <div
                className="w-40 h-48 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-md"
                style={{ borderColor: goldPrimary }}
              >
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          )}
          <div className="bg-amber-50/40 p-4 rounded-xl border" style={{ borderColor: `${goldPrimary}30` }}>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b ${fontClass}`} style={{ color: deepCharcoal, borderColor: `${goldPrimary}40` }}>
              Personal Bio & Astro
            </h2>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-stone-500">Date of Birth:</span> <strong className="text-stone-800">{personal.dateOfBirth}</strong></div>
              <div><span className="text-stone-500">Age:</span> <strong className="text-stone-800">{personal.age} Years</strong></div>
              <div><span className="text-stone-500">Height:</span> <strong className="text-stone-800">{personal.height}</strong></div>
              <div><span className="text-stone-500">Time of Birth:</span> <strong className="text-stone-800">{personal.timeOfBirth || '-'}</strong></div>
              <div><span className="text-stone-500">Place of Birth:</span> <strong className="text-stone-800">{personal.placeOfBirth || '-'}</strong></div>
              <div><span className="text-stone-500">Complexion:</span> <strong className="text-stone-800">{personal.complexion || '-'}</strong></div>
              <div><span className="text-stone-500">Manglik:</span> <strong className="text-stone-800">{personal.manglik || 'Non-Manglik'}</strong></div>
              <div><span className="text-stone-500">Mother Tongue:</span> <strong className="text-stone-800">{personal.motherTongue}</strong></div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 text-stone-700 ${fontClass}`}>
              Communication
            </h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
            </div>
          </div>
        </div>

        <div className="col-span-7 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${goldPrimary}40` }}>
              <span className="text-sm" style={{ color: goldPrimary }}>❖</span>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${fontClass}`} style={{ color: deepCharcoal }}>
                Education & Career
              </h2>
            </div>
            <div className="space-y-2.5">
              {education.map((e) => (
                <div key={e.id} className="text-xs bg-white p-2.5 rounded border border-stone-200/80">
                  <div className="font-bold text-stone-900">{e.degree}</div>
                  <div className="text-stone-600">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
                </div>
              ))}
              {experience.map((ex) => (
                <div key={ex.id} className="text-xs bg-white p-2.5 rounded border border-stone-200/80">
                  <div className="font-bold text-stone-900">{ex.jobTitle}</div>
                  <div className="text-stone-600">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                  {ex.achievements && <div className="text-[11px] font-semibold text-amber-800 mt-0.5">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${goldPrimary}40` }}>
              <span className="text-sm" style={{ color: goldPrimary }}>❖</span>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${fontClass}`} style={{ color: deepCharcoal }}>
                Family Background
              </h2>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200/80 space-y-2 text-xs">
              <div>
                <span className="text-stone-500">Father:</span>{' '}
                <strong className="text-stone-900">{family.fatherName || '-'}</strong>
                {family.fatherOccupation && <span className="text-stone-600 text-[11px] block">{family.fatherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-500">Mother:</span>{' '}
                <strong className="text-stone-900">{family.motherName || '-'}</strong>
                {family.motherOccupation && <span className="text-stone-600 text-[11px] block">{family.motherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-500">Siblings:</span>{' '}
                <span className="text-stone-800">
                  {family.brothersCount || 0} Brother(s) {family.marriedBrothers ? `(${family.marriedBrothers} Married)` : ''}, {family.sistersCount || 0} Sister(s)
                </span>
              </div>
              {family.nativePlace && (
                <div>
                  <span className="text-stone-500">Native Town:</span>{' '}
                  <span className="text-stone-800 font-medium">{family.nativePlace}</span>
                </div>
              )}
            </div>
          </section>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <section className="bg-amber-50/30 p-3.5 rounded border border-amber-200/60">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: deepCharcoal }}>
                Expectations & Preferences
              </h2>
              {marriage.aboutMe && <p className="text-xs text-stone-700 italic mb-1.5 leading-relaxed">"{marriage.aboutMe}"</p>}
              {marriage.partnerExpectations && (
                <p className="text-xs text-stone-800">
                  <strong style={{ color: goldPrimary }}>Preference:</strong> {marriage.partnerExpectations}
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="pt-3 border-t text-center text-[11px] uppercase tracking-widest text-stone-400 font-cinzel" style={{ borderColor: `${goldPrimary}30` }}>
        Gold Prestige Dignity Portfolio
      </div>
    </div>
  );
};
''')

# 27. PremiumContemporaryProfileTemplate.tsx
save('src/templates/biodata/PremiumContemporaryProfileTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumContemporaryProfileTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#0284c7'; // Modern Cerulean / Sky
  const darkNavy = customization.secondaryColor || '#0f172a'; // Deep Slate Navy
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-9 bg-slate-50 text-slate-900 shadow-sm ${baseFontSize}`}
    >
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-6">
        <div className="flex gap-6 items-center">
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-32 h-36 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-sm shrink-0">
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                {personal.religion || 'Matrimonial Profile'}
              </span>
              {personal.caste && (
                <span className="text-xs text-slate-500 font-medium">
                  {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''}
                </span>
              )}
            </div>
            <h1 className={`text-3xl font-extrabold text-slate-900 tracking-tight ${fontClass}`}>
              {personal.fullName || 'Ananya Iyer'}
            </h1>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              {experience[0]?.jobTitle || 'Senior Professional'} {experience[0]?.company ? `• ${experience[0].company}` : ''}
            </p>
            {marriage.aboutMe ? (
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                "{marriage.aboutMe}"
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                A warm, ambitious, and family-oriented individual looking for an equal partner to share life's adventures.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>✦</span> Vitals & Horoscope
            </h2>
            <div className="space-y-2 text-xs">
              <div><span className="text-slate-400">Age:</span> <strong className="text-slate-800">{personal.age ? `${personal.age} Years` : '-'}</strong></div>
              <div><span className="text-slate-400">Date of Birth:</span> <strong className="text-slate-800">{personal.dateOfBirth}</strong></div>
              <div><span className="text-slate-400">Height:</span> <strong className="text-slate-800">{personal.height}</strong></div>
              <div><span className="text-slate-400">Place of Birth:</span> <strong className="text-slate-800">{personal.placeOfBirth || '-'}</strong></div>
              <div><span className="text-slate-400">Mother Tongue:</span> <strong className="text-slate-800">{personal.motherTongue}</strong></div>
              <div><span className="text-slate-400">Gotra:</span> <strong className="text-slate-800">{personal.gotra || '-'}</strong></div>
              <div><span className="text-slate-400">Manglik:</span> <strong className="text-slate-800">{personal.manglik || 'No'}</strong></div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Contact Channels
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>✦</span> Professional & Academic Background
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2 border-r border-slate-100 pr-3">
                <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">Academics</div>
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-semibold text-slate-900">{e.degree}</div>
                    <div className="text-slate-500 text-[11.5px]">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pl-1">
                <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">Work History</div>
                {experience.map((ex) => (
                  <div key={ex.id}>
                    <div className="font-semibold text-slate-900">{ex.jobTitle}</div>
                    <div className="text-slate-500 text-[11.5px]">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>✦</span> Family Background
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <span className="text-slate-400">Father:</span>{' '}
                <strong className="text-slate-900">{family.fatherName || '-'}</strong>
                {family.fatherOccupation && <div className="text-[11px] text-slate-500">{family.fatherOccupation}</div>}
              </div>
              <div>
                <span className="text-slate-400">Mother:</span>{' '}
                <strong className="text-slate-900">{family.motherName || '-'}</strong>
                {family.motherOccupation && <div className="text-[11px] text-slate-500">{family.motherOccupation}</div>}
              </div>
              <div>
                <span className="text-slate-400">Siblings:</span>{' '}
                <span className="text-slate-700 font-medium">
                  {family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)
                </span>
              </div>
              {family.nativePlace && (
                <div>
                  <span className="text-slate-400">Native Roots:</span>{' '}
                  <span className="text-slate-700 font-medium">{family.nativePlace}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {marriage.partnerExpectations && (
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
          <span className="text-xl">💍</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-0.5">
              Partner Preferences & Compatibility
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {marriage.partnerExpectations}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# 28. PremiumElegantTwoToneTemplate.tsx
save('src/templates/biodata/PremiumElegantTwoToneTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumElegantTwoToneTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const sapphireNavy = customization.primaryColor || '#0f172a'; // Deep Midnight Sapphire
  const champagneGold = customization.secondaryColor || '#d97706'; // Warm Champagne Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet flex flex-row bg-[#fafaf9] text-stone-900 shadow-sm overflow-hidden ${baseFontSize}`}
    >
      <div
        className="w-[38%] p-7 text-white flex flex-col justify-between"
        style={{ backgroundColor: sapphireNavy }}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {customization.showPhoto !== false && personal.profilePhoto ? (
              <div
                className="w-36 h-44 rounded-xl overflow-hidden border-2 p-1 shadow-lg mb-3"
                style={{ borderColor: champagneGold }}
              >
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-full border-2 flex items-center justify-center mb-3 bg-white/10"
                style={{ borderColor: champagneGold }}
              >
                <span className="text-3xl">👤</span>
              </div>
            )}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: champagneGold }}>
                Matrimonial Profile
              </span>
              <div className="text-xs text-stone-300 mt-0.5">
                {personal.religion || 'Alliance'} {personal.caste ? `• ${personal.caste}` : ''}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-white/15">
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel" style={{ color: champagneGold }}>
              Astro & Vitals
            </h3>
            <div className="space-y-1.5 text-xs text-stone-200">
              {personal.age && <div className="flex justify-between"><span>Age:</span> <strong className="text-white">{personal.age} Years</strong></div>}
              {personal.dateOfBirth && <div className="flex justify-between"><span>DOB:</span> <strong className="text-white">{personal.dateOfBirth}</strong></div>}
              {personal.timeOfBirth && <div className="flex justify-between"><span>Time:</span> <strong className="text-white">{personal.timeOfBirth}</strong></div>}
              {personal.placeOfBirth && <div className="flex justify-between"><span>Birthplace:</span> <strong className="text-white">{personal.placeOfBirth}</strong></div>}
              {personal.height && <div className="flex justify-between"><span>Height:</span> <strong className="text-white">{personal.height}</strong></div>}
              {personal.complexion && <div className="flex justify-between"><span>Complexion:</span> <strong className="text-white">{personal.complexion}</strong></div>}
              {personal.bloodGroup && <div className="flex justify-between"><span>Blood Group:</span> <strong className="text-white">{personal.bloodGroup}</strong></div>}
              {personal.gotra && <div className="flex justify-between"><span>Gotra:</span> <strong className="text-white">{personal.gotra}</strong></div>}
              {personal.manglik && <div className="flex justify-between"><span>Manglik:</span> <strong className="text-white">{personal.manglik}</strong></div>}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/15 text-xs text-stone-300">
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel" style={{ color: champagneGold }}>
              Reach Out
            </h3>
            {contact.phone && <div>✆ {contact.phone}</div>}
            {contact.email && <div className="truncate">✉ {contact.email}</div>}
            {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
          </div>
        </div>
        <div className="pt-4 border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-stone-400 font-cinzel">
          Private & Confidential
        </div>
      </div>

      <div className="w-[62%] p-8 bg-[#fffdf9] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h1 className={`text-3xl font-extrabold uppercase tracking-wide text-stone-900 ${fontClass}`}>
              {personal.fullName || 'Rohan Sengupta'}
            </h1>
            <p className="text-sm font-semibold text-amber-800 mt-1">
              {experience[0]?.jobTitle || 'Business Executive'}
              {experience[0]?.company ? ` at ${experience[0].company}` : ''}
            </p>
          </div>

          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`} style={{ color: sapphireNavy }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
              Education & Qualifications
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id} className="p-2.5 rounded bg-white border border-stone-200 shadow-2xs">
                  <div className="font-bold text-stone-900">{e.degree}</div>
                  <div className="text-stone-500">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`} style={{ color: sapphireNavy }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
              Professional Career
            </h2>
            <div className="space-y-2 text-xs">
              {experience.map((ex) => (
                <div key={ex.id} className="p-2.5 rounded bg-white border border-stone-200 shadow-2xs">
                  <div className="font-bold text-stone-900">{ex.jobTitle}</div>
                  <div className="text-stone-600">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                  {ex.achievements && <div className="text-[11px] text-amber-800 mt-0.5">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fontClass}`} style={{ color: sapphireNavy }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: champagneGold }} />
              Family Pedigree & Lineage
            </h2>
            <div className="bg-white p-3 rounded border border-stone-200 space-y-1.5 text-xs">
              <div>
                <span className="text-stone-500">Father:</span>{' '}
                <strong className="text-stone-900">{family.fatherName || '-'}</strong>
                {family.fatherOccupation && <span className="text-stone-500 text-[11px] block">{family.fatherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-500">Mother:</span>{' '}
                <strong className="text-stone-900">{family.motherName || '-'}</strong>
                {family.motherOccupation && <span className="text-stone-500 text-[11px] block">{family.motherOccupation}</span>}
              </div>
              <div>
                <span className="text-stone-500">Siblings:</span>{' '}
                <span className="text-stone-800 font-medium">
                  {family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)
                </span>
              </div>
              {family.nativePlace && (
                <div>
                  <span className="text-stone-500">Native Town:</span>{' '}
                  <span className="text-stone-800 font-medium">{family.nativePlace}</span>
                </div>
              )}
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div className="bg-amber-50/50 p-3.5 rounded border border-amber-200/80">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${fontClass}`} style={{ color: sapphireNavy }}>
                Values & Expectations
              </h2>
              {marriage.aboutMe && <p className="text-xs text-stone-700 italic mb-1.5">"{marriage.aboutMe}"</p>}
              {marriage.partnerExpectations && (
                <p className="text-xs text-stone-800">
                  <strong className="text-stone-900">Partner Preference:</strong> {marriage.partnerExpectations}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-stone-200 text-right text-[11px] text-stone-400 font-cinzel">
          Two-Tone Architectural Prestige
        </div>
      </div>
    </div>
  );
};
''')

# 29. PremiumRegalVelvetTemplate.tsx
save('src/templates/biodata/PremiumRegalVelvetTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumRegalVelvetTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const regalEmerald = customization.primaryColor || '#064e3b'; // Deep Imperial Emerald Velvet
  const royalGold = customization.secondaryColor || '#ca8a04'; // Polished Palace Gold
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cinzel';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  return (
    <div
      className={`document-page-sheet p-8 bg-[#fdfcf9] text-stone-900 border-[12px] border-double shadow-md relative ${baseFontSize}`}
      style={{
        borderColor: regalEmerald,
      }}
    >
      <div
        className="absolute inset-1.5 border pointer-events-none"
        style={{ borderColor: royalGold, opacity: 0.85 }}
      />

      <div className="text-center pb-4 mb-5 border-b" style={{ borderColor: `${royalGold}60` }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm" style={{ color: royalGold }}>❖</span>
          <span className="text-xs uppercase font-bold tracking-[0.25em]" style={{ color: royalGold }}>
            REGAL MATRIMONIAL ALLIANCE
          </span>
          <span className="text-sm" style={{ color: royalGold }}>❖</span>
        </div>
        <h1 className={`text-4xl font-extrabold uppercase tracking-wider mt-1 ${fontClass}`} style={{ color: regalEmerald }}>
          {personal.fullName || 'Vikramaditya Rathore'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs uppercase tracking-widest text-stone-600">
          <span>{personal.religion || 'Hindu'}</span>
          {personal.caste && <span>• {personal.caste}</span>}
          {personal.subCaste && <span>({personal.subCaste})</span>}
          {personal.gotra && <span>• Gotra: {personal.gotra}</span>}
        </div>
      </div>

      <div className="flex gap-6 mb-5 items-center bg-white p-4 rounded-xl border" style={{ borderColor: `${royalGold}40` }}>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div
            className="w-36 h-44 rounded-lg overflow-hidden border-2 p-1 bg-white shadow-md shrink-0"
            style={{ borderColor: royalGold }}
          >
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${fontClass}`} style={{ color: regalEmerald, borderColor: `${royalGold}40` }}>
            Auspicious Horoscope & Birth Vitals
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-500">Date of Birth:</span> <span className="font-semibold text-stone-900">{personal.dateOfBirth} ({personal.age} Yrs)</span></div>
            <div><span className="font-semibold text-stone-500">Height:</span> <span className="font-semibold text-stone-900">{personal.height}</span></div>
            <div><span className="font-semibold text-stone-500">Time of Birth:</span> <span className="font-semibold text-stone-900">{personal.timeOfBirth || '-'}</span></div>
            <div><span className="font-semibold text-stone-500">Place of Birth:</span> <span className="font-semibold text-stone-900">{personal.placeOfBirth || '-'}</span></div>
            <div><span className="font-semibold text-stone-500">Complexion:</span> <span className="font-semibold text-stone-900">{personal.complexion || '-'}</span></div>
            <div><span className="font-semibold text-stone-500">Manglik Status:</span> <span className="font-semibold text-stone-900">{personal.manglik || 'Non-Manglik'}</span></div>
            <div><span className="font-semibold text-stone-500">Mother Tongue:</span> <span className="font-semibold text-stone-900">{personal.motherTongue}</span></div>
            <div><span className="font-semibold text-stone-500">Blood Group:</span> <span className="font-semibold text-stone-900">{personal.bloodGroup || '-'}</span></div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`} style={{ color: regalEmerald, borderColor: royalGold }}>
          <span>❖</span> Educational Accreditations & Career History
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded bg-white border border-stone-200 shadow-2xs">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} {e.endYear ? `(${e.endYear})` : ''}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded bg-white border border-stone-200 shadow-2xs">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
              {ex.achievements && <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5 ${fontClass}`} style={{ color: regalEmerald, borderColor: royalGold }}>
          <span>❖</span> Distinguished Family Lineage
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3 rounded-lg border border-stone-200">
          <div>
            <span className="text-stone-500">Father:</span>{' '}
            <strong className="text-stone-900">{family.fatherName || '-'}</strong>
            {family.fatherOccupation && <div className="text-[11px] text-stone-600">{family.fatherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-500">Mother:</span>{' '}
            <strong className="text-stone-900">{family.motherName || '-'}</strong>
            {family.motherOccupation && <div className="text-[11px] text-stone-600">{family.motherOccupation}</div>}
          </div>
          <div>
            <span className="text-stone-500">Brothers:</span>{' '}
            <strong className="text-stone-800">{family.brothersCount || 0}</strong> {family.marriedBrothers ? `(${family.marriedBrothers} Married)` : ''}
          </div>
          <div>
            <span className="text-stone-500">Sisters:</span>{' '}
            <strong className="text-stone-800">{family.sistersCount || 0}</strong> {family.marriedSisters ? `(${family.marriedSisters} Married)` : ''}
          </div>
          {family.nativePlace && (
            <div>
              <span className="text-stone-500">Ancestral Roots:</span> <strong className="text-stone-800">{family.nativePlace}</strong>
            </div>
          )}
          {family.familyStatus && (
            <div>
              <span className="text-stone-500">Social Standing:</span> <strong className="text-stone-800">{family.familyStatus}</strong>
            </div>
          )}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break bg-emerald-50/40 p-3.5 rounded border border-emerald-200/70">
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`} style={{ color: regalEmerald }}>
            Values & Partner Preferences
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-700 italic mb-1">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-800">
              <strong style={{ color: regalEmerald }}>Expectation:</strong> {marriage.partnerExpectations}
            </p>
          )}
        </div>
      )}

      <div className="pt-3 border-t flex items-center justify-between text-xs text-stone-600" style={{ borderColor: `${royalGold}40` }}>
        <div>
          <span>Residence: {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>
        </div>
        <div className="flex gap-4 font-semibold" style={{ color: regalEmerald }}>
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
        </div>
      </div>
    </div>
  );
};
''')

print('Wrote biodata part 2!')
