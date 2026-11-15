import {
  CoverLetterData,
  CoverLetterDateFormat,
  CoverLetterJobSource,
  CoverLetterNameStyle,
  CoverLetterType,
  DocumentData,
} from '../types/document';

export interface CoverLetterTypeConfig {
  id: CoverLetterType;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
}

export interface FieldDef {
  key: keyof CoverLetterData;
  label: string;
  placeholder: string;
  required?: boolean;
  optionalToggle?: boolean;
  toggleKey?: keyof CoverLetterData;
  inputType?: 'text' | 'select';
  options?: Array<{ value: string; label: string }>;
}

export const COVER_LETTER_TYPES: CoverLetterTypeConfig[] = [
  {
    id: 'experienced',
    number: 1,
    label: '1. Job Application (Experienced)',
    shortLabel: 'Experienced',
    description: 'Standard professional cover letter for experienced candidates.',
  },
  {
    id: 'fresher',
    number: 2,
    label: '2. Fresher / Graduate',
    shortLabel: 'Fresher / Graduate',
    description: 'Clean application format for recent graduates and entry-level roles.',
  },
  {
    id: 'internship',
    number: 3,
    label: '3. Internship',
    shortLabel: 'Internship',
    description: 'Application letter tailored for student and summer/winter internships.',
  },
  {
    id: 'career-change',
    number: 4,
    label: '4. Career Change',
    shortLabel: 'Career Change',
    description: 'Formal layout suited for transitioning across roles or industries.',
  },
  {
    id: 'referral',
    number: 5,
    label: '5. Referral-Based Application',
    shortLabel: 'Referral',
    description: 'Application letter highlighting an employee or colleague referral.',
  },
  {
    id: 'cold',
    number: 6,
    label: '6. Cold / Unsolicited (no vacancy advertised)',
    shortLabel: 'Cold / Unsolicited',
    description: 'Proactive outreach letter to an organization without a listed opening.',
  },
  {
    id: 'internal-transfer',
    number: 7,
    label: '7. Internal Transfer / Promotion',
    shortLabel: 'Internal Transfer',
    description: 'Internal application format for moving departments or advancing.',
  },
  {
    id: 'government',
    number: 8,
    label: '8. Government / PSU Job',
    shortLabel: 'Government / PSU',
    description: 'Formal application with Post Name, Advertisement No., Category, and Declaration.',
  },
  {
    id: 'academic',
    number: 9,
    label: '9. Academic / Research / Scholarship',
    shortLabel: 'Academic / Research',
    description: 'Application format for universities, research fellowships, or scholarships.',
  },
  {
    id: 'remote',
    number: 10,
    label: '10. Remote / International Job',
    shortLabel: 'Remote / Global',
    description: 'International application layout for remote or cross-border roles.',
  },
  {
    id: 'freelance',
    number: 11,
    label: '11. Freelance / Proposal Cover Letter',
    shortLabel: 'Freelance / Proposal',
    description: 'Client proposal cover letter format for freelance engagements.',
  },
  {
    id: 'email',
    number: 12,
    label: '12. Email Cover Letter (short email-body version)',
    shortLabel: 'Email Cover Letter',
    description: 'Concise 60–150 word email format with auto Subject line and no address block.',
  },
];

