import os

def save(file_path, content):
    full_path = os.path.abspath(file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Wrote:', file_path)

# 1. ATSFriendlyCoverLetterTemplate
save('src/templates/coverletter/ATSFriendlyCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ATSFriendlyCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[14.5px]' : 'text-[13px]';

  const sections = coverLetter?.visibleSections || {
    header: true,
    contact: true,
    date: true,
    recipient: true,
    subject: true,
    greeting: true,
    introduction: true,
    bodyExperience: true,
    bodySkills: true,
    bodyMotivation: true,
    closing: true,
    signature: true,
  };

  const recipientLocation = [coverLetter?.companyAddress, coverLetter?.companyCity, coverLetter?.companyState]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`document-page-sheet p-12 bg-white text-black font-sans leading-relaxed relative ${baseFontSize}`}
    >
      {/* ATS Compliant Simple Top Block */}
      {sections.header !== false && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-normal text-black">
            {personal.fullName || 'FULL NAME'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-medium text-gray-700 mt-0.5">{personal.professionalTitle}</p>
          )}
          {sections.contact !== false && (
            <div className="text-xs text-gray-700 mt-1 space-y-0.5">
              <div>
                {[contact.phone, contact.email, contact.city ? `${contact.city}${contact.state ? `, ${contact.state}` : ''}` : '']
                  .filter(Boolean)
                  .join(' | ')}
              </div>
              {contact.linkedin && <div>{contact.linkedin}</div>}
              {contact.portfolio && <div>{contact.portfolio}</div>}
            </div>
          )}
        </div>
      )}

      {/* Date */}
      {sections.date !== false && coverLetter?.applicationDate && (
        <div className="mb-4 text-xs font-normal text-black">
          {coverLetter.applicationDate}
        </div>
      )}

      {/* Recipient Details */}
      {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) && (
        <div className="mb-5 text-xs text-black space-y-0.5">
          {coverLetter?.hiringManager && <div className="font-semibold">{coverLetter.hiringManager}</div>}
          {coverLetter?.companyName && <div>{coverLetter.companyName}</div>}
          {recipientLocation && <div>{recipientLocation}</div>}
        </div>
      )}

      {/* Subject Line */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-4 text-xs font-bold text-black uppercase">
          RE: {coverLetter.subject}
        </div>
      )}

      {/* Greeting */}
      {sections.greeting !== false && (
        <div className="mb-4 text-xs font-bold text-black">
          {coverLetter?.greeting || 'Dear Hiring Manager,'}
        </div>
      )}

      {/* Machine-Readable Body Paragraphs */}
      <div className="space-y-4 text-xs text-black">
        {sections.introduction !== false && coverLetter?.introduction && (
          <p>{coverLetter.introduction}</p>
        )}
        {sections.bodyExperience !== false && coverLetter?.bodyExperience && (
          <p>{coverLetter.bodyExperience}</p>
        )}
        {sections.bodySkills !== false && coverLetter?.bodySkills && (
          <p>{coverLetter.bodySkills}</p>
        )}
        {sections.bodyMotivation !== false && coverLetter?.bodyMotivation && (
          <p>{coverLetter.bodyMotivation}</p>
        )}
        {sections.closing !== false && coverLetter?.closing && (
          <p>{coverLetter.closing}</p>
        )}
      </div>

      {/* Closing & Typed Name (ATS Safe: Pure Text) */}
      {sections.signature !== false && (
        <div className="mt-6 avoid-break space-y-3">
          <div className="text-xs text-black">{coverLetter?.signoff || 'Sincerely,'}</div>
          <div className="text-xs font-bold text-black">{personal.fullName || 'Applicant Name'}</div>
        </div>
      )}
    </div>
  );
};
''')

# 2. ClassicProfessionalCoverLetterTemplate
save('src/templates/coverletter/ClassicProfessionalCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ClassicProfessionalCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const primary = customization.primaryColor || '#1e293b';
  const accent = customization.accentColor || '#334155';
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[14.5px]' : 'text-[13px]';

  const sections = coverLetter?.visibleSections || {
    header: true,
    contact: true,
    date: true,
    recipient: true,
    subject: true,
    greeting: true,
    introduction: true,
    bodyExperience: true,
    bodySkills: true,
    bodyMotivation: true,
    closing: true,
    signature: true,
  };

  const recipientLocation = [coverLetter?.companyAddress, coverLetter?.companyCity, coverLetter?.companyState]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`document-page-sheet p-12 bg-white text-slate-900 shadow-sm relative ${baseFontSize} ${fontClass}`}
    >
      {/* 1. Header & Contact Information */}
      {sections.header !== false && (
        <div className="border-b-2 pb-5 mb-6 text-center" style={{ borderColor: primary }}>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-slate-950">
            {personal.fullName || 'FULL NAME'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-semibold tracking-wider uppercase text-slate-600 mt-1">
              {personal.professionalTitle}
            </p>
          )}
          {sections.contact !== false && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-600">
              {contact.phone && <span>✆ {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.city && <span>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.portfolio && <span>🌐 {contact.portfolio}</span>}
            </div>
          )}
        </div>
      )}

      {/* 2. Date */}
      {sections.date !== false && coverLetter?.applicationDate && (
        <div className="mb-5 text-xs font-medium text-slate-600">
          {coverLetter.applicationDate}
        </div>
      )}

      {/* 3. Recipient Section */}
      {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) && (
        <div className="mb-5 text-xs text-slate-800 space-y-0.5">
          {coverLetter?.hiringManager && <div className="font-bold text-slate-900">{coverLetter.hiringManager}</div>}
          {coverLetter?.companyName && <div className="font-semibold text-slate-800">{coverLetter.companyName}</div>}
          {recipientLocation && <div className="text-slate-600">{recipientLocation}</div>}
        </div>
      )}

      {/* 4. Subject Line */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-4 text-xs font-bold uppercase tracking-wide" style={{ color: primary }}>
          <span className="underline underline-offset-4 font-extrabold">{coverLetter.subject}</span>
        </div>
      )}

      {/* 5. Greeting */}
      {sections.greeting !== false && (
        <div className="mb-4 text-xs font-bold text-slate-900">
          {coverLetter?.greeting || 'Dear Hiring Manager,'}
        </div>
      )}

      {/* 6. Body Paragraphs */}
      <div className="space-y-3.5 text-slate-800 leading-relaxed text-justify">
        {sections.introduction !== false && coverLetter?.introduction && (
          <p>{coverLetter.introduction}</p>
        )}
        {sections.bodyExperience !== false && coverLetter?.bodyExperience && (
          <p>{coverLetter.bodyExperience}</p>
        )}
        {sections.bodySkills !== false && coverLetter?.bodySkills && (
          <p>{coverLetter.bodySkills}</p>
        )}
        {sections.bodyMotivation !== false && coverLetter?.bodyMotivation && (
          <p>{coverLetter.bodyMotivation}</p>
        )}
        {sections.closing !== false && coverLetter?.closing && (
          <p>{coverLetter.closing}</p>
        )}
      </div>

      {/* 7. Signoff and Signature */}
      {sections.signature !== false && (
        <div className="mt-7 avoid-break space-y-2">
          <div className="text-xs text-slate-800">{coverLetter?.signoff || 'Sincerely,'}</div>
          {coverLetter?.signatureType === 'image' && coverLetter.signatureImage ? (
            <div className="w-36 h-12 my-1 overflow-hidden">
              <img
                src={coverLetter.signatureImage}
                alt="Signature"
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-6 font-serif italic text-base text-slate-700">
              {personal.fullName || 'Rahul Sharma'}
            </div>
          )}
          <div className="text-xs font-bold text-slate-900">
            {personal.fullName || 'Rahul Sharma'}
          </div>
          {personal.professionalTitle && (
            <div className="text-[11px] text-slate-500 font-medium">{personal.professionalTitle}</div>
          )}
        </div>
      )}
    </div>
  );
};
''')

