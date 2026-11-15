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

export const FinanceProfessionalCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data, mapped: propMapped }) => {
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#064e3b';
  const paperColor = data.customization?.paperColor || '#ffffff';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'sans'
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

  const showHeader = showName || showTitle || contactItems.length > 0 || Boolean(mapped.date);

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
      className={`document-page-sheet cl-sheet-root ${paddingClass} ${fontClass} relative text-slate-900`}
      style={{ backgroundColor: paperColor }}
    >
      {/* Conservative Financial Institution Header */}
      {showHeader && (
        <div
          className="cl-header-block pb-4 mb-5"
          style={{ borderBottom: `2px solid ${primaryColor}` }}
        >
          <div className="flex items-baseline justify-between gap-4">
            {showName && (
              <h1
                className="cl-name font-bold tracking-tight break-words"
                style={{ color: primaryColor }}
              >
                <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
              </h1>
            )}
            {mapped.date && (
              <span className="cl-meta font-medium text-slate-600 shrink-0 tabular-nums ml-auto">
                {mapped.date}
              </span>
            )}
          </div>
          {showTitle && (
            <p className="cl-title font-semibold text-slate-600 mt-0.5 break-words">
              <CoverLetterSampleText
                value={mapped.sender.professionalTitle}
                sample="Your Professional Title"
              />
            </p>
          )}
          <CoverLetterContactBar
            items={contactItems}
            separator="|"
            separatorClassName="text-slate-300"
            className="mt-2.5 pt-2 border-t border-slate-200 text-slate-600"
          />
        </div>
      )}

      {/* Structured Advisory Metadata Ledger */}
      {showRecipient && (
        <div className="cl-recipient-block mb-5 pb-4 border-b border-slate-200 cl-meta text-slate-800 space-y-0.5 break-words">
          {showHmName && (
            <div className="font-bold text-slate-900">
              <CoverLetterSampleText
                value={mapped.recipient.hiringManagerName}
                sample="Hiring Manager Name"
              />
            </div>
          )}
          {showHmTitle && (
            <div className="text-slate-600">
              <CoverLetterSampleText
                value={mapped.recipient.hiringManagerTitle}
                sample="Hiring Manager Title"
              />
            </div>
          )}
          {showCompany && (
            <div className="font-semibold text-slate-800">
              <CoverLetterSampleText
                value={mapped.recipient.companyName}
                sample="Company Name"
                required={!mapped.isEmailType}
              />
            </div>
          )}
          {showCompanyAddr && (
            <div className="text-slate-500">
              <CoverLetterSampleText
                value={mapped.recipient.companyAddress}
                sample="Company Address"
              />
            </div>
          )}
        </div>
      )}

      {/* Subject */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 space-y-0.5 break-words">
          {showSubject && (
            <div className="cl-meta font-bold text-slate-900">
              <span className="uppercase tracking-wider mr-1.5" style={{ color: primaryColor }}>
                Re:
              </span>
              <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta font-medium text-slate-600">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details */}
      <CoverLetterDetailsBlock mapped={mapped} variant="normal" accentColor={primaryColor} />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 cl-meta font-semibold text-slate-900 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 cl-meta font-bold text-slate-900 break-words">
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
        containerClassName="mt-7 pt-4 avoid-break text-slate-800"
      />
    </div>
  );
};
