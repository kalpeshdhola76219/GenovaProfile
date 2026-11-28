import React, { useState } from 'react';
import { DocumentData, DocumentType, TemplateMetadata } from '../../types/document';
import { TemplateGallery } from '../gallery/TemplateGallery';

interface TemplateGalleryPageProps {
  initialType: DocumentType;
  onSelectTemplate: (template: TemplateMetadata) => void;
  currentDocumentData?: DocumentData | null;
}

const GALLERY_HERO_BY_TYPE: Record<
  DocumentType,
  { eyebrow: string; eyebrowClass: string; title: string; description: string }
> = {
  resume: {
    eyebrow: 'Career Architecture',
    eyebrowClass: 'text-[#5B4BDB]',
    title: 'Professional Resume Templates',
    description:
      'ATS-friendly single column, modern corporate, tech stack showcases, and executive leadership designs.',
  },
  'cover-letter': {
    eyebrow: 'Application Suite',
    eyebrowClass: 'text-emerald-600',
    title: 'Cover Letter Templates',
    description:
      'Pair your resume with beautifully formatted corporate, executive, tech, and creative cover letters.',
  },
  biodata: {
    eyebrow: 'Matrimonial Suite',
    eyebrowClass: 'text-rose-600',
    title: 'Matrimonial Profile Templates',
    description:
      'Culturally authentic Vedic formats, elegant gold crests, royal floral frames, and modern styles.',
  },
};

export const TemplateGalleryPage: React.FC<TemplateGalleryPageProps> = ({
  initialType,
  onSelectTemplate,
  currentDocumentData,
}) => {
  const [activeType, setActiveType] = useState<DocumentType>(initialType);
  const hero = GALLERY_HERO_BY_TYPE[activeType] || GALLERY_HERO_BY_TYPE.resume;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${hero.eyebrowClass}`}>
          {hero.eyebrow}
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{hero.title}</h1>
        <p className="text-xs sm:text-sm text-slate-500">{hero.description}</p>
      </div>
      <TemplateGallery
        initialType={initialType}
        onSelectTemplate={onSelectTemplate}
        currentDocumentData={currentDocumentData}
        onTypeChange={setActiveType}
      />
    </div>
  );
};
