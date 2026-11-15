const fs = require('fs');
const path = require('path');

function save(file, code) {
  const p = path.resolve(file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code.trim() + '\n', 'utf8');
  console.log('Saved:', file);
}

// 1. ChristianWeddingBiodataTemplate
save('src/templates/biodata/ChristianWeddingBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ChristianWeddingBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const royalNavy = '#1e3a8a';
  const champagneGold = '#b45309';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-double relative bg-[#fbfcfd]"
      style={{
        borderColor: royalNavy,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: champagneGold }}>
        <div className="text-xl font-serif text-amber-700 font-bold">✝</div>
        <p className="text-[11px] uppercase tracking-widest font-sans font-semibold text-slate-500 italic mt-0.5">
          "Love is patient, love is kind. It always protects, always trusts, always hopes." (1 Corinthians 13:4-7)
        </p>
        <h1 className="text-3xl font-extrabold uppercase mt-1.5 font-cinzel text-blue-950">
          Matrimonial Profile
        </h1>
        <p className="text-2xl font-bold text-stone-900 font-cinzel mt-1">
          {personal.fullName || 'David Fernandes'}
        </p>
        <p className="text-xs text-stone-600 font-sans mt-0.5">
          {personal.religion || 'Christian'} • {personal.caste || 'Roman Catholic'} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • {personal.placeOfBirth || 'Goa / Mumbai'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div className="w-36 h-44 rounded-xl border-2 p-1 bg-white shadow-md" style={{ borderColor: royalNavy }}>
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        )}
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel text-blue-900 border-b pb-1 border-slate-100 flex items-center justify-between">
            <span>Personal & Church Profile</span>
            <span className="text-[10px] text-amber-700 font-sans">Parish & Denomination</span>
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-600">Date of Birth:</span> {personal.dateOfBirth || '-'} ({personal.age || '28'})</div>
            <div><span className="font-semibold text-stone-600">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-stone-600">Complexion:</span> {personal.complexion || 'Fair'}</div>
            <div><span className="font-semibold text-stone-600">Marital Status:</span> {personal.maritalStatus || 'Never Married'}</div>
            <div><span className="font-semibold text-stone-600">Parish / Church:</span> St. Mary's Cathedral</div>
            <div><span className="font-semibold text-stone-600">Mother Tongue:</span> {personal.motherTongue || 'English, Konkani'}</div>
            <div><span className="font-semibold text-stone-600">Lifestyle:</span> Non-smoker, Social Drinker</div>
            <div><span className="font-semibold text-stone-600">Native Place:</span> {family.nativePlace || personal.placeOfBirth || '-'}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalNavy, borderColor: champagneGold }}>
          Education & Professional Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} • {e.endYear}</div>
              {e.score && <div className="text-[11px] text-blue-800 font-medium">Grade: {e.score}</div>}
            </div>
          ))}
          {experience.map((exp) => (
            <div key={exp.id} className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="font-bold text-blue-950">{exp.jobTitle}</div>
              <div className="text-stone-700">{exp.company} ({exp.startDate} - {exp.endDate})</div>
              {exp.achievements && <div className="text-[11px] font-semibold text-blue-800 mt-0.5">{exp.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: royalNavy }}>
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-stone-600">Father's Name:</span> {family.fatherName}</div>
          <div><span className="font-semibold text-stone-600">Father's Occupation:</span> {family.fatherOccupation}</div>
          <div><span className="font-semibold text-stone-600">Mother's Name:</span> {family.motherName}</div>
          <div><span className="font-semibold text-stone-600">Mother's Occupation:</span> {family.motherOccupation}</div>
          <div><span className="font-semibold text-stone-600">Siblings:</span> {family.brothersCount} Brother(s), {family.sistersCount} Sister(s)</div>
          <div><span className="font-semibold text-stone-600">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>

      {marriage.aboutMe && (
        <div className="mb-4 avoid-break p-3.5 bg-blue-50/30 rounded-xl border border-blue-100 text-xs">
          <span className="font-bold uppercase tracking-wider block mb-1 text-blue-900 font-cinzel">About Me & Partner Expectations</span>
          <p className="text-stone-700 leading-relaxed italic">{marriage.aboutMe}</p>
          {marriage.partnerExpectations && (
            <p className="text-stone-700 leading-relaxed mt-2 pt-2 border-t border-blue-200">
              <span className="font-semibold text-blue-950">Partner Expectations:</span> {marriage.partnerExpectations}
            </p>
          )}
        </div>
      )}

      <div className="pt-3 border-t-2 flex justify-between items-center text-xs" style={{ borderColor: champagneGold }}>
        <div className="text-stone-600 font-sans">
          <span>Contact: <strong className="text-stone-900">{contact.phone}</strong></span>
          <span className="mx-2">•</span>
          <span>Email: <strong className="text-stone-900">{contact.email}</strong></span>
        </div>
        <div className="text-amber-800 font-bold uppercase tracking-widest text-[10px] font-sans">
          God Bless Our Union
        </div>
      </div>
    </div>
  );
};
`);

// 2. CircularPhotoBiodataTemplate
save('src/templates/biodata/CircularPhotoBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const CircularPhotoBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 bg-[#fffdfa] border-4 border-stone-200"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-5 border-b border-stone-200 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 shadow-md mx-auto mb-3 p-0.5 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-800 mx-auto mb-3">
            {personal.fullName?.charAt(0) || 'R'}
          </div>
        )}
        <span className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold">Matrimonial Biodata</span>
        <h1 className="text-3xl font-extrabold uppercase mt-0.5 font-cinzel text-stone-900">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs text-stone-600 font-sans mt-0.5">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-2 font-cinzel">
            Personal & Kundali Info
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-stone-500">Date of Birth:</span> <span className="font-semibold">{personal.dateOfBirth} ({personal.age})</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Height:</span> <span className="font-semibold">{personal.height}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Complexion:</span> <span className="font-semibold">{personal.complexion}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Blood Group:</span> <span className="font-semibold">{personal.bloodGroup || '-'}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Gotra:</span> <span className="font-semibold">{personal.gotra || '-'}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Manglik:</span> <span className="font-semibold">{personal.manglik || 'Non-Manglik'}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Mother Tongue:</span> <span className="font-semibold">{personal.motherTongue}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Birth Place:</span> <span className="font-semibold">{personal.placeOfBirth}</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-2 font-cinzel">
            Family Heritage
          </h2>
          <div className="space-y-1.5 text-xs">
            <div><span className="text-stone-500">Father:</span> <span className="font-semibold">{family.fatherName}</span> ({family.fatherOccupation})</div>
            <div><span className="text-stone-500">Mother:</span> <span className="font-semibold">{family.motherName}</span> ({family.motherOccupation})</div>
            <div><span className="text-stone-500">Brothers:</span> <span className="font-semibold">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
            <div><span className="text-stone-500">Native Place:</span> <span className="font-semibold">{family.nativePlace || '-'}</span></div>
            <div><span className="text-stone-500">Family Status:</span> <span className="font-semibold">{family.familyStatus || 'Upper Middle Class'}</span></div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-2 font-cinzel">
          Education & Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-xl border border-stone-200 bg-white">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600 text-[11px]">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-xl border border-stone-200 bg-white">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600 text-[11px]">{ex.company}</div>
              {ex.achievements && <div className="text-amber-800 font-semibold text-[11px]">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break bg-white p-3.5 rounded-2xl border border-stone-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 font-cinzel">Profile & Expectations</h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && <p className="text-xs text-stone-700"><strong className="text-amber-950">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 mb-1 font-cinzel">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl border border-stone-200">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-stone-300 text-center text-xs text-stone-700 avoid-break font-sans">
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

console.log('Biodata part 1 finished');
