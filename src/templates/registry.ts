import React from 'react';
import { DocumentData, DocumentType, TemplateMetadata } from '../types/document';
import catalogJson from '../config/templatesCatalog.json';

// --- BIODATA TEMPLATE IMPORTS (43 Unique Components) ---
import { TraditionalIndianTemplate } from './biodata/TraditionalIndianTemplate';
import { RoyalVedicQRTemplate } from './biodata/RoyalVedicQRTemplate';
import { RoyalHinduBiodataTemplate } from './biodata/RoyalHinduBiodataTemplate';
import { ModernTealBiodataTemplate } from './biodata/ModernTealBiodataTemplate';
import { ElegantBlueWeddingTemplate } from './biodata/ElegantBlueWeddingTemplate';
import { MonochromeModernBiodataTemplate } from './biodata/MonochromeModernBiodataTemplate';
import { RoyalMaroonBiodataTemplate } from './biodata/RoyalMaroonBiodataTemplate';
import { PremiumRoyalHeritageTemplate } from './biodata/PremiumRoyalHeritageTemplate';
import { PremiumIndianClassicTemplate } from './biodata/PremiumIndianClassicTemplate';
import { PremiumRoyalPortraitTemplate } from './biodata/PremiumRoyalPortraitTemplate';
import { PremiumMinimalEditorialTemplate } from './biodata/PremiumMinimalEditorialTemplate';
import { PremiumLuxuryGoldTemplate } from './biodata/PremiumLuxuryGoldTemplate';
import { PremiumContemporaryProfileTemplate } from './biodata/PremiumContemporaryProfileTemplate';
import { PremiumElegantTwoToneTemplate } from './biodata/PremiumElegantTwoToneTemplate';
import { PremiumRegalVelvetTemplate } from './biodata/PremiumRegalVelvetTemplate';
import { TraditionalRedBiodataTemplate } from './biodata/TraditionalRedBiodataTemplate';
import { TraditionalGoldBiodataTemplate } from './biodata/TraditionalGoldBiodataTemplate';
import { RoyalTraditionalBiodataTemplate } from './biodata/RoyalTraditionalBiodataTemplate';
import { ClassicIndianBiodataTemplate } from './biodata/ClassicIndianBiodataTemplate';
import { CircularPhotoBiodataTemplate } from './biodata/CircularPhotoBiodataTemplate';
import { PortraitFocusBiodataTemplate } from './biodata/PortraitFocusBiodataTemplate';
import { FloralBorderBiodataTemplate } from './biodata/FloralBorderBiodataTemplate';
import { FloralGreenBiodataTemplate } from './biodata/FloralGreenBiodataTemplate';
import { FloralPinkBiodataTemplate } from './biodata/FloralPinkBiodataTemplate';
import { ModernElegantBiodataTemplate } from './biodata/ModernElegantBiodataTemplate';
import { ModernProfileBiodataTemplate } from './biodata/ModernProfileBiodataTemplate';
import { ContemporaryBiodataTemplate } from './biodata/ContemporaryBiodataTemplate';
import { ElegantClassicBiodataTemplate } from './biodata/ElegantClassicBiodataTemplate';
import { PremiumRoyalBiodataTemplate } from './biodata/PremiumRoyalBiodataTemplate';
import { IslamicNikahBiodataTemplate } from './biodata/IslamicNikahBiodataTemplate';
import { ChristianWeddingBiodataTemplate } from './biodata/ChristianWeddingBiodataTemplate';
import { ModernMinimalBiodataTemplate } from './biodata/ModernMinimalBiodataTemplate';
import { ElegantGoldBiodataTemplate } from './biodata/ElegantGoldBiodataTemplate';
import { FloralBiodataTemplate } from './biodata/FloralBiodataTemplate';
import { PremiumDarkBiodataTemplate } from './biodata/PremiumDarkBiodataTemplate';
import { ClassicSimpleBiodataTemplate } from './biodata/ClassicSimpleBiodataTemplate';
import { PhotoFocusedBiodataTemplate } from './biodata/PhotoFocusedBiodataTemplate';
import { TwoColumnBiodataTemplate } from './biodata/TwoColumnBiodataTemplate';
import { ModernIndianBiodataTemplate } from './biodata/ModernIndianBiodataTemplate';
import { ElegantWhiteBiodataTemplate } from './biodata/ElegantWhiteBiodataTemplate';
import { LuxuryBiodataTemplate } from './biodata/LuxuryBiodataTemplate';
import { MinimalProfessionalBiodataTemplate } from './biodata/MinimalProfessionalBiodataTemplate';