export const COVER_LETTER_TYPE_FIELDS: Record<CoverLetterType, FieldDef[]> = {
  experienced: [
    {
      key: 'currentCompany',
      label: 'Current / Last Company',
      placeholder: 'e.g. McKinsey & Company',
    },
    {
      key: 'currentRole',
      label: 'Current / Last Role',
      placeholder: 'e.g. Engagement Manager',
    },
    {
      key: 'totalExperienceYears',
      label: 'Total Experience',
      placeholder: 'e.g. 6 Years',
    },
    {
      key: 'willingToRelocate',
      label: 'Willing to Relocate',
      placeholder: 'Select option',
      inputType: 'select',
      options: [
        { value: '', label: 'Not specified' },
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      key: 'noticePeriod',
      label: 'Notice Period',
      placeholder: 'e.g. 30 Days / Immediate',
      optionalToggle: true,
      toggleKey: 'showNoticePeriod',
    },
    {
      key: 'expectedSalary',
      label: 'Expected Salary',
      placeholder: 'e.g. ₹22 LPA',
      optionalToggle: true,
      toggleKey: 'showExpectedSalary',
    },
  ],
  fresher: [
    {
      key: 'degree',
      label: 'Degree',
      placeholder: 'e.g. B.Tech in Computer Science',
    },
    {
      key: 'collegeName',
      label: 'College / University',
      placeholder: 'e.g. NIT Surat',
    },
    {
      key: 'graduationYear',
      label: 'Graduation Year',
      placeholder: 'e.g. 2026',
    },
    {
      key: 'cgpaOrPercentage',
      label: 'CGPA / Percentage',
      placeholder: 'e.g. 8.7 CGPA / 84%',
    },
    {
      key: 'availableFrom',
      label: 'Available From',
      placeholder: 'e.g. Immediate / June 2026',
    },
  ],
  internship: [
    {
      key: 'degree',
      label: 'Degree / Program',
      placeholder: 'e.g. B.E. Information Technology',
    },
    {
      key: 'collegeName',
      label: 'College / University',
      placeholder: 'e.g. DAIICT Gandhinagar',
    },
    {
      key: 'graduationYear',
      label: 'Graduation Year',
      placeholder: 'e.g. 2027',
    },
    {
      key: 'internshipDuration',
      label: 'Internship Duration',
      placeholder: 'e.g. 6 Months',
    },
    {
      key: 'availableFrom',
      label: 'Available From',
      placeholder: 'e.g. May 2026',
    },
  ],
  'career-change': [
    {
      key: 'previousField',
      label: 'Previous Field',
      placeholder: 'e.g. Mechanical Operations',
    },
    {
      key: 'newField',
      label: 'Target New Field',
      placeholder: 'e.g. Product Analytics',
    },
    {
      key: 'transferableSkills',
      label: 'Transferable Skills',
      placeholder: 'e.g. SQL, Stakeholder Management, Lean Six Sigma',
    },
    {
      key: 'relevantCourses',
      label: 'Relevant Courses / Certifications',
      placeholder: 'e.g. Google Data Analytics Professional Certificate',
    },
  ],
  referral: [
    {
      key: 'referrerName',
      label: 'Referrer Name',
      placeholder: 'e.g. Ananya Desai',
    },
    {
      key: 'referrerRole',
      label: 'Referrer Role',
      placeholder: 'e.g. Staff Software Engineer',
    },
    {
      key: 'referrerCompany',
      label: 'Referrer Company',
      placeholder: 'e.g. Razorpay',
    },
    {
      key: 'howYouKnowReferrer',
      label: 'How You Know Referrer',
      placeholder: 'e.g. Former colleague at Infosys',
    },
  ],
  cold: [
    {
      key: 'areaYouCanAddValue',
      label: 'Area You Can Add Value',
      placeholder: 'e.g. Reducing enterprise onboarding cycle times by 35%',
    },
    {
      key: 'companyAchievementOrNews',
      label: 'Company Achievement / News',
      placeholder: 'e.g. Recent Series B expansion into APAC',
    },
  ],
  'internal-transfer': [
    {
      key: 'currentDepartment',
      label: 'Current Department',
      placeholder: 'e.g. Customer Operations',
    },
    {
      key: 'targetDepartment',
      label: 'Target Department',
      placeholder: 'e.g. Product Operations',
    },
    {
      key: 'yearsInCompany',
      label: 'Years in Company',
      placeholder: 'e.g. 3.5 Years',
    },
    {
      key: 'managerName',
      label: 'Current Manager Name',
      placeholder: 'e.g. Vikram Mehta',
    },
  ],
  government: [
    {
      key: 'postName',
      label: 'Post Name',
      placeholder: 'e.g. Assistant Executive Engineer',
    },
    {
      key: 'advertisementNumber',
      label: 'Advertisement Number',
      placeholder: 'e.g. ONGC/RECT/2026/04',
    },
    {
      key: 'category',
      label: 'Category',
      placeholder: 'e.g. General / OBC / SC / ST / EWS',
    },
    {
      key: 'qualification',
      label: 'Qualification',
      placeholder: 'e.g. B.E. (Civil) First Class',
    },
    {
      key: 'languagesKnown',
      label: 'Languages Known',
      placeholder: 'e.g. English, Hindi, Gujarati',
    },
    {
      key: 'declarationLine',
      label: 'Declaration Line',
      placeholder:
        'e.g. I hereby declare that all statements made in this application are true and complete.',
    },
  ],
  academic: [
    {
      key: 'programOrPosition',
      label: 'Program or Position',
      placeholder: 'e.g. PhD Fellowship in Machine Learning',
    },
    {
      key: 'universityName',
      label: 'University / Institution',
      placeholder: 'e.g. IISc Bengaluru',
    },
    {
      key: 'highestQualification',
      label: 'Highest Qualification',
      placeholder: 'e.g. M.Tech in AI & Data Science',
    },
    {
      key: 'gpaOrCgpa',
      label: 'GPA / CGPA',
      placeholder: 'e.g. 9.2 / 10.0',
    },
    {
      key: 'researchInterest',
      label: 'Research Interest',
      placeholder: 'e.g. Low-resource Indic NLP & Safety',
    },
    {
      key: 'professorOrSupervisorName',
      label: 'Professor / Supervisor Name',
      placeholder: 'e.g. Prof. Arvind Rao',
    },
  ],
  remote: [
    {
      key: 'timezone',
      label: 'Timezone',
      placeholder: 'e.g. IST (UTC+5:30)',
    },
    {
      key: 'workAuthorization',
      label: 'Work Authorization',
      placeholder: 'e.g. Eligible for Global Remote / Contractor',
    },
    {
      key: 'englishLevel',
      label: 'English Level',
      placeholder: 'e.g. Fluent / C2 Native-level',
    },
    {
      key: 'overlapHoursAvailable',
      label: 'Overlap Hours Available',
      placeholder: 'e.g. 5 hours EST / Full GMT',
    },
    {
      key: 'countryOfCompany',
      label: 'Country of Company',
      placeholder: 'e.g. United Kingdom',
    },
  ],
  freelance: [
    {
      key: 'clientName',
      label: 'Client Name',
      placeholder: 'e.g. Rohan Kapoor',
    },
    {
      key: 'projectName',
      label: 'Project Name',
      placeholder: 'e.g. SaaS Billing Portal Redesign',
    },
    {
      key: 'servicesOffered',
      label: 'Services Offered',
      placeholder: 'e.g. UX Architecture & React Implementation',
    },
    {
      key: 'deliveryTimeline',
      label: 'Delivery Timeline',
      placeholder: 'e.g. 4 Weeks',
    },
    {
      key: 'priceOrRate',
      label: 'Price / Rate',
      placeholder: 'e.g. ₹85,000 fixed / $45 per hour',
    },
    {
      key: 'pastWorkLinks',
      label: 'Past Work Links',
      placeholder: 'e.g. rahulsharma.co/work',
    },
  ],
  email: [],
};

export const COVER_LETTER_TYPE_TIPS: Record<CoverLetterType, string> = {
  experienced:
    'What to write in each paragraph: (1) State the target role and years of experience; (2) Highlight 2–3 measurable career achievements; (3) Explain why your leadership fits the company and close with an interview request.',
  fresher:
    'What to write in each paragraph: (1) State your degree, college, and target entry-level role; (2) Describe relevant academic projects, labs, or campus leadership; (3) Show enthusiasm to learn and contribute from day one.',
  internship:
    'What to write in each paragraph: (1) Mention your current program, availability window, and internship role; (2) Highlight coursework, technical projects, or hackathons; (3) Express eagerness to support the team.',
  'career-change':
    'What to write in each paragraph: (1) Explain your transition from your previous field to the new field; (2) Connect transferable skills and recent coursework to the role; (3) Reaffirm readiness and commitment.',
  referral:
    'What to write in each paragraph: (1) Mention who referred you and why you are applying; (2) Present relevant impact aligned with team needs; (3) Thank the hiring team and request a conversation.',
  cold:
    'What to write in each paragraph: (1) Reference a recent company milestone and why you admire them; (2) Pitch the specific area where you can add immediate value; (3) Suggest a brief exploratory call.',
  'internal-transfer':
    'What to write in each paragraph: (1) Note your current role, tenure, and interest in the target department; (2) Share measurable internal results; (3) Explain how your institutional knowledge accelerates the new team.',
  government:
    'What to write in each paragraph: (1) Cite the exact post name and advertisement number; (2) Summarize educational eligibility and statutory qualifications; (3) Affirm readiness for verification and service.',
  academic:
    'What to write in each paragraph: (1) State the program/fellowship and supervisor alignment; (2) Outline your academic background and research interests; (3) Describe your motivation and long-term scholarly goals.',
  remote:
    'What to write in each paragraph: (1) State the remote role, timezone overlap, and async communication strengths; (2) Prove independent delivery with distributed outcomes; (3) Confirm work setup and availability.',
  freelance:
    'What to write in each paragraph: (1) Summarize your understanding of the client project scope; (2) Outline your deliverables, timeline, and relevant past work; (3) Propose a kickoff call and next steps.',
  email:
    'What to write in each paragraph: Keep it concise (60–150 words). (1) One sentence naming the role and your strongest credential; (2) 2–3 lines of proof or impact; (3) Brief sign-off inviting a call.',
};

export function getCoverLetterWordRange(type: CoverLetterType): { min: number; max: number } {
  if (type === 'email') return { min: 60, max: 150 };
  if (type === 'fresher' || type === 'internship') return { min: 200, max: 300 };
  if (type === 'government' || type === 'academic') return { min: 300, max: 400 };
  return { min: 250, max: 350 };
}

export interface CoverLetterBodyBlock {
  id: string;
  number: number;
  label: string;
  text: string;
  wordCount: number;
}

export interface CoverLetterDetailItem {
  label: string;
  value: string;
}

export interface MappedCoverLetterData {
  previewMode: 'sample' | 'live';
  coverLetterType: CoverLetterType;
  coverLetterTypeLabel: string;
  isEmailType: boolean;
  dateFormat: CoverLetterDateFormat;
  nameStyle: CoverLetterNameStyle;
  date: string;
  sender: {
    fullName: string;
    professionalTitle: string;
    companyName: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    country: string;
    locationLine: string;
    linkedin: string;
    github: string;
    portfolio: string;
    hasContactInfo: boolean;
  };
  recipient: {
    hiringManagerName: string;
    hiringManagerTitle: string;
    companyName: string;
    companyAddress: string;
    jobTitle: string;
    jobReferenceId: string;
    jobSource: CoverLetterJobSource;
    hasRecipientBlock: boolean;
    companyRequired: boolean;
  };
  subjectLine: string;
  referralNote: string;
  throughLine: string;
  freelanceSummaryLine: string;
  salutation: string;
  details: CoverLetterDetailItem[];
  blocks: CoverLetterBodyBlock[];
  paragraphs: string[];
  closing: {
    signOff: string;
    signatureName: string;
    signatureType: 'text' | 'image';
    signatureImage: string;
    handwrittenSignature: boolean;
    enclosures: string;
    declarationLine: string;
  };
  metrics: {
    wordCount: number;
    recommendedMinWords: number;
    recommendedMaxWords: number;
    longestParagraphIndex: number;
  };
}

function cleanStr(val: unknown): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (s === 'undefined' || s === 'null') return '';
  return s;
}

