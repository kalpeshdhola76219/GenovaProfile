import os

def save(file_path, content):
    full_path = os.path.abspath(file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Wrote:', file_path)

# 7. FinanceProfessionalCoverLetterTemplate
save('src/templates/coverletter/FinanceProfessionalCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const FinanceProfessionalCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const financeGreen = customization.primaryColor || '#064e3b'; // Deep Banking Emerald
  const accent = customization.accentColor || '#047857';
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
      className={`document-page-sheet p-12 bg-white text-stone-900 shadow-sm relative ${baseFontSize}`}
    >
      {/* Formal Header with Double Rule */}
      {sections.header !== false && (
        <div className="border-b-2 pb-5 mb-6 text-center" style={{ borderColor: financeGreen }}>
          <h1 className={`text-3xl font-extrabold uppercase tracking-widest ${fontClass}`} style={{ color: financeGreen }}>
            {personal.fullName || 'FINANCIAL PROFESSIONAL'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-600 mt-1 font-sans">
              {personal.professionalTitle}
            </p>
          )}
          {sections.contact !== false && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2.5 text-xs text-stone-600 font-sans">
              {contact.phone && <span>Tel: {contact.phone}</span>}
              {contact.email && <span>• Email: {contact.email}</span>}
              {contact.city && <span>• Location: {contact.city}{contact.state ? `, ${contact.state}` : ''}</span>}
              {contact.linkedin && <span>• LinkedIn: {contact.linkedin}</span>}
            </div>
          )}
        </div>
      )}

      {/* Structured Tabular Metadata Bar */}
      <div className="bg-stone-50 border border-stone-200 rounded p-3 mb-6 grid grid-cols-2 gap-4 text-xs font-sans">
        <div>
          {sections.date !== false && coverLetter?.applicationDate && (
            <div><span className="text-stone-400 uppercase text-[10.5px]">Filing Date:</span> <strong className="text-stone-800">{coverLetter.applicationDate}</strong></div>
          )}
          {coverLetter?.jobTitle && (
            <div><span className="text-stone-400 uppercase text-[10.5px]">Target Position:</span> <strong className="text-stone-800">{coverLetter.jobTitle}</strong></div>
          )}
        </div>
        {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) && (
          <div className="text-right">
            {coverLetter?.hiringManager && <div className="font-bold text-stone-900">{coverLetter.hiringManager}</div>}
            {coverLetter?.companyName && <div className="text-stone-700">{coverLetter.companyName}</div>}
            {recipientLocation && <div className="text-stone-500 text-[11px]">{recipientLocation}</div>}
          </div>
        )}
      </div>

      {/* Formal Subject */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-5 font-sans text-xs font-bold text-stone-900 uppercase tracking-wide">
          Subject: {coverLetter.subject}
        </div>
      )}

      {/* Formal Salutation */}
      {sections.greeting !== false && (
        <div className="mb-4 text-xs font-bold text-stone-900 font-sans">
          {coverLetter?.greeting || 'Dear Hiring Manager,'}
        </div>
      )}

      {/* Body with Conservative Formal Rigor */}
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

      {/* Formal Signature */}
      {sections.signature !== false && (
        <div className="mt-8 avoid-break space-y-2 font-sans">
          <div className="text-xs text-stone-800">{coverLetter?.signoff || 'Respectfully submitted,'}</div>
          {coverLetter?.signatureType === 'image' && coverLetter.signatureImage ? (
            <div className="w-36 h-12 my-1 overflow-hidden">
              <img
                src={coverLetter.signatureImage}
                alt="Signature"
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-6 font-serif italic text-base text-stone-800">
              {personal.fullName || 'Candidate Signature'}
            </div>
          )}
          <div className="text-xs font-bold text-stone-950 uppercase tracking-wider">{personal.fullName || 'Candidate Name'}</div>
          {personal.professionalTitle && (
            <div className="text-[11px] text-stone-500">{personal.professionalTitle}</div>
          )}
        </div>
      )}
    </div>
  );
};
''')

# 12. ModernCorporateCoverLetterTemplate
save('src/templates/coverletter/ModernCorporateCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernCorporateCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const primary = customization.primaryColor || '#1e3a8a'; // Deep Corporate Navy
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const defaultDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const letterText =
    coverLetter?.letterBody ||
    `I am writing to express my strong interest in the ${coverLetter?.reference ? coverLetter.reference : 'open position'} at ${coverLetter?.companyName || 'your esteemed organization'}. With over eight years of experience delivering high-impact strategic solutions and leading cross-functional initiatives, I am eager to contribute to your continued growth.\\n\\nThroughout my career, I have specialized in turning ambitious visions into measurable business outcomes. In my most recent role, I spearheaded operational workflows that increased overall execution efficiency by 34% while reducing delivery cycles. My approach combines data-driven decision-making with empathetic team leadership, ensuring that strategic goals align seamlessly with day-to-day execution.\\n\\n${coverLetter?.companyName || 'Your organization'} has distinguished itself as an industry pioneer known for excellence and innovation. I am particularly energized by your recent advancements and would welcome the opportunity to bring my hands-on problem-solving skills, stakeholder management expertise, and relentless commitment to high standards to your team.\\n\\nThank you for your time and consideration. I welcome the opportunity to discuss in greater detail how my background and qualifications align with your organizational priorities.`;

  const paragraphs = letterText.split('\\n\\n').filter((p) => p.trim().length > 0);

  return (
    <div
      className={`document-page-sheet flex flex-col justify-between p-12 bg-white text-slate-800 shadow-sm ${baseFontSize}`}
    >
      <div>
        {/* Modern Corporate Header Banner */}
        <div
          className="p-8 rounded-xl text-white mb-8 flex justify-between items-center shadow-xs"
          style={{ backgroundColor: primary }}
        >
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight uppercase ${fontClass}`}>
              {personal.fullName || 'ALEXANDER MORGAN'}
            </h1>
            <p className="text-xs font-semibold text-blue-100 tracking-wider uppercase mt-0.5">
              {personal.professionalTitle || 'Senior Business Strategy & Operations Lead'}
            </p>
          </div>
          <div className="text-right text-xs text-blue-100 space-y-0.5 font-sans">
            {contact.email && <div>✉ {contact.email}</div>}
            {contact.phone && <div>✆ {contact.phone}</div>}
            {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
            {contact.linkedin && <div>🔗 {contact.linkedin}</div>}
          </div>
        </div>

        {/* Date & Recipient Details */}
        <div className="flex justify-between items-start mb-6 text-xs text-slate-600 font-sans">
          <div>
            <p className="font-semibold text-slate-900 text-sm mb-0.5">
              {coverLetter?.recipientName || 'Hiring Manager'}
            </p>
            {coverLetter?.recipientTitle && <p className="text-slate-600">{coverLetter.recipientTitle}</p>}
            <p className="font-medium text-slate-800">{coverLetter?.companyName || 'Acme Global Technologies'}</p>
            {coverLetter?.companyAddress && <p className="text-slate-500">{coverLetter.companyAddress}</p>}
          </div>
          <div className="text-right">
            <span className="font-medium text-slate-500">{coverLetter?.date || defaultDate}</span>
          </div>
        </div>

        {/* Reference Line */}
        {coverLetter?.reference && (
          <div className="mb-6 pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-900 text-xs">
              RE: {coverLetter.reference}
            </span>
          </div>
        )}

        {/* Salutation */}
        <div className="mb-4">
          <p className="font-bold text-slate-900 text-sm">
            {coverLetter?.salutation || `Dear ${coverLetter?.recipientName ? coverLetter.recipientName : 'Hiring Team'},`}
          </p>
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-4 text-slate-700 leading-relaxed font-sans text-justify">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Professional Sign-off */}
      <div className="pt-8 border-t border-slate-100 font-sans mt-8">
        <p className="text-xs text-slate-600 mb-4">{coverLetter?.signOff || 'Sincerely,'}</p>
        <p className="font-bold text-sm text-slate-900">{personal.fullName || 'Alexander Morgan'}</p>
        {personal.professionalTitle && (
          <p className="text-xs text-slate-500 mt-0.5">{personal.professionalTitle}</p>
        )}
      </div>
    </div>
  );
};
''')

