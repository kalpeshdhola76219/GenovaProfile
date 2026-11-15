const fs = require('fs');
const path = require('path');

function save(file, code) {
  const p = path.resolve(file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code.trim() + '\n', 'utf8');
}

save('src/templates/biodata/FloralBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const FloralBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#831843';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-slate-900 border-8 border-rose-100/80 relative"
      style={{
        backgroundColor: '#fffafb',
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-3 left-3 text-2xl opacity-60">🌸</div>
      <div className="absolute top-3 right-3 text-2xl opacity-60">🌸</div>
      <div className="absolute bottom-3 left-3 text-2xl opacity-60">🌸</div>
      <div className="absolute bottom-3 right-3 text-2xl opacity-60">🌸</div>
      <div className="text-center pb-4 border-b border-rose-200 mb-6">
        <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold">Matrimonial Profile</span>
        <h1 className="text-3xl font-bold tracking-wide mt-1 font-playfair" style={{ color: primary }}>
          {personal.fullName || 'Full Name'}
        </h1>
        {personal.caste && (
          <p className="text-xs text-rose-700 mt-1">
            {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''}
          </p>
        )}
      </div>
      <div className="flex gap-6 mb-6 items-center">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-40 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-sm shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-xl" />
          </div>
        )}
        <div className="flex-1 bg-white/70 p-4 rounded-2xl border border-rose-100">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div><span className="font-semibold text-rose-950">DOB:</span> {personal.dateOfBirth || '-'}</div>
            <div><span className="font-semibold text-rose-950">Age:</span> {personal.age || '-'}</div>
            <div><span className="font-semibold text-rose-950">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-rose-950">Complexion:</span> {personal.complexion || '-'}</div>
            <div><span className="font-semibold text-rose-950">Mother Tongue:</span> {personal.motherTongue || '-'}</div>
            <div><span className="font-semibold text-rose-950">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-rose-950">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-rose-950">Birth Place:</span> {personal.placeOfBirth || '-'}</div>
          </div>
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-900 border-b border-rose-200 pb-1 mb-2 font-playfair">
          Education & Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-xl bg-white/80 border border-rose-100">
              <div className="font-bold text-rose-950">{e.degree}</div>
              <div className="text-xs text-slate-600">{e.institute}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-xl bg-white/80 border border-rose-100">
              <div className="font-bold text-rose-950">{ex.jobTitle}</div>
              <div className="text-xs text-slate-600">{ex.company}</div>
              {ex.achievements && <div className="text-xs text-rose-800 font-semibold">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-900 border-b border-rose-200 pb-1 mb-2 font-playfair">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-white/70 p-3 rounded-2xl border border-rose-100">
          <div><span className="font-semibold text-rose-950">Father:</span> {family.fatherName || '-'} ({family.fatherOccupation || 'N/A'})</div>
          <div><span className="font-semibold text-rose-950">Mother:</span> {family.motherName || '-'} ({family.motherOccupation || 'N/A'})</div>
          <div><span className="font-semibold text-rose-950">Brothers:</span> {family.brothersCount || '0'} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-rose-950">Sisters:</span> {family.sistersCount || '0'} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-rose-950">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-rose-950">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>
      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-900 border-b border-rose-200 pb-1 mb-2 font-playfair">
            Lifestyle & Preferences
          </h2>
          {marriage.aboutMe && <p className="text-xs text-slate-800 italic mb-2 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-slate-700"><span className="font-semibold text-rose-950">Partner Expectations:</span> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}
      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-900 border-b border-rose-200 pb-1 mb-2">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white/60 p-2 rounded-lg">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs">{sec.content}</p>}
        </div>
      ))}
      <div className="mt-5 pt-3 border-t border-rose-200 text-center text-xs text-rose-950 avoid-break">
        <div className="font-bold uppercase font-playfair mb-1">Contact Details</div>
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