# 3. ClassicSerifCoverLetterTemplate
save('src/templates/coverletter/ClassicSerifCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ClassicSerifCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  const defaultDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const letterText =
    coverLetter?.letterBody ||
    `I am writing to express my sincere interest in the position of ${coverLetter?.reference ? coverLetter.reference : 'Senior Associate'} with ${coverLetter?.companyName || 'your esteemed firm'}. With a proven track record of institutional commitment, analytical rigor, and collaborative execution, I welcome the opportunity to contribute meaningfully to your established practice.\\n\\nThroughout my professional tenure, I have focused on delivering enduring value through meticulous problem diagnosis and disciplined execution. In my previous position, I had the privilege of managing client engagements that required continuous stakeholder alignment, financial modeling, and risk mitigation. The foundational principles of my career have remained constant: uncompromising professional ethics, thorough preparation, and clear, respectful communication.\\n\\nYour firm's storied reputation and consistent commitment to excellence have long garnered my respect. I am enthusiastic about the prospect of applying my knowledge, dedication, and professional ethos within your collaborative environment.\\n\\nI should be grateful for the opportunity to discuss my qualifications further at a convenient time. Thank you for your courtesy, consideration, and review of my application materials.`;

  const paragraphs = letterText.split('\\n\\n').filter((p) => p.trim().length > 0);

  return (
    <div
      className={`document-page-sheet flex flex-col justify-between p-14 bg-white text-stone-900 shadow-sm ${baseFontSize}`}
    >
      <div>
        {/* Centered Classic Letterhead */}
        <div className="text-center pb-6 mb-8 border-b border-stone-800">
          <h1 className={`text-3xl font-extrabold uppercase tracking-widest text-stone-950 ${fontClass}`}>
            {personal.fullName || 'ELEANOR CHANDLER'}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-600 mt-1 font-sans">
            {personal.professionalTitle || 'Senior Legal Counsel & Corporate Governance'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-stone-600 font-sans">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            {contact.city && <span>• {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
            {contact.linkedin && <span>• {contact.linkedin}</span>}
          </div>
        </div>

        {/* Date & Recipient Details */}
        <div className="mb-6 font-sans text-xs space-y-1">
          <p className="text-stone-500 mb-3">{coverLetter?.date || defaultDate}</p>
          <p className="font-bold text-stone-900 text-sm">{coverLetter?.recipientName || 'Managing Partners & Hiring Committee'}</p>
          {coverLetter?.recipientTitle && <p className="text-stone-600">{coverLetter.recipientTitle}</p>}
          <p className="font-semibold text-stone-800">{coverLetter?.companyName || 'Chandler & Associates LLP'}</p>
          {coverLetter?.companyAddress && <p className="text-stone-500">{coverLetter.companyAddress}</p>}
        </div>

        {/* Reference */}
        {coverLetter?.reference && (
          <div className="mb-5 pb-1 border-b border-stone-300">
            <span className="font-bold text-stone-900 text-xs font-sans">
              IN RE: {coverLetter.reference}
            </span>
          </div>
        )}

        {/* Salutation */}
        <div className="mb-4">
          <p className="font-bold text-stone-900 text-sm font-sans">
            {coverLetter?.salutation || `Dear ${coverLetter?.recipientName ? coverLetter.recipientName : 'Hiring Committee'},`}
          </p>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4 text-stone-800 leading-relaxed font-sans text-justify">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Formal Closing */}
      <div className="pt-8 border-t border-stone-200 font-sans mt-8">
        <p className="text-xs text-stone-600 mb-4">{coverLetter?.signOff || 'Yours sincerely,'}</p>
        <p className={`font-bold text-base text-stone-950 ${fontClass}`}>{personal.fullName || 'Eleanor Chandler'}</p>
        {personal.professionalTitle && (
          <p className="text-xs text-stone-500 mt-0.5">{personal.professionalTitle}</p>
        )}
      </div>
    </div>
  );
};
''')

# 5. CreativeProfessionalCoverLetterTemplate
save('src/templates/coverletter/CreativeProfessionalCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const CreativeProfessionalCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const creativeColor = customization.primaryColor || '#c2410c'; // Terracotta / Sienna
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-playfair';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  const sections = coverLetter?.visibleSections || {
    header: true,
    contact: true,
    date: true,
    recipient: true,
    subject: true,
    greeting: true,
    introduction: true,
    bodyExperience: true,
    bodySkills: true,
    bodyMotivation: true,
    closing: true,
    signature: true,
  };

  const recipientLocation = [coverLetter?.companyAddress, coverLetter?.companyCity, coverLetter?.companyState]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`document-page-sheet p-12 bg-[#fdfbf9] text-stone-900 shadow-sm relative ${baseFontSize}`}
    >
      {/* Left Vertical Accent Line */}
      <div className="absolute top-0 left-0 bottom-0 w-2.5 pointer-events-none" style={{ backgroundColor: creativeColor }} />

      {/* Expressive Header */}
      {sections.header !== false && (
        <div className="pb-6 mb-7 border-b border-stone-200">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-orange-800 block mb-1">
            Creative Portfolio & Application
          </span>
          <h1 className={`text-4xl font-black tracking-tight text-stone-900 ${fontClass}`}>
            {personal.fullName || 'CREATIVE DIRECTOR'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-xs font-sans font-semibold text-stone-600 mt-1 uppercase tracking-wider">
              {personal.professionalTitle}
            </p>
          )}
          {sections.contact !== false && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-xs font-sans text-stone-600">
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.phone && <span>✆ {contact.phone}</span>}
              {contact.city && <span>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
              {contact.portfolio && <span>🌐 {contact.portfolio}</span>}
            </div>
          )}
        </div>
      )}

      {/* Date & Recipient */}
      <div className="flex justify-between items-start mb-6 text-xs font-sans text-stone-700">
        {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) ? (
          <div className="space-y-0.5">
            {coverLetter?.hiringManager && <div className="font-bold text-stone-900">{coverLetter.hiringManager}</div>}
            {coverLetter?.companyName && <div className="font-semibold text-orange-950">{coverLetter.companyName}</div>}
            {recipientLocation && <div className="text-stone-500 text-[11px]">{recipientLocation}</div>}
          </div>
        ) : <div />}
        {sections.date !== false && coverLetter?.applicationDate && (
          <div className="font-medium text-stone-500">{coverLetter.applicationDate}</div>
        )}
      </div>

      {/* Subject Line */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-5 font-sans text-xs font-extrabold uppercase tracking-wide text-orange-950 border-l-4 pl-3" style={{ borderColor: creativeColor }}>
          {coverLetter.subject}
        </div>
      )}

      {/* Greeting */}
      {sections.greeting !== false && (
        <div className="mb-4 text-xs font-bold text-stone-900 font-sans">
          {coverLetter?.greeting || 'Dear Creative Team,'}
        </div>
      )}

      {/* Body with Expressive Readability */}
      <div className="space-y-4 text-stone-800 leading-relaxed font-sans text-justify text-xs">
        {sections.introduction !== false && coverLetter?.introduction && (
          <p>{coverLetter.introduction}</p>
        )}
        {sections.bodyExperience !== false && coverLetter?.bodyExperience && (
          <p>{coverLetter.bodyExperience}</p>
        )}
        {sections.bodySkills !== false && coverLetter?.bodySkills && (
          <p>{coverLetter.bodySkills}</p>
        )}
        {sections.bodyMotivation !== false && coverLetter?.bodyMotivation && (
          <p>{coverLetter.bodyMotivation}</p>
        )}
        {sections.closing !== false && coverLetter?.closing && (
          <p>{coverLetter.closing}</p>
        )}
      </div>

      {/* Signature */}
      {sections.signature !== false && (
        <div className="mt-8 avoid-break space-y-2 font-sans">
          <div className="text-xs text-stone-700">{coverLetter?.signoff || 'Warm regards,'}</div>
          {coverLetter?.signatureType === 'image' && coverLetter.signatureImage ? (
            <div className="w-32 h-10 my-1 overflow-hidden">
              <img
                src={coverLetter.signatureImage}
                alt="Signature"
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-6 font-serif italic text-lg text-stone-800">
              {personal.fullName || 'Candidate Name'}
            </div>
          )}
          <div className="text-xs font-bold text-stone-900">{personal.fullName || 'Candidate Name'}</div>
        </div>
      )}
    </div>
  );
};
''')