# 13. ModernMinimalCoverLetterTemplate
save('src/templates/coverletter/ModernMinimalCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const ModernMinimalCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const accentColor = customization.accentColor || '#0284c7'; // Sky / Cerulean
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
      className={`document-page-sheet flex flex-col justify-between p-12 bg-white text-slate-800 shadow-sm relative ${baseFontSize} ${fontClass}`}
    >
      <div>
        {/* Modern Minimal Header with Accent Dot & Line */}
        {sections.header !== false && (
          <div className="pb-5 mb-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {personal.fullName || 'SARAH CONNOR'}
                </h1>
                {personal.professionalTitle && (
                  <p className="text-xs font-semibold text-slate-500">{personal.professionalTitle}</p>
                )}
              </div>
            </div>
            {sections.contact !== false && (
              <div className="text-right text-[11.5px] text-slate-500 space-y-0.5">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.city && <div>{contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
              </div>
            )}
          </div>
        )}

        {/* Date and Recipient Section */}
        <div className="flex justify-between items-start mb-6 text-xs">
          {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) ? (
            <div className="space-y-0.5">
              {coverLetter?.hiringManager && <div className="font-bold text-slate-900">{coverLetter.hiringManager}</div>}
              {coverLetter?.companyName && <div className="font-semibold text-slate-700">{coverLetter.companyName}</div>}
              {recipientLocation && <div className="text-slate-400">{recipientLocation}</div>}
            </div>
          ) : <div />}
          {sections.date !== false && coverLetter?.applicationDate && (
            <div className="text-slate-500 font-medium">{coverLetter.applicationDate}</div>
          )}
        </div>

        {/* Subject */}
        {sections.subject !== false && coverLetter?.subject && (
          <div className="mb-4 text-xs font-bold text-slate-900">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold mr-2" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              RE:
            </span>
            {coverLetter.subject}
          </div>
        )}

        {/* Greeting */}
        {sections.greeting !== false && (
          <div className="mb-4 text-xs font-bold text-slate-900">
            {coverLetter?.greeting || 'Dear Hiring Manager,'}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3.5 text-slate-700 leading-relaxed text-justify">
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
          <div className="mt-8 avoid-break space-y-1.5">
            <div className="text-xs text-slate-700">{coverLetter?.signoff || 'Best regards,'}</div>
            {coverLetter?.signatureType === 'image' && coverLetter.signatureImage ? (
              <div className="w-32 h-10 my-1 overflow-hidden">
                <img
                  src={coverLetter.signatureImage}
                  alt="Signature"
                  className="max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="h-6 font-serif italic text-base text-slate-800">
                {personal.fullName || 'Candidate'}
              </div>
            )}
            <div className="text-xs font-bold text-slate-900">{personal.fullName || 'Candidate'}</div>
          </div>
        )}
      </div>

      {/* Simple Footer Accent */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10.5px] text-slate-400 mt-6 avoid-break">
        <span>GenovaProfile Application Portfolio</span>
        <div className="w-8 h-1 rounded" style={{ backgroundColor: accentColor }} />
      </div>
    </div>
  );
};
''')

# 14. PremiumEditorialCoverLetterTemplate
save('src/templates/coverletter/PremiumEditorialCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const PremiumEditorialCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
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
      className={`document-page-sheet p-14 bg-[#faf9f6] text-stone-900 shadow-sm relative ${baseFontSize}`}
    >
      {/* Magazine Editorial Headline */}
      {sections.header !== false && (
        <div className="pb-6 mb-7 border-b border-stone-300">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400">
              Candidate Dossier • Issue {new Date().getFullYear()}
            </span>
            <span className="text-xs text-stone-500 font-sans">
              {contact.city ? `Based in ${contact.city}` : 'Strictly Confidential'}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h1 className={`text-4xl font-light tracking-tight text-stone-900 leading-none ${fontClass}`}>
                {personal.fullName || 'CLAIRE BEAUMONT'}
              </h1>
              {personal.professionalTitle && (
                <p className="text-xs text-stone-500 font-sans font-light mt-1.5 uppercase tracking-wider">
                  {personal.professionalTitle}
                </p>
              )}
            </div>
            {sections.contact !== false && (
              <div className="text-right text-xs font-sans text-stone-500 space-y-0.5 font-light">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.linkedin && <div>{contact.linkedin}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editorial Recipient & Date Bar */}
      <div className="flex justify-between items-start mb-6 text-xs font-sans text-stone-600">
        {sections.recipient !== false && (coverLetter?.hiringManager || coverLetter?.companyName || recipientLocation) ? (
          <div className="space-y-0.5">
            {coverLetter?.hiringManager && <div className="font-semibold text-stone-900">{coverLetter.hiringManager}</div>}
            {coverLetter?.companyName && <div>{coverLetter.companyName}</div>}
            {recipientLocation && <div className="text-stone-400 text-[11px]">{recipientLocation}</div>}
          </div>
        ) : <div />}
        {sections.date !== false && coverLetter?.applicationDate && (
          <div className="text-stone-400 font-light">{coverLetter.applicationDate}</div>
        )}
      </div>

      {/* Subject Line in Editorial Callout */}
      {sections.subject !== false && coverLetter?.subject && (
        <div className="mb-5 pl-4 border-l border-stone-800 text-xs font-sans font-medium text-stone-900 italic">
          {coverLetter.subject}
        </div>
      )}

      {/* Greeting */}
      {sections.greeting !== false && (
        <div className="mb-4 text-xs font-semibold text-stone-900 font-sans">
          {coverLetter?.greeting || 'Dear Hiring Manager,'}
        </div>
      )}

      {/* Editorial Body */}
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
          <div className="text-xs text-stone-600">{coverLetter?.signoff || 'Respectfully,'}</div>
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
          <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            {personal.fullName || 'Candidate Name'}
          </div>
        </div>
      )}

      {/* Editorial Bottom Rule */}
      <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400 font-sans mt-8 avoid-break">
        <span>PREMIUM EDITORIAL DOSSIER</span>
        <span>PRIVATE & CONFIDENTIAL</span>
      </div>
    </div>
  );
};
''')

