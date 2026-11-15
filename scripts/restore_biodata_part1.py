import os

def save(file_path, content):
    full_path = os.path.abspath(file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Wrote:', file_path)

# 1. TraditionalRedBiodataTemplate.tsx
save('src/templates/biodata/TraditionalRedBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const TraditionalRedBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const red = customization.primaryColor || '#b91c1c';
  const gold = customization.accentColor || '#d97706';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-[10px] border-double relative bg-[#fffdfa]"
      style={{
        borderColor: red,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      {/* Corner Filigrees */}
      <div className="absolute top-2 left-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute top-2 right-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute bottom-2 left-2 text-2xl font-bold" style={{ color: gold }}>卐</div>
      <div className="absolute bottom-2 right-2 text-2xl font-bold" style={{ color: gold }}>卐</div>

      {/* Vedic Mandir Header */}
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-sm font-bold tracking-widest uppercase" style={{ color: red }}>॥ श्री गणेशाय नमः ॥</p>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mt-1 font-cinzel" style={{ color: red }}>
          विवाह बायोडेटा
        </h1>
        <p className="text-2xl font-bold mt-1 text-stone-900 font-cinzel">
          {personal.fullName || 'Rahul Sharma'}
        </p>
        <p className="text-xs uppercase tracking-widest text-stone-600 mt-0.5">
          {personal.religion || 'Hindu'} • {personal.caste || 'Brahmin'} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="shrink-0">
            <div className="w-36 h-44 rounded border-2 p-1 bg-white shadow-sm" style={{ borderColor: red }}>
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xs"
              />
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between" style={{ color: red, borderColor: gold }}>
            <span>Personal & Astrological Data</span>
            <span className="text-[11px] font-normal text-stone-500">व्यक्तिगत विवरण</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-700">Date of Birth:</span> {personal.dateOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Age:</span> {personal.age || '-'}</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion || '-'}</div>
            <div><span className="font-semibold text-stone-700">Blood Group:</span> {personal.bloodGroup || '-'}</div>
            <div><span className="font-semibold text-stone-700">Mother Tongue:</span> {personal.motherTongue || '-'}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Birth Time:</span> {personal.timeOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'Non-Manglik'}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between" style={{ color: red, borderColor: gold }}>
          <span>Education & Professional Standing</span>
          <span className="text-[11px] font-normal text-stone-500">शिक्षा एवं व्यवसाय</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded bg-amber-50/50 border border-amber-200/60">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-700">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded bg-amber-50/50 border border-amber-200/60">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-700">{ex.company}</div>
              {ex.achievements && <div className="text-[11px] font-semibold text-red-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs flex justify-between" style={{ color: red, borderColor: gold }}>
          <span>Family Heritage</span>
          <span className="text-[11px] font-normal text-stone-500">पारिवारिक विवरण</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName || '-'} ({family.fatherOccupation || 'N/A'})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName || '-'} ({family.motherOccupation || 'N/A'})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || '0'} {family.marriedBrothers ? `(${family.marriedBrothers})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || '0'} {family.marriedSisters ? `(${family.marriedSisters})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <div className="border-b pb-1 mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
            Preferences & Lifestyle
          </div>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><strong style={{ color: red }}>Partner Expectations:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <div className="border-b pb-1 mb-1.5 font-bold uppercase tracking-wider text-xs" style={{ color: red, borderColor: gold }}>
            {sec.title}
          </div>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((it) => (
                <div key={it.id}><span className="font-semibold text-stone-700">{it.key}:</span> {it.value}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-700">{sec.content}</p>
          )}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 text-center text-xs text-stone-700 avoid-break" style={{ borderColor: gold }}>
        <div className="font-bold uppercase tracking-wider mb-1" style={{ color: red }}>Contact Details</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 2. TraditionalGoldBiodataTemplate.tsx
save('src/templates/biodata/TraditionalGoldBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const TraditionalGoldBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const gold = '#b45309';
  const amber = '#f59e0b';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-amber-600/70 relative bg-[#fffdf5]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 border-amber-500 mb-6">
        <span className="text-sm font-bold tracking-widest text-amber-800 uppercase">॥ ॐ श्री गणेशाय नमः ॥</span>
        <h1 className="text-3xl font-extrabold uppercase mt-1 font-cinzel text-amber-950">
          विवाह बायोडेटा
        </h1>
        <p className="text-2xl font-bold mt-1 text-amber-900 font-cinzel">
          {personal.fullName || 'Rahul Sharma'}
        </p>
        <p className="text-xs uppercase tracking-widest text-amber-800 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste || 'Brahmin'} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-lg overflow-hidden border-2 border-amber-400 shadow-md shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded" />
          </div>
        )}
        <div className="flex-1 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-2 font-cinzel">
            Personal & Kundali Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div><span className="font-semibold text-stone-700">Date of Birth:</span> {personal.dateOfBirth}</div>
            <div><span className="font-semibold text-stone-700">Age:</span> {personal.age}</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion}</div>
            <div><span className="font-semibold text-stone-700">Blood Group:</span> {personal.bloodGroup || '-'}</div>
            <div><span className="font-semibold text-stone-700">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'Non-Manglik'}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-2 font-cinzel">
          Educational & Career Achievements
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded bg-white border border-amber-200">
              <div className="font-bold text-amber-950">{e.degree}</div>
              <div className="text-stone-700">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded bg-white border border-amber-200">
              <div className="font-bold text-amber-950">{ex.jobTitle}</div>
              <div className="text-stone-700">{ex.company}</div>
              {ex.achievements && <div className="text-[11px] font-semibold text-amber-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-2 font-cinzel">
          Family Lineage & Roots
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-amber-50/40 p-3 rounded-xl border border-amber-200">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Status:</span> {family.familyStatus || 'Reputed Family'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-2 font-cinzel">
            Expectations & Partner Preference
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><strong className="text-amber-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-1 font-cinzel">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border border-amber-200">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 border-amber-400 text-center text-xs text-stone-700 avoid-break">
        <div className="font-bold text-amber-900 uppercase font-cinzel mb-1">Contact Information</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 3. RoyalTraditionalBiodataTemplate.tsx
save('src/templates/biodata/RoyalTraditionalBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const RoyalTraditionalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const royal = '#831843'; // Deep wine / royal
  const gold = '#b45309';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-8 border-double relative bg-[#fdfafb]"
      style={{
        borderColor: royal,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-xs font-bold tracking-widest uppercase font-cinzel" style={{ color: gold }}>
          ❖ Royal Matrimonial Heritage ❖
        </p>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mt-1 font-cinzel" style={{ color: royal }}>
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-600 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-md shrink-0" style={{ borderColor: gold }}>
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
        <div className="flex-1 bg-white p-4 rounded-xl border" style={{ borderColor: '#fbcfe8' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: royal }}>
            Personal Profile & Horoscope
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
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royal, borderColor: gold }}>
          Academic & Professional Credentials
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-white border border-pink-100">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-lg bg-white border border-pink-100">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600">{ex.company}</div>
              {ex.achievements && <div className="text-[11px] font-semibold text-pink-900">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royal, borderColor: gold }}>
          Family Heritage & Dignity
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3.5 rounded-xl border border-pink-100">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Ancestral Roots:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Status:</span> {family.familyStatus || 'Reputable Affluent'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royal, borderColor: gold }}>
            Personal Perspective & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 leading-relaxed mb-1 italic">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><strong style={{ color: royal }}>Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-cinzel pb-1 border-b" style={{ color: royal, borderColor: gold }}>{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 text-center text-xs text-stone-700 avoid-break" style={{ borderColor: gold }}>
        <div className="font-bold uppercase font-cinzel mb-1" style={{ color: royal }}>Contact Details</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 4. PortraitFocusBiodataTemplate.tsx
save('src/templates/biodata/PortraitFocusBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PortraitFocusBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const navy = '#0f172a'; // Slate 900
  const gold = '#d97706';

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800 bg-white flex min-h-[297mm]"
      style={{
        fontSize: customization.fontSize === 'sm' ? '12px' : customization.fontSize === 'lg' ? '15px' : '13px',
      }}
    >
      {/* Left Pillar: Portrait & Contact (32%) */}
      <div className="w-[32%] bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400 mb-5 shadow-lg">
              <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] rounded-2xl bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400 mb-5 border border-slate-700">
              {personal.fullName?.charAt(0) || 'R'}
            </div>
          )}

          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 mb-2">
            Personal Details
          </h2>
          <div className="space-y-1.5 text-xs text-slate-300 mb-5">
            <div><span className="text-slate-400 block text-[11px]">DOB:</span> {personal.dateOfBirth} ({personal.age})</div>
            <div><span className="text-slate-400 block text-[11px]">Height:</span> {personal.height}</div>
            <div><span className="text-slate-400 block text-[11px]">Complexion:</span> {personal.complexion}</div>
            <div><span className="text-slate-400 block text-[11px]">Gotra:</span> {personal.gotra || '-'}</div>
            <div><span className="text-slate-400 block text-[11px]">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="text-slate-400 block text-[11px]">Mother Tongue:</span> {personal.motherTongue}</div>
            <div><span className="text-slate-400 block text-[11px]">Birth Place:</span> {personal.placeOfBirth}</div>
          </div>

          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 mb-2">
            Contact Info
          </h2>
          <div className="space-y-1 text-xs text-slate-300">
            {contact.phone && <div>✆ {contact.phone}</div>}
            {contact.email && <div>✉ {contact.email}</div>}
            {contact.city && <div>📍 {contact.city}, {contact.state}</div>}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800">
          GenovaProfile • Private Matrimonial Record
        </div>
      </div>

      {/* Right Column: Identity, Career, Family, Expectations (68%) */}
      <div className="w-[68%] p-7 space-y-5">
        <div className="border-b-2 border-slate-900 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Matrimonial Biodata</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{personal.fullName || 'Rahul Sharma'}</h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">{personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} at ${experience[0].company}` : '')}</p>
          <div className="text-xs text-slate-500 mt-1">
            {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Education & Career
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-slate-900">{e.degree}</div>
                <div className="text-slate-500 text-[11px]">{e.institute} • {e.endYear}</div>
              </div>
            ))}
            {experience.map((ex) => (
              <div key={ex.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                <div className="text-slate-500 text-[11px]">{ex.company}</div>
                {ex.achievements && <div className="text-amber-700 font-medium text-[11px] mt-0.5">{ex.achievements}</div>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Family Background
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div><span className="text-slate-500">Father:</span> <span className="font-semibold text-slate-800">{family.fatherName}</span> ({family.fatherOccupation})</div>
            <div><span className="text-slate-500">Mother:</span> <span className="font-semibold text-slate-800">{family.motherName}</span> ({family.motherOccupation})</div>
            <div><span className="text-slate-500">Siblings:</span> <span className="text-slate-700">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
            <div><span className="text-slate-500">Native Place:</span> <span className="text-slate-700">{family.nativePlace || '-'}</span></div>
          </div>
        </div>

        {(marriage.aboutMe || marriage.partnerExpectations) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              About & Expectations
            </h2>
            {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-2">{marriage.aboutMe}</p>}
            {marriage.partnerExpectations && (
              <div className="text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 text-slate-700">
                <strong className="text-amber-900">Partner Preference:</strong> {marriage.partnerExpectations}
              </div>
            )}
          </div>
        )}

        {customSections.map((sec) => (
          <div key={sec.id}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1">{sec.title}</h2>
            {sec.items ? (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
              </div>
            ) : <p className="text-xs text-slate-700">{sec.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
''')

# 5. ModernCleanBiodataTemplate.tsx
save('src/templates/biodata/ModernCleanBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernCleanBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-start border-b border-slate-200 pb-5 mb-8">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Marriage Biodata</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{personal.fullName || 'Rahul Sharma'}</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">{personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle}` : '')}</p>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-20 h-24 rounded-xl object-cover border border-slate-200 shadow-xs" />
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">1. Personal Profile</h2>
          <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
            <div><span className="text-slate-400 block text-[11px]">DOB</span> <span className="font-semibold text-slate-900">{personal.dateOfBirth} ({personal.age})</span></div>
            <div><span className="text-slate-400 block text-[11px]">Height</span> <span className="font-semibold text-slate-900">{personal.height}</span></div>
            <div><span className="text-slate-400 block text-[11px]">Complexion</span> <span className="font-semibold text-slate-900">{personal.complexion}</span></div>
            <div><span className="text-slate-400 block text-[11px]">Religion</span> <span className="font-semibold text-slate-900">{personal.religion}</span></div>
            <div><span className="text-slate-400 block text-[11px]">Caste</span> <span className="font-semibold text-slate-900">{personal.caste}</span></div>
            <div><span className="text-slate-400 block text-[11px]">Gotra</span> <span className="font-semibold text-slate-900">{personal.gotra || '-'}</span></div>
          </div>
        </div>

        <div className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">2. Career & Education</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {education.map((e) => (
              <div key={e.id} className="p-3 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">{e.degree}</div>
                <div className="text-slate-500 text-[11px]">{e.institute} • {e.endYear}</div>
              </div>
            ))}
            {experience.map((ex) => (
              <div key={ex.id} className="p-3 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                <div className="text-slate-500 text-[11px]">{ex.company}</div>
                {ex.achievements && <div className="text-emerald-700 font-medium text-[11px] mt-0.5">{ex.achievements}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">3. Family Background</h2>
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
            <div><span className="text-slate-400 block text-[11px]">Father</span> <span className="font-semibold text-slate-900">{family.fatherName}</span> ({family.fatherOccupation})</div>
            <div><span className="text-slate-400 block text-[11px]">Mother</span> <span className="font-semibold text-slate-900">{family.motherName}</span> ({family.motherOccupation})</div>
            <div><span className="text-slate-400 block text-[11px]">Siblings</span> <span className="text-slate-700">{family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)</span></div>
            <div><span className="text-slate-400 block text-[11px]">Native Location</span> <span className="text-slate-700">{family.nativePlace || '-'}</span></div>
          </div>
        </div>

        {(marriage.aboutMe || marriage.partnerExpectations) && (
          <div className="avoid-break space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">4. About & Expectations</h2>
            {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed">{marriage.aboutMe}</p>}
            {marriage.partnerExpectations && (
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <strong className="text-slate-900">Partner Preference:</strong> {marriage.partnerExpectations}
              </div>
            )}
          </div>
        )}

        {customSections.map((sec, idx) => (
          <div key={sec.id} className="avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{idx + 5}. {sec.title}</h2>
            {sec.items ? (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                {sec.items.map((i) => <div key={i.id}><span className="text-slate-400">{i.key}:</span> <span className="font-medium">{i.value}</span></div>)}
              </div>
            ) : <p className="text-xs text-slate-700">{sec.content}</p>}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between avoid-break">
          <span>Phone: <strong className="text-slate-800">{contact.phone}</strong></span>
          <span>Email: <strong className="text-slate-800">{contact.email}</strong></span>
          <span>Location: <strong className="text-slate-800">{contact.city}, {contact.state}</strong></span>
        </div>
      </div>
    </div>
  );
};
''')

# 6. ModernElegantBiodataTemplate.tsx
save('src/templates/biodata/ModernElegantBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernElegantBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#1e293b'; // Slate 800
  const accent = '#6366f1'; // Indigo 500

  return (
    <div
      className="document-page-sheet p-9 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Sleek Top Banner */}
      <div className="flex justify-between items-center border-b pb-6 mb-7 border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Matrimonial Profile
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">
            {personal.fullName || 'Rahul Sharma'}
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            {personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} at ${experience[0].company}` : '')}
          </p>
          <div className="text-xs text-slate-500 mt-1">
            {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `• ${personal.subCaste}` : ''}
          </div>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous" referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover rounded-2xl shadow-sm border border-slate-200 shrink-0"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-5 space-y-5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Personal Info
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">DOB:</span> <span className="font-semibold text-slate-900">{personal.dateOfBirth}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age:</span> <span className="font-semibold text-slate-900">{personal.age}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Height:</span> <span className="font-semibold text-slate-900">{personal.height}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Complexion:</span> <span className="font-semibold text-slate-900">{personal.complexion}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold text-slate-900">{personal.gotra || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold text-slate-900">{personal.manglik || 'No'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Birth Place:</span> <span className="font-semibold text-slate-900">{personal.placeOfBirth}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Contact
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.city && <div>📍 {contact.city}, {contact.state}</div>}
            </div>
          </div>
        </div>

        <div className="col-span-7 space-y-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Career & Academics
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id} className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institute} • {e.endYear}</div>
                </div>
              ))}
              {experience.map((ex) => (
                <div key={ex.id} className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                  <div className="text-slate-600">{ex.company}</div>
                  {ex.achievements && <div className="text-indigo-700 font-semibold mt-0.5">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Family Details
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Father:</span> <span className="font-medium text-slate-800">{family.fatherName}</span></div>
              <div><span className="text-slate-500">Occupation:</span> <span className="text-slate-700">{family.fatherOccupation}</span></div>
              <div><span className="text-slate-500">Mother:</span> <span className="font-medium text-slate-800">{family.motherName}</span></div>
              <div><span className="text-slate-500">Occupation:</span> <span className="text-slate-700">{family.motherOccupation}</span></div>
              <div><span className="text-slate-500">Siblings:</span> <span className="text-slate-700">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
              <div><span className="text-slate-500">Native:</span> <span className="text-slate-700">{family.nativePlace || '-'}</span></div>
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">About & Preferences</h2>
              {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-2">{marriage.aboutMe}</p>}
              {marriage.partnerExpectations && (
                <div className="text-xs bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                  <strong className="text-indigo-900">Partner Preference:</strong> {marriage.partnerExpectations}
                </div>
              )}
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> <span className="font-medium">{i.value}</span></div>)}
                </div>
              ) : <p className="text-xs text-slate-700">{sec.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
''')

# 7. ModernProfileBiodataTemplate.tsx
save('src/templates/biodata/ModernProfileBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernProfileBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl mb-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Personal & Marriage Profile</span>
          <h1 className="text-3xl font-black text-white mt-1">{personal.fullName || 'Rahul Sharma'}</h1>
          <p className="text-xs font-medium text-slate-300 mt-0.5">{personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} • ${experience[0].company}` : '')}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
            <span className="bg-white/10 px-2 py-0.5 rounded">🎂 {personal.dateOfBirth} ({personal.age})</span>
            <span className="bg-white/10 px-2 py-0.5 rounded">📏 {personal.height}</span>
            <span className="bg-white/10 px-2 py-0.5 rounded">🕉️ {personal.religion} ({personal.caste})</span>
          </div>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-24 h-28 object-cover rounded-xl border-2 border-white/80 shadow-md shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Astrological & Physical</h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Complexion:</span> <span className="font-semibold">{personal.complexion}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <span className="font-semibold">{personal.bloodGroup || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold">{personal.gotra || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold">{personal.manglik || 'Non-Manglik'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-semibold">{personal.motherTongue}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Birth Place:</span> <span className="font-semibold">{personal.placeOfBirth}</span></div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Family Information</h2>
          <div className="space-y-1.5 text-xs">
            <div><span className="text-slate-500">Father:</span> <span className="font-semibold">{family.fatherName}</span> ({family.fatherOccupation})</div>
            <div><span className="text-slate-500">Mother:</span> <span className="font-semibold">{family.motherName}</span> ({family.motherOccupation})</div>
            <div><span className="text-slate-500">Siblings:</span> <span className="font-semibold">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
            <div><span className="text-slate-500">Native Place:</span> <span className="font-semibold">{family.nativePlace || '-'}</span></div>
            <div><span className="text-slate-500">Family Status:</span> <span className="font-semibold">{family.familyStatus || 'Upper Middle Class'}</span></div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Education & Profession</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">{e.degree}</div>
              <div className="text-slate-500 text-[11px]">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">{ex.jobTitle}</div>
              <div className="text-slate-500 text-[11px]">{ex.company}</div>
              {ex.achievements && <div className="text-indigo-600 font-medium text-[11px]">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">About Myself & Expectations</h2>
          {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-2">{marriage.aboutMe}</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-slate-600"><strong className="text-slate-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-slate-200 text-center text-xs text-slate-600 avoid-break flex justify-center gap-6">
        {contact.phone && <span>Phone: <strong className="text-slate-900">{contact.phone}</strong></span>}
        {contact.email && <span>Email: <strong className="text-slate-900">{contact.email}</strong></span>}
        {contact.city && <span>Location: <strong className="text-slate-900">{contact.city}, {contact.state}</strong></span>}
      </div>
    </div>
  );
};
''')

# 8. PremiumRoyalBiodataTemplate.tsx
save('src/templates/biodata/PremiumRoyalBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumRoyalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const royalBlue = '#1e1b4b'; // Royal Midnight Indigo
  const gold = '#ca8a04'; // Royal Gold

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-[8px] border-double relative bg-[#fcfbfa]"
      style={{
        borderColor: royalBlue,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b-2 mb-6" style={{ borderColor: gold }}>
        <p className="text-xs uppercase tracking-widest font-cinzel font-bold text-amber-700">
          ❖ Royal Alliance Biodata ❖
        </p>
        <h1 className="text-3xl font-extrabold uppercase mt-1 font-cinzel" style={{ color: royalBlue }}>
          {personal.fullName || 'Rahul Sharma'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-600 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • Gotra: {personal.gotra || 'Kashyap'}
        </p>
      </div>

      <div className="flex gap-6 mb-6 items-start">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 p-1 bg-white shadow-md shrink-0" style={{ borderColor: gold }}>
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
        <div className="flex-1 bg-white p-4 rounded-xl border border-amber-200">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel" style={{ color: royalBlue }}>
            Personal Bio & Horoscope
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
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
          Education & Career History
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-white border border-amber-100">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-stone-600">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-lg bg-white border border-amber-100">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-stone-600">{ex.company}</div>
              {ex.achievements && <div className="text-[11px] font-semibold text-amber-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
          Family Lineage & Dignity
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-white p-3.5 rounded-xl border border-amber-100">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Ancestral Roots:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Status:</span> {family.familyStatus || 'Upper Middle Class'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>
            Expectations
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-1 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><strong style={{ color: royalBlue }}>Partner Preference:</strong> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-3 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1 font-cinzel pb-1 border-b" style={{ color: royalBlue, borderColor: gold }}>{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs text-stone-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t-2 text-center text-xs text-stone-700 avoid-break" style={{ borderColor: gold }}>
        <div className="font-bold uppercase font-cinzel mb-1" style={{ color: royalBlue }}>Contact Details</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 9. ModernMinimalBiodataTemplate.tsx
save('src/templates/biodata/ModernMinimalBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernMinimalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#0f172a'; // Slate 900
  const accent = customization.accentColor || '#0284c7'; // Sky 600

  return (
    <div
      className="document-page-sheet p-10 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Header Bar */}
      <div className="flex justify-between items-end border-b pb-6 mb-8" style={{ borderColor: '#e2e8f0' }}>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">Marriage Biodata</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1" style={{ color: primary }}>
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            {personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} at ${experience[0].company}` : '')}
          </p>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous" referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover rounded-xl shadow-sm border border-slate-200"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Personal & Horoscope & Contact */}
        <div className="col-span-5 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
              Personal Profile
            </h2>
            <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between"><span className="text-slate-500">DOB:</span> <span className="font-medium text-slate-900">{personal.dateOfBirth || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age:</span> <span className="font-medium text-slate-900">{personal.age || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Height:</span> <span className="font-medium text-slate-900">{personal.height || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Religion:</span> <span className="font-medium text-slate-900">{personal.religion || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Caste:</span> <span className="font-medium text-slate-900">{personal.caste || '-'}</span></div>
              {personal.gotra && <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-medium text-slate-900">{personal.gotra}</span></div>}
              {personal.manglik && <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-medium text-slate-900">{personal.manglik}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-medium text-slate-900">{personal.motherTongue || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Birth Place:</span> <span className="font-medium text-slate-900">{personal.placeOfBirth || '-'}</span></div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
              Contact & Location
            </h2>
            <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              {contact.phone && <div className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-900">{contact.phone}</span></div>}
              {contact.email && <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{contact.email}</span></div>}
              {contact.city && <div className="flex justify-between"><span className="text-slate-500">City:</span> <span className="font-medium text-slate-900">{contact.city}, {contact.state}</span></div>}
              {family.nativePlace && <div className="flex justify-between"><span className="text-slate-500">Native:</span> <span className="font-medium text-slate-900">{family.nativePlace}</span></div>}
            </div>
          </div>
        </div>

        {/* Right Column: Career, Education, Family, Expectations */}
        <div className="col-span-7 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
              Education & Career
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 pl-3 py-0.5" style={{ borderColor: accent }}>
                  <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                  <div className="text-xs text-slate-600">{edu.institute} • {edu.endYear}</div>
                </div>
              ))}
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-3 py-0.5" style={{ borderColor: primary }}>
                  <div className="font-bold text-slate-900 text-sm">{exp.jobTitle}</div>
                  <div className="text-xs text-slate-600">{exp.company} {exp.location ? `(${exp.location})` : ''}</div>
                  {exp.achievements && <div className="text-xs font-medium text-emerald-700 mt-0.5">{exp.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
              Family Background
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div><span className="text-xs text-slate-500 block">Father:</span> <span className="font-medium text-slate-900">{family.fatherName || '-'}</span></div>
              <div><span className="text-xs text-slate-500 block">Occupation:</span> <span className="text-slate-700">{family.fatherOccupation || '-'}</span></div>
              <div><span className="text-xs text-slate-500 block">Mother:</span> <span className="font-medium text-slate-900">{family.motherName || '-'}</span></div>
              <div><span className="text-xs text-slate-500 block">Occupation:</span> <span className="text-slate-700">{family.motherOccupation || '-'}</span></div>
              <div><span className="text-xs text-slate-500 block">Siblings:</span> <span className="text-slate-700">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
              <div><span className="text-xs text-slate-500 block">Family Type:</span> <span className="text-slate-700">{family.familyType || 'Nuclear'}</span></div>
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                About & Expectations
              </h2>
              <div className="text-sm space-y-2 text-slate-700">
                {marriage.aboutMe && <p className="leading-relaxed text-slate-800">{marriage.aboutMe}</p>}
                {marriage.partnerExpectations && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <span className="font-bold text-slate-900">Partner Preference: </span>
                    {marriage.partnerExpectations}
                  </div>
                )}
              </div>
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg">
                  {sec.items.map((it) => (
                    <div key={it.id}><span className="text-slate-500">{it.key}:</span> <span className="font-medium text-slate-800">{it.value}</span></div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-700">{sec.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
''')

# 10. PremiumDarkBiodataTemplate.tsx
save('src/templates/biodata/PremiumDarkBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumDarkBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = '#0f172a'; // Deep slate
  const gold = '#eab308'; // Gold accent

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Dark Regal Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Matrimonial Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white font-cinzel">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            {personal.religion || 'Hindu'} {personal.caste ? `• ${personal.caste}` : ''} {personal.subCaste ? `(${personal.subCaste})` : ''}
          </p>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img
            src={personal.profilePhoto}
            alt={personal.fullName}
            crossOrigin="anonymous" referrerPolicy="no-referrer"
            className="w-24 h-28 object-cover rounded-xl border-2 border-amber-400 shadow-md"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span className="text-amber-500">✦</span> Personal Details
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Date of Birth:</span> <span className="font-semibold text-slate-900">{personal.dateOfBirth || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Age:</span> <span className="font-semibold text-slate-900">{personal.age || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Height:</span> <span className="font-semibold text-slate-900">{personal.height || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Complexion:</span> <span className="font-semibold text-slate-900">{personal.complexion || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <span className="font-semibold text-slate-900">{personal.bloodGroup || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold text-slate-900">{personal.gotra || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold text-slate-900">{personal.manglik || 'No'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-semibold text-slate-900">{personal.motherTongue || '-'}</span></div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span className="text-amber-500">✦</span> Family Details
          </h2>
          <div className="space-y-1.5 text-xs">
            <div><span className="text-slate-500 block">Father:</span> <span className="font-semibold text-slate-900">{family.fatherName || '-'}</span> <span className="text-slate-600">({family.fatherOccupation || 'N/A'})</span></div>
            <div><span className="text-slate-500 block">Mother:</span> <span className="font-semibold text-slate-900">{family.motherName || '-'}</span> <span className="text-slate-600">({family.motherOccupation || 'N/A'})</span></div>
            <div><span className="text-slate-500">Siblings:</span> <span className="font-semibold text-slate-900">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
            <div><span className="text-slate-500">Native Place:</span> <span className="font-semibold text-slate-900">{family.nativePlace || '-'}</span></div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <span className="text-amber-500">✦</span> Education & Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {education.map((e) => (
            <div key={e.id} className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">{e.degree}</div>
              <div className="text-slate-600">{e.institute}</div>
              {e.score && <div className="text-slate-500 mt-0.5">Score: {e.score}</div>}
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">{ex.jobTitle}</div>
              <div className="text-slate-600">{ex.company}</div>
              {ex.achievements && <div className="text-amber-800 font-semibold mt-0.5">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-5 avoid-break bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span className="text-amber-500">✦</span> About Myself & Preferences
          </h2>
          {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-2">{marriage.aboutMe}</p>}
          {marriage.partnerExpectations && (
            <div className="text-xs">
              <span className="font-bold text-slate-900">Partner Expectations: </span>
              <span className="text-slate-700">{marriage.partnerExpectations}</span>
            </div>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> <span className="font-medium text-slate-900">{i.value}</span></div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-slate-200 text-center text-xs text-slate-600 avoid-break flex justify-center gap-6">
        {contact.phone && <span>Contact: <strong className="text-slate-900">{contact.phone}</strong></span>}
        {contact.email && <span>Email: <strong className="text-slate-900">{contact.email}</strong></span>}
        {contact.city && <span>Location: <strong className="text-slate-900">{contact.city}, {contact.state}</strong></span>}
      </div>
    </div>
  );
};
''')

# 11. PhotoFocusedBiodataTemplate.tsx
save('src/templates/biodata/PhotoFocusedBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PhotoFocusedBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#047857'; // Emerald 700
  const accent = customization.accentColor || '#10b981';

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Heroic Split Top: Large Photo Card & Identity */}
      <div className="flex gap-8 items-center bg-gradient-to-r from-emerald-50 to-teal-50/40 p-6 rounded-2xl border border-emerald-100 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto ? (
          <div className="w-40 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white shrink-0">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-32 h-36 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-800 shrink-0">
            {personal.fullName?.charAt(0) || 'B'}
          </div>
        )}
        <div className="flex-1">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Matrimonial Biodata</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-sm font-semibold text-emerald-800 mt-0.5">
            {personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} at ${experience[0].company}` : '')}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-medium">🎂 {personal.dateOfBirth || '-'} ({personal.age || '-'})</span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-medium">📏 {personal.height || '-'}</span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-medium">🕉️ {personal.religion || 'Hindu'} ({personal.caste || '-'})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1">
              Personal & Astrological
            </h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Complexion:</span> <span className="font-semibold">{personal.complexion || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <span className="font-semibold">{personal.bloodGroup || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-semibold">{personal.motherTongue || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold">{personal.gotra || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold">{personal.manglik || 'No'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Birth Place:</span> <span className="font-semibold">{personal.placeOfBirth || '-'}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1">
              Family Background
            </h2>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-slate-500">Father:</span> <span className="font-semibold">{family.fatherName}</span> <span className="text-slate-600">({family.fatherOccupation})</span></div>
              <div><span className="text-slate-500">Mother:</span> <span className="font-semibold">{family.motherName}</span> <span className="text-slate-600">({family.motherOccupation})</span></div>
              <div><span className="text-slate-500">Siblings:</span> <span className="font-semibold">{family.brothersCount || 0} Brother(s), {family.sistersCount || 0} Sister(s)</span></div>
              <div><span className="text-slate-500">Native Place:</span> <span className="font-semibold">{family.nativePlace || '-'}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1">
              Education & Career
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id} className="pb-1 border-b border-slate-200 last:border-0">
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institute} • {e.endYear}</div>
                </div>
              ))}
              {experience.map((ex) => (
                <div key={ex.id} className="pb-1 border-b border-slate-200 last:border-0">
                  <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                  <div className="text-slate-600">{ex.company}</div>
                  {ex.achievements && <div className="text-emerald-700 font-semibold">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 border-b border-slate-200 pb-1">
                About & Expectations
              </h2>
              {marriage.aboutMe && <p className="text-xs text-slate-700 mb-1 leading-relaxed">{marriage.aboutMe}</p>}
              {marriage.partnerExpectations && (
                <p className="text-xs text-slate-600"><strong className="text-slate-900">Partner Preference:</strong> {marriage.partnerExpectations}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> <span className="font-medium">{i.value}</span></div>)}
            </div>
          ) : <p className="text-xs text-slate-700">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-slate-200 text-center text-xs text-slate-600 avoid-break flex justify-center gap-6">
        {contact.phone && <span>Phone: <strong className="text-slate-900">{contact.phone}</strong></span>}
        {contact.email && <span>Email: <strong className="text-slate-900">{contact.email}</strong></span>}
        {contact.city && <span>Location: <strong className="text-slate-900">{contact.city}, {contact.state}</strong></span>}
      </div>
    </div>
  );
};
''')

# 12. TwoColumnBiodataTemplate.tsx
save('src/templates/biodata/TwoColumnBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const TwoColumnBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#4c1d95'; // Violet 900
  const accent = customization.accentColor || '#7c3aed';

  return (
    <div
      className="document-page-sheet font-jakarta text-slate-800 flex"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      {/* Left Column (Personal, Horoscope & Contact) */}
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
        <div>
          {customization.showPhoto !== false && personal.profilePhoto && (
            <div className="w-32 h-36 mx-auto rounded-xl overflow-hidden border-2 border-violet-400 mb-4 shadow-md">
              <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          )}

          <h2 className="text-sm font-bold uppercase tracking-wider text-violet-300 border-b border-violet-800 pb-1 mb-3">
            Personal Details
          </h2>
          <div className="space-y-2 text-xs text-slate-300 mb-6">
            <div><span className="text-slate-400 block">DOB:</span> <span className="text-white font-medium">{personal.dateOfBirth || '-'} ({personal.age || '-'})</span></div>
            <div><span className="text-slate-400 block">Height:</span> <span className="text-white font-medium">{personal.height || '-'}</span></div>
            <div><span className="text-slate-400 block">Complexion:</span> <span className="text-white font-medium">{personal.complexion || '-'}</span></div>
            <div><span className="text-slate-400 block">Religion & Caste:</span> <span className="text-white font-medium">{personal.religion} - {personal.caste}</span></div>
            <div><span className="text-slate-400 block">Gotra / Manglik:</span> <span className="text-white font-medium">{personal.gotra || '-'} / {personal.manglik || 'No'}</span></div>
            <div><span className="text-slate-400 block">Mother Tongue:</span> <span className="text-white font-medium">{personal.motherTongue || '-'}</span></div>
            <div><span className="text-slate-400 block">Place of Birth:</span> <span className="text-white font-medium">{personal.placeOfBirth || '-'}</span></div>
          </div>

          <h2 className="text-sm font-bold uppercase tracking-wider text-violet-300 border-b border-violet-800 pb-1 mb-3">
            Contact Info
          </h2>
          <div className="space-y-2 text-xs text-slate-300">
            {contact.phone && <div>✆ {contact.phone}</div>}
            {contact.email && <div>✉ {contact.email}</div>}
            {contact.city && <div>📍 {contact.city}, {contact.state}</div>}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800">
          Confidential Matrimonial Profile
        </div>
      </div>

      {/* Right Column (Career, Family, Expectations) */}
      <div className="w-2/3 p-8 bg-white flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-violet-900 pb-4 mb-6">
            <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">Matrimonial Profile</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              {personal.fullName || 'Full Name'}
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} • ${experience[0].company}` : '')}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2">
                Education & Career
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <div><span className="font-bold text-slate-900">{e.degree}</span> <span className="text-slate-500">({e.institute})</span></div>
                    <span className="text-slate-500">{e.endYear}</span>
                  </div>
                ))}
                {experience.map((ex) => (
                  <div key={ex.id} className="flex justify-between">
                    <div><span className="font-bold text-slate-900">{ex.jobTitle}</span> <span className="text-slate-600">at {ex.company}</span></div>
                    <span className="text-violet-700 font-semibold">{ex.achievements || ex.location}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2">
                Family Background
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div><span className="text-slate-500">Father:</span> <span className="font-semibold text-slate-800">{family.fatherName}</span></div>
                <div><span className="text-slate-500">Occupation:</span> <span className="text-slate-700">{family.fatherOccupation}</span></div>
                <div><span className="text-slate-500">Mother:</span> <span className="font-semibold text-slate-800">{family.motherName}</span></div>
                <div><span className="text-slate-500">Occupation:</span> <span className="text-slate-700">{family.motherOccupation}</span></div>
                <div><span className="text-slate-500">Siblings:</span> <span className="text-slate-700">{family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</span></div>
                <div><span className="text-slate-500">Native Place:</span> <span className="text-slate-700">{family.nativePlace || '-'}</span></div>
              </div>
            </div>

            {(marriage.aboutMe || marriage.partnerExpectations) && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2">
                  About & Partner Preferences
                </h2>
                {marriage.aboutMe && <p className="text-xs text-slate-700 leading-relaxed mb-2">{marriage.aboutMe}</p>}
                {marriage.partnerExpectations && (
                  <p className="text-xs text-slate-600 bg-violet-50/50 p-2.5 rounded border border-violet-100">
                    <strong className="text-violet-900">Partner Preference:</strong> {marriage.partnerExpectations}
                  </p>
                )}
              </div>
            )}

            {customSections.map((sec) => (
              <div key={sec.id}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-900 border-b border-slate-200 pb-1 mb-2">{sec.title}</h2>
                {sec.items ? (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded">
                    {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
                  </div>
                ) : <p className="text-xs text-slate-700">{sec.content}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
''')

# 13. ModernIndianBiodataTemplate.tsx
save('src/templates/biodata/ModernIndianBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernIndianBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#c2410c'; // Vibrant Saffron / Warm Orange-Amber
  const accent = customization.accentColor || '#b45309';

  return (
    <div
      className="document-page-sheet p-8 font-cormorant text-stone-900 border-t-8 bg-[#fffdf9]"
      style={{
        borderTopColor: primary,
        fontSize: customization.fontSize === 'sm' ? '14px' : customization.fontSize === 'lg' ? '17px' : '15px',
      }}
    >
      <div className="text-center pb-4 border-b border-orange-200 mb-6">
        <p className="text-sm font-semibold tracking-widest text-orange-700 uppercase">॥ श्री गणेशाय नमः ॥</p>
        <span className="text-xs uppercase tracking-widest text-orange-600 font-bold block mt-1">Matrimonial Profile</span>
        <h1 className="text-3xl font-bold tracking-wide mt-1 text-stone-900 font-cinzel">
          {personal.fullName || 'Full Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-600 mt-1">
          {personal.religion || 'Hindu'} • {personal.caste} {personal.subCaste ? `(${personal.subCaste})` : ''} • {personal.gotra ? `Gotra: ${personal.gotra}` : ''}
        </p>
      </div>

      <div className="flex gap-6 mb-6">
        {customization.showPhoto !== false && personal.profilePhoto && (
          <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-orange-300 shadow-sm shrink-0 p-1 bg-white">
            <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
        <div className="flex-1 bg-orange-50/40 p-4 rounded-xl border border-orange-200/60">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div><span className="font-semibold text-stone-700">Date of Birth:</span> {personal.dateOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Age:</span> {personal.age || '-'}</div>
            <div><span className="font-semibold text-stone-700">Height:</span> {personal.height || '-'}</div>
            <div><span className="font-semibold text-stone-700">Complexion:</span> {personal.complexion || '-'}</div>
            <div><span className="font-semibold text-stone-700">Mother Tongue:</span> {personal.motherTongue || '-'}</div>
            <div><span className="font-semibold text-stone-700">Manglik:</span> {personal.manglik || 'No'}</div>
            <div><span className="font-semibold text-stone-700">Birth Place:</span> {personal.placeOfBirth || '-'}</div>
            <div><span className="font-semibold text-stone-700">Birth Time:</span> {personal.timeOfBirth || '-'}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
          Education & Career
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {education.map((e) => (
            <div key={e.id} className="p-2 rounded bg-white border border-stone-200">
              <div className="font-bold text-stone-900">{e.degree}</div>
              <div className="text-xs text-stone-600">{e.institute} • {e.endYear}</div>
            </div>
          ))}
          {experience.map((ex) => (
            <div key={ex.id} className="p-2 rounded bg-white border border-stone-200">
              <div className="font-bold text-stone-900">{ex.jobTitle}</div>
              <div className="text-xs text-stone-600">{ex.company}</div>
              {ex.achievements && <div className="text-xs font-semibold text-orange-800">{ex.achievements}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-orange-50/40 p-3 rounded-xl border border-orange-200/50">
          <div><span className="font-semibold text-stone-700">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
          <div><span className="font-semibold text-stone-700">Brothers:</span> {family.brothersCount || 0} {family.marriedBrothers ? `(${family.marriedBrothers})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Sisters:</span> {family.sistersCount || 0} {family.marriedSisters ? `(${family.marriedSisters})` : ''}</div>
          <div><span className="font-semibold text-stone-700">Native Place:</span> {family.nativePlace || '-'}</div>
          <div><span className="font-semibold text-stone-700">Family Type:</span> {family.familyType || 'Nuclear'}</div>
        </div>
      </div>

      {(marriage.aboutMe || marriage.partnerExpectations) && (
        <div className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">
            About & Expectations
          </h2>
          {marriage.aboutMe && <p className="text-xs text-stone-800 italic mb-2 leading-relaxed">"{marriage.aboutMe}"</p>}
          {marriage.partnerExpectations && (
            <p className="text-xs text-stone-700"><span className="font-semibold text-orange-950">Partner Preference:</span> {marriage.partnerExpectations}</p>
          )}
        </div>
      )}

      {customSections.map((sec) => (
        <div key={sec.id} className="mb-4 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-900 border-b border-orange-200 pb-1 mb-2 font-cinzel">{sec.title}</h2>
          {sec.items ? (
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border border-stone-200">
              {sec.items.map((i) => <div key={i.id}><span className="font-semibold text-stone-700">{i.key}:</span> {i.value}</div>)}
            </div>
          ) : <p className="text-xs">{sec.content}</p>}
        </div>
      ))}

      <div className="mt-5 pt-3 border-t border-orange-200 text-center text-xs text-stone-700 avoid-break">
        <div className="font-bold text-orange-950 uppercase font-cinzel mb-1">Contact & Address</div>
        <div className="flex justify-center gap-6">
          {contact.phone && <span>✆ {contact.phone}</span>}
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.city && <span>📍 {contact.city}, {contact.state}</span>}
        </div>
      </div>
    </div>
  );
};
''')

# 14. MinimalProfessionalBiodataTemplate.tsx
save('src/templates/biodata/MinimalProfessionalBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const MinimalProfessionalBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customSections, customization } = data;
  const primary = customization.primaryColor || '#1e293b'; // Slate 800
  const accent = customization.accentColor || '#3b82f6';

  return (
    <div
      className="document-page-sheet p-8 font-jakarta text-slate-800 bg-white"
      style={{
        fontSize: customization.fontSize === 'sm' ? '13px' : customization.fontSize === 'lg' ? '16px' : '14px',
      }}
    >
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">Matrimonial Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            {personal.fullName || 'Full Name'}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            {personal.professionalTitle || (experience[0]?.jobTitle ? `${experience[0].jobTitle} at ${experience[0].company}` : '')}
          </p>
        </div>
        {customization.showPhoto !== false && personal.profilePhoto && (
          <img src={personal.profilePhoto} alt={personal.fullName} crossOrigin="anonymous" referrerPolicy="no-referrer" className="w-24 h-28 object-cover rounded-lg shadow-sm border border-slate-200" />
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Personal Bio
            </h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">DOB:</span> <span className="font-semibold">{personal.dateOfBirth}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age / Height:</span> <span className="font-semibold">{personal.age} / {personal.height}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Religion/Caste:</span> <span className="font-semibold">{personal.religion} - {personal.caste}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gotra:</span> <span className="font-semibold">{personal.gotra || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Manglik:</span> <span className="font-semibold">{personal.manglik || 'No'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mother Tongue:</span> <span className="font-semibold">{personal.motherTongue}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Contact & Address
            </h2>
            <div className="space-y-1.5 text-xs">
              {contact.phone && <div>✆ {contact.phone}</div>}
              {contact.email && <div>✉ {contact.email}</div>}
              {contact.city && <div>📍 {contact.city}, {contact.state}</div>}
            </div>
          </div>
        </div>

        <div className="col-span-7 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Education & Experience
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institute} • {e.endYear}</div>
                </div>
              ))}
              {experience.map((ex) => (
                <div key={ex.id}>
                  <div className="font-bold text-slate-900">{ex.jobTitle}</div>
                  <div className="text-slate-600">{ex.company}</div>
                  {ex.achievements && <div className="text-blue-700 font-semibold">{ex.achievements}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Family Details
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Father:</span> {family.fatherName} ({family.fatherOccupation})</div>
              <div><span className="text-slate-500">Mother:</span> {family.motherName} ({family.motherOccupation})</div>
              <div><span className="text-slate-500">Siblings:</span> {family.brothersCount || 0} Bro, {family.sistersCount || 0} Sis</div>
              <div><span className="text-slate-500">Native:</span> {family.nativePlace || '-'}</div>
            </div>
          </div>

          {(marriage.aboutMe || marriage.partnerExpectations) && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                About & Expectations
              </h2>
              {marriage.aboutMe && <p className="text-xs text-slate-700 mb-2">{marriage.aboutMe}</p>}
              {marriage.partnerExpectations && <p className="text-xs text-slate-600"><strong>Expectations:</strong> {marriage.partnerExpectations}</p>}
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">{sec.title}</h2>
              {sec.items ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sec.items.map((i) => <div key={i.id}><span className="text-slate-500">{i.key}:</span> {i.value}</div>)}
                </div>
              ) : <p className="text-xs text-slate-700">{sec.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
''')

# 15. RoyalHinduBiodataTemplate.tsx
save('src/templates/biodata/RoyalHinduBiodataTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';
import {
  User,
  Users,
  GraduationCap,
  Heart,
  UserCheck,
  Quote,
} from 'lucide-react';
import {
  GaneshaVector,
  LotusVector,
  OmLotusVector,
  CornerFiligreeVector,
  DiyaLampVector,
} from './decorativeAssets';

export const RoyalHinduBiodataTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, education, experience, family, marriage, customization } = data;
  const maroon = customization.primaryColor || '#7a1414'; // Traditional Deep Maroon
  const gold = customization.accentColor || '#b45309'; // Warm Royal Gold / Amber
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[11px]' : customization.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  // Format siblings info cleanly
  const brothers = family.brothersCount
    ? `${family.brothersCount} ${family.marriedBrothers ? `(${family.marriedBrothers})` : ''}`.trim()
    : null;
  const sisters = family.sistersCount
    ? `${family.sistersCount} ${family.marriedSisters ? `(${family.marriedSisters})` : ''}`.trim()
    : null;

  // Personal vitals list (only non-empty items)
  const personalItems: { label: string; value?: string }[] = [
    { label: 'Name', value: personal.fullName },
    { label: 'Date of Birth', value: personal.dateOfBirth },
    { label: 'Time of Birth', value: personal.timeOfBirth },
    { label: 'Birth Place', value: personal.placeOfBirth },
    { label: 'Gotra', value: personal.gotra },
    { label: 'Height', value: personal.height },
    { label: 'Complexion', value: personal.complexion },
    { label: 'Marital Status', value: personal.maritalStatus },
    { label: 'Manglik', value: personal.manglik },
    {
      label: 'Rashi / Nakshatra',
      value: [personal.rashi, personal.nakshatra].filter(Boolean).join(' / '),
    },
  ].filter((item) => item.value && item.value.trim() !== '');

  // Family details list
  const familyItems: { label: string; value?: string }[] = [
    { label: "Father's Name", value: family.fatherName },
    { label: 'Occupation', value: family.fatherOccupation },
    { label: "Mother's Name", value: family.motherName },
    { label: 'Occupation', value: family.motherOccupation },
    { label: 'Brother(s)', value: brothers || undefined },
    { label: 'Sister(s)', value: sisters || undefined },
    { label: 'Family Type', value: family.familyType },
    { label: 'Family Values', value: family.familyStatus },
  ].filter((item) => item.value && item.value.trim() !== '');

  // Education & Career combined list
  const eduCareerItems: { label: string; value?: string }[] = [
    { label: 'Education', value: education[0]?.degree },
    { label: 'College / University', value: education[0]?.institute },
    { label: 'Occupation', value: experience[0]?.jobTitle || personal.professionalTitle },
    { label: 'Company', value: experience[0]?.company },
    { label: 'Work Location', value: experience[0]?.location || contact.city },
  ].filter((item) => item.value && item.value.trim() !== '');

  // Lifestyle list
  const lifestyleItems: { label: string; value?: string }[] = [
    { label: 'Diet', value: marriage.lifestyle || 'Vegetarian' },
    { label: 'Smoke / Drink', value: 'No / No' },
    { label: 'Hobbies', value: marriage.hobbies },
  ].filter((item) => item.value && item.value.trim() !== '');

  // Partner preference list
  const partnerItems: { label: string; value?: string }[] = [
    { label: 'Age', value: '25 – 30 Years' },
    { label: 'Height', value: "5'4\\" and above" },
    { label: 'Education', value: 'Graduate and above' },
    { label: 'Profession', value: 'Working Professional' },
    { label: 'Location', value: contact.state || contact.country || 'Anywhere in India' },
    { label: 'Other Expectations', value: marriage.partnerExpectations },
  ].filter((item) => item.value && item.value.trim() !== '');

  return (
    <div
      className={`document-page-sheet relative bg-[#fffdf9] text-zinc-900 shadow-sm flex flex-col justify-between overflow-hidden ${fontClass} ${baseFontSize}`}
      style={{
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '16mm 14mm 12mm 14mm',
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
        size={54}
        color={gold}
        className="absolute top-3 left-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="top-right"
        size={54}
        color={gold}
        className="absolute top-3 right-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="bottom-left"
        size={54}
        color={gold}
        className="absolute bottom-3 left-3 pointer-events-none"
      />
      <CornerFiligreeVector
        position="bottom-right"
        size={54}
        color={gold}
        className="absolute bottom-3 right-3 pointer-events-none"
      />

      {/* Hanging Brass Diya Lamp on the Right */}
      <div className="absolute top-6 right-8 pointer-events-none">
        <DiyaLampVector size={22} color={gold} />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        {/* Left Side: Circular Photo with Concentric Rings */}
        <div className="relative shrink-0 w-36 h-36">
          {customization.showPhoto !== false && personal.profilePhoto ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Outer Golden Concentric Ring */}
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: gold }}
              />
              <div
                className="absolute inset-1.5 rounded-full border"
                style={{ borderColor: `${gold}66` }}
              />
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-md bg-amber-50">
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center text-amber-700 bg-amber-50" style={{ borderColor: gold }}>
              <User size={36} />
            </div>
          )}
        </div>

        {/* Right Side: Royal Hindu Title */}
        <div className="flex-1 text-center pr-6">
          <div className="flex justify-center mb-1">
            <LotusVector size={36} color={gold} />
          </div>
          <h1
            className="text-[26px] font-bold tracking-[0.14em] uppercase leading-tight font-serif"
            style={{ color: maroon }}
          >
            HINDU MARRIAGE BIODATA
          </h1>
          {/* Subtitle with decorative diamond line */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-12 h-px" style={{ backgroundColor: gold }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
            <span
              className="text-xs font-semibold tracking-wider font-serif uppercase italic"
              style={{ color: gold }}
            >
              Looking for a Life Partner
            </span>
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
            <div className="w-12 h-px" style={{ backgroundColor: gold }} />
          </div>
        </div>
      </div>

      {/* Main Content: Two Balanced Columns */}
      <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-3 flex-1 mb-2">
        {/* LEFT COLUMN */}
        <div className="space-y-3.5 flex flex-col justify-start">
          {/* Personal Details */}
          {personalItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-2" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <User size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  PERSONAL DETAILS
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {personalItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[105px_12px_1fr] items-baseline leading-snug">
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
              <div className="flex items-center gap-2 pb-1 border-b mb-2" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Users size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  FAMILY DETAILS
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {familyItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[105px_12px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Matrimonial Quote Block Card */}
          <div
            className="p-3 rounded-lg border relative mt-auto"
            style={{
              backgroundColor: '#fff9f0',
              borderColor: `${gold}66`,
            }}
          >
            <Quote size={16} className="absolute top-2 left-2 opacity-30" style={{ color: maroon }} />
            <p className="text-[11.5px] italic text-zinc-800 text-center px-3 leading-relaxed font-serif">
              "{marriage.aboutMe || 'A simple person with strong moral values, looking for a compatible and understanding partner to build a joyful, harmonious life together.'}"
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-3.5 flex flex-col justify-start">
          {/* About Me */}
          {marriage.aboutMe && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-1.5" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <User size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  ABOUT ME
                </h2>
              </div>
              <p className="text-[11.5px] text-zinc-800 leading-relaxed pl-1 text-justify">
                {marriage.aboutMe}
              </p>
            </section>
          )}

          {/* Education & Career */}
          {eduCareerItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-2" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <GraduationCap size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  EDUCATION & CAREER
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {eduCareerItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[115px_12px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Lifestyle */}
          {lifestyleItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-2" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <Heart size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  LIFESTYLE
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {lifestyleItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[115px_12px_1fr] items-baseline leading-snug">
                    <span className="font-semibold text-zinc-700">{item.label}</span>
                    <span className="text-zinc-500 font-bold">:</span>
                    <span className="font-medium text-zinc-900 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Partner Preference */}
          {partnerItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-1 border-b mb-2" style={{ borderColor: `${maroon}44` }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: maroon }}
                >
                  <UserCheck size={12} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-serif" style={{ color: maroon }}>
                  PARTNER PREFERENCE
                </h2>
              </div>
              <div className="space-y-1 pl-1">
                {partnerItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[115px_12px_1fr] items-baseline leading-snug">
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
        className="relative z-10 rounded-lg p-2.5 flex items-center justify-between border mt-auto"
        style={{
          backgroundColor: '#faede1',
          borderColor: `${gold}55`,
        }}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <GaneshaVector size={38} color={maroon} variant="line" />
        </div>
        <div className="text-center px-4">
          <p className="text-[11px] font-semibold text-zinc-800 font-serif">
            Thank you for visiting my profile.
          </p>
          <p className="text-[10px] text-zinc-600 italic">
            Looking forward to a meaningful, blessed connection.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5 text-zinc-400">
            <div className="w-6 h-px bg-amber-400" />
            <Heart size={8} className="text-rose-700 fill-rose-700" />
            <div className="w-6 h-px bg-amber-400" />
          </div>
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <OmLotusVector size={38} color={maroon} />
        </div>
      </div>
    </div>
  );
};
''')

print('Wrote biodata part 1!')
