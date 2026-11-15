const fs = require('fs');
const path = require('path');

function save(file, code) {
  const p = path.resolve(file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code.trim() + '\n', 'utf8');
}

save('src/templates/biodata/ElegantBlueWeddingTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';
import {
  GaneshaVector,
  WeddingRingsVector,
  CornerFiligreeVector,
  RoyalCoupleVector,
} from './decorativeAssets';
import {
  User,
  Heart,
  Briefcase,
  Users,
  Phone,
  Sparkles,
} from 'lucide-react';

export const ElegantBlueWeddingTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const royalNavy = customization.primaryColor || '#0c4a6e';
  const gold = customization.accentColor || '#b45309';
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  return (
    <div
      className={\`document-page-sheet relative bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#e6f4f8] text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden \${fontClass} \${baseFontSize}\`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '12mm 12mm 10mm 12mm',
      }}
    >
      <div className="absolute inset-3 border-2 pointer-events-none" style={{ borderColor: \`\${gold}99\` }} />
      <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: \`\${gold}55\` }} />
      <CornerFiligreeVector position="top-left" size={60} color={gold} className="absolute top-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="top-right" size={60} color={gold} className="absolute top-3 right-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-left" size={60} color={gold} className="absolute bottom-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-right" size={60} color={gold} className="absolute bottom-3 right-3 pointer-events-none" />

      <div className="relative z-10 text-center mb-2">
        <div className="flex justify-center mb-0.5">
          <div className="p-1 rounded-full bg-white/60 border border-amber-300/80 shadow-xs">
            <GaneshaVector size={42} color={gold} variant="gold" />
          </div>
        </div>
        <p className="text-[12px] font-bold tracking-[0.25em] uppercase font-serif" style={{ color: gold }}>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] uppercase font-serif" style={{ color: royalNavy }}>
          MARRIAGE BIODATA
        </h1>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <div className="w-12 h-px bg-amber-400/80" />
          <span className="text-[11px] font-semibold tracking-widest uppercase italic text-amber-800">
            Shubh Vivah • Sacred Matrimonial Union
          </span>
          <div className="w-12 h-px bg-amber-400/80" />
        </div>
      </div>

      <div className="relative z-10 bg-white/85 backdrop-blur-xs rounded-xl p-3.5 border border-sky-200/80 shadow-xs flex items-center gap-5 mb-2.5">
        {customization.showPhoto !== false && personal.profilePhoto ? (
          <div className="relative shrink-0 w-28 h-28">
            <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: gold }} />
            <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-white shadow-sm">
              <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center text-sky-800 bg-sky-50 shrink-0" style={{ borderColor: gold }}>
            <User size={32} />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold font-serif tracking-wide" style={{ color: royalNavy }}>
            {personal.fullName || 'Bride / Groom Name'}
          </h2>
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
            {experience[0]?.jobTitle || personal.professionalTitle || 'Software Professional'}
            {education[0]?.degree ? \` • \${education[0].degree}\` : ''}
          </p>
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-sky-100 text-[11px]">
            <div><span className="text-zinc-500 block text-[10px] uppercase font-bold">DOB</span><span className="font-semibold text-zinc-900">{personal.dateOfBirth || '-'}</span></div>
            <div><span className="text-zinc-500 block text-[10px] uppercase font-bold">Height</span><span className="font-semibold text-zinc-900">{personal.height || '-'}</span></div>
            <div><span className="text-zinc-500 block text-[10px] uppercase font-bold">Religion</span><span className="font-semibold text-zinc-900">{personal.religion || 'Hindu'}</span></div>
            <div><span className="text-zinc-500 block text-[10px] uppercase font-bold">Caste</span><span className="font-semibold text-zinc-900">{personal.caste || '-'}</span></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 flex-1 mb-2">
        <div className="space-y-2.5 flex flex-col justify-start">
          <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-sky-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
              <Sparkles size={13} style={{ color: gold }} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>Personal Information</h3>
            </div>
            <div className="space-y-1 text-[11.5px]">
              {personal.placeOfBirth && <div className="flex justify-between"><span className="text-zinc-600">Birth Place:</span><span className="font-semibold text-zinc-900">{personal.placeOfBirth}</span></div>}
              {personal.timeOfBirth && <div className="flex justify-between"><span className="text-zinc-600">Birth Time:</span><span className="font-semibold text-zinc-900">{personal.timeOfBirth}</span></div>}
              {personal.gotra && <div className="flex justify-between"><span className="text-zinc-600">Gotra:</span><span className="font-semibold text-zinc-900">{personal.gotra}</span></div>}
              {personal.rashi && <div className="flex justify-between"><span className="text-zinc-600">Rashi / Nakshatra:</span><span className="font-semibold text-zinc-900">{personal.rashi} {personal.nakshatra ? \`(\${personal.nakshatra})\` : ''}</span></div>}
              {personal.manglik && <div className="flex justify-between"><span className="text-zinc-600">Manglik Status:</span><span className="font-semibold text-zinc-900">{personal.manglik}</span></div>}
              {personal.complexion && <div className="flex justify-between"><span className="text-zinc-600">Complexion:</span><span className="font-semibold text-zinc-900">{personal.complexion}</span></div>}
              {personal.bloodGroup && <div className="flex justify-between"><span className="text-zinc-600">Blood Group:</span><span className="font-semibold text-zinc-900">{personal.bloodGroup}</span></div>}
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-sky-200/80 shadow-xs space-y-1.5 flex-1">
            <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
              <Users size={13} style={{ color: gold }} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>Family Background</h3>
            </div>
            <div className="space-y-1 text-[11.5px]">
              {family.fatherName && <div><span className="text-zinc-500">Father: </span><span className="font-semibold text-zinc-900">{family.fatherName}</span>{family.fatherOccupation && <span className="text-zinc-600"> ({family.fatherOccupation})</span>}</div>}
              {family.motherName && <div><span className="text-zinc-500">Mother: </span><span className="font-semibold text-zinc-900">{family.motherName}</span>{family.motherOccupation && <span className="text-zinc-600"> ({family.motherOccupation})</span>}</div>}
              {family.brothersCount && <div><span className="text-zinc-500">Brothers: </span><span className="font-semibold text-zinc-900">{family.brothersCount}</span></div>}
              {family.sistersCount && <div><span className="text-zinc-500">Sisters: </span><span className="font-semibold text-zinc-900">{family.sistersCount}</span></div>}
              {family.nativePlace && <div><span className="text-zinc-500">Native: </span><span className="font-semibold text-zinc-900">{family.nativePlace}</span></div>}
            </div>
          </div>
        </div>

        <div className="space-y-2.5 flex flex-col justify-start">
          <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-sky-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
              <Briefcase size={13} style={{ color: gold }} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>Education & Career</h3>
            </div>
            <div className="space-y-1 text-[11.5px]">
              {education[0]?.degree && <div><span className="font-bold text-zinc-900">{education[0].degree}</span>{education[0].institute && <div className="text-zinc-600 text-[10.5px]">{education[0].institute}</div>}</div>}
              {experience[0]?.jobTitle && <div className="pt-1"><span className="font-bold text-zinc-900">{experience[0].jobTitle}</span>{experience[0].company && <div className="text-zinc-600 text-[10.5px]">{experience[0].company} • {experience[0].location}</div>}</div>}
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-sky-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
              <Heart size={13} style={{ color: gold }} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>Partner Preference</h3>
            </div>
            <p className="text-[11px] text-zinc-700 leading-relaxed italic">
              "{marriage.partnerExpectations || 'Seeking an understanding and supportive partner from a respectable family.'}"
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-sky-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-sky-100">
              <Phone size={13} style={{ color: gold }} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: royalNavy }}>Contact Information</h3>
            </div>
            <div className="space-y-1 text-[11.5px]">
              {contact.phone && <div className="flex items-center gap-2"><span className="text-zinc-500">Phone:</span><span className="font-semibold text-zinc-900">{contact.phone}</span></div>}
              {contact.email && <div className="flex items-center gap-2"><span className="text-zinc-500">Email:</span><span className="font-semibold text-zinc-900">{contact.email}</span></div>}
              {contact.address && <div className="flex items-start gap-2"><span className="text-zinc-500">Address:</span><span className="font-medium text-zinc-800 text-[10.5px]">{contact.address}, {contact.city}</span></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center my-0.5 pointer-events-none">
        <WeddingRingsVector size={48} goldColor={gold} />
      </div>

      <div className="relative z-0 flex justify-center -mb-2 overflow-hidden pointer-events-none">
        <RoyalCoupleVector size={210} />
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/ElegantClassicBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ElegantClassicBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-4 border-stone-300 relative bg-[#fffdfb]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-stone-200 mb-6">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">Matrimonial Biodata</span>
        <h1 className="text-3xl font-normal text-stone-900 mt-1 font-playfair italic">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-500 mt-1 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`• \${personal.subCaste}\` : ''}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded overflow-hidden border border-stone-200 p-1 bg-white shadow-xs shrink-0">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-700">Date of Birth:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-stone-700">Blood Group:</span> {personal.bloodGroup || '-'}</div>
            <div><span className="font-semibold text-stone-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'Non-Manglik'}</div>
            <div><span className="font-semibold text-stone-700">Mother Tongue:</span> {personal.motherTongue}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
          Academics & Profession
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2 border border-stone-200 rounded">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-500 font-sans">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2 border border-stone-200 rounded">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-500 font-sans">{ex.company}</div>
              {ex.achievements && <div className="text-[11px] font-medium text-stone-700">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
          Family Lineage
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-stone-50 p-3 rounded">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Type:</span> {family.familyType}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2 font-sans">
            Profile & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700 font-sans"><strong className="text-stone-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-1 font-sans">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-stone-300 text-center text-xs text-stone-500 font-sans avoid-break">
        <div className="flex justify-center gap-6">
          {contact.phone && <span>📞 {contact.phone}</span>}
          {contact.email && <span>✉️ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/ElegantGoldBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ElegantGoldBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const accent = customization.accentColor || '#d97706';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-4 border-double"
      style={{
        borderColor: accent,
        backgroundColor: '#fffcf7',
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-amber-200 mb-6">
        <div className="text-2xl mb-1 text-amber-600">॥ ॐ श्री गणेशाय नमः ॥</div>
        <h1 className="text-3xl font-bold tracking-wide uppercase font-cinzel text-amber-950">
          Matrimonial Profile
        </h1>
        <p className="text-2xl font-bold mt-1 text-amber-900 font-cinzel">
          {personal.fullName || 'Full Name'}
        </p>
        <p className="text-xs uppercase tracking-widest text-amber-800 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`• \${personal.subCaste}\` : ''}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-lg overflow-hidden border-2 border-amber-300 shadow-md shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div><span className="font-semibold text-stone-700">Birth Date:</span> {personal.dateOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Age:</span> {personal.age || '-'}</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion || '-'}</div>
            <div><span className="font-semibold text-stone-700">Blood Group:</span> {personal.bloodGroup || '-'}</div>
            <div><span className="font-semibold text-stone-700">Mother Tongue:</span> {personal.motherTongue || '-'}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Birth Time:</span> {personal.timeOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'No'}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
          Educational & Professional Background
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {education.map((e) => (
            <div key={e.id} className="p-2 rounded bg-amber-50/60 border border-amber-200/40">
              <div className="font-bold text-amber-950">{e.degree}</div>
              <div className="text-stone-700 text-xs">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2 rounded bg-amber-50/60 border border-amber-200/40">
              <div className="font-bold text-amber-950">{ex.jobTitle}</div>
              <div className="text-stone-700 text-xs">{ex.company} {ex.location ? \`(\${ex.location})\` : ''}</div>
              {ex.achievements && <div className="text-xs font-semibold text-amber-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName || '-'}</div>
          <div><span className="font-semibold text-stone-700">Occupation:</span> {family.fatherOccupation || '-'}</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName || '-'}</div>
          <div><span className="font-semibold text-stone-700">Occupation:</span> {family.motherOccupation || '-'}</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || '0'} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || '0'} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Type:</span> {family.familyType || 'Nuclear'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-5 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">
            About & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-sm text-stone-800 italic leading-relaxed mb-2">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><span className="font-semibold text-amber-950">Partner Preference:</span> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2 font-cinzel">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-6 pt-3 border-t border-amber-200 text-center text-xs text-stone-700 avoid-break">
        <div className="font-bold text-amber-950 uppercase font-cinzel mb-1">Contact Information</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>Phone: {contact.phone}</span>}
          {contact.email && <span>Email: {contact.email}</span>}
          {contact.city && <span>Location: {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/ElegantWhiteBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ElegantWhiteBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-10 font-cormorant text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-6 border-b border-slate-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-sans">Matrimonial Profile</span>
        <h1 className="text-3xl font-normal tracking-wide text-slate-900 mt-2 font-playfair italic">
          {personal.fullName || 'Full Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 mt-1 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`• \${personal.subCaste}\` : ''}
        </p>
      </div>

      <div className="flex gap-8 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded overflow-hidden shadow-sm shrink-0 border border-slate-200">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div><span className="text-slate-500 font-sans text-xs">Date of Birth:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="text-slate-500 font-sans text-xs">Height:</span> {personal.height}</div>
            <div><span className="text-slate-500 font-sans text-xs">Complexion:</span> {personal.complexion}</div>
            <div><span className="text-slate-500 font-sans text-xs">Mother Tongue:</span> {personal.motherTongue}</div>
            <div><span className="text-slate-500 font-sans text-xs">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="text-slate-500 font-sans text-xs">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="text-slate-500 font-sans text-xs">Birth Place:</span> {personal.placeOfBirth}</div>
            <div><span className="text-slate-500 font-sans text-xs">Birth Time:</span> {personal.timeOfBirth}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
          Education & Career
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {education.map((e) => (
            <div key={e.id}>
              <div className="font-bold text-slate-900">{e.degree}</div>
              <div className="text-xs text-slate-500 font-sans">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id}>
              <div className="font-bold text-slate-900">{ex.jobTitle}</div>
              <div className="text-xs text-slate-500 font-sans">{ex.company}</div>
              {ex.achievements && <div className="text-xs text-slate-600 font-sans mt-0.5">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
          Family Information
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div><span className="text-slate-500 font-sans text-xs">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="text-slate-500 font-sans text-xs">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="text-slate-500 font-sans text-xs">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="text-slate-500 font-sans text-xs">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="text-slate-500 font-sans text-xs">Native:</span> {family.nativePlace || '-'}</div>
          <div><span className="text-slate-500 font-sans text-xs">Family Type:</span> {family.familyType}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
            Profile & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-sm text-slate-800 leading-relaxed mb-2 italic">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-slate-600 font-sans"><strong className="text-slate-800">Partner Expectation:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-sans avoid-break">
        <div>{contact.phone} • {contact.email} • {contact.city}, {contact.state}</div>
      </div>
    </div>
  );
};
`);

console.log('Saved batch 2 biodatas');