save('src/templates/biodata/FloralBorderBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const FloralBorderBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-[12px] border-amber-100/80 relative bg-[#fffdf9]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-xl opacity-60">🌺</div>
      <div className="absolute top-2 right-2 text-xl opacity-60">🌺</div>
      <div className="absolute bottom-2 left-2 text-xl opacity-60">🌺</div>
      <div className="absolute bottom-2 right-2 text-xl opacity-60">🌺</div>
      <div className="text-center pb-3 border-b-2 border-amber-300 mb-5">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-sans font-semibold">Biodata For Marriage</span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-1 font-playfair">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs text-stone-600 mt-0.5 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>
      <div className="flex gap-6 mb-5 items-center">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-40 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-xl" />
          </div>
        )}
        <div className="flex-1 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2 font-playfair">Personal Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-800">DOB:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="font-semibold text-stone-800">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-stone-800">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-stone-800">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-800">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-stone-800">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">Education & Career</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-xl bg-white border border-amber-100">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600 text-[11px]">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-xl bg-white border border-amber-100">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600 text-[11px]">{ex.company}</div>
              {ex.achievements && <div className="text-amber-800 font-semibold text-[11px]">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-2 font-playfair">Family Details</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60">
          <div><span className="font-semibold text-stone-800">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-800">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-800">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-stone-800">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-stone-800">Native:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-800">Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>
      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-1 font-playfair">About & Expectations</h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && <p className="text-xs text-stone-700"><strong className="text-amber-950">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
        </div>
      )}
      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-200 pb-1 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
      <div className="mt-5 pt-3 border-t border-amber-300 text-center text-xs text-stone-700 avoid-break font-sans">
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

save('src/templates/biodata/FloralGreenBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const FloralGreenBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-emerald-100 relative bg-[#fbfdfa]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-2xl opacity-70">🌿</div>
      <div className="absolute top-2 right-2 text-2xl opacity-70">🌿</div>
      <div className="absolute bottom-2 left-2 text-2xl opacity-70">🌿</div>
      <div className="absolute bottom-2 right-2 text-2xl opacity-70">🌿</div>
      <div className="text-center pb-4 border-b border-emerald-200 mb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-sans font-semibold">Biodata For Marriage</span>
        <h1 className="text-3xl font-bold text-emerald-950 mt-1 font-playfair">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs text-emerald-800 mt-1 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>
      <div className="flex gap-6 mb-6 items-center">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-42 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-xs shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-xl" />
          </div>
        )}
        <div className="flex-1 bg-white/80 p-4 rounded-2xl border border-emerald-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 font-playfair">Personal Profile</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-emerald-950">DOB:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="font-semibold text-emerald-950">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-emerald-950">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-emerald-950">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-emerald-950">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-emerald-950">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 mb-2 font-playfair">Education & Profession</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-xl bg-white border border-emerald-100">
              <div className="font-bold text-emerald-950">{e.degree}</div>
              <div className="text-stone-600 text-[11px]">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-xl bg-white border border-emerald-100">
              <div className="font-bold text-emerald-950">{ex.jobTitle}</div>
              <div className="text-stone-600 text-[11px]">{ex.company}</div>
              {ex.achievements && <div className="text-emerald-800 font-semibold text-[11px]">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 mb-2 font-playfair">Family Background</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white/80 p-3.5 rounded-2xl border border-emerald-100">
          <div><span className="font-semibold text-emerald-950">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-emerald-950">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-emerald-950">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-emerald-950">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-emerald-950">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-emerald-950">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>
      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 mb-1 font-playfair">About & Expectations</h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && <p className="text-xs text-stone-700"><strong className="text-emerald-950">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
        </div>
      )}
      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
      <div className="mt-5 pt-3 border-t border-emerald-200 text-center text-xs text-emerald-900 avoid-break font-sans">
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

save('src/templates/biodata/FloralPinkBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const FloralPinkBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-pink-100 relative bg-[#fff9fa]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="absolute top-2 left-2 text-2xl">🌸</div>
      <div className="absolute top-2 right-2 text-2xl">🌸</div>
      <div className="absolute bottom-2 left-2 text-2xl">🌸</div>
      <div className="absolute bottom-2 right-2 text-2xl">🌸</div>
      <div className="text-center pb-4 border-b border-pink-200 mb-6">
        <span className="text-xs uppercase tracking-widest text-pink-500 font-sans font-semibold">Biodata For Marriage</span>
        <h1 className="text-3xl font-bold text-pink-950 mt-1 font-playfair">
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs text-pink-700 mt-1 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>
      <div className="flex gap-6 mb-6 items-center">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-42 rounded-3xl overflow-hidden border-2 border-pink-200 shadow-sm shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-2xl" />
          </div>
        )}
        <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-pink-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-900 mb-2 font-playfair">Personal Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-pink-950">DOB:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="font-semibold text-pink-950">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-pink-950">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-pink-950">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-pink-950">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-pink-950">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-pink-900 border-b border-pink-200 pb-1 mb-2 font-playfair">Education & Career</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-2xl bg-white border border-pink-100">
              <div className="font-bold text-pink-950">{e.degree}</div>
              <div className="text-stone-600 text-[11px]">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-2xl bg-white border border-pink-100">
              <div className="font-bold text-pink-950">{ex.jobTitle}</div>
              <div className="text-stone-600 text-[11px]">{ex.company}</div>
              {ex.achievements && <div className="text-pink-700 font-semibold text-[11px]">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-pink-900 border-b border-pink-200 pb-1 mb-2 font-playfair">Family Details</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white/80 p-3.5 rounded-2xl border border-pink-100">
          <div><span className="font-semibold text-pink-950">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-pink-950">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-pink-950">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-pink-950">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-pink-950">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-pink-950">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>
      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-900 border-b border-pink-200 pb-1 mb-1 font-playfair">About & Expectations</h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && <p className="text-xs text-stone-700"><strong className="text-pink-950">Partner Preference:</strong> {marriage.partnerExpectations}</p>}
        </div>
      )}
      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-900 border-b border-pink-200 pb-1 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}
      <div className="mt-5 pt-3 border-t border-pink-200 text-center text-xs text-pink-900 avoid-break font-sans">
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

