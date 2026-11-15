export type DocumentType = 'resume' | 'cover-letter' | 'biodata';

export type CoverLetterType =
  | 'experienced'
  | 'fresher'
  | 'internship'
  | 'career-change'
  | 'referral'
  | 'cold'
  | 'internal-transfer'
  | 'government'
  | 'academic'
  | 'remote'
  | 'freelance'
  | 'email';

export type CoverLetterDateFormat = 'DD/MM/YYYY' | 'Month DD, YYYY';
export type CoverLetterJobSource = 'LinkedIn' | 'Naukri' | 'Referral' | 'Company site' | 'Other' | '';
export type CoverLetterNameStyle = 'as-typed' | 'title-case' | 'uppercase';

export interface CoverLetterData {
  // Step 1: Type
  coverLetterType?: CoverLetterType;

  // Step 2B: Date & Recipient
  letterDate?: string;
  dateFormat?: CoverLetterDateFormat;
  hiringManagerName?: string;
  hiringManagerTitle?: string;
  companyName?: string;
  companyAddress?: string;
  companyCity?: string;
  companyState?: string;
  jobTitle?: string;
  jobReferenceId?: string;
  jobSource?: CoverLetterJobSource;
  showApplicationSource?: boolean;
  subject?: string;
  salutation?: string;

  // Step 2C: Experience Fields
  currentCompany?: string;
  currentRole?: string;
  totalExperienceYears?: string;
  willingToRelocate?: 'yes' | 'no' | '';
  noticePeriod?: string;
  showNoticePeriod?: boolean;
  expectedSalary?: string;
  showExpectedSalary?: boolean;

  // Step 2D: Fresher / Internship Fields
  degree?: string;
  collegeName?: string;
  graduationYear?: string;
  cgpaOrPercentage?: string;
  availableFrom?: string;
  internshipDuration?: string;

  // Step 2E: Career Change Fields
  previousField?: string;
  newField?: string;
  transferableSkills?: string;
  relevantCourses?: string;

  // Step 2F: Referral Fields
  referrerName?: string;
  referrerRole?: string;
  referrerCompany?: string;
  howYouKnowReferrer?: string;

  // Step 2G: Cold / Unsolicited Fields
  areaYouCanAddValue?: string;
  companyAchievementOrNews?: string;

  // Step 2H: Internal Transfer Fields
  currentDepartment?: string;
  targetDepartment?: string;
  yearsInCompany?: string;
  managerName?: string;

  // Step 2I: Government / PSU Fields
  postName?: string;
  advertisementNumber?: string;
  category?: string;
  qualification?: string;
  languagesKnown?: string;
  declarationLine?: string;

  // Step 2J: Academic / Research Fields
  programOrPosition?: string;
  universityName?: string;
  highestQualification?: string;
  gpaOrCgpa?: string;
  researchInterest?: string;
  professorOrSupervisorName?: string;

  // Step 2K: Remote / International Fields
  timezone?: string;
  workAuthorization?: string;
  englishLevel?: string;
  overlapHoursAvailable?: string;
  countryOfCompany?: string;

  // Step 2L: Freelance / Proposal Fields
  clientName?: string;
  projectName?: string;
  servicesOffered?: string;
  deliveryTimeline?: string;
  priceOrRate?: string;
  pastWorkLinks?: string;

  // Step 2M: Manual Body & Closing Fields
  letterBody?: string;
  signOff?: string;
  signatureName?: string;
  signatureType?: 'text' | 'image';
  signatureImage?: string;
  enclosures?: string;

  // Phone Settings
  phoneCountryCode?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  location?: string;
  startYear?: string;
  endYear?: string;
  score?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  achievements?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  level?: string; // Beginner, Intermediate, Expert, or 1-5
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  technologies?: string;
  link?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface FamilyMemberItem {
  id: string;
  relation: string;
  name: string;
  occupation: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  type: 'text' | 'list' | 'key-value';
  content?: string;
  items?: Array<{ id: string; key: string; value: string }>;
}

export interface ExecutiveMetric {
  id: string;
  value: string;
  label: string;
}

export interface DocumentCustomization {
  fontFamily: 'jakarta' | 'playfair' | 'cormorant' | 'cinzel' | 'jetbrains' | 'sans' | 'serif';
  fontSize: 'sm' | 'base' | 'lg';
  headingSize: 'base' | 'lg' | 'xl';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  margins: 'compact' | 'normal' | 'spacious';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  paperColor?: string;
  showPhoto?: boolean;
  justifyText?: boolean;
  handwrittenSignature?: boolean;
  nameStyle?: CoverLetterNameStyle;
}

export interface DocumentData {
  id: string;
  type: DocumentType;
  title: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  status?: 'draft' | 'completed' | 'archived';
  metadata?: {
    industry?: string;
    tags?: string[];
    language?: string;
    version?: number;
    completionPercentage?: number;
  };
  customization: DocumentCustomization;
  personal: {
    fullName: string;
    profilePhoto?: string;
    extraPhotos?: string[];
    professionalTitle?: string; // For resume: e.g. "Senior Full Stack Architect"
    dateOfBirth?: string;
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    bloodGroup?: string;
    complexion?: string;
    religion?: string;
    caste?: string;
    subCaste?: string;
    gotra?: string;
    rashi?: string;
    nakshatra?: string;
    motherTongue?: string;
    maritalStatus?: string;
    manglik?: string;
    placeOfBirth?: string;
    timeOfBirth?: string;
    occupation?: string;
    companyName?: string;
    annualIncome?: string;
    diet?: string;
    education?: string; // Short text: highest qualification
  };
  contact: {
    phone: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  family: {
    fatherName?: string;
    fatherOccupation?: string;
    motherName?: string;
    motherOccupation?: string;
    brothersCount?: string;
    sistersCount?: string;
    marriedBrothers?: string;
    marriedSisters?: string;
    familyType?: string; // Joint, Nuclear
    familyStatus?: string; // Middle Class, Upper Middle, Affluent
    nativePlace?: string;
    familyAddress?: string;
    additionalMembers?: FamilyMemberItem[];
  };
  marriage: {
    aboutMe?: string;
    hobbies?: string;
    interests?: string;
    lifestyle?: string; // Vegetarian, Non-smoker, etc.
    partnerExpectations?: string;
    additionalPhotos?: string[]; // Multiple photos supported for gallery/family biodatas
  };
  summary?: string; // Resume professional summary or career objective
  executiveMetrics?: ExecutiveMetric[]; // Executive Scorecard metrics (e.g. Monaco Sovereign)
  showExecutiveMetrics?: boolean; // Toggle display of executive scorecard strip
  coverLetter?: CoverLetterData;
  customSections: CustomSectionItem[];
}

export interface TemplateMetadata {
  id: string;
  name: string;
  type: DocumentType;
  category: string;
  description: string;
  priceINR: number;
  currency?: string;
  isATS?: boolean;
  supportsPhoto: boolean;
  layout: 'single' | 'two-column' | 'header-accent' | 'luxury-frame' | 'minimal-split';
  industry?: string[];
  tags?: string[];
  popularity?: number;
  createdAt?: string;
  primaryColorSample: string;
  secondaryColorSample: string;
  component: React.ComponentType<{ data: DocumentData }>;
}
