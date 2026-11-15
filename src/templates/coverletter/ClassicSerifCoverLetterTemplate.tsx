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

export const ClassicSerifCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data, mapped: propMapped }) => {
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'cormorant'
  );

  const showName = shouldShowCoverLetterSlot(mapped.sender.fullName, previewMode, isExportMode, true);
  const showTitle = shouldShowCoverLetterSlot(mapped.sender.professionalTitle, previewMode, isExportMode, false);
  const showEmail = shouldShowCoverLetterSlot(mapped.sender.email, previewMode, isExportMode, !mapped.isEmailType);
  const showPhone = shouldShowCoverLetterSlot(mapped.sender.phone, previewMode, isExportMode, !mapped.isEmailType);
  const showLocation = shouldShowCoverLetterSlot(mapped.sender.locationLine, previewMode, isExportMode, false);

  const contactParts: React.ReactNode[] = [];
  if (showEmail) {
    contactParts.push(<CoverLetterSampleText key="em" value={mapped.sender.email} sample="your.email@example.com" required={!mapped.isEmailType} />);
  }
  if (showPhone) {
    contactParts.push(<CoverLetterSampleText key="ph" value={mapped.sender.phone} sample="+91 98765 43210" required={!mapped.isEmailType} />);
  }
  if (showLocation) {
    contactParts.push(<CoverLetterSampleText key="loc" value={mapped.sender.locationLine} sample="City, State, Country" />);
  }
  if (mapped.sender.linkedin) contactParts.push(<span key="li">{mapped.sender.linkedin}</span>);
  if (mapped.sender.portfolio) contactParts.push(<span key="web">{mapped.sender.portfolio}</span>);

  const showHeader = showName || showTitle || contactParts.length > 0;

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
      className={`document-page-sheet cl-sheet-root ${paddingClass} bg-white text-stone-950 relative`}
    >
      {/* Centered Classic Formal ATS Letterhead */}
      {showHeader && (
        <div className="cl-header-block text-center pb-5 mb-5 border-b border-stone-900">
          {showName && (
            <h1 className={`cl-name font-bold tracking-wide text-stone-950 break-words ${fontClass}`}>
              <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
            </h1>
          )}
          {showTitle && (
            <p className="cl-title font-semibold uppercase tracking-widest text-stone-600 mt-1 font-sans break-words">
              <CoverLetterSampleText value={mapped.sender.professionalTitle} sample="Your Professional Title" />
            </p>
          )}
          <CoverLetterContactBar
            items={contactParts}
            separator={<>&middot;</>}
            separatorClassName="text-stone-400"
            center
            className="mt-2.5 text-stone-700 font-sans"
          />
        </div>
      )}

      {/* Single-Column Date & Recipient */}
      {mapped.date && (
        <p className="cl-meta font-sans text-stone-600 mb-4">{mapped.date}</p>
      )}

      {showRecipient && (
        <div className="cl-recipient-block mb-5 font-sans cl-meta space-y-0.5 break-words">
          {showHmName && (
            <p className="font-bold text-stone-950">
              <CoverLetterSampleText value={mapped.recipient.hiringManagerName} sample="Hiring Manager Name" />
            </p>
          )}
          {showHmTitle && (
            <p className="text-stone-700">
              <CoverLetterSampleText value={mapped.recipient.hiringManagerTitle} sample="Hiring Manager Title" />
            </p>
          )}
          {showCompany && (
            <p className="font-semibold text-stone-900">
              <CoverLetterSampleText value={mapped.recipient.companyName} sample="Company Name" required={!mapped.isEmailType} />
            </p>
          )}
          {showCompanyAddr && (
            <p className="text-stone-600">
              <CoverLetterSampleText value={mapped.recipient.companyAddress} sample="Company Address" />
            </p>
          )}
        </div>
      )}

      {/* Formal Subject + Referral Note */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 pb-1.5 border-b border-stone-300 break-words font-sans space-y-0.5">
          {showSubject && (
            <div className="cl-meta font-bold text-stone-950">
              Re: <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta text-stone-700 font-medium">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details */}
      <CoverLetterDetailsBlock mapped={mapped} variant="ats" className="font-sans" />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 font-sans cl-meta font-semibold text-stone-950 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 break-words font-sans cl-meta font-bold text-stone-950">
          {mapped.salutation}
        </div>
      )}

      {/* Body Paragraphs */}
      <CoverLetterBodyBlocks
        mapped={mapped}
        className="text-stone-900 font-sans"
      />

      {/* Standardized Closing */}
      <CoverLetterClosingBlock
        mapped={mapped}
        containerClassName="mt-7 pt-4 border-t border-stone-200 font-sans avoid-break text-stone-900"
      />
    </div>
  );
};
