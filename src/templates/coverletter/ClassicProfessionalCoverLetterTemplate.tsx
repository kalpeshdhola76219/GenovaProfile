import React from 'react';
import { DocumentData } from '../../types/document';
import { mapCoverLetterData, MappedCoverLetterData } from '../../utils/mapCoverLetterData';
import {
  CoverLetterBodyBlocks,
  CoverLetterClosingBlock,
  CoverLetterContactBar,
  CoverLetterDetailsBlock,
  CoverLetterSampleText,
  getCoverLetterSheetTypography,
  shouldShowCoverLetterSlot,
  useCoverLetterPreviewMode,
} from './CoverLetterTemplateHelpers';

export const ClassicProfessionalCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data, mapped: propMapped }) => {
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primary = data.customization.primaryColor || '#1e293b';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'jakarta'
  );

  const showName = shouldShowCoverLetterSlot(mapped.sender.fullName, previewMode, isExportMode, true);
  const showTitle = shouldShowCoverLetterSlot(mapped.sender.professionalTitle, previewMode, isExportMode, false);
  const showPhone = shouldShowCoverLetterSlot(mapped.sender.phone, previewMode, isExportMode, !mapped.isEmailType);
  const showEmail = shouldShowCoverLetterSlot(mapped.sender.email, previewMode, isExportMode, !mapped.isEmailType);
  const showLocation = shouldShowCoverLetterSlot(mapped.sender.locationLine, previewMode, isExportMode, false);

  const contactItems: React.ReactNode[] = [];
  if (showPhone) {
    contactItems.push(<CoverLetterSampleText key="ph" value={mapped.sender.phone} sample="+91 98765 43210" required={!mapped.isEmailType} />);
  }
  if (showEmail) {
    contactItems.push(<CoverLetterSampleText key="em" value={mapped.sender.email} sample="your.email@example.com" required={!mapped.isEmailType} />);
  }
  if (showLocation) {
    contactItems.push(<CoverLetterSampleText key="loc" value={mapped.sender.locationLine} sample="City, State, Country" />);
  }
  if (mapped.sender.linkedin) contactItems.push(<span key="li">{mapped.sender.linkedin}</span>);
  if (mapped.sender.portfolio) contactItems.push(<span key="web">{mapped.sender.portfolio}</span>);

  const showHeader = showName || showTitle || contactItems.length > 0;

  const showHmName = shouldShowCoverLetterSlot(mapped.recipient.hiringManagerName, previewMode, isExportMode, false);
  const showHmTitle = shouldShowCoverLetterSlot(mapped.recipient.hiringManagerTitle, previewMode, isExportMode, false);
  const showCompany = shouldShowCoverLetterSlot(mapped.recipient.companyName, previewMode, isExportMode, !mapped.isEmailType);
  const showCompanyAddr = shouldShowCoverLetterSlot(mapped.recipient.companyAddress, previewMode, isExportMode, false);
  const showRecipient = !mapped.isEmailType && (showHmName || showHmTitle || showCompany || showCompanyAddr);

  const showSubject = shouldShowCoverLetterSlot(mapped.subjectLine, previewMode, isExportMode, true);

  return (
    <div
      data-document-type="cover-letter"
      lang="en"
      data-cl-justify="true"
      className={`document-page-sheet cl-sheet-root ${paddingClass} bg-white text-slate-900 relative ${fontClass}`}
    >
      {/* Clean Single-Column Formal Header */}
      {showHeader && (
        <div className="cl-header-block border-b-2 pb-4 mb-5 text-center" style={{ borderColor: primary }}>
          {showName && (
            <h1 className="cl-name font-extrabold tracking-wider text-slate-950 break-words">
              <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
            </h1>
          )}
          {showTitle && (
            <p className="cl-title font-semibold uppercase tracking-widest text-slate-600 mt-1 break-words">
              <CoverLetterSampleText value={mapped.sender.professionalTitle} sample="Your Professional Title" />
            </p>
          )}
          <CoverLetterContactBar
            items={contactItems}
            separator="|"
            separatorClassName="text-slate-300"
            center
            className="mt-2 text-slate-600"
          />
        </div>
      )}

      {/* Date */}
      {mapped.date && (
        <div className="mb-4 cl-meta font-medium text-slate-700">{mapped.date}</div>
      )}

      {/* Recipient */}
      {showRecipient && (
        <div className="cl-recipient-block mb-5 cl-meta text-slate-800 space-y-0.5 break-words">
          {showHmName && (
            <div className="font-bold text-slate-950">
              <CoverLetterSampleText value={mapped.recipient.hiringManagerName} sample="Hiring Manager Name" />
            </div>
          )}
          {showHmTitle && (
            <div className="text-slate-600">
              <CoverLetterSampleText value={mapped.recipient.hiringManagerTitle} sample="Hiring Manager Title" />
            </div>
          )}
          {showCompany && (
            <div className="font-semibold text-slate-900">
              <CoverLetterSampleText value={mapped.recipient.companyName} sample="Company Name" required={!mapped.isEmailType} />
            </div>
          )}
          {showCompanyAddr && (
            <div className="text-slate-600">
              <CoverLetterSampleText value={mapped.recipient.companyAddress} sample="Company Address" />
            </div>
          )}
        </div>
      )}

      {/* Subject */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 space-y-0.5 break-words">
          {showSubject && (
            <div className="cl-meta font-bold text-slate-950" style={{ color: primary }}>
              Subject: <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta text-slate-700 font-medium">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details */}
      <CoverLetterDetailsBlock mapped={mapped} variant="ats" />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 cl-meta font-semibold text-slate-950 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 cl-meta font-bold text-slate-950 break-words">
          {mapped.salutation}
        </div>
      )}

      {/* Body */}
      <CoverLetterBodyBlocks
        mapped={mapped}
        className="text-slate-800"
      />

      {/* Standardized Closing */}
      <CoverLetterClosingBlock
        mapped={mapped}
        containerClassName="mt-7 pt-3 avoid-break text-slate-800"
      />
    </div>
  );
};
