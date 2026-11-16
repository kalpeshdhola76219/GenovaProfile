import React from 'react';
import { DocumentData } from '../../types/document';
import { sanitizeDocumentTextFields, sanitizeText } from '../../utils/textSanitizer';

export { sanitizeDocumentTextFields, sanitizeText };

export const BIODATA_HEADER_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
};

export const BIODATA_HEADER_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '16px',
};

export const BIODATA_HEADER_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
};

export const BIODATA_ROW_STYLE: React.CSSProperties = {
  display: 'table',
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
};

export const BIODATA_LEFT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'left',
  paddingRight: '12px',
};

export const BIODATA_RIGHT_STYLE: React.CSSProperties = {
  display: 'table-cell',
  verticalAlign: 'top',
  textAlign: 'right',
};

/**
 * Maximum character limits for matrimonial biodata fields to prevent layout overflows
 * while ensuring comprehensive profile presentation.
 */
export const MAX_ADDITIONAL_FAMILY_MEMBERS = 4;
export const MAX_ADDITIONAL_PHOTOS = 3;

export const BIODATA_LIMITS = {
  fullName: 60,
  parentNames: 50,
  fatherName: 50,
  motherName: 50,
  occupations: 60,
  occupation: 60,
  fatherOccupation: 60,
  motherOccupation: 60,
  companyName: 60,
  anyAddress: 120,
  address: 120,
  familyAddress: 120,
  nativePlace: 50,
  aboutMe: 350,
  partnerExpectations: 250,
  hobbies: 100,
  interests: 100,
  lifestyle: 80,
  education: 80,
  singleLine: 40,
  defaultSingleLine: 40,
  other: 40,
  default: 40,
} as const;

/**
 * Helper to retrieve character limit for a given field key.
 */
export function getBiodataFieldLimit(fieldKey: string): number {
  if (fieldKey in BIODATA_LIMITS) {
    return BIODATA_LIMITS[fieldKey as keyof typeof BIODATA_LIMITS];
  }
  return BIODATA_LIMITS.default;
}

export interface BiodataFieldItem {
  key: string;
  label: string;
  value: string;
}

export interface BiodataSections {
  personal: BiodataFieldItem[];
  astrology: BiodataFieldItem[];
  family: BiodataFieldItem[];
  careerEducation: BiodataFieldItem[];
  aboutAndInterests: BiodataFieldItem[];
  expectations: BiodataFieldItem[];
  contact: BiodataFieldItem[];
}

/**
 * Calculates age in years from a date of birth string.
 * Supports ISO (YYYY-MM-DD), slash-delimited, and standard date formats.
 */
export function calculateAge(dob?: string): string {
  if (!dob || !dob.trim()) return '';
  const trimmed = dob.trim();

  let birthDate: Date | null = null;

  // Check for ISO format (YYYY-MM-DD or YYYY/MM/DD)
  const isoMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    birthDate = new Date(year, month, day);
  } else {
    // Check for DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      birthDate = new Date(year, month, day);
    } else {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        birthDate = parsed;
      }
    }
  }

  if (!birthDate || isNaN(birthDate.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age >= 0 && age <= 130) {
    return String(age);
  }
  return '';
}

/**
 * Adds a key-value item to a list only if the value is non-empty and contains non-whitespace text.
 */
function addField(
  list: BiodataFieldItem[],
  key: string,
  label: string,
  value?: string | number | null
): void {
  if (value === undefined || value === null) return;
  const strVal = sanitizeText(String(value).trim());
  if (!strVal) return;
  list.push({ key, label, value: strVal });
}

/**
 * Groups and returns filled biodata details into structured sections.
 * Automatically computes age from date of birth when age is empty.
 * Skips empty fields and formats multi-item fields cleanly.
 */