save('src/templates/biodata/GoldenHeritageBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';
import { GaneshaVector, CornerFiligreeVector } from './decorativeAssets';
import { User } from 'lucide-react';

export const GoldenHeritageBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, customization } = data;
  const gold = customization.primaryColor || '#b45309';
  const fontClass = customization.fontFamily ? \`font-\${customization.fontFamily}\` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11.5px]' : customization.fontSize === 'lg' ? 'text-[13.5px]' : 'text-[12.5px]';

  const personalItems: { label: string; value?: string }[] = [
    { label: 'Name', value: personal.fullName },
    { label: 'Date of Birth', value: personal.dateOfBirth },
    { label: 'Time of Birth', value: personal.timeOfBirth },
    { label: 'Place of Birth', value: personal.placeOfBirth },
    { label: 'Rashi', value: personal.rashi },
    { label: 'Manglik', value: personal.manglik || 'No' },
    { label: 'Religion', value: personal.religion || 'Hindu' },
    { label: 'Caste', value: [personal.caste, personal.subCaste].filter(Boolean).join(' - ') },
    { label: 'Weight', value: personal.weight },
    { label: 'Height', value: personal.height },
    { label: 'Blood Group', value: personal.bloodGroup },
    { label: 'Complexion', value: personal.complexion },
    { label: 'Education', value: education[0]?.degree },
    {
      label: 'Occupation',
      value: [experience[0]?.jobTitle || personal.professionalTitle, experience[0]?.company, experience[0]?.location]
        .filter(Boolean)
        .join(', '),
    },
    { label: 'Income', value: experience[0]?.achievements },
  ].filter((item) => item.value && item.value.trim() !== '');

  return (
    <div
      className={\`document-page-sheet relative bg-[#fffdf7] text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden \${fontClass} \${baseFontSize}\`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '16mm 16mm 14mm 16mm',
      }}
    >
      <div className="absolute inset-3 border-2 pointer-events-none" style={{ borderColor: gold }} />
      <div className="absolute inset-4 border border-dashed pointer-events-none" style={{ borderColor: \`\${gold}88\` }} />
      <div className="absolute inset-5 border pointer-events-none" style={{ borderColor: \`\${gold}44\` }} />
      <CornerFiligreeVector position="top-left" size={64} color={gold} className="absolute top-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="top-right" size={64} color={gold} className="absolute top-3 right-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-left" size={64} color={gold} className="absolute bottom-3 left-3 pointer-events-none" />
      <CornerFiligreeVector position="bottom-right" size={64} color={gold} className="absolute bottom-3 right-3 pointer-events-none" />

      <div className="relative z-10 text-center mb-3">
        <div className="flex justify-center mb-1">
          <GaneshaVector size={48} color="#d97706" variant="gold" />
        </div>
        <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase font-serif" style={{ color: gold }}>
          || SHREE GANESHAYA NAMAH ||
        </h2>
        <h1 className="text-2xl font-bold tracking-[0.16em] uppercase font-serif mt-0.5" style={{ color: gold }}>
          BIODATA
        </h1>
      </div>

      <div className="relative z-10 flex gap-8 items-start mb-2">
        <div className="flex-1 space-y-1">
          {personalItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[130px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">{item.label}</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900 break-words">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="shrink-0 w-44 pt-1">
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="w-44 h-56 p-1.5 rounded border-2 shadow-md bg-amber-50 relative overflow-hidden" style={{ borderColor: gold }}>
              <div className="w-full h-full rounded overflow-hidden border border-amber-300">
                <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="w-44 h-56 rounded border-2 border-dashed flex flex-col items-center justify-center text-amber-800 bg-amber-50" style={{ borderColor: gold }}>
              <User size={48} className="opacity-60 mb-2" />
              <span className="text-xs font-serif uppercase tracking-wider">Photo</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 my-2 pt-2 border-t border-amber-200">
        <h3 className="text-center text-sm font-extrabold uppercase tracking-[0.18em] font-serif mb-2" style={{ color: gold }}>
          FAMILY DETAILS
        </h3>
        <div className="max-w-xl mx-auto space-y-1 text-[12.5px]">
          {family.fatherName && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Father Name</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.fatherName}</span>
            </div>
          )}
          {family.fatherOccupation && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Occupation</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.fatherOccupation}</span>
            </div>
          )}
          {family.motherName && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Mother Name</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.motherName}</span>
            </div>
          )}
          {family.motherOccupation && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Occupation</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.motherOccupation}</span>
            </div>
          )}
          {family.sistersCount && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Sister</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.sistersCount}</span>
            </div>
          )}
          {family.brothersCount && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Brother</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{family.brothersCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-2 border-t border-amber-200 mt-auto">
        <h3 className="text-center text-sm font-extrabold uppercase tracking-[0.18em] font-serif mb-2" style={{ color: gold }}>
          CONTACT DETAILS
        </h3>
        <div className="max-w-xl mx-auto space-y-1 text-[12.5px]">
          {(contact.address || family.familyAddress) && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Address</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">
                {contact.address || family.familyAddress}, {contact.city}
              </span>
            </div>
          )}
          {contact.phone && (
            <div className="grid grid-cols-[140px_14px_1fr] items-baseline leading-snug">
              <span className="font-bold text-amber-900">Contact No.</span>
              <span className="text-amber-800 font-bold">:</span>
              <span className="font-medium text-zinc-900">{contact.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/IslamicNikahBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const IslamicNikahBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const emerald = '#065f46';
  const gold = '#d97706';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-double relative bg-[#fcfdfd]"
      style={{
        borderColor: emerald,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-lg font-bold tracking-widest text-emerald-800 font-serif">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p className="text-xs uppercase tracking-widest font-sans font-semibold mt-1" style={{ color: gold }}>
          In the Name of Allah, the Most Beneficent, the Most Merciful
        </p>
        <h1 className="text-3xl font-extrabold uppercase mt-2 font-cinzel text-emerald-950">
          Matrimonial Nikah Biodata
        </h1>
        <p className="text-2xl font-bold text-stone-900 font-cinzel mt-1">
          {personal.fullName || 'Zaid Khan'}
        </p>
        <p className="text-xs text-stone-600 font-sans mt-0.5">
          {personal.religion || 'Islam'} • {personal.caste || 'Sunni'} {personal.subCaste ? \`(\${personal.subCaste})\` : ''} • {personal.placeOfBirth || 'Mumbai'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div className="w-36 h-44 rounded-xl border-2 p-1 bg-white shadow-md" style={{ borderColor: emerald }}>
              <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        )}
        <div className="flex-1 bg-white p-4 rounded-xl border shadow-xs" style={{ borderColor: '#a7f3d0' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel text-emerald-900 border-b pb-1 border-emerald-100 flex items-center justify-between">
            <span>Personal & Religious Details</span>
            <span className="text-[10px] text-emerald-700 font-sans">Deen & Values</span>
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-600">Date of Birth:</span> {personal.dateOfBirth || '-'} ({personal.age || '28'})</div>
            <div><span className="font-semibold text-stone-600">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-stone-600">Complexion:</span> {personal.complexion || 'Fair'}</div>
            <div><span className="font-semibold text-stone-600">Marital Status:</span> {personal.maritalStatus || 'Never Married'}</div>
            <div><span className="font-semibold text-stone-600">Mother Tongue:</span> {personal.motherTongue || 'Urdu, English'}</div>
            <div><span className="font-semibold text-stone-600">Namaz / Deen:</span> 5 Times Daily Salah, Practicing</div>
            <div><span className="font-semibold text-stone-600">Diet & Lifestyle:</span> 100% Halal, Teetotaler</div>
            <div><span className="font-semibold text-stone-600">Native Place:</span> {family.nativePlace || personal.placeOfBirth || '-'}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: emerald, borderColor: gold }}>
          Education & Professional Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-white border border-emerald-100">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((exp) => (
            <div key={exp.id} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <div className="font-bold text-emerald-950">{exp.jobTitle}</div>
              <div className="text-stone-700">{exp.company} ({exp.startDate} - {exp.endDate})</div>
              {exp.achievements && <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">{exp.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: emerald }}>
          Respected Family Background
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-stone-600">Father's Name:</span> {family.fatherName}</div>
          <div><span className="font-semibold text-stone-600">Father's Occupation:</span> {family.fatherOccupation}</div>
          <div><span className="font-semibold text-stone-600">Mother's Name:</span> {family.motherName}</div>
          <div><span className="font-semibold text-stone-600">Mother's Occupation:</span> {family.motherOccupation}</div>
          <div><span className="font-semibold text-stone-600">Siblings:</span> {family.brothersCount} Brother(s), {family.sistersCount} Sister(s)</div>
          <div><span className="font-semibold text-stone-600">Family Type:</span> {family.familyType} ({family.familyStatus})</div>
        </div>
      </div>

      {marriage.aboutMe && (
        <div className="mb-4 avoid-break p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs">
          <span className="font-bold uppercase tracking-wider block mb-1 text-emerald-900 font-cinzel">About Self & Partner Expectations</span>
          <p className="text-stone-700 leading-relaxed italic">{marriage.aboutMe}</p>
          {marriage.partnerExpectations && (
            <p className="text-stone-700 leading-relaxed mt-2 pt-2 border-t border-emerald-200">
              <span className="font-semibold text-emerald-950">Partner Expectations:</span> {marriage.partnerExpectations}
            </p>
          )}
        </div>
      )}

      <div className="pt-3 border-t-2 flex justify-between items-center text-xs" style={{ borderColor: gold }}>
        <div className="text-stone-600 font-sans">
          <span>Contact: <strong className="text-stone-900">{contact.phone}</strong></span>
          <span className="mx-2">•</span>
          <span>Email: <strong className="text-stone-900">{contact.email}</strong></span>
        </div>
        <div className="text-emerald-800 font-bold uppercase tracking-widest text-[10px] font-sans">
          Alhamdulillah
        </div>
      </div>
    </div>
  );
};
`);

