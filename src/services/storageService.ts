import { DocumentData, DocumentType } from '../types/document';
import { createEmptyDocument, sampleBiodataDocument, sampleResumeDocument, sampleCoverLetterDocument } from '../data/sampleData';
import { sanitizeDocumentTextFields } from '../utils/textSanitizer';

const STORAGE_KEY = 'genovadoc_documents_v1';
const LEGACY_STORAGE_KEY = 'biocv_documents_v1';

export interface BackupPayload {
  version: string;
  exportedAt: string;
  source: 'GenovaProfile' | 'GenovaDoc';
  documents: DocumentData[];
}

export interface StorageLimitResult {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  isUnlimited: boolean;
}

const LEGACY_CL_KEYS = [
  'recipientName',
  'recipientTitle',
  'hiringManager',
  'date',
  'applicationDate',
  'reference',
  'greeting',
  'signoff',
  'introduction',
  'bodyExperience',
  'bodySkills',
  'bodyMotivation',
  'closing',
  'visibleSections',
  'relevantSkillsExperienceYears',
  'keySkills',
  'topAchievements',
  'toolsOrSoftware',
  'currentLocation',
  'projects',
  'internships',
  'certifications',
  'extracurriculars',
  'whyChanging',
  'whyThisCompany',
  'keyInternalAchievements',
  'relevantExperience',
  'publications',
  'fundingNeeded',
  'remoteExperience',
  'callToAction',
  'closingLine',
];

function sanitizeCoverLetterBlock(rawCl: any, defaultCl: any) {
  const merged: any = { ...(defaultCl || {}), ...(rawCl || {}) };

  // One-time migration from legacy duplicate keys into canonical keys
  if (!merged.hiringManagerName) {
    merged.hiringManagerName = merged.recipientName || merged.hiringManager || '';
  }
  if (!merged.hiringManagerTitle && merged.recipientTitle) {
    merged.hiringManagerTitle = merged.recipientTitle;
  }
  if (!merged.letterDate && (merged.date || merged.applicationDate)) {
    merged.letterDate = merged.date || merged.applicationDate;
  }
  if (!merged.jobReferenceId && merged.reference) {
    merged.jobReferenceId = merged.reference;
  }
  if (!merged.salutation && merged.greeting) {
    merged.salutation = merged.greeting;
  }
  if (!merged.signOff && merged.signoff) {
    merged.signOff = merged.signoff;
  }
  if (!merged.letterBody) {
    const legacyParagraphs = [
      merged.introduction,
      merged.bodyExperience,
      merged.bodySkills,
      merged.bodyMotivation,
      merged.closing,
    ]
      .map((s: unknown) => (typeof s === 'string' ? s.trim() : ''))
      .filter(Boolean);
    if (legacyParagraphs.length > 0) {
      merged.letterBody = legacyParagraphs.join('\n\n');
    }
  }
  if (Array.isArray(merged.transferableSkills)) {
    merged.transferableSkills = merged.transferableSkills.filter(Boolean).join(', ');
  }

  for (const key of LEGACY_CL_KEYS) {
    delete merged[key];
  }

  return merged;
}

const REMOVED_COVER_LETTER_SUFFIX_MAP: Record<string, string> = {
  'minimal-executive': 'coverletter-classic-serif',
  'minimal-professional': 'coverletter-ats-friendly',
  'international-professional': 'coverletter-classic-professional',
  'two-tone-corporate': 'coverletter-modern-corporate',
  'technology-professional': 'coverletter-tech-lead',
  international: 'coverletter-executive',
  creative: 'coverletter-creative-professional',
};

export function normalizeCoverLetterTemplateId(templateId?: string): string | undefined {
  if (!templateId || !templateId.startsWith('coverletter-')) return templateId;
  const suffix = templateId.slice('coverletter-'.length);
  return REMOVED_COVER_LETTER_SUFFIX_MAP[suffix] || templateId;
}

export const sanitizeDocument = (doc: any): DocumentData => {
  if (!doc) return createEmptyDocument('resume', 'resume-ats-professional');
  const rawTemplateId = doc.templateId || 'resume-ats-professional';
  const normalizedTemplateId =
    doc.type === 'cover-letter' || rawTemplateId.startsWith('coverletter-')
      ? normalizeCoverLetterTemplateId(rawTemplateId) || 'coverletter-modern-corporate'
      : rawTemplateId;
  const defaults = createEmptyDocument(doc.type || 'resume', normalizedTemplateId);
  const isCoverLetter = (doc.type || defaults.type) === 'cover-letter';
  const personal = { ...defaults.personal, ...(doc.personal || {}) };
  const customization = { ...defaults.customization, ...(doc.customization || {}) };

  if (isCoverLetter) {
    personal.profilePhoto = '';
    personal.extraPhotos = undefined;
    customization.showPhoto = false;
    customization.justifyText = true;
  }

  return sanitizeDocumentTextFields({
    ...defaults,
    ...doc,
    templateId: normalizedTemplateId,
    personal,
    contact: { ...defaults.contact, ...(doc.contact || {}) },
    family: { ...defaults.family, ...(doc.family || {}) },
    marriage: { ...defaults.marriage, ...(doc.marriage || {}) },
    coverLetter: sanitizeCoverLetterBlock(doc.coverLetter, defaults.coverLetter),
    customization,
    education: Array.isArray(doc.education) ? doc.education : defaults.education,
    experience: Array.isArray(doc.experience) ? doc.experience : defaults.experience,
    skills: Array.isArray(doc.skills) ? doc.skills : defaults.skills,
    projects: Array.isArray(doc.projects) ? doc.projects : defaults.projects,
    certifications: Array.isArray(doc.certifications) ? doc.certifications : defaults.certifications,
    achievements: Array.isArray(doc.achievements) ? doc.achievements : defaults.achievements,
    customSections: Array.isArray(doc.customSections) ? doc.customSections : defaults.customSections,
    executiveMetrics: Array.isArray(doc.executiveMetrics)
      ? doc.executiveMetrics
      : defaults.executiveMetrics,
    showExecutiveMetrics:
      typeof doc.showExecutiveMetrics === 'boolean'
        ? doc.showExecutiveMetrics
        : defaults.showExecutiveMetrics,
  });
};