export function countWords(text: string): number {
  const cleaned = cleanStr(text);
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function formatCoverLetterDate(
  rawDate?: string,
  format: CoverLetterDateFormat = 'DD/MM/YYYY',
  autoFillToday: boolean = true
): string {
  const cleaned = cleanStr(rawDate);
  let dateObj: Date | null = null;

  if (cleaned) {
    const dmyMatch = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const candidate = new Date(year, month, day);
      if (!isNaN(candidate.getTime())) {
        dateObj = candidate;
      }
    } else {
      const parsed = new Date(cleaned);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      } else {
        return cleaned;
      }
    }
  } else if (autoFillToday) {
    dateObj = new Date();
  }

  if (!dateObj) return '';

  if (format === 'DD/MM/YYYY') {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

export interface CoverLetterTypeScaleLevel {
  level: number;
  namePt: number;
  titlePt: number;
  bodyPt: number;
  metaPt: number;
  labelPt: number;
  lineBody: number;
  lineMeta: number;
}

export const COVER_LETTER_TYPE_SCALE: CoverLetterTypeScaleLevel[] = [
  { level: 0, namePt: 22, titlePt: 9.5, bodyPt: 11, metaPt: 10, labelPt: 8, lineBody: 1.5, lineMeta: 1.4 },
  { level: 1, namePt: 21, titlePt: 9.5, bodyPt: 10.75, metaPt: 9.75, labelPt: 8, lineBody: 1.47, lineMeta: 1.4 },
  { level: 2, namePt: 20, titlePt: 9, bodyPt: 10.5, metaPt: 9.5, labelPt: 7.75, lineBody: 1.44, lineMeta: 1.4 },
  { level: 3, namePt: 19, titlePt: 9, bodyPt: 10.25, metaPt: 9.25, labelPt: 7.5, lineBody: 1.41, lineMeta: 1.4 },
  { level: 4, namePt: 18, titlePt: 9, bodyPt: 10, metaPt: 9, labelPt: 7.5, lineBody: 1.38, lineMeta: 1.4 },
  { level: 5, namePt: 18, titlePt: 8.5, bodyPt: 10, metaPt: 9, labelPt: 7.5, lineBody: 1.35, lineMeta: 1.4 },
];

const KEEP_UPPER_ACRONYMS = new Set([
  'HR',
  'SAP',
  'GST',
  'TDS',
  'IT',
  'MBA',
  'PSU',
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'VP',
  'AVP',
  'SVP',
  'EVP',
  'MD',
  'GM',
  'UI',
  'UX',
  'AI',
  'ML',
  'QA',
  'AWS',
  'GCP',
  'SQL',
  'API',
  'B2B',
  'B2C',
  'R&D',
  'CA',
  'CS',
  'LLP',
  'ONGC',
  'TCS',
  'IBM',
  'ERP',
  'CRM',
  'SEO',
  'SEM',
  'MIS',
]);

const LOWERCASE_CONNECTORS = new Set(['of', 'and', 'in', 'for', 'the', 'at', 'to', 'on', 'by', 'with', 'or']);

function formatTitleWord(word: string, isEdgeWord: boolean): string {
  if (!word) return word;
  const upperClean = word.replace(/[^a-zA-Z0-9&]/g, '').toUpperCase();
  if (KEEP_UPPER_ACRONYMS.has(upperClean)) {
    return word.replace(/[a-zA-Z0-9&]+/, upperClean);
  }
  // Preserve intentional mixed camel/brand case (e.g., McKinsey, iOS, GitHub)
  if (/[a-z]/.test(word) && /[A-Z]/.test(word) && !/^[A-Z][a-z]+$/.test(word)) {
    return word;
  }
  const lower = word.toLowerCase();
  if (!isEdgeWord && LOWERCASE_CONNECTORS.has(lower)) {
    return lower;
  }
  return word.replace(/[a-zA-Z]+/, (alpha) => alpha.charAt(0).toUpperCase() + alpha.slice(1).toLowerCase());
}

export function formatCoverLetterTitleText(raw: string): string {
  const collapsed = cleanStr(raw).replace(/\s+/g, ' ');
  if (!collapsed) return '';
  const words = collapsed.split(' ');
  return words
    .map((w, idx) => formatTitleWord(w, idx === 0 || idx === words.length - 1))
    .join(' ');
}

export function formatCoverLetterCompanyText(raw: string): string {
  const collapsed = cleanStr(raw).replace(/\s+/g, ' ');
  if (!collapsed) return '';
  const words = collapsed.split(' ');
  let formatted = words
    .map((w, idx) => formatTitleWord(w, idx === 0 || idx === words.length - 1))
    .join(' ');

  // Normalize legal suffixes cleanly
  formatted = formatted
    .replace(/\bpvt\.?\s+ltd\.?$/i, 'Pvt. Ltd.')
    .replace(/\bprivate\s+limited$/i, 'Private Limited')
    .replace(/\blimited$/i, 'Limited')
    .replace(/\bllp$/i, 'LLP');

  return formatted;
}

const NAME_SMALL_PARTICLES = new Set([
  'de',
  'da',
  'do',
  'dos',
  'del',
  'della',
  'van',
  'von',
  'der',
  'den',
  'bin',
  'binti',
  'ibn',
  'al',
  'el',
  'of',
  'and',
  'the',
]);

function formatNameToken(token: string, isFirstWord: boolean): string {
  if (!token) return token;

  // Handle dotted initials like "a.", "a.p.j.", "A.P.J."
  if (/^(?:[a-zA-Z]\.)+[a-zA-Z]?$/.test(token)) {
    return token.toUpperCase();
  }

  // Handle lowercase particles when not the leading word
  const lower = token.toLowerCase();
  if (!isFirstWord && NAME_SMALL_PARTICLES.has(lower)) {
    return lower;
  }

  // Handle hyphenated and apostrophe-separated parts (e.g. "jean-luc", "o'connor")
  return token
    .split('-')
    .map((hyphenPart) =>
      hyphenPart
        .split("'")
        .map((aposPart, aposIdx) => {
          if (!aposPart) return aposPart;
          // Preserve single-letter prefix lowercase before apostrophe if particle like d'Souza? Standard Title Case: D'Souza / O'Connor
          if (aposIdx > 0 && aposPart.length === 1) {
            return aposPart.toLowerCase();
          }
          return aposPart.charAt(0).toUpperCase() + aposPart.slice(1).toLowerCase();
        })
        .join("'")
    )
    .join('-');
}

export function formatCoverLetterPersonName(
  raw: string,
  style: CoverLetterNameStyle = 'as-typed'
): string {
  const cleaned = cleanStr(raw);
  if (!cleaned) return '';
  if (style === 'uppercase') {
    return cleaned.toUpperCase();
  }
  if (style === 'title-case') {
    const words = cleaned.replace(/\s+/g, ' ').split(' ');
    return words.map((w, idx) => formatNameToken(w, idx === 0)).join(' ');
  }
  return cleaned;
}

const LINKEDIN_TYPOS = ['linkdlen', 'linkdin', 'linkedn', 'linkedinn'];

export function analyzeLinkedInInput(raw: string): {
  onBlurValue: string;
  typoDetected: string | null;
  suggestedFix: string | null;
} {
  const trimmed = cleanStr(raw);
  if (!trimmed) {
    return { onBlurValue: '', typoDetected: null, suggestedFix: null };
  }

  const lower = trimmed.toLowerCase();
  for (const typo of LINKEDIN_TYPOS) {
    if (lower.includes(typo)) {
      const fixed = trimmed.replace(new RegExp(typo, 'gi'), 'linkedin');
      return {
        onBlurValue: trimmed,
        typoDetected: typo,
        suggestedFix: fixed,
      };
    }
  }

  // Bare username (no dots, no slashes, no spaces) -> prefix linkedin.com/in/
  const cleanedHandle = trimmed.replace(/^@+/, '');
  if (!/[./\s]/.test(cleanedHandle)) {
    return {
      onBlurValue: `linkedin.com/in/${cleanedHandle}`,
      typoDetected: null,
      suggestedFix: null,
    };
  }

  // Handle "in/username" or "/in/username"
  if (/^\/?in\/[^/\s]+$/i.test(cleanedHandle)) {
    const normalized = cleanedHandle.replace(/^\/+/, '');
    return {
      onBlurValue: `linkedin.com/${normalized}`,
      typoDetected: null,
      suggestedFix: null,
    };
  }

  return { onBlurValue: trimmed, typoDetected: null, suggestedFix: null };
}

function normalizeForMentionMatch(str: string): string {
  return str
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/\band\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function checkJobTitleMentionedInBody(jobTitle: string, bodyText: string): boolean {
  const normTitle = normalizeForMentionMatch(jobTitle);
  const normBody = normalizeForMentionMatch(bodyText);
  if (!normTitle || !normBody) return true;
  return normBody.includes(normTitle);
}

function parseUserBodyParagraphs(cl: CoverLetterData): CoverLetterBodyBlock[] {
  const rawBody = cleanStr(cl.letterBody);
  if (!rawBody) return [];

  const rawParagraphs = rawBody
    .split(/\r?\n+/)
    .map((p) => p.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);

  return rawParagraphs.map((para, idx) => ({
    id: `para_${idx + 1}`,
    number: idx + 1,
    label: `Paragraph ${idx + 1}`,
    text: para,
    wordCount: countWords(para),
  }));
}

export function isCoverLetterTemplateATS(templateId?: string): boolean {
  if (!templateId) return false;
  const atsIds = new Set([
    'coverletter-ats-friendly',
    'coverletter-classic-serif',
    'coverletter-classic-professional',
  ]);
  return atsIds.has(templateId);
}

/**
 * Single authoritative mapper used by all 10 cover letter templates and preview/export.
 */
export function mapCoverLetterData(data?: DocumentData | null): MappedCoverLetterData {
  const personal = data?.personal || { fullName: '' };
  const contact = data?.contact || { phone: '', email: '' };
  const cl: CoverLetterData = data?.coverLetter || {};
  const coverLetterType: CoverLetterType = cl.coverLetterType || 'experienced';
  const typeConfig = COVER_LETTER_TYPES.find((t) => t.id === coverLetterType) || COVER_LETTER_TYPES[0];
  const isEmailType = coverLetterType === 'email';
  const dateFormat: CoverLetterDateFormat = cl.dateFormat || 'DD/MM/YYYY';
  const nameStyle: CoverLetterNameStyle = data?.customization?.nameStyle || 'as-typed';
  const handwrittenSignature = Boolean(data?.customization?.handwrittenSignature);

  // A. SENDER
  const rawFullName = cleanStr(personal.fullName);
  const fullName = formatCoverLetterPersonName(rawFullName, nameStyle);
  const professionalTitle = cleanStr(personal.professionalTitle);
  const senderCompanyName = cleanStr(personal.companyName);
  const phone = cleanStr(contact.phone);
  const email = cleanStr(contact.email);
  const city = cleanStr(contact.city);
  const state = cleanStr(contact.state);
  const country = cleanStr(contact.country);
  const locationLine = [city, state, country].filter(Boolean).join(', ');
  const linkedin = cleanStr(contact.linkedin);
  const github = cleanStr(contact.github);
  const portfolio = cleanStr(contact.portfolio || contact.website);

  const hasContactInfo = Boolean(phone || email || locationLine || linkedin || github || portfolio);

  // B. DATE & RECIPIENT
  const hasExplicitDateField = cl.letterDate !== undefined;
  const rawDate = cleanStr(cl.letterDate);
  const date = isEmailType ? '' : formatCoverLetterDate(rawDate, dateFormat, !hasExplicitDateField);

  // Academic maps professorOrSupervisorName when hiringManagerName is empty; Freelance can use clientName
  const hiringManagerName =
    cleanStr(cl.hiringManagerName) ||
    (coverLetterType === 'academic' ? cleanStr(cl.professorOrSupervisorName) : '') ||
    (coverLetterType === 'freelance' ? cleanStr(cl.clientName) : '');
  const hiringManagerTitle = cleanStr(cl.hiringManagerTitle);
  const companyName =
    cleanStr(cl.companyName) ||
    (coverLetterType === 'academic' ? cleanStr(cl.universityName) : '');
  const companyAddress = [
    cleanStr(cl.companyAddress),
    cleanStr(cl.companyCity),
    cleanStr(cl.companyState),
    coverLetterType === 'remote' ? cleanStr(cl.countryOfCompany) : '',
  ]
    .filter(Boolean)
    .join(', ');

  const jobTitle =
    cleanStr(cl.jobTitle) ||
    (coverLetterType === 'government' ? cleanStr(cl.postName) : '') ||
    (coverLetterType === 'academic' ? cleanStr(cl.programOrPosition) : '') ||
    (coverLetterType === 'freelance' ? cleanStr(cl.projectName) : '');
  const jobReferenceId = cleanStr(cl.jobReferenceId);
  const jobSource: CoverLetterJobSource = (cl.jobSource as CoverLetterJobSource) || '';

  const hasRecipientBlock =
    !isEmailType && Boolean(hiringManagerName || hiringManagerTitle || companyName || companyAddress);

  // Subject Line + Special Placement Logic
  let subjectLine = '';
  const customSubject = cleanStr(cl.subject);
  if (isEmailType) {
    if (customSubject) {
      subjectLine = customSubject;
    } else if (jobTitle || fullName) {
      subjectLine = `Application for ${jobTitle || 'Position'}${fullName ? ` - ${fullName}` : ''}`;
    }
  } else if (customSubject) {
    subjectLine = customSubject;
  } else if (coverLetterType === 'government') {
    const post = cleanStr(cl.postName) || jobTitle;
    const advt = cleanStr(cl.advertisementNumber);
    const cat = cleanStr(cl.category);
    if (post || advt || cat) {
      const parts: string[] = [];
      if (post) parts.push(`Application for the post of ${post}`);
      if (advt) parts.push(`Advt. No. ${advt}`);
      if (cat) parts.push(`Category: ${cat}`);
      subjectLine = parts.join(' | ');
    }
  } else if (coverLetterType === 'academic') {
    const program = cleanStr(cl.programOrPosition) || jobTitle;
    if (program) {
      subjectLine = `Application for ${program}`;
    }
  } else if (coverLetterType === 'freelance') {
    const proj = cleanStr(cl.projectName) || jobTitle;
    if (proj) {
      subjectLine = `Proposal for ${proj}`;
    }
  } else if (jobTitle) {
    subjectLine = `Application for ${jobTitle}${jobReferenceId ? ` (Ref: ${jobReferenceId})` : ''}`;
  } else if (jobReferenceId) {
    subjectLine = jobReferenceId;
  }

  // Special placement strings
  let referralNote = '';
  if (coverLetterType === 'referral') {
    const refName = cleanStr(cl.referrerName);
    const refRole = cleanStr(cl.referrerRole);
    const refCo = cleanStr(cl.referrerCompany);
    if (refName) {
      const rolePart = refRole ? `, ${refRole}` : '';
      const coPart = refCo ? ` at ${refCo}` : '';
      referralNote = `Referred by ${refName}${rolePart}${coPart}`;
    }
  }

  let throughLine = '';
  if (coverLetterType === 'internal-transfer') {
    const mgr = cleanStr(cl.managerName);
    if (mgr) {
      throughLine = `Through: ${mgr}`;
    }
  }

  let freelanceSummaryLine = '';
  if (coverLetterType === 'freelance') {
    const proj = cleanStr(cl.projectName) || jobTitle;
    const timeline = cleanStr(cl.deliveryTimeline);
    const rate = cleanStr(cl.priceOrRate);
    const fParts: string[] = [];
    if (proj) fParts.push(`Project: ${proj}`);
    if (timeline) fParts.push(`Timeline: ${timeline}`);
    if (rate) fParts.push(`Rate: ${rate}`);
    freelanceSummaryLine = fParts.join(' | ');
  }

  // Salutation
  const customSalutation = cleanStr(cl.salutation);
  const salutation = customSalutation
    ? customSalutation
    : hiringManagerName
    ? `Dear ${hiringManagerName},`
    : 'Dear Hiring Manager,';

  // Type-Specific Details (max 6 items, empty values removed)
  const typeFields = COVER_LETTER_TYPE_FIELDS[coverLetterType] || [];
  const details: CoverLetterDetailItem[] = [];
  for (const fieldDef of typeFields) {
    // Skip fields already rendered in dedicated positions unless needed
    if (coverLetterType === 'government' && fieldDef.key === 'declarationLine') {
      continue;
    }
    if (coverLetterType === 'freelance' && (fieldDef.key === 'projectName' || fieldDef.key === 'deliveryTimeline' || fieldDef.key === 'priceOrRate')) {
      continue;
    }
    if (fieldDef.optionalToggle && fieldDef.toggleKey && !cl[fieldDef.toggleKey]) {
      continue;
    }

    const rawVal = cleanStr(cl[fieldDef.key]);
    if (!rawVal) continue;

    let displayVal = rawVal;
    if (fieldDef.key === 'willingToRelocate') {
      displayVal = rawVal === 'yes' ? 'Yes' : rawVal === 'no' ? 'No' : rawVal;
    }

    details.push({ label: fieldDef.label, value: displayVal });
    if (details.length >= 6) break;
  }

  // Include Application Source in details only when toggle is explicitly enabled (off by default)
  if (Boolean(cl.showApplicationSource) && jobSource && details.length < 6 && !isEmailType) {
    details.push({ label: 'Application Source', value: jobSource });
  }

  // User-entered body paragraphs (never auto-generated)
  const blocks = parseUserBodyParagraphs(cl);
  const paragraphs = blocks.map((b) => b.text);

  // Closing
  const signOff =
    cleanStr(cl.signOff) || (coverLetterType === 'government' ? 'Yours faithfully,' : 'Sincerely,');
  const rawSignatureName = cleanStr(cl.signatureName) || rawFullName;
  const signatureName = formatCoverLetterPersonName(rawSignatureName, nameStyle);
  const signatureType: 'text' | 'image' =
    cl.signatureType === 'image' && cleanStr(cl.signatureImage) ? 'image' : 'text';
  const signatureImage = cleanStr(cl.signatureImage);
  const enclosures = cleanStr(cl.enclosures);
  const declarationLine =
    coverLetterType === 'government' ? cleanStr(cl.declarationLine) : '';

  // Detect whether any field in the form has real user input -> 'live' vs 'sample'
  const hasAnyTypeFieldInput = typeFields.some((f) => Boolean(cleanStr(cl[f.key])));
  const hasCoreOrBodyInput = Boolean(
    fullName ||
      professionalTitle ||
      email ||
      phone ||
      locationLine ||
      linkedin ||
      github ||
      portfolio ||
      hiringManagerName ||
      hiringManagerTitle ||
      companyName ||
      companyAddress ||
      jobTitle ||
      jobReferenceId ||
      jobSource ||
      customSubject ||
      customSalutation ||
      paragraphs.length > 0 ||
      enclosures ||
      declarationLine ||
      signatureImage ||
      cleanStr(cl.signatureName) ||
      hasAnyTypeFieldInput
  );

  const previewMode: 'sample' | 'live' = hasCoreOrBodyInput ? 'live' : 'sample';

  // Word Count & Per-Type Recommended Range
  const totalWords = blocks.reduce((acc, b) => acc + b.wordCount, 0);
  const { min: recommendedMinWords, max: recommendedMaxWords } =
    getCoverLetterWordRange(coverLetterType);

  let longestParagraphIndex = 2;
  if (blocks.length > 0) {
    let maxW = -1;
    blocks.forEach((b, idx) => {
      if (b.wordCount > maxW) {
        maxW = b.wordCount;
        longestParagraphIndex = idx + 1;
      }
    });
    if (blocks.length >= 2 && blocks[1].wordCount >= maxW * 0.75) {
      longestParagraphIndex = 2;
    }
  }

  return {
    previewMode,
    coverLetterType,
    coverLetterTypeLabel: typeConfig.shortLabel,
    isEmailType,
    dateFormat,
    nameStyle,
    date,
    sender: {
      fullName,
      professionalTitle,
      companyName: senderCompanyName,
      phone,
      email,
      city,
      state,
      country,
      locationLine,
      linkedin,
      github,
      portfolio,
      hasContactInfo,
    },
    recipient: {
      hiringManagerName,
      hiringManagerTitle,
      companyName,
      companyAddress,
      jobTitle,
      jobReferenceId,
      jobSource,
      hasRecipientBlock,
      companyRequired: !isEmailType,
    },
    subjectLine,
    referralNote,
    throughLine,
    freelanceSummaryLine,
    salutation,
    details,
    blocks,
    paragraphs,
    closing: {
      signOff,
      signatureName,
      signatureType,
      signatureImage,
      handwrittenSignature,
      enclosures,
      declarationLine,
    },
    metrics: {
      wordCount: totalWords,
      recommendedMinWords,
      recommendedMaxWords,
      longestParagraphIndex,
    },
  };
}

export interface CoverLetterValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
}

export function validateCoverLetterFields(data: DocumentData): {
  isValid: boolean;
  errors: CoverLetterValidationErrors;
  missingRequiredFields: string[];
  requiredCompletedCount: number;
  requiredTotalCount: number;
} {
  const mapped = mapCoverLetterData(data);
  const errors: CoverLetterValidationErrors = {};
  const missingRequiredFields: string[] = [];

  const requiredChecks: Array<{ done: boolean; label: string }> = [];

  // 1. Full Name (all types)
  const hasFullName = Boolean(mapped.sender.fullName);
  requiredChecks.push({ done: hasFullName, label: 'Full Name' });
  if (!hasFullName) {
    errors.fullName = 'Full name is required.';
    missingRequiredFields.push('Full Name');
  }

  if (!mapped.isEmailType) {
    // 2. Email
    let emailDone = false;
    if (!mapped.sender.email) {
      errors.email = 'Email address is required.';
      missingRequiredFields.push('Email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mapped.sender.email)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
      missingRequiredFields.push('Valid Email');
    } else {
      emailDone = true;
    }
    requiredChecks.push({ done: emailDone, label: 'Email' });

    // 3. Phone
    let phoneDone = false;
    if (!mapped.sender.phone) {
      errors.phone = 'Phone number is required.';
      missingRequiredFields.push('Phone');
    } else {
      const rawPhone = mapped.sender.phone.replace(/[\s()-]/g, '');
      if (rawPhone.startsWith('+91')) {
        const local = rawPhone.slice(3);
        if (!/^[6-9]\d{9}$/.test(local)) {
          errors.phone = 'For +91 (India), enter a valid 10-digit mobile number starting with 6–9.';
          missingRequiredFields.push('Valid Phone');
        } else {
          phoneDone = true;
        }
      } else if (rawPhone.startsWith('+')) {
        if (!/^\+\d{7,15}$/.test(rawPhone)) {
          errors.phone =
            'Enter a valid international phone number (+country code followed by 7–14 digits).';
          missingRequiredFields.push('Valid Phone');
        } else {
          phoneDone = true;
        }
      } else if (!/^[6-9]\d{9}$/.test(rawPhone) && !/^\d{7,15}$/.test(rawPhone)) {
        errors.phone =
          'Please enter a valid 10-digit mobile number or international number with country code.';
        missingRequiredFields.push('Valid Phone');
      } else {
        phoneDone = true;
      }
    }
    requiredChecks.push({ done: phoneDone, label: 'Phone' });

    // 4. Company / Institution / Client
    const companyLabel =
      mapped.coverLetterType === 'academic'
        ? 'University / Institution Name'
        : mapped.coverLetterType === 'freelance'
        ? 'Client / Company Name'
        : 'Company Name';
    const hasCompany = Boolean(mapped.recipient.companyName);
    requiredChecks.push({ done: hasCompany, label: companyLabel });
    if (!hasCompany) {
      errors.companyName = `${companyLabel} is required.`;
      missingRequiredFields.push(companyLabel);
    }
  } else {
    if (mapped.sender.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mapped.sender.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (mapped.sender.phone) {
      const rawPhone = mapped.sender.phone.replace(/[\s()-]/g, '');
      if (!/^\+?\d{7,15}$/.test(rawPhone)) {
        errors.phone = 'Please enter a valid phone number.';
      }
    }
  }

  // 5 (or 2 for email). Job Title / Target Position
  const jobLabel =
    mapped.coverLetterType === 'government'
      ? 'Post Name'
      : mapped.coverLetterType === 'academic'
      ? 'Program or Position'
      : mapped.coverLetterType === 'freelance'
      ? 'Project Name'
      : 'Job Title';
  const hasJobTitle = Boolean(mapped.recipient.jobTitle);
  requiredChecks.push({ done: hasJobTitle, label: jobLabel });
  if (!hasJobTitle) {
    errors.jobTitle = `${jobLabel} is required.`;
    missingRequiredFields.push(jobLabel);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    missingRequiredFields,
    requiredCompletedCount: requiredChecks.filter((c) => c.done).length,
    requiredTotalCount: requiredChecks.length,
  };
}
