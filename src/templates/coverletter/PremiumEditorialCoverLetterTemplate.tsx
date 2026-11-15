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

export const PremiumEditorialCoverLetterTemplate: React.FC<{
  data: DocumentData;
  mapped?: MappedCoverLetterData;
}> = ({ data, mapped: propMapped }) => {
  const mapped = propMapped || mapCoverLetterData(data);
  const { isExportMode, previewMode } = useCoverLetterPreviewMode();
  const primaryColor = data.customization?.primaryColor || '#292524';
  const paperColor = data.customization?.paperColor || '#ffffff';
  const { fontClass, paddingClass } = getCoverLetterSheetTypography(
    data.customization,
    'cormorant'
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
  if (mapped.sender.linkedin) {
    contactItems.push(<span key="li">{mapped.sender.linkedin}</span>);
  }
  if (mapped.sender.portfolio) {
    contactItems.push(<span key="web">{mapped.sender.portfolio}</span>);
  }

  const showHeader = Boolean(showName || showTitle || contactItems.length > 0);
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
      className={`document-page-sheet cl-sheet-root ${paddingClass} ${fontClass} relative text-stone-900`}
      style={{ backgroundColor: paperColor }}
    >
      {/* Editorial Monograph Centered Masthead */}
      {showHeader && (
        <div className="cl-header-block text-center pb-6 mb-7 border-b border-stone-300">
          {showName && (
            <h1
              className="cl-name font-semibold tracking-tight break-words"
              style={{ color: primaryColor }}
            >
              <CoverLetterSampleText value={mapped.sender.fullName} sample="Your Name" required />
            </h1>
          )}
          {showTitle && (
            <p className="cl-title font-sans font-semibold uppercase tracking-[0.22em] text-stone-500 mt-1.5 break-words">
              <CoverLetterSampleText
                value={mapped.sender.professionalTitle}
                sample="Your Professional Title"
              />
            </p>
          )}
          <CoverLetterContactBar
            items={contactItems}
            separator={<>&bull;</>}
            separatorClassName="text-stone-300"
            center
            className="mt-3 font-sans text-stone-600"
          />
        </div>
      )}

      {/* Date & Recipient */}
      {(showRecipient || mapped.date) && (
        <div className="cl-recipient-block flex items-start justify-between gap-6 mb-6 font-sans cl-meta">
          <div className="text-stone-800 space-y-0.5 break-words flex-1">
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
            <div className="text-right font-medium text-stone-500 shrink-0">
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
        <div className="mb-5 pb-2.5 border-b border-stone-200 font-sans break-words space-y-0.5">
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
      <CoverLetterDetailsBlock mapped={mapped} variant="normal" accentColor={primaryColor} />

      {/* Internal Transfer Through Line */}
      {mapped.throughLine && (
        <div className="mb-2 font-sans cl-meta font-semibold text-stone-800 break-words">
          {mapped.throughLine}
        </div>
      )}

      {/* Salutation */}
      {mapped.salutation && (
        <div className="mb-4 font-sans cl-meta font-bold text-stone-900 break-words">
          {mapped.salutation}
        </div>
      )}

      {/* Body */}
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
