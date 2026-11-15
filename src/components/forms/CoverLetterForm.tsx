import React, { useMemo, useState } from 'react';
import {
  CoverLetterData,
  CoverLetterDateFormat,
  CoverLetterJobSource,
  CoverLetterType,
  DocumentData,
} from '../../types/document';
import {
  analyzeLinkedInInput,
  checkJobTitleMentionedInBody,
  COVER_LETTER_TYPE_FIELDS,
  COVER_LETTER_TYPE_TIPS,
  COVER_LETTER_TYPES,
  formatCoverLetterCompanyText,
  formatCoverLetterDate,
  formatCoverLetterTitleText,
  mapCoverLetterData,
  validateCoverLetterFields,
} from '../../utils/mapCoverLetterData';
import {
  User,
  Building,
  FileEdit,
  Award,
  AlertCircle,
  RotateCcw,
  Info,
} from 'lucide-react';

interface CoverLetterFormProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
}

const COUNTRY_CODES = [
  { code: '+91', label: '+91 (IN)' },
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+971', label: '+971 (UAE)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+81', label: '+81 (JP)' },
];

const JOB_SOURCES: CoverLetterJobSource[] = [
  'LinkedIn',
  'Naukri',
  'Referral',
  'Company site',
  'Other',
];

const TITLE_AUTOFORMAT_KEYS = new Set<keyof CoverLetterData>([
  'currentRole',
  'referrerRole',
  'currentDepartment',
  'targetDepartment',
  'postName',
  'programOrPosition',
  'projectName',
]);