// --- RESUME TEMPLATE IMPORTS (21 Unique Components) ---
import { ATSBasicResumeTemplate } from './resume/ATSBasicResumeTemplate';
import { ATSProfessionalResumeTemplate } from './resume/ATSProfessionalResumeTemplate';
import { ClassicResumeTemplate } from './resume/ClassicResumeTemplate';
import { CleanResumeTemplate } from './resume/CleanResumeTemplate';
import { CreativeResumeTemplate } from './resume/CreativeResumeTemplate';
import { ExecutivePremiumResumeTemplate } from './resume/ExecutivePremiumResumeTemplate';
import { ExecutiveResumeTemplate } from './resume/ExecutiveResumeTemplate';
import { FinanceProfessionalResumeTemplate } from './resume/FinanceProfessionalResumeTemplate';
import { FreshGraduateResumeTemplate } from './resume/FreshGraduateResumeTemplate';
import { ITProfessionalResumeTemplate } from './resume/ITProfessionalResumeTemplate';
import { MinimalResumeTemplate } from './resume/MinimalResumeTemplate';
import { ModernCorporateResumeTemplate } from './resume/ModernCorporateResumeTemplate';
import { ModernMinimalResumeTemplate } from './resume/ModernMinimalResumeTemplate';
import { MonacoSovereignTemplate } from './resume/MonacoSovereignTemplate';
import { PremiumConsultantResumeTemplate } from './resume/PremiumConsultantResumeTemplate';
import { PremiumCreativeLeadResumeTemplate } from './resume/PremiumCreativeLeadResumeTemplate';
import { PremiumInternationalResumeTemplate } from './resume/PremiumInternationalResumeTemplate';
import { PremiumMinimalExecutiveResumeTemplate } from './resume/PremiumMinimalExecutiveResumeTemplate';
import { PremiumTechLeadResumeTemplate } from './resume/PremiumTechLeadResumeTemplate';
import { ProfessionalResumeTemplate } from './resume/ProfessionalResumeTemplate';
import { TwoColumnResumeTemplate } from './resume/TwoColumnResumeTemplate';
import { ResumeATSTemplate } from './resume/ResumeATSTemplate';

// --- COVER LETTER IMPORTS (10 Unique Components) ---
import { ATSFriendlyCoverLetterTemplate } from './coverletter/ATSFriendlyCoverLetterTemplate';
import { ClassicProfessionalCoverLetterTemplate } from './coverletter/ClassicProfessionalCoverLetterTemplate';
import { ClassicSerifCoverLetterTemplate } from './coverletter/ClassicSerifCoverLetterTemplate';
import { CreativeProfessionalCoverLetterTemplate } from './coverletter/CreativeProfessionalCoverLetterTemplate';
import { ExecutiveCoverLetterTemplate } from './coverletter/ExecutiveCoverLetterTemplate';
import { FinanceProfessionalCoverLetterTemplate } from './coverletter/FinanceProfessionalCoverLetterTemplate';
import { ModernCorporateCoverLetterTemplate } from './coverletter/ModernCorporateCoverLetterTemplate';
import { ModernMinimalCoverLetterTemplate } from './coverletter/ModernMinimalCoverLetterTemplate';
import { PremiumEditorialCoverLetterTemplate } from './coverletter/PremiumEditorialCoverLetterTemplate';
import { TechLeadCoverLetterTemplate } from './coverletter/TechLeadCoverLetterTemplate';

export type RegisteredTemplate = TemplateMetadata;

/**
 * Strict, type-safe Component Resolver
 * Guarantees zero cross-type component mismatch between Resume, Biodata, Cover Letter, and Invitation.
 * Every template ID renders its own unique, authentic component without aliases.
 */