save('src/templates/biodata/LuxuryBiodataTemplate.tsx', `import React from 'react';
import { DocumentData } from '../../types/document';

export const LuxuryBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#701a75';
  const gold = customization.accentColor || '#ca8a04';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-slate-900 border-8 border-double bg-[#faf7f9]"
      style={{
        borderColor: gold,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: primary }}>
        <div className="text-xl font-bold tracking-widest uppercase font-cinzel text-amber-600">
          ❖ Matrimonial Portfolio ❖
        </div>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mt-1 font-cinzel" style={{ color: primary }}>
          {personal.fullName || 'Full Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-600 mt-1 font-sans">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? \`• \${personal.subCaste}\` : ''}
        </p>
      </div>
      <div className="flex gap-6 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-amber-500 shadow-md shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
        <div className="flex-1 bg-white p-4 rounded-xl border border-amber-200">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: primary }}>
            Personal Bio
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div><span className="font-semibold text-slate-700">DOB:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="font-semibold text-slate-700">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-slate-700">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-slate-700">Blood Group:</span> {personal.bloodGroup || '-'}</div>
            <div><span className="font-semibold text-slate-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-slate-700">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-slate-700">Mother Tongue:</span> {personal.motherTongue}</div>
            <div><span className="font-semibold text-slate-700">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
          Academics & Profession
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-white border border-amber-100">
              <div className="font-bold text-slate-900">{e.degree}</div>
              <div className="text-xs text-slate-600">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-lg bg-white border border-amber-100">
              <div className="font-bold text-slate-900">{ex.jobTitle}</div>
              <div className="text-xs text-slate-600">{ex.company}</div>
              {ex.achievements && <div className="text-xs font-semibold text-amber-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
          Family Heritage
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-white p-3 rounded-xl border border-amber-100">
          <div><span className="font-semibold text-slate-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-slate-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-slate-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? \`(\${family.marriedBrothers})\` : ''}</div>
          <div><span className="font-semibold text-slate-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? \`(\${family.marriedSisters})\` : ''}</div>
          <div><span className="font-semibold text-slate-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-slate-700">Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>
      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: primary, borderColor: gold }}>
            Personal Perspective
          </h2>
          {marriage.aboutMe && <p className="text-xs text-slate-800 leading-relaxed mb-1 italic">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-slate-700"><strong className="text-purple-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}
      <div className="mt-5 pt-3 border-t-2 text-center text-xs text-slate-600 avoid-break" style={{ borderColor: gold }}>
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

console.log('Saved batch 3 part 1');
