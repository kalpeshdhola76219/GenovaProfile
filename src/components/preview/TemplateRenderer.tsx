import React from 'react';
import { DocumentData } from '../../types/document';
import { getTemplateById, TEMPLATE_REGISTRY } from '../../templates/registry';
import { sanitizeDocument } from '../../services/storageService';
import { PaginatedDocumentPreview } from './PaginatedDocumentPreview';
import { CoverLetterOnePagePreview } from './CoverLetterOnePagePreview';

interface TemplateRendererProps {
  data: DocumentData;
  isUnpaidPremium?: boolean;
  onPageCountChange?: (count: number) => void;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  data,
  isUnpaidPremium = false,
  onPageCountChange,
}) => {
  const safeData = sanitizeDocument(data);
  let templateMeta = getTemplateById(safeData.templateId);
  if (!templateMeta) {
    templateMeta = TEMPLATE_REGISTRY.find((t) => t.type === safeData.type) || TEMPLATE_REGISTRY[0];
  }
  const TemplateComponent = templateMeta.component;

  const shouldJustify = safeData.type === 'resume';

  return (
    <div className={`w-full flex justify-center${shouldJustify ? ' doc-justify' : ''}`}>
      {safeData.type === 'cover-letter' ? (
        <CoverLetterOnePagePreview
          data={safeData}
          TemplateComponent={TemplateComponent}
          isUnpaidPremium={isUnpaidPremium}
          onPageCountChange={onPageCountChange}
        />
      ) : (
        <PaginatedDocumentPreview
          data={safeData}
          TemplateComponent={TemplateComponent}
          isUnpaidPremium={isUnpaidPremium}
          onPageCountChange={onPageCountChange}
        />
      )}
    </div>
  );
};
