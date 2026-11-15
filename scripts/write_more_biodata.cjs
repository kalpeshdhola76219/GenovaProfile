const fs = require('fs');
const path = require('path');

function save(file, code) {
  const p = path.resolve(file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code.trim() + '\n', 'utf8');
}

// -----------------------------------------------------------------------
// BIODATA TEMPLATES
// -----------------------------------------------------------------------

save('src/templates/biodata/ClassicIndianBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ClassicIndianBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-4 border-stone-800 relative bg-[#fdfdfc]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-3 border-b-2 border-stone-800 mb-6">
        <div className="text-xl font-bold font-cinzel text-stone-900 mb-0.5">॥ श्री गणेशाय नमः ॥</div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-stone-900 font-cinzel">
          Marriage Biodata (बायोडाटा)
        </h1>
        <p className="text-2xl font-bold mt-1 text-stone-900 font-cinzel">
          {personal.fullName || 'Rahul Sharma'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-32 h-40 border border-stone-400 p-1 bg-white shadow-xs shrink-0">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-2 border-l-2 border-stone-800 font-cinzel">
            Personal & Kundali Particulars
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-700">Date of Birth:</span> {personal.dateOfBirth}</div>
            <div><span className="font-semibold text-stone-700">Age:</span> {personal.age}</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-stone-700">Religion / Caste:</span> {personal.religion} - {personal.caste}</div>
            <div><span className="font-semibold text-stone-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'Non-Manglik'}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-2 border-l-2 border-stone-800 font-cinzel">
          Educational Qualifications & Career
        </h2>
        <div className="space-y-2 text-xs">
          {education.map((e) => (
            <div key={e.id} className="flex justify-between border-b border-stone-100 pb-1">
              <div><strong>{e.degree}</strong> ({e.institute})</div>
              <div className="text-stone-500 font-sans">{e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="flex justify-between border-b border-stone-100 pb-1">
              <div><strong>{ex.jobTitle}</strong> at {ex.company}</div>
              <div className="text-stone-700 font-medium">{ex.achievements || ex.location}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-2 border-l-2 border-stone-800 font-cinzel">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-stone-700">Father's Name:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother's Name:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Status:</span> {family.familyStatus || 'Middle Class'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-2 border-l-2 border-stone-800 font-cinzel">
            About & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 mb-1 leading-relaxed">{marriage.aboutMe}</p>}
          {marriage.partnerExpectations && <p className="text-xs text-stone-700"><strong className="text-stone-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 text-stone-900 mb-1 border-l-2 border-stone-800 font-cinzel">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 border-stone-800 text-center text-xs text-stone-700 avoid-break font-sans">
        <div className="font-bold uppercase font-cinzel mb-1 text-stone-900">Contact Details</div>
        <div>Phone: {contact.phone} • Email: {contact.email} • Location: {contact.city}, {contact.state}</div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/ClassicSimpleBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ClassicSimpleBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white border border-slate-300"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="border-b-2 border-slate-800 pb-3 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
            Matrimonial Profile
          </h1>
          <p className="text-xl font-semibold text-slate-700 mt-1">
            {personal.fullName || 'Full Name'}
          </p>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-24 h-28 border border-slate-300 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 text-slate-900 mb-2 border-l-4 border-slate-800">
            1. Personal Details
          </h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600 w-1/3">Full Name</td><td className="py-1">{personal.fullName}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Date of Birth</td><td className="py-1">{personal.dateOfBirth}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Height / Weight</td><td className="py-1">{personal.height || '-'} / {personal.weight || '-'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Religion / Caste</td><td className="py-1">{personal.religion} - {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Gotra</td><td className="py-1">{personal.gotra || '-'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Manglik Status</td><td className="py-1">{personal.manglik || 'Non-Manglik'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Place of Birth</td><td className="py-1">{personal.placeOfBirth || '-'}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 text-slate-900 mb-2 border-l-4 border-slate-800">
            2. Education & Profession
          </h2>
          <div className="text-xs space-y-2">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between border-b border-slate-100 pb-1">
                <div><strong>{e.degree}</strong> ({e.institute})</div>
                <div className="text-slate-500">{e.endYear}</div>
              </div>
            ))}
            {experience.map((ex) => (
              <div key={ex.id} className="flex justify-between border-b border-slate-100 pb-1">
                <div><strong>{ex.jobTitle}</strong> at {ex.company}</div>
                <div className="text-slate-600 font-semibold">{ex.achievements || ex.location}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 text-slate-900 mb-2 border-l-4 border-slate-800">
            3. Family Details
          </h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600 w-1/3">Father's Name & Work</td><td className="py-1">{family.fatherName} ({family.fatherOccupation || 'N/A'})</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Mother's Name & Work</td><td className="py-1">{family.motherName} ({family.motherOccupation || 'N/A'})</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Brothers & Sisters</td><td className="py-1">{family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 font-semibold text-slate-600">Native Place</td><td className="py-1">{family.nativePlace || '-'}</td></tr>
            </tbody>
          </table>
        </div>

        {(marriage.aboutMe || marriage.partnerExpectations) && (
          <div className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 text-slate-900 mb-2 border-l-4 border-slate-800">
              4. About & Partner Expectations
            </h2>
            {marriage.aboutMe && <p className="text-xs text-slate-700 mb-1 leading-relaxed">{marriage.aboutMe}</p>}
            {marriage.partnerExpectations && <p className="text-xs text-slate-600"><strong className="text-slate-800">Preferences:</strong> {marriage.partnerExpectations}</p>}
          </div>
        )}

        {customSections.map((sec, idx) => (
          <div key={sec.id} className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 text-slate-900 mb-2 border-l-4 border-slate-800">
              {idx + 5}. {sec.title}
            </h2>
            {sec.items ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
              </div>
            ) : <p className="text-xs text-slate-700">{sec.content}</p>}
          </div>
        ))}

        <div className="pt-3 border-t-2 border-slate-800 text-xs avoid-break">
          <div className="font-bold uppercase text-slate-900 mb-1">Contact Address & Phone:</div>
          <div className="text-slate-700">{contact.phone} • {contact.email} • {family.familyAddress || contact.address || \`\${contact.city}, \${contact.state}\`}</div>
        </div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/ContemporaryBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const ContemporaryBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex gap-6 items-center border-b-2 border-teal-800 pb-5 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-24 h-28 object-cover rounded-2xl border-2 border-teal-600 shadow-sm shrink-0" />
        )}
        <div className="flex-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Matrimony Biodata</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">{personal.fullName || 'Rahul Sharma'}</h1>
          <p className="text-sm font-semibold text-teal-800 mt-0.5">{personal.professionalTitle || (experience[0]?.jobTitle ? \`\${experience[0].jobTitle} • \${experience[0].company}\` : '')}</p>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4">
            <span>📅 {personal.dateOfBirth} ({personal.age})</span>
            <span>📏 {personal.height}</span>
            <span>🕉 {personal.religion} - {personal.caste}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="space-y-4">
          <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-2">Horoscope & Bio</h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Complexion:</span> <span className="font-semibold">{personal.complexion}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <span className="font-semibold">{personal.bloodGroup || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold">{personal.gotra || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold">{personal.manglik || 'Non-Manglik'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-semibold">{personal.motherTongue}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Birth Place:</span> <span className="font-semibold">{personal.placeOfBirth}</span></div>
            </div>
          </div>
          <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-2">Family Info</h2>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-slate-500">Father:</span> <span className="font-semibold">{family.fatherName}</span> ({family.fatherOccupation})</div>
              <div><span className="text-slate-500">Mother:</span> <span className="font-semibold">{family.motherName}</span> ({family.motherOccupation})</div>
              <div><span className="text-slate-500">Siblings:</span> <span className="font-semibold">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
              <div><span className="text-slate-500">Native:</span> <span className="font-semibold">{family.nativePlace || '-'}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-2">Career & Studies</h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id} className="p-2 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-500 text-[11px]">{e.institute} • {e.endYear}</div>
                </div>
              ))}
              {experience.map((ex) => (
                <div key={ex.id} className="p-2 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                  <div className="text-slate-500 text-[11px]">{ex.company}</div>
                  {ex.achievements && <div className="text-teal-700 font-medium text-[11px]">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">Expectations</h2>
              {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-1.5">{marriage.aboutMe}</p>}
              {marriage.partnerExpectations && <p className="text-xs text-slate-600"><strong className="text-teal-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
            </div>
          )}
        </div>
      </div>

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 border-teal-800 text-center text-xs text-slate-600 avoid-break flex justify-center gap-6">
        {contact.phone && <span>📞 {contact.phone}</span>}
        {contact.email && <span>✉️ {contact.email}</span>}
        {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
      </div>
    </div>
  );
};
`);

console.log('Saved classic and contemporary biodatas');
