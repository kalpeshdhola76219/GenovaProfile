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

export const TechLeadCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data: rawData, mapped: propMapped }) => {
  const data = sanitizeDocumentTextFields(rawData);
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#1e293b';
  const paperColor = data.customization?.paperColor || '#ffffff';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'jakarta'
  );

  const showName = shouldShowCoverLetterSlot(mapped.sender.fullName, previewMode, isExportMode, true);
  const showTitle = shouldShowCoverLetterSlot(mapped.sender.professionalTitle, previewMode, isExportMode, false);
  const showEmail = shouldShowCoverLetterSlot(mapped.sender.email, previewMode, isExportMode, !mapped.isEmailType);
  const showPhone = shouldShowCoverLetterSlot(mapped.sender.phone, previewMode, isExportMode, !mapped.isEmailType);
  const showLocation = shouldShowCoverLetterSlot(mapped.sender.locationLine, previewMode, isExportMode, false);

  const contactItems: React.ReactNode[] = [];
  if (showEmail) {
    contactItems.push(
      <span key="email">
        <CoverLetterSampleText
          value={mapped.sender.email}
          sample="your.email@example.com"
          required={!mapped.isEmailType}
        />
      </span>
    );
  }
  if (showPhone) {
    contactItems.push(
      <span key="phone">
        <CoverLetterSampleText
          value={mapped.sender.phone}
          sample="+91 98765 43210"
          required={!mapped.isEmailType}
        />
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
  if (mapped.sender.portfolio) {
    contactItems.push(<span key="web">{mapped.sender.portfolio}</span>);
  }
  if (mapped.sender.linkedin) {
    contactItems.push(<span key="li">{mapped.sender.linkedin}</span>);
  }

  const showHeader = Boolean(showName || showTitle || contactItems.length > 0 || mapped.date);
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
      className={`document-page-sheet cl-sheet-root ${paddingClass} ${fontClass} relative text-slate-800`}
      style={{ backgroundColor: paperColor }}
    >
      {/* Clean Geometric Engineering Header (No code-comment prefixes) */}
      {showHeader && (
        <div
          className="cl-header-block pb-5 mb-6"
          style={{ borderBottom: `2px solid ${primaryColor}` }}
        >
          <div style={CL_METADATA_ROW_STYLE}>
            <div className="min-w-0" style={CL_METADATA_LEFT_STYLE}>
              {showName && (
                <h1
                  className="cl-name font-extrabold tracking-tight break-words"
                  style={{ color: primaryColor }}
                >
                  <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
                </h1>
              )}
              {showTitle && (
                <p className="cl-title font-semibold text-slate-600 mt-1 break-words">
                  <CoverLetterSampleText
                    value={mapped.sender.professionalTitle}
                    sample="Your Professional Title"
                  />
                </p>
              )}
            </div>

            {mapped.date && (
              <div className="text-right font-jetbrains cl-meta text-slate-500 pt-1" style={CL_METADATA_RIGHT_STYLE}>
                {mapped.date}
              </div>
            )}
          </div>

          <CoverLetterContactBar
            items={contactItems}
            separator="|"
            separatorClassName="text-slate-300"
            className="mt-3 font-jetbrains text-slate-600"
          />
        </div>
      )}

      {/* Structured Recipient & Role Row */}
      {(showRecipient || showSubject || mapped.referralNote) && (
        <div className="cl-recipient-block mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-12 gap-4 cl-meta">
          {showRecipient && (
            <div className="col-span-7 space-y-0.5 break-words">
              <div className="cl-label font-bold uppercase tracking-widest text-slate-400 mb-1">
                Recipient
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
            </div>
          )}

          {(showSubject || mapped.referralNote) && (
            <div
              className={`${
                showRecipient ? 'col-span-5 border-l border-slate-200 pl-4' : 'col-span-12'
              } space-y-1 break-words`}
            >
              {showSubject && (
                <>
                  <div className="cl-label font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Role / Subject
                  </div>
                  <div className="font-bold text-slate-900">
                    <CoverLetterSampleText value={mapped.subjectLine} sample="Application for Job Title" required />
                  </div>
                </>
              )}
              {mapped.referralNote && (
                <div className="cl-meta font-medium text-slate-600">{mapped.referralNote}</div>
              )}
              {mapped.recipient.jobReferenceId && (
                <div className="font-jetbrains cl-label text-slate-500 pt-0.5">
                  Ref: {mapped.recipient.jobReferenceId}
                </div>
              )}
            </div>
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

      {/* Body */}
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
  );
};