# 15. TechLeadCoverLetterTemplate
save('src/templates/coverletter/TechLeadCoverLetterTemplate.tsx', '''import React from 'react';
import { DocumentData } from '../../types/document';

export const TechLeadCoverLetterTemplate: React.FC<{ data: DocumentData }> = ({ data }) => {
  const { personal, contact, coverLetter, customization } = data;
  const indigo = customization.primaryColor || '#312e81'; // Silicon Indigo
  const fontClass = customization.fontFamily ? `font-${customization.fontFamily}` : 'font-jakarta';
  const baseFontSize =
    customization.fontSize === 'sm' ? 'text-[12px]' : customization.fontSize === 'lg' ? 'text-[15px]' : 'text-[13px]';

  const defaultDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const letterText =
    coverLetter?.letterBody ||
    `I am writing to submit my candidacy for the ${coverLetter?.reference ? coverLetter.reference : 'Senior Engineering'} role at ${coverLetter?.companyName || 'your engineering organization'}. With extensive experience architecting mission-critical distributed systems, leading high-velocity engineering squads, and driving cloud reliability at scale, I am excited by your engineering challenges.\\n\\nThroughout my background building scalable microservices and real-time streaming pipelines, I have consistently championed clean architecture, automated testing pipelines, and developer productivity. Recently, my team re-architected an ingestion service handling 350,000 requests/sec, dropping p99 latencies by 42% while trimming annual infrastructure costs by $180,000. I believe deeply in engineering pragmatism: selecting the right tools for the job, minimizing technical debt, and empowering engineers to take radical ownership.\\n\\n${coverLetter?.companyName || 'Your organization'}'s engineering blog posts and technical vision for your core platform demonstrate a commitment to technical craftsmanship that I find deeply compelling. I would welcome the opportunity to bring my hands-on systems expertise and architectural leadership to your technical roadmap.\\n\\nThank you for reviewing my profile and credentials. I look forward to connecting with your engineering leadership team!`;

  const paragraphs = letterText.split('\\n\\n').filter((p) => p.trim().length > 0);

  return (
    <div
      className={`document-page-sheet flex flex-col justify-between p-12 bg-white text-slate-900 shadow-sm ${baseFontSize}`}
    >
      <div>
        {/* Tech Header */}
        <div className="flex justify-between items-start pb-6 mb-8 border-b-2 border-slate-900">
          <div>
            <h1 className={`text-3xl font-black uppercase tracking-tight text-slate-950 ${fontClass}`}>
              {personal.fullName || 'MARCUS VANCE'}
            </h1>
            <p className="text-xs font-semibold text-indigo-900 font-mono mt-1">
              {personal.professionalTitle || 'Staff Software Engineer & Distributed Systems Architect'}
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
            {contact.email && <div>✉ {contact.email}</div>}
            {contact.phone && <div>✆ {contact.phone}</div>}
            {contact.github && <div className="text-indigo-600 font-semibold">{contact.github}</div>}
            {contact.linkedin && <div>{contact.linkedin}</div>}
            {contact.city && <div>📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</div>}
          </div>
        </div>

        {/* Date & Recipient Details */}
        <div className="flex justify-between items-start mb-6 font-mono text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block mb-0.5">// TO:</span>
            <p className="font-bold text-slate-900 text-sm font-sans">{coverLetter?.recipientName || 'Engineering Director / Hiring Team'}</p>
            {coverLetter?.recipientTitle && <p className="text-slate-600 font-sans">{coverLetter.recipientTitle}</p>}
            <p className="font-semibold text-indigo-950 font-sans">{coverLetter?.companyName || 'NextGen Cloud Technologies'}</p>
            {coverLetter?.companyAddress && <p className="text-slate-500 font-sans">{coverLetter.companyAddress}</p>}
          </div>
          <div className="text-right">
            <span>{coverLetter?.date || defaultDate}</span>
          </div>
        </div>

        {/* Reference Line */}
        {coverLetter?.reference && (
          <div className="mb-6 p-2 bg-slate-50 border-l-4 border-indigo-600 font-mono text-xs">
            <span className="font-bold text-slate-900">
              // POSITION_ID: {coverLetter.reference}
            </span>
          </div>
        )}

        {/* Salutation */}
        <div className="mb-4">
          <p className="font-bold text-slate-900 text-sm font-sans">
            {coverLetter?.salutation || `Hello ${coverLetter?.recipientName ? coverLetter.recipientName : 'Engineering Team'},`}
          </p>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-slate-700 leading-relaxed font-sans text-justify">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="pt-8 border-t border-slate-200 font-sans mt-8">
        <p className="text-xs text-slate-500 mb-3 font-mono">// END_LETTER</p>
        <p className="text-xs text-slate-600 mb-2">{coverLetter?.signOff || 'Best regards,'}</p>
        <p className="font-bold text-base text-slate-900">{personal.fullName || 'Marcus Vance'}</p>
        {personal.professionalTitle && (
          <p className="text-xs text-indigo-900 font-mono mt-0.5">{personal.professionalTitle}</p>
        )}
      </div>
    </div>
  );
};
''')

print('Wrote all 10 cover letter templates!')
