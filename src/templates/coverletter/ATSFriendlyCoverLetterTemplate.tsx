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
  sanitizeDocumentTextFields,
  shouldShowCoverLetterSlot,
  useCoverLetterPreviewMode,
} from './CoverLetterTemplateHelpers';

export const ATSFriendlyCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data: rawData, mapped: propMapped }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
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
    contactItems.push(
      <span key="phone">
        <CoverLetterSampleText value={mapped.sender.phone} sample="+91 98765 43210" required={!mapped.isEmailType} />
      </span>
    );
  }
  if (showEmail) {
    contactItems.push(
      <span key="email">
        <CoverLetterSampleText value={mapped.sender.email} sample="your.email@example.com" required={!mapped.isEmailType} />
      </span>
    );
  }
  if (showLocation) {
    contactItems.push(
      <span key="loc">
        <CoverLetterSampleText value={mapped.sender.locationLine} sample="City, State, Country" />
      </span>
    );
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
      className={`document-page-sheet cl-sheet-root ${paddingClass} bg-white text-black ${fontClass} relative`}
    >
      {/* Pure Single-Column ATS Header */}
      {showHeader && (
        <div className="cl-header-block pb-4 mb-5 border-b border-black">
          {showName && (
            <h1 className="cl-name font-bold tracking-tight text-black break-words">
              <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
            </h1>
          )}
          {showTitle && (
            <p className="cl-title font-semibold text-gray-800 mt-0.5 break-words">
              <CoverLetterSampleText value={mapped.sender.professionalTitle} sample="Your Professional Title" />
            </p>
          )}
          <CoverLetterContactBar
            items={contactItems}
            separator="|"
            separatorClassName="text-gray-400"
            className="mt-2 text-gray-800"
          />
        </div>
      )}

      {/* Date */}
      {mapped.date && (
        <div className="mb-4 cl-meta text-black">{mapped.date}</div>
      )}

      {/* Single-Column Recipient Block */}
      {showRecipient && (
        <div className="cl-recipient-block mb-5 cl-meta text-black space-y-0.5 break-words">
          {showHmName && (
            <div className="font-semibold">
              <CoverLetterSampleText value={mapped.recipient.hiringManagerName} sample="Hiring Manager Name" />
            </div>
          )}
          {showHmTitle && (
            <div>
              <CoverLetterSampleText value={mapped.recipient.hiringManagerTitle} sample="Hiring Manager Title" />
            </div>
          )}
          {showCompany && (
            <div className="font-medium">
              <CoverLetterSampleText value={mapped.recipient.companyName} sample="Company Name" required={!mapped.isEmailType} />
            </div>
          )}
          {showCompanyAddr && (
            <div>
              <CoverLetterSampleText value={mapped.recipient.companyAddress} sample="Company Address" />
            </div>
          )}
        </div>
      )}

      {/* Subject Line + Referral Note */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 space-y-0.5 break-words">
          {showSubject && (
            <div className="cl-meta font-bold text-black">
              Subject: <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta text-gray-800 font-medium">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details (ATS Plain Text) */}
      <CoverLetterDetailsBlock mapped={mapped} variant="ats" />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 cl-meta font-semibold text-black break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 cl-meta font-bold text-black break-words">
          {mapped.salutation}
        </div>
      )}

      {/* Machine-Readable Body */}
      <CoverLetterBodyBlocks
        mapped={mapped}
        className="text-black"
      />

      {/* Standardized Closing */}
      <CoverLetterClosingBlock
        mapped={mapped}
        containerClassName="mt-7 pt-3 avoid-break text-black"
      />
    </div>
  );
};
