const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/templates/invitations/invitationRegistry.tsx');

const content = `import React from 'react';
import {
  InvitationTemplate,
  InvitationData,
  InvitationCategory,
  InvitationSize,
  InvitationLanguage,
} from '../../types/invitation';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Heart,
  PartyPopper,
  Flame,
  Award,
  Crown,
  Gift,
  Building,
} from 'lucide-react';

// --- 25 UNIQUE INVITATION CARD COMPONENT IMPORTS ---
import { RoyalGoldWeddingInvitation } from './RoyalGoldWeddingInvitation';
import { ModernTealWeddingInvitation } from './ModernTealWeddingInvitation';
import { FloralBlossomWeddingInvitation } from './FloralBlossomWeddingInvitation';
import { DarkLuxuryReceptionInvitation } from './DarkLuxuryReceptionInvitation';
import { PlayfulKidsBirthdayInvitation } from './PlayfulKidsBirthdayInvitation';
import { MilestoneAdultBirthdayInvitation } from './MilestoneAdultBirthdayInvitation';
import { BabyShowerPastelInvitation } from './BabyShowerPastelInvitation';
import { TraditionalPoojaInvitation } from './TraditionalPoojaInvitation';
import { HousewarmingGruhPraveshInvitation } from './HousewarmingGruhPraveshInvitation';
import { GrandOpeningCorporateInvitation } from './GrandOpeningCorporateInvitation';
import { CocktailPartyInvitation } from './CocktailPartyInvitation';
import { PhotoShowcaseEngagementInvitation } from './PhotoShowcaseEngagementInvitation';
import { SilverAnniversaryInvitation } from './SilverAnniversaryInvitation';
import { ModernMinimalCleanInvitation } from './ModernMinimalCleanInvitation';
import { BlackGoldNoirInvitation } from './BlackGoldNoirInvitation';
import { PastelGardenFloralInvitation } from './PastelGardenFloralInvitation';
import { RoyalBlueSapphireInvitation } from './RoyalBlueSapphireInvitation';
import { LuxuryDinnerGalaInvitation } from './LuxuryDinnerGalaInvitation';
import { GraduationHonorsInvitation } from './GraduationHonorsInvitation';
import { DiwaliFestiveGalaInvitation } from './DiwaliFestiveGalaInvitation';
import { CorporateSummitAwardsInvitation } from './CorporateSummitAwardsInvitation';
import { MarbleGoldLuxeInvitation } from './MarbleGoldLuxeInvitation';
import { EmeraldVelvetLuxeInvitation } from './EmeraldVelvetLuxeInvitation';
import { GoldenBotanicalLuxeInvitation } from './GoldenBotanicalLuxeInvitation';
import { ModernTypographyChicInvitation } from './ModernTypographyChicInvitation';

// Re-export all 25 individual invitation templates
export {
  RoyalGoldWeddingInvitation,
  ModernTealWeddingInvitation,
  FloralBlossomWeddingInvitation,
  DarkLuxuryReceptionInvitation,
  PlayfulKidsBirthdayInvitation,
  MilestoneAdultBirthdayInvitation,
  BabyShowerPastelInvitation,
  TraditionalPoojaInvitation,
  HousewarmingGruhPraveshInvitation,
  GrandOpeningCorporateInvitation,
  CocktailPartyInvitation,
  PhotoShowcaseEngagementInvitation,
  SilverAnniversaryInvitation,
  ModernMinimalCleanInvitation,
  BlackGoldNoirInvitation,
  PastelGardenFloralInvitation,
  RoyalBlueSapphireInvitation,
  LuxuryDinnerGalaInvitation,
  GraduationHonorsInvitation,
  DiwaliFestiveGalaInvitation,
  CorporateSummitAwardsInvitation,
  MarbleGoldLuxeInvitation,
  EmeraldVelvetLuxeInvitation,
  GoldenBotanicalLuxeInvitation,
  ModernTypographyChicInvitation,
};

/**
 * Universal, null-safe base luxury invitation card component.
 * Safely handles missing fields, objects, or strings without runtime exceptions.
 */
export const LuxuryInvitationCard: React.FC<{ data: any; scale?: number }> = ({ data }) => {
  const inv = data?.invitation || data || {};
  const {
    title,
    eventTitle,
    subtitle,
    category = 'Event',
    hosts,
    primaryName,
    secondaryName,
    parentsNames,
    date,
    time,
    venueName,
    venueAddress,
    contactPhone,
    rsvp,
    message,
    ceremonies,
    photos,
    design,
  } = inv;

  const primary = design?.primaryColor || '#991b1b';
  const accent = design?.accentColor || '#d97706';
  const bg = design?.backgroundColor || '#fdfaf5';
  const text = design?.textColor || '#1e293b';
  const cardBg = design?.cardBackground || bg;
  const categoryStr = typeof category === 'string' ? category : 'Event';
  const displaySubtitle = subtitle || (categoryStr ? categoryStr.toUpperCase() + ' INVITATION' : 'INVITATION');

  const renderIcon = () => {
    switch (design?.decorationType) {
      case 'ganesh':
      case 'diya':
        return <Flame className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-pulse" />;
      case 'rings':
        return <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" fill="currentColor" />;
      case 'cake':
      case 'balloons':
      case 'confetti':
        return <PartyPopper className="w-8 h-8 text-amber-600 mx-auto mb-2" />;
      case 'sparkles':
      case 'stars':
        return <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />;
      case 'baby':
        return <Gift className="w-8 h-8 text-sky-500 mx-auto mb-2" />;
      default:
        if (category === 'wedding') return <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />;
        if (category === 'business') return <Building className="w-8 h-8 text-slate-700 mx-auto mb-2" />;
        if (category === 'education') return <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />;
        return <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />;
    }
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 transition-all select-none box-border shadow-2xl"
      style={{
        background: cardBg,
        color: text,
      }}
    >
      {/* Ornate Border Frame */}
      <div
        className="absolute inset-3 pointer-events-none rounded-xl"
        style={{
          border: design?.borderStyle === 'gold-double'
            ? '4px double ' + accent
            : design?.borderStyle === 'curved'
            ? '2px solid ' + accent
            : '2px solid ' + accent + '40',
        }}
      />

      <div
        className="absolute inset-5 pointer-events-none rounded-lg"
        style={{
          border: '1px dashed ' + accent + '30',
        }}
      />

      {/* Header section */}
      <div className="relative z-10 text-center pt-2">
        {renderIcon()}

        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-1.5 opacity-90"
          style={{ color: accent }}
        >
          {displaySubtitle}
        </p>

        {hosts && (
          <p className="text-xs italic opacity-80 mb-2">
            With the blessings of our elders, {hosts} cordially invite you to
          </p>
        )}

        <h1
          className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase font-serif mt-2"
          style={{ color: primary }}
        >
          {eventTitle || title || 'Celebration'}
        </h1>
      </div>

      {/* Main Couple / Person names & optional Photo */}
      <div className="relative z-10 text-center my-auto py-4">
        {photos && photos.length > 0 && design?.showPhoto && (
          <div className="flex justify-center mb-4">
            <div
              className={\`overflow-hidden border-2 shadow-md \${
                design?.photoShape === 'circle'
                  ? 'rounded-full w-28 h-28'
                  : design?.photoShape === 'arch'
                  ? 'rounded-t-full w-28 h-36'
                  : 'rounded-xl w-28 h-28'
              }\`}
              style={{ borderColor: accent }}
            >
              <img
                src={photos[0]}
                alt="Honoree"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-8 sm:w-16" style={{ backgroundColor: accent }} />
          <h2
            className="text-2xl sm:text-3xl font-bold font-serif tracking-wide"
            style={{ color: primary }}
          >
            {primaryName || 'Honored Guest'}
            {secondaryName && ' & ' + secondaryName}
          </h2>
          <div className="h-[1px] w-8 sm:w-16" style={{ backgroundColor: accent }} />
        </div>

        {parentsNames && (
          <p className="text-xs text-slate-500 mt-1 font-serif">
            (Son/Daughter of {parentsNames})
          </p>
        )}

        {message && (
          <p className="text-xs italic max-w-sm mx-auto mt-3 opacity-75 font-serif leading-relaxed px-4">
            "{message}"
          </p>
        )}
      </div>

      {/* Ceremonies List or Date/Time/Venue */}
      <div className="relative z-10">
        {ceremonies && ceremonies.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {ceremonies.map((c: any, i: number) => (
              <div
                key={i}
                className="bg-white/60 p-2 rounded border text-center"
                style={{ borderColor: accent + '30' }}
              >
                <span className="text-[11px] font-bold block" style={{ color: primary }}>
                  {c.name}
                </span>
                <span className="text-[10px] text-slate-600 block">{c.date} • {c.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="bg-white/60 p-4 rounded-xl border max-w-sm mx-auto mb-4 text-center shadow-xs"
            style={{ borderColor: accent + '40' }}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold mb-1" style={{ color: primary }}>
              <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>{date || 'Upcoming Date'}</span>
              <span className="opacity-40">•</span>
              <Clock className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>{time || '7:00 PM'}</span>
            </div>

            <div className="flex items-start justify-center gap-1.5 text-xs text-slate-600 mt-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
              <div>
                <p className="font-semibold text-slate-800">{venueName || 'Grand Hall'}</p>
                {venueAddress && <p className="text-[11px] text-slate-500">{venueAddress}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Footer / RSVP */}
        <div className="text-center pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] opacity-80" style={{ borderColor: accent + '30' }}>
          {(rsvp || contactPhone) && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" style={{ color: accent }} />
              <span>RSVP: {rsvp || contactPhone}</span>
            </div>
          )}
          <span className="text-[10px] tracking-wider uppercase font-serif" style={{ color: primary }}>
            Auspicious Celebrations
          </span>
        </div>
      </div>
    </div>
  );
};

export const createDefaultInvitationData = (
  templateId: string,
  category: InvitationCategory = 'wedding',
  subcategory: string = 'marriage'
): InvitationData => ({
  id: 'inv_' + Date.now(),
  templateId,
  title: 'Royal Wedding Celebration',
  category,
  subcategory,
  eventTitle: 'Grand Wedding Celebration',
  subtitle: 'Auspicious Shubh Vivah',
  hosts: 'Mr. & Mrs. Sharma',
  primaryName: 'Rahul',
  secondaryName: 'Priya',
  parentsNames: 'Ramesh & Sunita Sharma',
  date: 'Sunday, December 20, 2026',
  time: '7:00 PM Onwards',
  venueName: 'The Royal Palace Banquet',
  venueAddress: 'Opp. City Garden, MG Road, Udaipur, Rajasthan 313001',
  contactPhone: '+91 98765 43210',
  rsvp: '+91 98765 43210 / 98765 43211',
  message: 'We request the pleasure of your company to grace this blessed occasion with your love, presence, and blessings.',
  language: 'en',
  size: 'portrait',
  design: {
    fontFamily: 'cinzel',
    fontSizeScale: 'base',
    primaryColor: '#831843',
    secondaryColor: '#d97706',
    backgroundColor: '#fdfaf5',
    accentColor: '#d97706',
    textColor: '#1e293b',
    borderStyle: 'gold-double',
    decorationType: 'ganesh',
    textAlign: 'center',
    showPhoto: false,
    photoShape: 'circle',
  },
});

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'inv-royal-gold-wedding',
    name: 'Royal Gold Shubh Vivah',
    category: 'wedding',
    subcategory: 'marriage',
    style: 'royal',
    priceINR: 100,
    currency: 'INR',
    popularity: 98,
    isNew: true,
    previewColor: '#831843',
    secondaryColor: '#d97706',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-royal-gold-wedding', 'wedding', 'marriage'),
    supportedLanguages: ['en', 'hi', 'gu', 'mr'],
    maxPhotos: 1,
    tags: ['royal', 'gold', 'wedding', 'vivah', 'traditional'],
    component: RoyalGoldWeddingInvitation,
  },
  {
    id: 'inv-modern-teal-wedding',
    name: 'Modern Teal & Gold Couple',
    category: 'wedding',
    subcategory: 'wedding-invitation',
    style: 'modern',
    priceINR: 0,
    currency: 'INR',
    popularity: 94,
    previewColor: '#0f766e',
    secondaryColor: '#f59e0b',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-modern-teal-wedding', 'wedding', 'wedding-invitation'),
    supportedLanguages: ['en', 'hi', 'gu'],
    maxPhotos: 2,
    tags: ['free', 'modern', 'teal', 'wedding'],
    component: ModernTealWeddingInvitation,
  },
  {
    id: 'inv-floral-blossom-wedding',
    name: 'Blush Botanical Wedding',
    category: 'wedding',
    subcategory: 'wedding-invitation',
    style: 'floral',
    priceINR: 50,
    currency: 'INR',
    popularity: 91,
    previewColor: '#9d174d',
    secondaryColor: '#fb7185',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-floral-blossom-wedding', 'wedding', 'wedding-invitation'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 1,
    tags: ['floral', 'botanical', 'wedding', 'blush'],
    component: FloralBlossomWeddingInvitation,
  },
  {
    id: 'inv-dark-luxury-reception',
    name: 'Midnight Gold Reception',
    category: 'wedding',
    subcategory: 'reception',
    style: 'dark-luxury',
    priceINR: 100,
    currency: 'INR',
    popularity: 96,
    previewColor: '#0f172a',
    secondaryColor: '#fbbf24',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-dark-luxury-reception', 'wedding', 'reception'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['dark', 'luxury', 'gold', 'reception', 'night'],
    component: DarkLuxuryReceptionInvitation,
  },
  {
    id: 'inv-playful-kids-birthday',
    name: 'Rainbow Balloon Kids Bash',
    category: 'birthday',
    subcategory: 'kids-birthday',
    style: 'kids',
    priceINR: 0,
    currency: 'INR',
    popularity: 88,
    previewColor: '#0284c7',
    secondaryColor: '#f59e0b',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-playful-kids-birthday', 'birthday', 'kids-birthday'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 1,
    tags: ['kids', 'birthday', 'balloons', 'playful'],
    component: PlayfulKidsBirthdayInvitation,
  },
  {
    id: 'inv-milestone-adult-birthday',
    name: 'Gold Noir 30th / 50th Milestone',
    category: 'birthday',
    subcategory: 'adult-birthday',
    style: 'gold',
    priceINR: 50,
    currency: 'INR',
    popularity: 90,
    previewColor: '#18181b',
    secondaryColor: '#eab308',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-milestone-adult-birthday', 'birthday', 'adult-birthday'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['adult', 'milestone', 'birthday', 'noir'],
    component: MilestoneAdultBirthdayInvitation,
  },
  {
    id: 'inv-baby-shower-pastel',
    name: 'Heaven Sent Baby Shower',
    category: 'baby',
    subcategory: 'baby-shower',
    style: 'pastel',
    priceINR: 50,
    currency: 'INR',
    popularity: 92,
    previewColor: '#0284c7',
    secondaryColor: '#f472b6',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-baby-shower-pastel', 'baby', 'baby-shower'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 1,
    tags: ['baby', 'shower', 'pastel', 'cute'],
    component: BabyShowerPastelInvitation,
  },
  {
    id: 'inv-traditional-pooja',
    name: 'Satyanarayan Katha & Puja',
    category: 'religious',
    subcategory: 'pooja',
    style: 'traditional',
    priceINR: 50,
    currency: 'INR',
    popularity: 95,
    previewColor: '#c2410c',
    secondaryColor: '#eab308',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-traditional-pooja', 'religious', 'pooja'),
    supportedLanguages: ['en', 'hi', 'gu', 'mr'],
    maxPhotos: 0,
    tags: ['pooja', 'satyanarayan', 'religious', 'traditional', 'ganesh'],
    component: TraditionalPoojaInvitation,
  },
  {
    id: 'inv-housewarming-gruh-pravesh',
    name: 'Gruh Pravesh & Housewarming',
    category: 'house',
    subcategory: 'housewarming',
    style: 'traditional',
    priceINR: 50,
    currency: 'INR',
    popularity: 93,
    previewColor: '#15803d',
    secondaryColor: '#d97706',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-housewarming-gruh-pravesh', 'house', 'housewarming'),
    supportedLanguages: ['en', 'hi', 'gu'],
    maxPhotos: 1,
    tags: ['housewarming', 'gruh-pravesh', 'new-home'],
    component: HousewarmingGruhPraveshInvitation,
  },
  {
    id: 'inv-grand-opening-corporate',
    name: 'Executive Grand Opening',
    category: 'business',
    subcategory: 'grand-opening',
    style: 'corporate',
    priceINR: 100,
    currency: 'INR',
    popularity: 89,
    previewColor: '#0f172a',
    secondaryColor: '#d97706',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-grand-opening-corporate', 'business', 'grand-opening'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['business', 'launch', 'corporate', 'office'],
    component: GrandOpeningCorporateInvitation,
  },
  {
    id: 'inv-cocktail-party',
    name: 'Twilight Cocktail Soirée',
    category: 'party',
    subcategory: 'cocktail',
    style: 'dark-luxury',
    priceINR: 50,
    currency: 'INR',
    popularity: 87,
    previewColor: '#4c1d95',
    secondaryColor: '#f43f5e',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-cocktail-party', 'party', 'cocktail'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['cocktail', 'party', 'drinks', 'soiree'],
    component: CocktailPartyInvitation,
  },
  {
    id: 'inv-photo-showcase-engagement',
    name: 'Editorial Photo Save the Date',
    category: 'wedding',
    subcategory: 'engagement',
    style: 'photo-based',
    priceINR: 100,
    currency: 'INR',
    popularity: 97,
    previewColor: '#1e293b',
    secondaryColor: '#e11d48',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-photo-showcase-engagement', 'wedding', 'engagement'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 2,
    tags: ['photo', 'engagement', 'save-the-date', 'modern'],
    component: PhotoShowcaseEngagementInvitation,
  },
  {
    id: 'inv-silver-anniversary',
    name: 'Silver Jubilee & Rose Gold',
    category: 'party',
    subcategory: 'anniversary',
    style: 'elegant',
    priceINR: 50,
    currency: 'INR',
    popularity: 90,
    previewColor: '#334155',
    secondaryColor: '#f43f5e',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-silver-anniversary', 'party', 'anniversary'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 1,
    tags: ['anniversary', 'silver-jubilee', '25th', 'celebration'],
    component: SilverAnniversaryInvitation,
  },
  {
    id: 'inv-modern-minimal-clean',
    name: 'Modern Minimalist Monochrome',
    category: 'party',
    subcategory: 'minimal',
    style: 'minimal',
    priceINR: 0,
    currency: 'INR',
    popularity: 86,
    previewColor: '#09090b',
    secondaryColor: '#52525b',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-modern-minimal-clean', 'party', 'minimal'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['minimal', 'clean', 'monochrome', 'black-white'],
    component: ModernMinimalCleanInvitation,
  },
  {
    id: 'inv-black-gold-noir',
    name: 'Gatsby Black & Gold Grand Ball',
    category: 'party',
    subcategory: 'noir-gala',
    style: 'gold',
    priceINR: 100,
    currency: 'INR',
    popularity: 96,
    previewColor: '#f59e0b',
    secondaryColor: '#d97706',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-black-gold-noir', 'party', 'noir-gala'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['gatsby', 'black-gold', 'luxury', 'noir', 'ball'],
    component: BlackGoldNoirInvitation,
  },
  {
    id: 'inv-pastel-garden-floral',
    name: 'Blush & Lavender Garden Party',
    category: 'party',
    subcategory: 'garden-party',
    style: 'floral',
    priceINR: 50,
    currency: 'INR',
    popularity: 89,
    previewColor: '#6b21a8',
    secondaryColor: '#ec4899',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-pastel-garden-floral', 'party', 'garden-party'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['garden', 'lavender', 'floral', 'outdoor', 'tea-party'],
    component: PastelGardenFloralInvitation,
  },
  {
    id: 'inv-royal-blue-sapphire',
    name: 'Imperial Sapphire & Royal Blue',
    category: 'wedding',
    subcategory: 'royal-wedding',
    style: 'royal',
    priceINR: 100,
    currency: 'INR',
    popularity: 95,
    previewColor: '#1e3a8a',
    secondaryColor: '#fbbf24',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-royal-blue-sapphire', 'wedding', 'royal-wedding'),
    supportedLanguages: ['en', 'hi', 'gu', 'mr'],
    maxPhotos: 1,
    tags: ['royal-blue', 'sapphire', 'gold', 'imperial', 'wedding'],
    component: RoyalBlueSapphireInvitation,
  },
  {
    id: 'inv-luxury-dinner-gala',
    name: 'Haute Velvet Charity Dinner Gala',
    category: 'business',
    subcategory: 'charity-gala',
    style: 'dark-luxury',
    priceINR: 100,
    currency: 'INR',
    popularity: 91,
    previewColor: '#4c0519',
    secondaryColor: '#eab308',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-luxury-dinner-gala', 'business', 'charity-gala'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['gala', 'charity', 'dinner', 'velvet', 'black-tie'],
    component: LuxuryDinnerGalaInvitation,
  },
  {
    id: 'inv-graduation-honors',
    name: 'Collegiate Honors & Commencement',
    category: 'education',
    subcategory: 'graduation',
    style: 'corporate',
    priceINR: 0,
    currency: 'INR',
    popularity: 85,
    previewColor: '#1e1b4b',
    secondaryColor: '#d97706',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-graduation-honors', 'education', 'graduation'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['graduation', 'commencement', 'academic', 'honors'],
    component: GraduationHonorsInvitation,
  },
  {
    id: 'inv-diwali-festive-gala',
    name: 'Shubh Deepavali Festive Milan',
    category: 'religious',
    subcategory: 'festive',
    style: 'traditional',
    priceINR: 50,
    currency: 'INR',
    popularity: 98,
    isNew: true,
    previewColor: '#991b1b',
    secondaryColor: '#f59e0b',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-diwali-festive-gala', 'religious', 'festive'),
    supportedLanguages: ['en', 'hi', 'gu', 'mr'],
    maxPhotos: 0,
    tags: ['diwali', 'deepavali', 'festive', 'milan', 'diya'],
    component: DiwaliFestiveGalaInvitation,
  },
  {
    id: 'inv-corporate-summit-awards',
    name: 'Global Leadership Summit & Keynote',
    category: 'business',
    subcategory: 'summit',
    style: 'corporate',
    priceINR: 100,
    currency: 'INR',
    popularity: 92,
    previewColor: '#0f172a',
    secondaryColor: '#0284c7',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-corporate-summit-awards', 'business', 'summit'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['summit', 'conference', 'keynote', 'leadership', 'tech'],
    component: CorporateSummitAwardsInvitation,
  },
  {
    id: 'inv-marble-gold-luxe',
    name: 'Carrara Marble & Gold Leaf',
    category: 'party',
    subcategory: 'marble-luxe',
    style: 'luxury',
    priceINR: 100,
    currency: 'INR',
    popularity: 94,
    previewColor: '#1c1917',
    secondaryColor: '#ca8a04',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-marble-gold-luxe', 'party', 'marble-luxe'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['marble', 'gold-leaf', 'luxury', 'modern'],
    component: MarbleGoldLuxeInvitation,
  },
  {
    id: 'inv-emerald-velvet-luxe',
    name: 'Royal Emerald Velvet Soirée',
    category: 'party',
    subcategory: 'emerald-luxe',
    style: 'royal',
    priceINR: 100,
    currency: 'INR',
    popularity: 96,
    isNew: true,
    previewColor: '#064e3b',
    secondaryColor: '#f59e0b',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-emerald-velvet-luxe', 'party', 'emerald-luxe'),
    supportedLanguages: ['en', 'hi'],
    maxPhotos: 1,
    tags: ['emerald', 'velvet', 'royal', 'soiree', 'gold'],
    component: EmeraldVelvetLuxeInvitation,
  },
  {
    id: 'inv-golden-botanical-luxe',
    name: 'Gilded Olive & Botanical Wreath',
    category: 'wedding',
    subcategory: 'botanical-luxe',
    style: 'floral',
    priceINR: 50,
    currency: 'INR',
    popularity: 91,
    previewColor: '#3f6212',
    secondaryColor: '#ca8a04',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-golden-botanical-luxe', 'wedding', 'botanical-luxe'),
    supportedLanguages: ['en'],
    maxPhotos: 1,
    tags: ['botanical', 'olive', 'wreath', 'gold', 'wedding'],
    component: GoldenBotanicalLuxeInvitation,
  },
  {
    id: 'inv-modern-typography-chic',
    name: 'Avant-Garde Editorial Typography',
    category: 'party',
    subcategory: 'typography-chic',
    style: 'typography',
    priceINR: 50,
    currency: 'INR',
    popularity: 88,
    previewColor: '#09090b',
    secondaryColor: '#ea580c',
    defaultSize: 'portrait',
    defaultData: createDefaultInvitationData('inv-modern-typography-chic', 'party', 'typography-chic'),
    supportedLanguages: ['en'],
    maxPhotos: 0,
    tags: ['typography', 'editorial', 'chic', 'avant-garde'],
    component: ModernTypographyChicInvitation,
  },
];

export const getInvitationTemplateById = (id?: string): InvitationTemplate | undefined => {
  if (!id) return undefined;
  return INVITATION_TEMPLATES.find((t) => t.id === id);
};

export const getInvitationTemplatesByCategory = (category?: InvitationCategory): InvitationTemplate[] => {
  if (!category || category === 'other') return INVITATION_TEMPLATES;
  return INVITATION_TEMPLATES.filter((t) => t.category === category);
};
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated ' + targetFile);