export const storageService = {
  FREE_TIER_LIMIT: 3,

  checkLimit: (): StorageLimitResult => {
    const docs = storageService.getAll();
    return {
      allowed: true,
      currentCount: docs.length,
      maxLimit: Infinity,
      isUnlimited: true,
    };
  },

  getAll: (): DocumentData[] => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyRaw) {
          raw = legacyRaw;
          localStorage.setItem(STORAGE_KEY, legacyRaw);
        }
      }
      if (!raw) {
        const initial = [sampleResumeDocument, sampleCoverLetterDocument, sampleBiodataDocument];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial.map(sanitizeDocument);
      }
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [sampleResumeDocument, sampleCoverLetterDocument, sampleBiodataDocument];
      return list.map(sanitizeDocument);
    } catch (e) {
      console.error('Failed to load documents from storage:', e);
      return [sampleResumeDocument, sampleCoverLetterDocument, sampleBiodataDocument].map(sanitizeDocument);
    }
  },

  get: (id: string): DocumentData | null => {
    const docs = storageService.getAll();
    return docs.find((d) => d.id === id) || null;
  },

  create: (type: DocumentType, templateId: string, initialTitle?: string): DocumentData => {
    const resolvedTemplateId =
      type === 'cover-letter'
        ? normalizeCoverLetterTemplateId(templateId) || 'coverletter-modern-corporate'
        : templateId;
    const newDoc = createEmptyDocument(type, resolvedTemplateId);
    if (initialTitle) {
      newDoc.title = initialTitle;
    }
    newDoc.status = 'draft';
    return storageService.update(newDoc);
  },

  update: (doc: DocumentData): DocumentData => {
    const docs = storageService.getAll();
    const updatedDoc: DocumentData = sanitizeDocument({
      ...doc,
      updatedAt: new Date().toISOString(),
    });
    const index = docs.findIndex((d) => d.id === doc.id);
    let newDocs: DocumentData[];
    if (index >= 0) {
      newDocs = [...docs];
      newDocs[index] = updatedDoc;
    } else {
      newDocs = [updatedDoc, ...docs];
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocs));
    } catch (e) {
      console.error('Error saving document to localStorage:', e);
    }
    return updatedDoc;
  },

  delete: (id: string): boolean => {
    try {
      const docs = storageService.getAll();
      const filtered = docs.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting document:', e);
      return false;
    }
  },

  duplicate: (id: string): DocumentData | null => {
    const original = storageService.get(id);
    if (!original) return null;
    const timestamp = new Date().toISOString();
    const duplicated: DocumentData = {
      ...JSON.parse(JSON.stringify(original)),
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${original.title} Copy`,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'draft',
    };
    return storageService.update(duplicated);
  },

  getDocuments: (): DocumentData[] => storageService.getAll(),
  getRecentDocuments: (): DocumentData[] => storageService.getAll(),
  getDocument: (id: string): DocumentData | null => storageService.get(id),
  getDocumentById: (id: string): DocumentData | null => storageService.get(id),
  saveDocument: (doc: DocumentData): DocumentData => storageService.update(doc),
  createNewDocument: (type: DocumentType, templateId: string, initialTitle?: string): DocumentData =>
    storageService.create(type, templateId, initialTitle),
  duplicateDocument: (id: string): DocumentData | null => storageService.duplicate(id),
  renameDocument: (id: string, newTitle: string): DocumentData | null => {
    const doc = storageService.get(id);
    if (!doc) return null;
    doc.title = newTitle.trim() || doc.title;
    return storageService.update(doc);
  },
  deleteDocument: (id: string): boolean => storageService.delete(id),

  resetToDemo: (): DocumentData[] => {
    const initial = [sampleBiodataDocument, sampleResumeDocument, sampleCoverLetterDocument].map(sanitizeDocument);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.error('Error resetting to demo:', e);
    }
    return initial;
  },

  exportBackup: (): string => {
    const docs = storageService.getAll();
    const payload: BackupPayload = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      source: 'GenovaProfile',
      documents: docs,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `genovaprofile-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return jsonStr;
  },

  importBackup: async (file: File): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      let docsToImport: DocumentData[] = [];
      if (Array.isArray(parsed)) {
        docsToImport = parsed;
      } else if (parsed && Array.isArray(parsed.documents)) {
        docsToImport = parsed.documents;
      } else {
        return { success: false, count: 0, error: 'Invalid backup file format. Expected a list of documents.' };
      }
      const validDocs = docsToImport.filter((d) => d && d.id && d.type && d.title);
      if (validDocs.length === 0) {
        return { success: false, count: 0, error: 'No valid documents found in the backup file.' };
      }
      const existing = storageService.getAll();
      const existingMap = new Map(existing.map((d) => [d.id, d]));
      for (const d of validDocs) {
        existingMap.set(d.id, sanitizeDocument(d));
      }
      const merged = Array.from(existingMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return { success: true, count: validDocs.length };
    } catch (e: any) {
      console.error('Failed to import backup:', e);
      return { success: false, count: 0, error: e.message || 'Error parsing backup JSON file.' };
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  },
};