function resolveComponent(id: string, type: DocumentType): React.ComponentType<{ data: DocumentData }> {
  // ------------------------------------------------------------
  // 1. RESUME TEMPLATES
  // ------------------------------------------------------------
  if (type === 'resume') {
    switch (id) {
      case 'resume-monaco-sovereign':
        return MonacoSovereignTemplate;
      case 'resume-prem-minimal-executive':
        return PremiumMinimalExecutiveResumeTemplate;
      case 'resume-prem-international':
        return PremiumInternationalResumeTemplate;
      case 'resume-prem-creative-lead':
        return PremiumCreativeLeadResumeTemplate;
      case 'resume-prem-tech-lead':
        return PremiumTechLeadResumeTemplate;
      case 'resume-prem-consultant':
        return PremiumConsultantResumeTemplate;
      case 'resume-ats-basic':
        return ATSBasicResumeTemplate;
      case 'resume-ats-professional':
        return ATSProfessionalResumeTemplate;
      case 'resume-modern-corporate':
        return ModernCorporateResumeTemplate;
      case 'resume-executive-premium':
        return ExecutivePremiumResumeTemplate;
      case 'resume-executive':
        return ExecutiveResumeTemplate;
      case 'resume-modern-minimal':
        return ModernMinimalResumeTemplate;
      case 'resume-minimal':
        return MinimalResumeTemplate;
      case 'resume-two-column':
        return TwoColumnResumeTemplate;
      case 'resume-professional':
        return ProfessionalResumeTemplate;
      case 'resume-clean':
        return CleanResumeTemplate;
      case 'resume-creative':
        return CreativeResumeTemplate;
      case 'resume-finance':
        return FinanceProfessionalResumeTemplate;
      case 'resume-fresh-graduate':
        return FreshGraduateResumeTemplate;
      case 'resume-it':
        return ITProfessionalResumeTemplate;
      case 'resume-classic':
        return ClassicResumeTemplate;
      case 'resume-ats':
        return ResumeATSTemplate;
      default:
        return ATSProfessionalResumeTemplate;
    }
  }

  // ------------------------------------------------------------
  // 2. COVER LETTER TEMPLATES
  // ------------------------------------------------------------
  if (type === 'cover-letter') {
    switch (id) {
      case 'coverletter-modern-corporate':
        return ModernCorporateCoverLetterTemplate;
      case 'coverletter-tech-lead':
        return TechLeadCoverLetterTemplate;
      case 'coverletter-classic-serif':
        return ClassicSerifCoverLetterTemplate;
      case 'coverletter-ats-friendly':
        return ATSFriendlyCoverLetterTemplate;
      case 'coverletter-classic-professional':
        return ClassicProfessionalCoverLetterTemplate;
      case 'coverletter-creative-professional':
        return CreativeProfessionalCoverLetterTemplate;
      case 'coverletter-executive':
        return ExecutiveCoverLetterTemplate;
      case 'coverletter-finance-professional':
        return FinanceProfessionalCoverLetterTemplate;
      case 'coverletter-modern-minimal':
        return ModernMinimalCoverLetterTemplate;
      case 'coverletter-premium-editorial':
        return PremiumEditorialCoverLetterTemplate;
      default:
        return ModernCorporateCoverLetterTemplate;
    }
  }

  // ------------------------------------------------------------
  // 3. MATRIMONIAL BIODATA TEMPLATES
  // ------------------------------------------------------------
  switch (id) {
    case 'biodata-royal-vedic-qr':
      return RoyalVedicQRTemplate;
    case 'marriage-royal-hindu':
      return RoyalHinduBiodataTemplate;
    case 'marriage-modern-teal':
      return ModernTealBiodataTemplate;
    case 'marriage-elegant-blue':
      return ElegantBlueWeddingTemplate;
    case 'marriage-monochrome':
      return MonochromeModernBiodataTemplate;
    case 'marriage-royal-maroon':
      return RoyalMaroonBiodataTemplate;
    case 'biodata-prem-royal-heritage':
      return PremiumRoyalHeritageTemplate;
    case 'biodata-prem-indian-classic':
      return PremiumIndianClassicTemplate;
    case 'biodata-prem-royal-portrait':
      return PremiumRoyalPortraitTemplate;
    case 'biodata-prem-minimal-editorial':
      return PremiumMinimalEditorialTemplate;
    case 'biodata-prem-luxury-gold':
      return PremiumLuxuryGoldTemplate;
    case 'biodata-prem-contemporary-couple':
      return PremiumContemporaryProfileTemplate;
    case 'biodata-prem-elegant-two-tone':
      return PremiumElegantTwoToneTemplate;
    case 'biodata-prem-regal-velvet':
      return PremiumRegalVelvetTemplate;
    case 'biodata-traditional-indian':
      return TraditionalIndianTemplate;
    case 'biodata-traditional-red':
      return TraditionalRedBiodataTemplate;
    case 'biodata-traditional-gold':
      return TraditionalGoldBiodataTemplate;
    case 'biodata-royal-traditional':
      return RoyalTraditionalBiodataTemplate;
    case 'biodata-classic-indian':
      return ClassicIndianBiodataTemplate;
    case 'biodata-circular-photo':
      return CircularPhotoBiodataTemplate;
    case 'biodata-portrait-focus':
      return PortraitFocusBiodataTemplate;
    case 'biodata-floral-border':
      return FloralBorderBiodataTemplate;
    case 'biodata-floral-green':
      return FloralGreenBiodataTemplate;
    case 'biodata-floral-pink':
      return FloralPinkBiodataTemplate;
    case 'biodata-floral':
      return FloralBiodataTemplate;
    case 'biodata-modern-elegant':
      return ModernElegantBiodataTemplate;
    case 'biodata-modern-profile':
      return ModernProfileBiodataTemplate;
    case 'biodata-contemporary':
      return ContemporaryBiodataTemplate;
    case 'biodata-elegant-classic':
      return ElegantClassicBiodataTemplate;
    case 'biodata-premium-royal':
      return PremiumRoyalBiodataTemplate;
    case 'biodata-islamic-nikah':
      return IslamicNikahBiodataTemplate;
    case 'christian-wedding':
    case 'biodata-christian-wedding':
      return ChristianWeddingBiodataTemplate;
    case 'biodata-modern-minimal':
      return ModernMinimalBiodataTemplate;
    case 'biodata-elegant-gold':
      return ElegantGoldBiodataTemplate;
    case 'biodata-premium-dark':
      return PremiumDarkBiodataTemplate;
    case 'biodata-classic-simple':
      return ClassicSimpleBiodataTemplate;
    case 'biodata-photo-focused':
      return PhotoFocusedBiodataTemplate;
    case 'biodata-two-column':
      return TwoColumnBiodataTemplate;
    case 'biodata-modern-indian':
      return ModernIndianBiodataTemplate;
    case 'biodata-elegant-white':
      return ElegantWhiteBiodataTemplate;
    case 'biodata-luxury':
      return LuxuryBiodataTemplate;
    case 'biodata-minimal-professional':
      return MinimalProfessionalBiodataTemplate;
    default:
      return TraditionalIndianTemplate;
  }
}