# 6. ExecutiveCoverLetterTemplate
save('src/templates/coverletter/ExecutiveCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ExecutiveCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const primary = customization.primaryColor || '#0f172a'; // Deep Executive Onyx
  const accent = customization.accentColor || '#64748b'; // Slate Accent
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-cormorant';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13.5px]';

  const sections = coverLetter?.visibleSections || {
    header: true,
    contact: true,
    date: true,
    recipient: true,
    subject: true,
    greeting: true,
    introduction: true,
    bodyExperience: true,
    bodySkills: true,
    bodyMotivation: true,
    closing: true,
    signature: true,
  };

  const recipientLocation = [coverLetter?.companyAddress, coverLetter?.companyCity, coverLetter?.companyState]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`document-page-sheet p-12 bg-[#faf9f6] text-stone-900 shadow-sm relative ${baseFontSize}`}
    >
      {/* Executive Letterhead */}
      {sections.header !== false && (
        <div className="border-b-2 border-stone-800 pb-6 mb-7">
          <div className="flex justify-between items-end">
            <div>
              <h1 className={`text-3xl font-extrabold uppercase tracking-widest text-stone-950 ${fontClass}`}>
                {personal.fullName || 'EXECUTIVE LEADER'}
              </h1>
              {personal.professionalTitle && (
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-600 mt-1 font-sans">
                  {personal.professionalTitle}
                </p>
              )}
            </div>
            {sections.contact !== false && (
              <div className="text-right text-xs font-sans text-stone-600 space-y-0.5">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.city && <div>{contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
                {contact.linkedin && <div>{contact.linkedin}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date & Recipient Grid */}
      <div className="grid grid-cols-2 gap-4 mb-7 text-xs font-sans">
        {sections.date !== false && coverLetter?.applicationDate && (
          <div className="text-stone-500 font-medium">
            Date: <strong className="text-stone-900">{coverLetter.applicationDate}</strong>
          </div>
        )}
        {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) && (
          <div className="text-right space-y-0.5 ml-auto">
            {coverLetter?.hiringManager && <div className="font-bold text-stone-900">{coverLetter.hiringManager}</div>}
            {coverLetter?.companyName && <div className="font-semibold text-stone-800">{coverLetter.companyName}</div>}
            {recipientLocation && <div className="text-stone-600 text-[11px]">{recipientLocation}</div>}
          </div>
        )}
      </div>

      {/* Subject Line */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-6 font-sans text-xs font-extrabold uppercase tracking-wider text-stone-900 border-l-2 border-stone-800 pl-3">
          {coverLetter.subject}
        </div>
      )}

      {/* Greeting */}
      {sections.greeting !== false && (
        <div className="mb-4 text-sm font-bold text-stone-900 font-sans">
          {coverLetter?.greeting || 'Dear Hiring Committee,'}
        </div>
      )}

      {/* Executive Body Typography */}
      <div className="space-y-4 text-stone-800 leading-relaxed font-sans text-justify">
        {sections.introduction !== false && coverLetter?.introduction && (
          <p>{coverLetter.introduction}</p>
        )}
        {sections.bodyExperience !== false && coverLetter?.bodyExperience && (
          <p>{coverLetter.bodyExperience}</p>
        )}
        {sections.bodySkills !== false && coverLetter?.bodySkills && (
          <p>{coverLetter.bodySkills}</p>
        )}
        {sections.bodyMotivation !== false && coverLetter?.bodyMotivation && (
          <p>{coverLetter.bodyMotivation}</p>
        )}
        {sections.closing !== false && coverLetter?.closing && (
          <p>{coverLetter.closing}</p>
        )}
      </div>

      {/* Executive Signature */}
      {sections.signature !== false && (
        <div className="mt-8 avoid-break space-y-2 font-sans">
          <div className="text-xs text-stone-700">{coverLetter?.signoff || 'Respectfully,'}</div>
          {coverLetter?.signatureType === 'image' && coverLetter.signatureImage ? (
            <div className="w-36 h-12 my-1 overflow-hidden">
              <img
                src={coverLetter.signatureImage}
                alt="Signature"
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-7 font-serif italic text-lg text-stone-800">
              {personal.fullName || 'Executive Candidate'}
            </div>
          )}
          <div className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {personal.fullName || 'Executive Candidate'}
          </div>
          {personal.professionalTitle && (
            <div className="text-[11px] text-stone-500 tracking-wide">{personal.professionalTitle}</div>
          )}
        </div>
      )}
    </div>
  );
};
''')

print('Wrote cover letters part 1')
