import React from 'react';
import { DocumentData } from '../../types/document';
import { mapCoverLetterData, MappedCoverLetterData } from '../../utils/mapCoverLetterData';
import {
  CL_HEADER_LEFT_STYLE,
  CL_HEADER_RIGHT_STYLE,
  CL_HEADER_ROW_STYLE,
  CoverLetterBodyBlocks,
  CoverLetterClosingBlock,
  CoverLetterDetailsBlock,
  CoverLetterSampleText,
  getCoverLetterSheetTypography,
  sanitizeDocumentTextFields,
  shouldShowCoverLetterSlot,
  useCoverLetterPreviewMode,
} from './CoverLetterTemplateHelpers';

export const ExecutiveCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data: rawData, mapped: propMapped }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#1c1917';
  const paperColor = data.customization?.paperColor || '#FAF9F6';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'playfair'
  );

  const showName = shouldShowCoverLetterSlot(mapped.sender.fullName, previewMode, isExportMode, true);
  const showTitle = shouldShowCoverLetterSlot(mapped.sender.professionalTitle, previewMode, isExportMode, false);
  const showPhone = shouldShowCoverLetterSlot(mapped.sender.phone, previewMode, isExportMode, !mapped.isEmailType);
  const showEmail = shouldShowCoverLetterSlot(mapped.sender.email, previewMode, isExportMode, !mapped.isEmailType);
  const showLocation = shouldShowCoverLetterSlot(mapped.sender.locationLine, previewMode, isExportMode, false);

  const showHeader =
    showName || showTitle || showPhone || showEmail || showLocation || Boolean(mapped.sender.linkedin || mapped.sender.portfolio);

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
      className={`document-page-sheet cl-sheet-root ${paddingClass} ${fontClass} relative text-stone-800`}
      style={{ backgroundColor: paperColor }}
    >
      {/* Top Archival Hairline */}
      <div className="h-[2px] w-full mb-7" style={{ backgroundColor: primaryColor }} />

      {/* Split Editorial Executive Masthead */}
      {showHeader && (
        <div className="cl-header-block pb-6 mb-6 border-b border-stone-300" style={CL_HEADER_ROW_STYLE}>
          <div className="min-w-0" style={CL_HEADER_LEFT_STYLE}>
            {showName && (
              <h1
                className="cl-name font-bold tracking-tight break-words"
                style={{ color: primaryColor }}
              >
                <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
              </h1>
            )}
            {showTitle && (
              <p className="cl-title font-semibold uppercase tracking-[0.2em] text-stone-600 mt-1.5 font-sans break-words">
                <CoverLetterSampleText
                  value={mapped.sender.professionalTitle}
                  sample="Your Professional Title"
                />
              </p>
            )}
          </div>

          <div
            className="text-right cl-meta text-stone-600 font-sans space-y-0.5 max-w-[260px] break-words"
            style={{ ...CL_HEADER_RIGHT_STYLE, whiteSpace: 'normal', maxWidth: '260px' }}
          >
            {showPhone && (
              <div>
                <CoverLetterSampleText value={mapped.sender.phone} sample="+91 98765 43210" required={!mapped.isEmailType} />
              </div>
            )}
            {showEmail && (
              <div>
                <CoverLetterSampleText value={mapped.sender.email} sample="your.email@example.com" required={!mapped.isEmailType} />
              </div>
            )}
            {showLocation && (
              <div>
                <CoverLetterSampleText value={mapped.sender.locationLine} sample="City, State, Country" />
              </div>
            )}
            {mapped.sender.linkedin && <div>{mapped.sender.linkedin}</div>}
            {mapped.sender.portfolio && <div>{mapped.sender.portfolio}</div>}
          </div>
        </div>
      )}

      {/* Date */}
      {mapped.date && (
        <div className="mb-4 cl-meta font-sans font-medium text-stone-600">
          {mapped.date}
        </div>
      )}

      {/* Recipient */}
      {showRecipient && (
        <div className="cl-recipient-block mb-5 cl-meta font-sans text-stone-800 space-y-0.5 break-words">
          {showHmName && (
            <div className="font-bold text-stone-900">
              <CoverLetterSampleText
                value={mapped.recipient.hiringManagerName}
                sample="Hiring Manager Name"
              />
            </div>
          )}
          {showHmTitle && (
            <div className="text-stone-600">
              <CoverLetterSampleText
                value={mapped.recipient.hiringManagerTitle}
                sample="Hiring Manager Title"
              />
            </div>
          )}
          {showCompany && (
            <div className="font-semibold text-stone-800">
              <CoverLetterSampleText value={mapped.recipient.companyName} sample="Company Name" required={!mapped.isEmailType} />
            </div>
          )}
          {showCompanyAddr && (
            <div className="text-stone-500">
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
        <div className="mb-4 py-2.5 border-y border-stone-200 font-sans break-words space-y-0.5">
          {showSubject && (
            <div className="cl-meta font-bold text-stone-900">
              Subject: <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta font-medium text-stone-600">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details */}
      <CoverLetterDetailsBlock mapped={mapped} variant="normal" accentColor={primaryColor} className="font-sans" />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 font-sans cl-meta font-semibold text-stone-800 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 cl-meta font-sans font-bold text-stone-900 break-words">
          {mapped.salutation}
        </div>
      )}

      {/* Body Paragraphs */}
      <CoverLetterBodyBlocks
        mapped={mapped}
        className="font-sans text-stone-800"
      />

      {/* Standardized Closing */}
      <CoverLetterClosingBlock
        mapped={mapped}
        containerClassName="mt-8 pt-4 avoid-break font-sans text-stone-800"
      />
    </div>
  );
};