export function getBiodataSections(rawData: DocumentData): BiodataSections {
  const data = sanitizeDocumentTextFields(rawData);
  const personalData = data?.personal || ({} as DocumentData['personal']);
  const familyData = data?.family || ({} as DocumentData['family']);
  const marriageData = data?.marriage || ({} as DocumentData['marriage']);
  const contactData = data?.contact || ({} as DocumentData['contact']);
  const educationList = Array.isArray(data?.education) ? data.education : [];
  const experienceList = Array.isArray(data?.experience) ? data.experience : [];

  // Determine age: calculate automatically if empty or whitespace
  let resolvedAge = (personalData.age || '').trim();
  if (!resolvedAge && personalData.dateOfBirth) {
    resolvedAge = calculateAge(personalData.dateOfBirth);
  }

  // 1. Personal Details
  const personal: BiodataFieldItem[] = [];
  addField(personal, 'fullName', 'Full Name', personalData.fullName);
  addField(personal, 'gender', 'Gender', personalData.gender);
  addField(personal, 'dateOfBirth', 'Date of Birth', personalData.dateOfBirth);
  addField(personal, 'age', 'Age', resolvedAge);
  addField(personal, 'height', 'Height', personalData.height);
  addField(personal, 'weight', 'Weight', personalData.weight);
  addField(personal, 'bloodGroup', 'Blood Group', personalData.bloodGroup);
  addField(personal, 'complexion', 'Complexion', personalData.complexion);
  addField(personal, 'maritalStatus', 'Marital Status', personalData.maritalStatus);
  addField(personal, 'diet', 'Diet', personalData.diet);
  addField(personal, 'religion', 'Religion', personalData.religion);
  addField(personal, 'caste', 'Caste', personalData.caste);
  addField(personal, 'subCaste', 'Sub-Caste', personalData.subCaste);
  addField(personal, 'motherTongue', 'Mother Tongue', personalData.motherTongue);

  // 2. Astrology / Kundali Details
  const astrology: BiodataFieldItem[] = [];
  addField(astrology, 'timeOfBirth', 'Time of Birth', personalData.timeOfBirth);
  addField(astrology, 'placeOfBirth', 'Place of Birth', personalData.placeOfBirth);
  addField(astrology, 'rashi', 'Rashi / Moon Sign', personalData.rashi);
  addField(astrology, 'nakshatra', 'Nakshatra', personalData.nakshatra);
  addField(astrology, 'gotra', 'Gotra', personalData.gotra);
  addField(astrology, 'manglik', 'Manglik Status', personalData.manglik);

  // 3. Family Details
  const family: BiodataFieldItem[] = [];
  addField(family, 'fatherName', "Father's Name", familyData.fatherName);
  addField(family, 'fatherOccupation', "Father's Occupation", familyData.fatherOccupation);
  addField(family, 'motherName', "Mother's Name", familyData.motherName);
  addField(family, 'motherOccupation', "Mother's Occupation", familyData.motherOccupation);
  addField(family, 'familyType', 'Family Type', familyData.familyType);
  addField(family, 'familyStatus', 'Family Status', familyData.familyStatus);
  addField(family, 'brothersCount', 'Brothers', familyData.brothersCount);
  addField(family, 'marriedBrothers', 'Married Brothers', familyData.marriedBrothers);
  addField(family, 'sistersCount', 'Sisters', familyData.sistersCount);
  addField(family, 'marriedSisters', 'Married Sisters', familyData.marriedSisters);
  addField(family, 'nativePlace', 'Native Place', familyData.nativePlace);
  addField(family, 'familyAddress', 'Family Address', familyData.familyAddress);

  // Additional Family Members (up to MAX_ADDITIONAL_FAMILY_MEMBERS = 4)
  if (Array.isArray(familyData.additionalMembers)) {
    familyData.additionalMembers.slice(0, MAX_ADDITIONAL_FAMILY_MEMBERS).forEach((member, idx) => {
      if (!member) return;
      const name = (member.name || '').trim();
      const relation = (member.relation || '').trim();
      const occ = (member.occupation || '').trim();

      if (name || relation || occ) {
        const label = relation || `Family Member ${idx + 1}`;
        const valParts = [name, occ ? `(${occ})` : ''].filter(Boolean);
        const val = valParts.join(' ').trim() || occ || relation;
        if (val) {
          addField(family, `additionalMember_${idx + 1}`, label, val);
        }
      }
    });
  }

  // 4. Career & Education Details
  const careerEducation: BiodataFieldItem[] = [];
  addField(careerEducation, 'education', 'Highest Qualification', personalData.education);
  addField(careerEducation, 'occupation', 'Occupation', personalData.occupation);
  addField(careerEducation, 'companyName', 'Company / Organization', personalData.companyName);
  addField(careerEducation, 'annualIncome', 'Annual Income', personalData.annualIncome);
  addField(careerEducation, 'professionalTitle', 'Professional Title', personalData.professionalTitle);

  // Array-based education items (if present)
  educationList.forEach((edu, idx) => {
    if (!edu) return;
    const parts = [
      edu.degree?.trim(),
      edu.institute?.trim(),
      edu.endYear ? `(${edu.endYear.trim()})` : '',
      edu.score ? `[${edu.score.trim()}]` : '',
    ].filter(Boolean);
    const combined = parts.join(' • ');
    if (combined) {
      addField(careerEducation, `educationItem_${idx + 1}`, edu.degree || 'Education', combined);
    }
  });

  // Array-based experience items (if present)
  experienceList.forEach((exp, idx) => {
    if (!exp) return;
    const parts = [
      exp.jobTitle?.trim(),
      exp.company ? `at ${exp.company.trim()}` : '',
      exp.location ? `(${exp.location.trim()})` : '',
      exp.achievements ? `• ${exp.achievements.trim()}` : '',
    ].filter(Boolean);
    const combined = parts.join(' ');
    if (combined) {
      addField(careerEducation, `experienceItem_${idx + 1}`, exp.jobTitle || 'Career', combined);
    }
  });

  // 5. About & Interests
  const aboutAndInterests: BiodataFieldItem[] = [];
  const aboutText = (marriageData.aboutMe || '').trim() || (data?.summary || '').trim();
  addField(aboutAndInterests, 'aboutMe', 'About Me', aboutText);
  addField(aboutAndInterests, 'hobbies', 'Hobbies', marriageData.hobbies);
  addField(aboutAndInterests, 'interests', 'Interests', marriageData.interests);
  addField(aboutAndInterests, 'lifestyle', 'Lifestyle', marriageData.lifestyle);

  // 6. Partner Expectations
  const expectations: BiodataFieldItem[] = [];
  addField(expectations, 'partnerExpectations', 'Partner Expectations', marriageData.partnerExpectations);

  // 7. Contact Details
  const contact: BiodataFieldItem[] = [];
  addField(contact, 'phone', 'Phone', contactData.phone);
  addField(contact, 'email', 'Email', contactData.email);
  addField(contact, 'address', 'Address', contactData.address);
  addField(contact, 'city', 'City', contactData.city);
  addField(contact, 'state', 'State', contactData.state);
  addField(contact, 'country', 'Country', contactData.country);
  addField(contact, 'linkedin', 'LinkedIn', contactData.linkedin);
  addField(contact, 'github', 'GitHub', contactData.github);
  addField(contact, 'portfolio', 'Portfolio', contactData.portfolio);
  addField(contact, 'website', 'Website', contactData.website);

  return {
    personal,
    astrology,
    family,
    careerEducation,
    aboutAndInterests,
    expectations,
    contact,
  };
}