const COMPANY_AUTOFORMAT_KEYS = new Set<keyof CoverLetterData>([
  'currentCompany',
  'referrerCompany',
  'universityName',
]);

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'sender' | 'recipient' | 'body' | 'closing'>('sender');

  const cl: CoverLetterData = data.coverLetter || {};
  const currentType: CoverLetterType = cl.coverLetterType || 'experienced';
  const mapped = useMemo(() => mapCoverLetterData(data), [data]);
  const validation = useMemo(() => validateCoverLetterFields(data), [data]);
  const linkedInAnalysis = useMemo(
    () => analyzeLinkedInInput(data.contact.linkedin || ''),
    [data.contact.linkedin]
  );
  const typeFields = COVER_LETTER_TYPE_FIELDS[currentType] || [];
  const typeTip = COVER_LETTER_TYPE_TIPS[currentType];

  const updateFields = (updates: {
    personal?: Partial<DocumentData['personal']>;
    contact?: Partial<DocumentData['contact']>;
    coverLetter?: Partial<CoverLetterData>;
    customization?: Partial<DocumentData['customization']>;
  }) => {
    const nextCl: CoverLetterData = {
      ...cl,
      ...(updates.coverLetter || {}),
    };

    onChange({
      ...data,
      personal: updates.personal ? { ...data.personal, ...updates.personal } : data.personal,
      contact: updates.contact ? { ...data.contact, ...updates.contact } : data.contact,
      customization: updates.customization
        ? { ...data.customization, ...updates.customization }
        : data.customization,
      coverLetter: nextCl,
    });
  };

  const handleTypeChange = (newType: CoverLetterType) => {
    updateFields({
      coverLetter: {
        coverLetterType: newType,
        signOff:
          newType === 'government'
            ? 'Yours faithfully,'
            : cl.signOff === 'Yours faithfully,'
            ? 'Sincerely,'
            : cl.signOff || 'Sincerely,',
      },
    });
  };

  const handleDateFormatChange = (newFormat: CoverLetterDateFormat) => {
    const formatted = formatCoverLetterDate(cl.letterDate, newFormat, true);
    updateFields({
      coverLetter: {
        dateFormat: newFormat,
        letterDate: formatted,
      },
    });
  };

  const rawBodyValue = cl.letterBody || '';
  const { wordCount, recommendedMinWords, recommendedMaxWords } = mapped.metrics;

  const wordColorClass =
    wordCount === 0
      ? 'text-slate-500'
      : wordCount >= recommendedMinWords && wordCount <= recommendedMaxWords
      ? 'text-emerald-700'
      : 'text-amber-700';

  const companyFieldLabel =
    currentType === 'academic'
      ? 'University / Institution Name'
      : currentType === 'freelance'
      ? 'Client / Company Name'
      : 'Company / Organization Name';

  const jobFieldLabel =
    currentType === 'government'
      ? 'Post Name'
      : currentType === 'academic'
      ? 'Program or Position'
      : currentType === 'freelance'
      ? 'Project Name'
      : 'Job Title / Target Position';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-full">
      {/* COVER LETTER TYPE SELECTOR & REQUIRED PROGRESS HINT */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <label
              htmlFor="cover-letter-type-select"
              className="block text-xs font-bold uppercase tracking-wider text-slate-900"
            >
              Cover Letter Type
            </label>
            <p className="text-[11px] text-slate-500">
              {validation.requiredCompletedCount} of {validation.requiredTotalCount} required fields done
            </p>
          </div>
          <span className={`text-[11px] font-mono font-semibold shrink-0 ${wordColorClass}`}>
            {wordCount} words ({recommendedMinWords}&ndash;{recommendedMaxWords} rec.)
          </span>
        </div>

        <select
          id="cover-letter-type-select"
          value={currentType}
          onChange={(e) => handleTypeChange(e.target.value as CoverLetterType)}
          className="w-full min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0066FF] focus:outline-none cursor-pointer"
        >
          {COVER_LETTER_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        {validation.missingRequiredFields.length > 0 && mapped.previewMode === 'live' && (
          <div className="px-3 py-2 bg-amber-50/90 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Remaining required: {validation.missingRequiredFields.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* SECTION TABS (4 Scrollable Tabs, >= 40px tap target) */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-3 pt-2 gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('sender')}
          className={`flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'sender'
              ? 'bg-white text-[#0066FF] border-[#0066FF]'
              : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>1. Sender</span>
          {(validation.errors.fullName || validation.errors.email || validation.errors.phone) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recipient')}
          className={`flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'recipient'
              ? 'bg-white text-[#0066FF] border-[#0066FF]'
              : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>2. Date &amp; Recipient</span>
          {(validation.errors.companyName || validation.errors.jobTitle) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('body')}
          className={`flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'body'
              ? 'bg-white text-[#0066FF] border-[#0066FF]'
              : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>3. Letter Body</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('closing')}
          className={`flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'closing'
              ? 'bg-white text-[#0066FF] border-[#0066FF]'
              : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>4. Closing</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-5 text-xs">
        {/* ================================================================= */}
        {/* TAB 1: SENDER                                                     */}
        {/* ================================================================= */}
        {activeTab === 'sender' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sender Details</h3>
              <p className="text-xs text-slate-500">
                Updates your letterhead and contact bar in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={data.personal.fullName || ''}
                  onChange={(e) =>
                    updateFields({
                      personal: { fullName: e.target.value },
                      coverLetter: {
                        signatureName:
                          !cl.signatureName || cl.signatureName === data.personal.fullName
                            ? e.target.value
                            : cl.signatureName,
                      },
                    })
                  }
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl border bg-white ${
                    validation.errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {validation.errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {validation.errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={data.personal.professionalTitle || ''}
                  onChange={(e) =>
                    updateFields({ personal: { professionalTitle: e.target.value } })
                  }
                  placeholder="e.g. Senior Strategy & Operations Manager"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email Address {!mapped.isEmailType && <span className="text-rose-600">*</span>}
                </label>
                <input
                  type="email"
                  value={data.contact.email || ''}
                  onChange={(e) => updateFields({ contact: { email: e.target.value } })}
                  placeholder="e.g. rahul.sharma@example.com"
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl border bg-white ${
                    validation.errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {validation.errors.email && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {validation.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phone Number (+91 Default){' '}
                  {!mapped.isEmailType && <span className="text-rose-600">*</span>}
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={cl.phoneCountryCode || '+91'}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      const currentPhone = (data.contact.phone || '').replace(/^\+\d{1,4}\s*/, '');
                      updateFields({
                        contact: { phone: currentPhone ? `${newCode} ${currentPhone}` : '' },
                        coverLetter: { phoneCountryCode: newCode },
                      });
                    }}
                    className="min-h-[40px] px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-700 shrink-0 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={data.contact.phone || ''}
                    onChange={(e) => updateFields({ contact: { phone: e.target.value } })}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full min-h-[40px] px-3 py-2 rounded-xl border bg-white ${
                      validation.errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {validation.errors.phone && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {validation.errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={data.contact.city || ''}
                  onChange={(e) => updateFields({ contact: { city: e.target.value } })}
                  placeholder="e.g. Bengaluru / Ahmedabad"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State</label>
                <input
                  type="text"
                  value={data.contact.state || ''}
                  onChange={(e) => updateFields({ contact: { state: e.target.value } })}
                  placeholder="e.g. Karnataka / Gujarat"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={data.contact.country || ''}
                  onChange={(e) => updateFields({ contact: { country: e.target.value } })}
                  placeholder="e.g. India"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={data.contact.linkedin || ''}
                  onChange={(e) => updateFields({ contact: { linkedin: e.target.value } })}
                  onBlur={(e) => {
                    const res = analyzeLinkedInInput(e.target.value);
                    if (res.onBlurValue !== e.target.value) {
                      updateFields({ contact: { linkedin: res.onBlurValue } });
                    }
                  }}
                  placeholder="e.g. linkedin.com/in/rahulsharma"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                {linkedInAnalysis.typoDetected && linkedInAnalysis.suggestedFix && (
                  <div className="mt-1.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <span className="truncate">
                      Typo detected &mdash; did you mean{' '}
                      <strong className="font-semibold">{linkedInAnalysis.suggestedFix}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateFields({ contact: { linkedin: linkedInAnalysis.suggestedFix! } })
                      }
                      className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0 cursor-pointer"
                    >
                      Fix it
                    </button>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Portfolio / Website (Optional)
                </label>
                <input
                  type="text"
                  value={data.contact.portfolio || data.contact.website || ''}
                  onChange={(e) =>
                    updateFields({
                      contact: { portfolio: e.target.value, website: e.target.value },
                    })
                  }
                  placeholder="e.g. rahulsharma.co / github.com/rahulsharma"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: DATE, TYPE-SPECIFIC DETAILS & RECIPIENT                    */}
        {/* ================================================================= */}
        {activeTab === 'recipient' && (
          <div className="space-y-5">
            {/* Type-Specific Details Card (preserves typed data on type switch) */}
            {typeFields.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Type-specific details ({mapped.coverLetterTypeLabel})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Optional fields tailored for this letter type. Leave any field empty to hide it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {typeFields.map((fieldDef) => {
                    const rawVal = (cl[fieldDef.key] as string | undefined) || '';

                    if (fieldDef.optionalToggle && fieldDef.toggleKey) {
                      const isIncluded = Boolean(cl[fieldDef.toggleKey]);
                      return (
                        <div key={String(fieldDef.key)} className="sm:col-span-2 space-y-1.5">
                          <label className="inline-flex items-center gap-2 min-h-[40px] cursor-pointer select-none font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={(e) =>
                                updateFields({
                                  coverLetter: {
                                    [fieldDef.toggleKey!]: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
                            />
                            <span>Include {fieldDef.label} (Optional)</span>
                          </label>
                          {isIncluded && (
                            <input
                              type="text"
                              value={rawVal}
                              onChange={(e) =>
                                updateFields({
                                  coverLetter: { [fieldDef.key]: e.target.value },
                                })
                              }
                              placeholder={fieldDef.placeholder}
                              className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                            />
                          )}
                        </div>
                      );
                    }

                    if (fieldDef.inputType === 'select' && fieldDef.options) {
                      return (
                        <div key={String(fieldDef.key)}>
                          <label className="block text-slate-700 font-semibold mb-1">
                            {fieldDef.label}
                          </label>
                          <select
                            value={rawVal}
                            onChange={(e) =>
                              updateFields({
                                coverLetter: { [fieldDef.key]: e.target.value },
                              })
                            }
                            className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium cursor-pointer"
                          >
                            {fieldDef.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={String(fieldDef.key)}>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {fieldDef.label}
                        </label>
                        <input
                          type="text"
                          value={rawVal}
                          onChange={(e) => {
                            const val = e.target.value;
                            const extra: Partial<CoverLetterData> = { [fieldDef.key]: val };
                            if (fieldDef.key === 'postName' && !cl.jobTitle) extra.jobTitle = val;
                            if (fieldDef.key === 'programOrPosition' && !cl.jobTitle) extra.jobTitle = val;
                            if (fieldDef.key === 'projectName' && !cl.jobTitle) extra.jobTitle = val;
                            if (fieldDef.key === 'universityName' && !cl.companyName) extra.companyName = val;
                            updateFields({ coverLetter: extra });
                          }}
                          onBlur={(e) => {
                            const raw = e.target.value;
                            let formatted = raw;
                            if (TITLE_AUTOFORMAT_KEYS.has(fieldDef.key)) {
                              formatted = formatCoverLetterTitleText(raw);
                            } else if (COMPANY_AUTOFORMAT_KEYS.has(fieldDef.key)) {
                              formatted = formatCoverLetterCompanyText(raw);
                            } else {
                              return;
                            }
                            if (formatted !== raw) {
                              const extra: Partial<CoverLetterData> = { [fieldDef.key]: formatted };
                              if (
                                (fieldDef.key === 'postName' ||
                                  fieldDef.key === 'programOrPosition' ||
                                  fieldDef.key === 'projectName') &&
                                (!cl.jobTitle || cl.jobTitle === raw)
                              ) {
                                extra.jobTitle = formatted;
                              }
                              if (
                                fieldDef.key === 'universityName' &&
                                (!cl.companyName || cl.companyName === raw)
                              ) {
                                extra.companyName = formatted;
                              }
                              updateFields({ coverLetter: extra });
                            }
                          }}
                          placeholder={fieldDef.placeholder}
                          className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-slate-900">Date &amp; Recipient Details</h3>
              <p className="text-xs text-slate-500">
                Salutation automatically updates to &ldquo;{mapped.salutation}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!mapped.isEmailType && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Date Format (India / Global)
                    </label>
                    <select
                      value={cl.dateFormat || 'DD/MM/YYYY'}
                      onChange={(e) =>
                        handleDateFormatChange(e.target.value as CoverLetterDateFormat)
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium cursor-pointer"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (India Default)</option>
                      <option value="Month DD, YYYY">Month DD, YYYY (Global)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Letter Date (Auto-filled today, editable)
                    </label>
                    <input
                      type="text"
                      value={cl.letterDate ?? mapped.date}
                      onChange={(e) =>
                        updateFields({ coverLetter: { letterDate: e.target.value } })
                      }
                      placeholder={
                        cl.dateFormat === 'Month DD, YYYY' ? 'November 14, 2026' : '14/11/2026'
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hiring Manager Name
                </label>
                <input
                  type="text"
                  value={cl.hiringManagerName ?? ''}
                  onChange={(e) =>
                    updateFields({ coverLetter: { hiringManagerName: e.target.value } })
                  }
                  placeholder="e.g. Sarah Jenkins (leave empty for Hiring Manager)"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hiring Manager Title
                </label>
                <input
                  type="text"
                  value={cl.hiringManagerTitle ?? ''}
                  onChange={(e) =>
                    updateFields({ coverLetter: { hiringManagerTitle: e.target.value } })
                  }
                  onBlur={(e) => {
                    const formatted = formatCoverLetterTitleText(e.target.value);
                    if (formatted !== e.target.value) {
                      updateFields({ coverLetter: { hiringManagerTitle: formatted } });
                    }
                  }}
                  placeholder="e.g. Director of Talent Acquisition"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {companyFieldLabel}{' '}
                  {!mapped.isEmailType && <span className="text-rose-600">*</span>}
                </label>
                <input
                  type="text"
                  value={cl.companyName || ''}
                  onChange={(e) =>
                    updateFields({
                      coverLetter: {
                        companyName: e.target.value,
                        ...(currentType === 'academic' ? { universityName: e.target.value } : {}),
                      },
                    })
                  }
                  onBlur={(e) => {
                    const formatted = formatCoverLetterCompanyText(e.target.value);
                    if (formatted !== e.target.value) {
                      updateFields({
                        coverLetter: {
                          companyName: formatted,
                          ...(currentType === 'academic' ? { universityName: formatted } : {}),
                        },
                      });
                    }
                  }}
                  placeholder="e.g. Google Cloud & AI Systems"
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl border bg-white ${
                    validation.errors.companyName
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-300'
                  }`}
                />
                {validation.errors.companyName && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {validation.errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {jobFieldLabel} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={cl.jobTitle || ''}
                  onChange={(e) =>
                    updateFields({
                      coverLetter: {
                        jobTitle: e.target.value,
                        ...(currentType === 'government' ? { postName: e.target.value } : {}),
                        ...(currentType === 'academic' ? { programOrPosition: e.target.value } : {}),
                        ...(currentType === 'freelance' ? { projectName: e.target.value } : {}),
                      },
                    })
                  }
                  onBlur={(e) => {
                    const formatted = formatCoverLetterTitleText(e.target.value);
                    if (formatted !== e.target.value) {
                      updateFields({
                        coverLetter: {
                          jobTitle: formatted,
                          ...(currentType === 'government' ? { postName: formatted } : {}),
                          ...(currentType === 'academic' ? { programOrPosition: formatted } : {}),
                          ...(currentType === 'freelance' ? { projectName: formatted } : {}),
                        },
                      });
                    }
                  }}
                  placeholder="e.g. Senior Strategy & Operations Lead"
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl border bg-white ${
                    validation.errors.jobTitle
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-300'
                  }`}
                />
                {validation.errors.jobTitle && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {validation.errors.jobTitle}
                  </p>
                )}
              </div>

              {currentType !== 'government' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Job Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={cl.jobReferenceId ?? ''}
                    onChange={(e) =>
                      updateFields({ coverLetter: { jobReferenceId: e.target.value } })
                    }
                    placeholder="e.g. GOOG-29401"
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Job Source (Optional)
                </label>
                <select
                  value={cl.jobSource || ''}
                  onChange={(e) =>
                    updateFields({
                      coverLetter: { jobSource: e.target.value as CoverLetterJobSource },
                    })
                  }
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white cursor-pointer"
                >
                  <option value="">Select source (optional)</option>
                  {JOB_SOURCES.filter(Boolean).map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
                <label className="mt-1.5 inline-flex items-center gap-2 min-h-[36px] cursor-pointer select-none text-[11px] font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(cl.showApplicationSource)}
                    onChange={(e) =>
                      updateFields({
                        coverLetter: { showApplicationSource: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                  />
                  <span>Show where I found the job</span>
                </label>
              </div>

              {!mapped.isEmailType && (
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Company Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={cl.companyAddress || ''}
                    onChange={(e) =>
                      updateFields({ coverLetter: { companyAddress: e.target.value } })
                    }
                    placeholder="e.g. Prestige Technostar, Whitefield, Bengaluru"
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Custom Subject Line (Optional)
                </label>
                <input
                  type="text"
                  value={cl.subject || ''}
                  onChange={(e) =>
                    updateFields({ coverLetter: { subject: e.target.value } })
                  }
                  placeholder="Auto-fills from Job Title if left empty"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Custom Salutation (Optional)
                </label>
                <input
                  type="text"
                  value={cl.salutation || ''}
                  onChange={(e) =>
                    updateFields({ coverLetter: { salutation: e.target.value } })
                  }
                  placeholder={`Default: ${mapped.salutation}`}
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: LETTER BODY (Direct User Input Only)                       */}
        {/* ================================================================= */}
        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cover Letter Body</h3>
                <p className="text-xs text-slate-500">
                  Write your cover letter paragraphs below. Press Enter to start a new paragraph.
                </p>
              </div>
              {rawBodyValue.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    updateFields({
                      coverLetter: {
                        letterBody: '',
                      },
                    })
                  }
                  className="min-h-[40px] px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Per-type writing guidance tip */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
              <span>{typeTip}</span>
            </div>

            <div>
              <textarea
                rows={13}
                value={rawBodyValue}
                onChange={(e) =>
                  updateFields({
                    coverLetter: {
                      letterBody: e.target.value,
                    },
                  })
                }
                placeholder={typeTip}
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y min-h-[260px]"
              />
              {mapped.recipient.jobTitle &&
                rawBodyValue.trim().length > 0 &&
                !checkJobTitleMentionedInBody(mapped.recipient.jobTitle, rawBodyValue) && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Your subject says &lsquo;{mapped.recipient.jobTitle}&rsquo; but your letter does not mention it. Check the role name.
                    </span>
                  </div>
                )}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px]">
                <span className={`font-semibold ${wordColorClass}`}>
                  {mapped.paragraphs.length}{' '}
                  {mapped.paragraphs.length === 1 ? 'paragraph' : 'paragraphs'} &bull; {wordCount} words
                </span>
                <span className="text-slate-500">
                  Recommended ({mapped.coverLetterTypeLabel}): {recommendedMinWords}&ndash;{recommendedMaxWords} words
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: CLOSING & ENCLOSURES                                       */}
        {/* ================================================================= */}
        {activeTab === 'closing' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Closing, Signature &amp; Enclosures</h3>
              <p className="text-xs text-slate-500">
                Customize your sign-off, signature name, and optional enclosures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sign-Off</label>
                <input
                  type="text"
                  value={cl.signOff || ''}
                  onChange={(e) => updateFields({ coverLetter: { signOff: e.target.value } })}
                  placeholder="e.g. Sincerely, / Yours faithfully,"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Signature Name</label>
                <input
                  type="text"
                  value={cl.signatureName ?? ''}
                  onChange={(e) =>
                    updateFields({ coverLetter: { signatureName: e.target.value } })
                  }
                  placeholder={data.personal.fullName || 'e.g. Rahul Sharma'}
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Enclosures (Optional, e.g. Resume, Certificates)
                </label>
                <input
                  type="text"
                  value={cl.enclosures || ''}
                  onChange={(e) => updateFields({ coverLetter: { enclosures: e.target.value } })}
                  placeholder="e.g. Resume, Degree Certificates (leave empty to hide)"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              {currentType === 'government' && (
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Declaration Line (Optional &mdash; Government / PSU)
                  </label>
                  <input
                    type="text"
                    value={cl.declarationLine || ''}
                    onChange={(e) =>
                      updateFields({ coverLetter: { declarationLine: e.target.value } })
                    }
                    placeholder="e.g. I hereby declare that all statements made in this application are true and complete."
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
