import React from 'react';
import { DocumentData } from '../../types/document';
import { mapCoverLetterData, MappedCoverLetterData } from '../../utils/mapCoverLetterData';
import {
  CL_METADATA_LEFT_STYLE,
  CL_METADATA_RIGHT_STYLE,
  CL_METADATA_ROW_STYLE,
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

export const ModernCorporateCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data: rawData, mapped: propMapped }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#1e3a8a';
  const paperColor = data.customization?.paperColor || '#ffffff';
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
        <CoverLetterSampleText value={mapped.sender.phone} sample="+91 98765 43210" required={!mapped.isEmailType} dark />
      </span>
    );
  }
  if (showEmail) {
    contactItems.push(
      <span key="email">
        <CoverLetterSampleText value={mapped.sender.email} sample="your.email@example.com" required={!mapped.isEmailType} dark />
      </span>
    );
  }
  if (showLocation) {
    contactItems.push(
      <span key="loc">
        <CoverLetterSampleText value={mapped.sender.locationLine} sample="City, State, Country" dark />
      </span>
    );
  }
  if (mapped.sender.linkedin) contactItems.push(<span key="li">{mapped.sender.linkedin}</span>);
  if (mapped.sender.portfolio) contactItems.push(<span key="web">{mapped.sender.portfolio}</span>);

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
      className={`document-page-sheet ${fontClass} relative text-slate-800`}
      style={{ backgroundColor: paperColor }}
    >
      {/* Corporate Navy Banner */}
      <div
        className="cl-header-block px-12 py-8 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        {showName && (
          <h1 className="cl-name font-bold tracking-tight text-white break-words">
            <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required dark />
          </h1>
        )}
        {showTitle && (
          <p className="cl-title font-medium text-white/85 uppercase tracking-[0.14em] mt-1 break-words">
            <CoverLetterSampleText
              value={mapped.sender.professionalTitle}
              sample="Your Professional Title"
              dark
            />
          </p>
        )}
        <CoverLetterContactBar
          items={contactItems}
          separator={<>&middot;</>}
          separatorClassName="text-white/40"
          className="mt-4 pt-3 border-t border-white/20 text-white/90"
        />
      </div>

      {/* Letter Content Body */}
      <div className={`cl-sheet-root ${paddingClass} pt-7`}>
        {(showRecipient || mapped.date) && (
          <div className="cl-recipient-block pb-4 mb-5 border-b border-slate-200" style={CL_METADATA_ROW_STYLE}>
            <div className="cl-meta text-slate-700 space-y-0.5 break-words" style={CL_METADATA_LEFT_STYLE}>
              {showRecipient && (
                <>
                  <div
                    className="cl-label font-bold uppercase tracking-widest mb-1"
                    style={{ color: primaryColor }}
                  >
                    Prepared For
                  </div>
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
                </>
              )}
            </div>

            {mapped.date && (
              <div className="text-right" style={CL_METADATA_RIGHT_STYLE}>
                <div className="cl-label font-bold uppercase tracking-widest text-slate-400">
                  Date
                </div>
                <div className="cl-meta font-semibold text-slate-800 mt-0.5">{mapped.date}</div>
                {mapped.recipient.jobReferenceId && (
                  <div className="cl-meta text-slate-500 mt-1">
                    Ref: {mapped.recipient.jobReferenceId}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subject Line + Referral Note */}
        {(showSubject || mapped.referralNote) && (
          <div className="mb-4 pb-2.5 border-b border-slate-100 break-words space-y-0.5">
            {showSubject && (
              <div>
                <span
                  className="cl-label font-bold uppercase tracking-widest mr-2"
                  style={{ color: primaryColor }}
                >
                  Subject
                </span>
                <span className="cl-meta font-bold text-slate-900">
                  <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
                </span>
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
          <div className="mb-2 cl-meta font-semibold text-slate-800 break-words">
            {mapped.throughLine}
          </div>
        )}

        {/* Salutation */}
        {mapped.salutation && (
          <div className="mb-4 cl-meta font-bold text-slate-900 break-words">
            {mapped.salutation}
          </div>
        )}

        {/* Body Paragraphs */}
        <CoverLetterBodyBlocks
          mapped={mapped}
          className="text-slate-700"
        />

        {/* Standardized Closing */}
        <CoverLetterClosingBlock
          mapped={mapped}
          containerClassName="mt-7 pt-4 avoid-break text-slate-700"
        />
      </div>
    </div>
  );
};
