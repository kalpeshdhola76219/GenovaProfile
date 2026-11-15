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

export const ModernMinimalCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data, mapped: propMapped }) => {
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#0284c7';
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

  const initials = mapped.sender.fullName
    ? mapped.sender.fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : 'YN';

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
  if (mapped.sender.linkedin) {
    contactItems.push(<span key="li">{mapped.sender.linkedin}</span>);
  }
  if (mapped.sender.portfolio) {
    contactItems.push(<span key="web">{mapped.sender.portfolio}</span>);
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
      {/* Contemporary Minimal Header with Geometric Initials Mark */}
      {showHeader && (
        <div className="cl-header-block pb-5 mb-7 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {(mapped.sender.fullName || !isExportMode) && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white cl-meta font-bold tracking-wider shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                {showName && (
                  <h1 className="cl-name font-bold tracking-tight text-slate-900 break-words">
                    <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
                  </h1>
                )}
                {showTitle && (
                  <p
                    className="cl-title font-semibold mt-0.5 break-words"
                    style={{ color: primaryColor }}
                  >
                    <CoverLetterSampleText
                      value={mapped.sender.professionalTitle}
                      sample="Your Professional Title"
                    />
                  </p>
                )}
              </div>
            </div>

            {mapped.date && (
              <div className="text-right cl-meta font-medium text-slate-500 shrink-0">
                <div>{mapped.date}</div>
                {mapped.recipient.jobReferenceId && (
                  <div className="cl-meta text-slate-500 mt-0.5">
                    Ref: {mapped.recipient.jobReferenceId}
                  </div>
                )}
              </div>
            )}
          </div>

          <CoverLetterContactBar
            items={contactItems}
            separator={<>&bull;</>}
            separatorClassName="text-slate-300"
            className="mt-3.5 text-slate-500"
          />
        </div>
      )}

      {/* Recipient */}
      {showRecipient && (
        <div className="cl-recipient-block mb-5 cl-meta text-slate-700 space-y-0.5 break-words">
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

      {/* Subject + Referral Note */}
      {(showSubject || mapped.referralNote) && (
        <div className="mb-4 break-words space-y-0.5">
          {showSubject && (
            <div className="cl-meta font-bold text-slate-900">
              <span style={{ color: primaryColor }} className="mr-1.5">
                Subject:
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