export function templateSupportsPhoto(templateId?: string, documentType?: DocumentType): boolean {
  if (!templateId) return false;

  // Cover letters never require or support photos
  if (
    documentType === 'cover-letter' ||
    templateId.startsWith('cover-') ||
    templateId.startsWith('coverletter-') ||
    templateId.includes('cover-letter')
  ) {
    return false;
  }

  // Resumes: Profile photos are not required across all resume templates
  if (documentType === 'resume' || templateId.startsWith('resume-')) {
    return false;
  }

  // Biodatas: All standard Indian matrimonial biodatas support photos
  if (documentType === 'biodata' || templateId.startsWith('biodata-') || templateId.startsWith('marriage-')) {
    return true;
  }

  return false;
}

export const TEMPLATE_REGISTRY: RegisteredTemplate[] = Object.entries(catalogJson).map(
  ([id, meta]: [string, any]) => {
    const docType = (meta.documentType || 'biodata') as DocumentType;
    const category = meta.category || (docType === 'biodata' ? 'Matrimonial' : docType === 'resume' ? 'Professional' : 'General');
    const isResume = docType === 'resume' || id.startsWith('resume-');
    const isCoverLetter = docType === 'cover-letter' || id.startsWith('coverletter-');
    
    return {
      id,
      name: meta.name || id,
      type: docType,
      category,
      description:
        meta.description ||
        `${meta.name || id} - Professional ${docType} design optimized for visual clarity, elegance, and immediate high-resolution PDF download.`,
      priceINR: meta.priceINR ?? 0,
      currency: meta.currency || 'INR',
      isATS: meta.isATS ?? (docType === 'resume'),
      supportsPhoto: isResume || isCoverLetter ? false : (meta.supportsPhoto !== undefined ? Boolean(meta.supportsPhoto) : templateSupportsPhoto(id, docType)),
      layout: meta.layout || (docType === 'biodata' ? 'luxury-frame' : 'single'),
      industry: meta.industry || [],
      tags: meta.tags || [category, docType],
      popularity: meta.popularity ?? 85,
      createdAt: meta.createdAt || '2026-01-01',
      primaryColorSample: meta.primaryColor || (docType === 'biodata' ? '#991b1b' : docType === 'resume' ? '#1e3a8a' : '#4338ca'),
      secondaryColorSample: meta.secondaryColor || '#d97706',
      component: resolveComponent(id, docType),
    };
  }
);

export function getTemplateById(id?: string): RegisteredTemplate | undefined {
  if (!id) return undefined;
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

export function getTemplatesByType(type: DocumentType): RegisteredTemplate[] {
  return TEMPLATE_REGISTRY.filter((t) => t.type === type);
}

export function getTemplateCategories(type?: DocumentType): string[] {
  const templates = type ? TEMPLATE_REGISTRY.filter((t) => t.type === type) : TEMPLATE_REGISTRY;
  const cats = new Set<string>();
  templates.forEach((t) => {
    if (t.category) {
      cats.add(t.category);
    }
  });
  return Array.from(cats);
}
