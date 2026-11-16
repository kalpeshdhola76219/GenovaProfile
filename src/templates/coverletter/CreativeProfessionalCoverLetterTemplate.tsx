import React from 'react';
import { DocumentData } from '../../types/document';
import { mapCoverLetterData, MappedCoverLetterData } from '../../utils/mapCoverLetterData';
import {
  CL_METADATA_LEFT_STYLE,
  CL_METADATA_RIGHT_STYLE,
  CL_METADATA_ROW_STYLE,
  CoverLetterBodyBlocks,
  CoverLetterClosingBlock,
  CoverLetterDetailsBlock,
  CoverLetterSampleText,
  getCoverLetterSheetTypography,
  sanitizeDocumentTextFields,
  shouldShowCoverLetterSlot,
  useCoverLetterPreviewMode,
} from './CoverLetterTemplateHelpers';

export const CreativeProfessionalCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data: rawData, mapped: propMapped }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#9a3412';
  const paperColor = data.customization?.paperColor || '#FDFBF9';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'jakarta'
  );

  const showName = shouldShowCoverLetterSlot(mapped.sender.fullName, previewMode, isExportMode, true);
  const showTitle = shouldShowCoverLetterSlot(mapped.sender.professionalTitle, previewMode, isExportMode, false);
  const showEmail = shouldShowCoverLetterSlot(mapped.sender.email, previewMode, isExportMode, !mapped.isEmailType);
  const showPhone = shouldShowCoverLetterSlot(mapped.sender.phone, previewMode, isExportMode, !mapped.isEmailType);
  const showLocation = shouldShowCoverLetterSlot(mapped.sender.locationLine, previewMode, isExportMode, false);
  const showHeader = Boolean(
    showName || showTitle || showEmail || showPhone || showLocation || mapped.sender.portfolio || mapped.sender.linkedin
  );

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
      {/* Asymmetric Editorial Atelier Masthead */}
      {showHeader && (
        <div className="cl-header-block grid grid-cols-12 gap-6 pb-6 mb-7 border-b border-stone-300/80">
          <div className="col-span-7 min-w-0">
            <div
              className="w-8 h-[2px] mb-3"
              style={{ backgroundColor: primaryColor }}
            />
            {showName && (
              <h1
                className="cl-name font-extrabold tracking-tight break-words"
                style={{ color: primaryColor }}
              >
                <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
              </h1>
            )}
            {showTitle && (
              <p className="cl-title font-semibold uppercase tracking-[0.15em] text-stone-500 mt-1.5 break-words">
                <CoverLetterSampleText
                  value={mapped.sender.professionalTitle}
                  sample="Your Professional Title"
                />
              </p>
            )}
          </div>

          <div className="col-span-5 text-right cl-meta text-stone-600 space-y-0.5 self-end break-words">
            {showEmail && (
              <div className="font-medium text-stone-800">
                <CoverLetterSampleText
                  value={mapped.sender.email}
                  sample="your.email@example.com"
                  required={!mapped.isEmailType}
                />
              </div>
            )}
            {showPhone && (
              <div>
                <CoverLetterSampleText
                  value={mapped.sender.phone}
                  sample="+91 98765 43210"
                  required={!mapped.isEmailType}
                />
              </div>
            )}
            {showLocation && (
              <div>
                <CoverLetterSampleText value={mapped.sender.locationLine} sample="City, State, Country" />
              </div>
            )}
            {mapped.sender.portfolio && <div>{mapped.sender.portfolio}</div>}
            {mapped.sender.linkedin && <div>{mapped.sender.linkedin}</div>}
          </div>
        </div>
      )}

      {/* Date & Recipient */}
      {(showRecipient || mapped.date) && (
        <div className="cl-recipient-block mb-6 cl-meta" style={CL_METADATA_ROW_STYLE}>
          <div className="text-stone-700 space-y-0.5 break-words" style={CL_METADATA_LEFT_STYLE}>
            {showRecipient && (
              <>
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
                    <CoverLetterSampleText
                      value={mapped.recipient.companyName}
                      sample="Company Name"
                      required={!mapped.isEmailType}
                    />
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
              </>
            )}
          </div>

          {mapped.date && (
            <div className="text-right cl-meta font-medium text-stone-500" style={CL_METADATA_RIGHT_STYLE}>
              <div>{mapped.date}</div>
              {mapped.recipient.jobReferenceId && (
                <div className="cl-meta text-stone-500 mt-0.5">
                  Ref: {mapped.recipient.jobReferenceId}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subject + Referral Note */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 break-words space-y-0.5">
          {showSubject && (
            <div className="cl-meta font-bold text-stone-900">
              <span className="uppercase tracking-widest cl-label mr-2" style={{ color: primaryColor }}>
                Re
              </span>
              <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
            </div>
          )}
          {mapped.referralNote && (
            <div className="cl-meta font-medium text-stone-600">{mapped.referralNote}</div>
          )}
        </div>
      )}

      {/* Type-Specific Details */}
      <CoverLetterDetailsBlock mapped={mapped} variant="normal" accentColor={primaryColor} />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 cl-meta font-semibold text-stone-800 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 cl-meta font-bold text-stone-900 break-words">
          {mapped.salutation}
        </div>
      )}

      {/* Body */}
      <CoverLetterBodyBlocks
        mapped={mapped}
        className="text-stone-800"
      />

      {/* Standardized Closing */}
      <CoverLetterClosingBlock
        mapped={mapped}
        containerClassName="mt-7 pt-4 avoid-break text-stone-800"
      />
    </div>
  );
};
