import os

INVITATIONS_DIR = "src/templates/invitations"
os.makedirs(INVITATIONS_DIR, exist_ok=True)

# Helper function template generator
def make_template(component_name, title, category, subcategory, primary_color, secondary_color, bg_style, border_style, deco_import, deco_render, specific_details):
    return f'''import React from 'react';
import {{ Calendar, Clock, MapPin, Phone, Heart, Sparkles, Crown }} from 'lucide-react';
{deco_import}

interface InvitationProps {{
  data: any;
  scale?: number;
}}

export const {component_name}: React.FC<InvitationProps> = ({{ data }}) => {{
  const inv = data?.invitation || data || {{}};
  const personal = data?.personal || {{}};
  const contact = data?.contact || {{}};
  const marriage = data?.marriage || {{}};
  const custom = data?.customization || {{}};

  const title = inv.title || data?.title || '{title}';
  const eventTitle = inv.eventTitle || inv.title || personal.professionalTitle || '{title}';
  const subtitle = inv.subtitle || (inv.category ? `${{String(inv.category).toUpperCase()}} INVITATION` : '{category.upper()} INVITATION');
  const hosts = inv.hosts || (marriage.fatherName ? `Mr. & Mrs. ${{marriage.fatherName}}` : 'The Family');
  const primaryName = inv.primaryName || personal.fullName || 'Rahul & Priya';
  const secondaryName = inv.secondaryName || '';
  const date = inv.date || 'Sunday, December 20, 2026';
  const time = inv.time || '7:00 PM Onwards';
  const venueName = inv.venueName || contact.address || 'The Grand Palace Hall';
  const venueAddress = inv.venueAddress || `${{contact.city || 'Udaipur'}}, ${{contact.state || 'Rajasthan'}}`;
  const rsvp = inv.rsvp || inv.contactPhone || contact.phone || '+91 98765 43210';
  const message = inv.message || marriage.aboutMe || 'We request the honor of your presence and warm blessings as we celebrate this auspicious milestone.';
  const ceremonies = inv.ceremonies || [];
  const photos = inv.photos || (personal.profilePhoto ? [personal.profilePhoto] : []);

  const primary = custom.primaryColor || inv.design?.primaryColor || '{primary_color}';
  const accent = custom.accentColor || inv.design?.accentColor || '{secondary_color}';

  return (
    <div
      className="w-full h-full min-h-[1123px] relative overflow-hidden flex flex-col justify-between p-8 sm:p-14 select-none box-border shadow-2xl transition-all"
      style={{{{ {bg_style} }}}}
    >
      {/* Decorative Border Frame */}
      {border_style}

      {/* Header Accent */}
      <div className="relative z-10 text-center pt-4">
        {deco_render}
        <p
          className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 opacity-90 font-serif"
          style={{{{ color: accent }}}}
        >
          {{subtitle}}
        </p>
        {{hosts && (
          <p className="text-xs sm:text-sm italic opacity-85 mb-3 font-serif max-w-lg mx-auto">
            With the blessings of our elders, {{hosts}} cordially invite you to celebrate
          </p>
        )}}
        <h1
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-serif mt-2"
          style={{{{ color: primary }}}}
        >
          {{eventTitle}}
        </h1>
      </div>

      {/* Main Focus: Couple / Honoree / Photo */}
      <div className="relative z-10 text-center my-auto py-6">
        {{photos && photos.length > 0 && (
          <div className="flex justify-center mb-5">
            <div
              className="overflow-hidden border-2 shadow-xl rounded-full w-32 h-32 p-1"
              style={{{{ borderColor: accent }}}}
            >
              <img
                src={{photos[0]}}
                alt="Honoree"
                className="w-full h-full object-cover rounded-full"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}}

        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 sm:w-20" style={{{{ backgroundColor: accent }}}} />
          <h2
            className="text-2xl sm:text-4xl font-bold font-serif tracking-wide"
            style={{{{ color: primary }}}}
          >
            {{primaryName}}
            {{secondaryName ? ` & ${{secondaryName}}` : ''}}
          </h2>
          <div className="h-[1px] w-12 sm:w-20" style={{{{ backgroundColor: accent }}}} />
        </div>

        {specific_details}

        {{message && (
          <p className="text-xs sm:text-sm italic max-w-lg mx-auto mt-4 opacity-80 font-serif leading-relaxed px-4">
            "{{message}}"
          </p>
        )}}
      </div>

      {/* Event Details: Date, Time, Venue, RSVP */}
      <div className="relative z-10">
        {{ceremonies && ceremonies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-xl mx-auto">
            {{ceremonies.map((c: any, idx: number) => (
              <div
                key={{idx}}
                className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border text-center shadow-xs"
                style={{{{ borderColor: `${{accent}}30` }}}}
              >
                <p className="text-xs font-bold uppercase tracking-wider" style={{{{ color: primary }}}}>
                  {{c.name}}
                </p>
                <p className="text-xs text-slate-700 mt-0.5">{{c.date}} at {{c.time}}</p>
                {{c.venue && <p className="text-[11px] text-slate-500 truncate">{{c.venue}}</p>}}
              </div>
            ))}}
          </div>
        ) : (
          <div
            className="bg-white/80 backdrop-blur-xs p-5 rounded-xl border max-w-xl mx-auto mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left"
            style={{{{ borderColor: `${{accent}}40` }}}}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 shrink-0" style={{{{ color: accent }}}} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">{{date}}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 shrink-0" style={{{{ color: accent }}}} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Time</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">{{time}}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 shrink-0" style={{{{ color: accent }}}} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Venue</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate max-w-[140px]">
                  {{venueName}}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{{venueAddress}}</p>
              </div>
            </div>
          </div>
        )}}

        <div className="text-center border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-xl mx-auto text-xs" style={{{{ borderColor: `${{accent}}30` }}}}>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{{{ color: accent }}}} />
            <span className="font-semibold text-slate-800">RSVP: {{rsvp}}</span>
          </div>
          <span className="text-[11px] tracking-widest uppercase font-serif opacity-70" style={{{{ color: primary }}}}>
            Genova Profile • Auspicious Celebrations
          </span>
        </div>
      </div>
    </div>
  );
}};
'''

templates = [
    (
        "RoyalGoldWeddingInvitation.tsx",
        "RoyalGoldWeddingInvitation",
        "Royal Gold Shubh Vivah",
        "wedding",
        "marriage",
        "#831843",
        "#d97706",
        "background: 'linear-gradient(135deg, #fdfaf5 0%, #fef3c7 50%, #fffbeb 100%)', color: '#1e293b'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-4 border-double" style={{ borderColor: accent }} />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed" style={{ borderColor: `${accent}60` }} />
      <InvitationCornerOrnament className="absolute top-6 left-6" size={50} color={accent} />
      <InvitationCornerOrnament className="absolute top-6 right-6 rotate-90" size={50} color={accent} />
      <InvitationCornerOrnament className="absolute bottom-6 left-6 -rotate-90" size={50} color={accent} />
      <InvitationCornerOrnament className="absolute bottom-6 right-6 rotate-180" size={50} color={accent} />''',
        "import { InvitationGanesha, InvitationCornerOrnament } from './invitationDecorations';",
        "<InvitationGanesha className=\"mx-auto mb-3\" size={52} color={accent} /><p className=\"text-xs tracking-widest font-serif font-bold uppercase mb-2\" style={{ color: accent }}>|| Om Shri Ganeshaya Namah ||</p>",
        "<p className=\"text-sm sm:text-base font-serif italic text-amber-900 mt-2\">Solicit your gracious presence & auspicious blessings on our holy matrimony</p>"
    ),
    (
        "ModernTealWeddingInvitation.tsx",
        "ModernTealWeddingInvitation",
        "Modern Teal & Gold Couple",
        "wedding",
        "wedding-invitation",
        "#0f766e",
        "#f59e0b",
        "background: 'linear-gradient(145deg, #f0fdfa 0%, #e6fffa 40%, #fefce8 100%)', color: '#0f172a'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border-2" style={{ borderColor: primary }} />
      <div className="absolute inset-7 pointer-events-none rounded-lg border border-dashed" style={{ borderColor: accent }} />''',
        "import { InvitationWeddingRings } from './invitationDecorations';",
        "<InvitationWeddingRings className=\"mx-auto mb-2\" size={46} color={accent} />",
        "<p className=\"text-xs uppercase tracking-widest text-teal-800 font-sans font-semibold mt-2\">Save The Date for the Wedding Celebration</p>"
    ),
    (
        "FloralBlossomWeddingInvitation.tsx",
        "FloralBlossomWeddingInvitation",
        "Blush Botanical Wedding",
        "wedding",
        "wedding-invitation",
        "#9d174d",
        "#fb7185",
        "background: 'linear-gradient(160deg, #fff1f2 0%, #fdf2f8 50%, #ffffff 100%)', color: '#334155'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border-2" style={{ borderColor: `${accent}80` }} />
      <div className="absolute inset-8 pointer-events-none rounded-xl border border-dashed" style={{ borderColor: `${primary}40` }} />''',
        "import { InvitationLotus } from './invitationDecorations';",
        "<InvitationLotus className=\"mx-auto mb-2\" size={48} color={primary} />",
        "<p className=\"text-xs uppercase tracking-widest text-rose-700 font-serif italic mt-2\">Together with their loving families</p>"
    ),
    (
        "DarkLuxuryReceptionInvitation.tsx",
        "DarkLuxuryReceptionInvitation",
        "Midnight Gold Reception",
        "wedding",
        "reception",
        "#fbbf24",
        "#d97706",
        "background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)', color: '#f8fafc'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-2" style={{ borderColor: accent }} />
      <div className="absolute inset-6 pointer-events-none rounded-xl border border-dashed" style={{ borderColor: `${primary}50` }} />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<Crown className=\"w-10 h-10 text-amber-400 mx-auto mb-3 animate-pulse\" />",
        "<p className=\"text-xs uppercase tracking-widest text-amber-300 font-sans mt-2\">An Evening of Elegance & Haute Cuisine</p>"
    ),
    (
        "PlayfulKidsBirthdayInvitation.tsx",
        "PlayfulKidsBirthdayInvitation",
        "Rainbow Balloon Kids Bash",
        "birthday",
        "kids-birthday",
        "#0284c7",
        "#f59e0b",
        "background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 50%, #fefce8 100%)', color: '#1e293b'",
        '''<div className="absolute inset-5 pointer-events-none rounded-3xl border-4 border-dashed" style={{ borderColor: '#38bdf8' }} />''',
        "",
        "<Sparkles className=\"w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce\" />",
        "<p className=\"text-xs font-bold text-sky-600 uppercase tracking-widest mt-2\">Games • Cake • Surprises • Fun</p>"
    ),
    (
        "MilestoneAdultBirthdayInvitation.tsx",
        "MilestoneAdultBirthdayInvitation",
        "Gold Noir 30th / 50th Milestone",
        "birthday",
        "adult-birthday",
        "#eab308",
        "#ca8a04",
        "background: 'linear-gradient(135deg, #18181b 0%, #09090b 60%, #1c1917 100%)', color: '#f4f4f5'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border-2" style={{ borderColor: primary }} />
      <div className="absolute inset-8 pointer-events-none rounded-lg border border-dashed" style={{ borderColor: accent }} />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<Sparkles className=\"w-10 h-10 text-amber-400 mx-auto mb-2\" />",
        "<p className=\"text-xs uppercase tracking-widest text-amber-400 font-serif mt-2\">Cheers to a Magnificent New Decade</p>"
    ),
    (
        "BabyShowerPastelInvitation.tsx",
        "BabyShowerPastelInvitation",
        "Heaven Sent Baby Shower",
        "baby",
        "baby-shower",
        "#0284c7",
        "#f472b6",
        "background: 'linear-gradient(135deg, #f0fdfa 0%, #fdf2f8 60%, #fefce8 100%)', color: '#1e293b'",
        '''<div className="absolute inset-5 pointer-events-none rounded-3xl border-2 border-dotted" style={{ borderColor: '#f472b6' }} />''',
        "",
        "<Heart className=\"w-10 h-10 text-pink-500 mx-auto mb-2\" fill=\"currentColor\" />",
        "<p className=\"text-xs uppercase tracking-widest text-pink-600 font-serif mt-2\">A Little Miracle is on the Way</p>"
    ),
    (
        "TraditionalPoojaInvitation.tsx",
        "TraditionalPoojaInvitation",
        "Satyanarayan Katha & Puja",
        "religious",
        "pooja",
        "#c2410c",
        "#eab308",
        "background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fefce8 100%)', color: '#431407'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-4 border-double" style={{ borderColor: '#c2410c' }} />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed" style={{ borderColor: '#eab308' }} />''',
        "import { InvitationGanesha, InvitationDiya } from './invitationDecorations';",
        "<InvitationGanesha className=\"mx-auto mb-2\" size={50} color=\"#c2410c\" /><InvitationDiya className=\"mx-auto mb-2\" size={36} color=\"#ea580c\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-amber-800 font-serif mt-2\">Seek Divine Blessings & Mahaprasad</p>"
    ),
    (
        "HousewarmingGruhPraveshInvitation.tsx",
        "HousewarmingGruhPraveshInvitation",
        "Gruh Pravesh & Housewarming",
        "house",
        "housewarming",
        "#15803d",
        "#d97706",
        "background: 'linear-gradient(135deg, #f0fdf4 0%, #fefce8 60%, #fffbeb 100%)', color: '#14532d'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border-2" style={{ borderColor: '#15803d' }} />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed" style={{ borderColor: '#d97706' }} />''',
        "import { InvitationDiya } from './invitationDecorations';",
        "<InvitationDiya className=\"mx-auto mb-2\" size={44} color=\"#d97706\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-emerald-800 font-serif mt-2\">Bless Our New Abode with Warmth & Light</p>"
    ),
    (
        "GrandOpeningCorporateInvitation.tsx",
        "GrandOpeningCorporateInvitation",
        "Executive Grand Opening",
        "business",
        "grand-opening",
        "#0f172a",
        "#d97706",
        "background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 60%, #ffffff 100%)', color: '#0f172a'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border-2" style={{ borderColor: '#0f172a' }} />
      <div className="absolute inset-8 pointer-events-none rounded-lg border border-dashed" style={{ borderColor: '#d97706' }} />''',
        "",
        "<Crown className=\"w-9 h-9 text-slate-800 mx-auto mb-2\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-slate-600 font-sans mt-2\">Inauguration Ceremony & Networking Reception</p>"
    ),
    (
        "CocktailPartyInvitation.tsx",
        "CocktailPartyInvitation",
        "Twilight Cocktail Soirée",
        "party",
        "cocktail",
        "#4c1d95",
        "#f43f5e",
        "background: 'linear-gradient(145deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%)', color: '#f8fafc'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border border-violet-400/40" />''',
        "",
        "<Sparkles className=\"w-9 h-9 text-pink-400 mx-auto mb-2 animate-pulse\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-pink-300 font-sans mt-2\">Drinks • Tapas • Music • Midnight Revelry</p>"
    ),
    (
        "PhotoShowcaseEngagementInvitation.tsx",
        "PhotoShowcaseEngagementInvitation",
        "Editorial Photo Save the Date",
        "wedding",
        "engagement",
        "#1e293b",
        "#e11d48",
        "background: '#ffffff', color: '#1e293b'",
        '''<div className="absolute inset-6 pointer-events-none border border-slate-300 rounded-lg" />''',
        "import { InvitationWeddingRings } from './invitationDecorations';",
        "<InvitationWeddingRings className=\"mx-auto mb-2\" size={42} color=\"#e11d48\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-rose-600 font-serif mt-2\">Save The Date For Our Ring Ceremony</p>"
    ),
    (
        "SilverAnniversaryInvitation.tsx",
        "SilverAnniversaryInvitation",
        "Silver Jubilee & Rose Gold",
        "party",
        "anniversary",
        "#334155",
        "#f43f5e",
        "background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #fff1f2 100%)', color: '#1e293b'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border-2 border-slate-400" />
      <div className="absolute inset-8 pointer-events-none rounded-lg border border-dashed border-rose-400" />''',
        "import { InvitationWeddingRings } from './invitationDecorations';",
        "<InvitationWeddingRings className=\"mx-auto mb-2\" size={46} color=\"#f43f5e\" />",
        "<p className=\"text-xs font-bold uppercase tracking-widest text-slate-700 font-serif mt-2\">Celebrating 25 Years of Eternal Love & Companionship</p>"
    ),
    (
        "ModernMinimalCleanInvitation.tsx",
        "ModernMinimalCleanInvitation",
        "Modern Minimalist Monochrome",
        "party",
        "minimal",
        "#09090b",
        "#52525b",
        "background: '#fafafa', color: '#09090b'",
        '''<div className="absolute inset-6 pointer-events-none border border-black/20" />''',
        "",
        "<div className=\"w-8 h-[2px] bg-black mx-auto mb-4\" />",
        "<p className=\"text-[11px] font-sans uppercase tracking-[0.3em] text-zinc-600 mt-2\">Exclusive Gathering & Celebration</p>"
    ),
    (
        "BlackGoldNoirInvitation.tsx",
        "BlackGoldNoirInvitation",
        "Gatsby Black & Gold Grand Ball",
        "party",
        "noir-gala",
        "#f59e0b",
        "#d97706",
        "background: 'radial-gradient(circle at center, #18181b 0%, #09090b 80%, #000000 100%)', color: '#fef08a'",
        '''<div className="absolute inset-4 pointer-events-none rounded-xl border-2 border-amber-500/80" />
      <div className="absolute inset-7 pointer-events-none rounded-lg border border-dashed border-amber-400/40" />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<InvitationCornerOrnament className=\"mx-auto mb-2\" size={44} color=\"#f59e0b\" />",
        "<p className=\"text-xs font-serif uppercase tracking-[0.25em] text-amber-300 mt-2\">Roaring Twenties Glamour & Black Tie Soirée</p>"
    ),
    (
        "PastelGardenFloralInvitation.tsx",
        "PastelGardenFloralInvitation",
        "Blush & Lavender Garden Party",
        "party",
        "garden-party",
        "#6b21a8",
        "#ec4899",
        "background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #f0fdf4 100%)', color: '#3b0764'",
        '''<div className="absolute inset-5 pointer-events-none rounded-3xl border-2 border-purple-300" />''',
        "import { InvitationLotus } from './invitationDecorations';",
        "<InvitationLotus className=\"mx-auto mb-2\" size={44} color=\"#a855f7\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-purple-700 mt-2\">Afternoon Tea, Sunshine & Blossoming Memories</p>"
    ),
    (
        "RoyalBlueSapphireInvitation.tsx",
        "RoyalBlueSapphireInvitation",
        "Imperial Sapphire & Royal Blue",
        "wedding",
        "royal-wedding",
        "#1e3a8a",
        "#fbbf24",
        "background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #172554 100%)', color: '#f8fafc'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-4 border-double border-amber-400" />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed border-amber-300/40" />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<Crown className=\"w-10 h-10 text-amber-400 mx-auto mb-2\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-amber-300 mt-2\">Under the Royal Patronage of our Esteemed Ancestors</p>"
    ),
    (
        "LuxuryDinnerGalaInvitation.tsx",
        "LuxuryDinnerGalaInvitation",
        "Haute Velvet Charity Dinner Gala",
        "business",
        "charity-gala",
        "#4c0519",
        "#eab308",
        "background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #ffffff 100%)', color: '#4c0519'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border-2 border-rose-900/30" />
      <div className="absolute inset-8 pointer-events-none rounded-lg border border-dashed border-amber-600/50" />''',
        "",
        "<Sparkles className=\"w-9 h-9 text-rose-800 mx-auto mb-2\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-rose-900 font-bold mt-2\">Honoring Visionary Benefactors & Patrons</p>"
    ),
    (
        "GraduationHonorsInvitation.tsx",
        "GraduationHonorsInvitation",
        "Collegiate Honors & Commencement",
        "education",
        "graduation",
        "#1e1b4b",
        "#d97706",
        "background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)', color: '#1e1b4b'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border-2 border-indigo-900/40" />''',
        "",
        "<Crown className=\"w-9 h-9 text-indigo-900 mx-auto mb-2\" />",
        "<p className=\"text-xs font-sans uppercase tracking-widest text-indigo-700 font-bold mt-2\">Celebrating Academic Distinction & Graduation</p>"
    ),
    (
        "DiwaliFestiveGalaInvitation.tsx",
        "DiwaliFestiveGalaInvitation",
        "Shubh Deepavali Festive Milan",
        "religious",
        "festive",
        "#991b1b",
        "#f59e0b",
        "background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 50%, #fef3c7 100%)', color: '#7f1d1d'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-4 border-double border-amber-500" />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed border-red-500/40" />''',
        "import { InvitationDiya } from './invitationDecorations';",
        "<div className=\"flex justify-center gap-3 mb-2\"><InvitationDiya size={36} color=\"#b91c1c\" /><InvitationDiya size={42} color=\"#d97706\" /><InvitationDiya size={36} color=\"#b91c1c\" /></div>",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-amber-800 font-bold mt-2\">May The Divine Light Bring Prosperity, Peace & Joy</p>"
    ),
    (
        "CorporateSummitAwardsInvitation.tsx",
        "CorporateSummitAwardsInvitation",
        "Global Leadership Summit & Keynote",
        "business",
        "summit",
        "#0f172a",
        "#0284c7",
        "background: 'linear-gradient(135deg, #0b0f19 0%, #111827 60%, #1e293b 100%)', color: '#f8fafc'",
        '''<div className="absolute inset-5 pointer-events-none rounded-xl border border-cyan-500/30" />''',
        "",
        "<Crown className=\"w-9 h-9 text-cyan-400 mx-auto mb-2\" />",
        "<p className=\"text-xs font-sans uppercase tracking-widest text-cyan-300 font-semibold mt-2\">Shaping The Future of Global Industry & Technology</p>"
    ),
    (
        "MarbleGoldLuxeInvitation.tsx",
        "MarbleGoldLuxeInvitation",
        "Carrara Marble & Gold Leaf",
        "party",
        "marble-luxe",
        "#1c1917",
        "#ca8a04",
        "background: 'radial-gradient(circle at top left, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%)', color: '#1c1917'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border-2 border-amber-600/50" />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed border-amber-500/30" />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<InvitationCornerOrnament className=\"mx-auto mb-2\" size={44} color=\"#ca8a04\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-stone-700 mt-2\">Timeless Architectural Sophistication</p>"
    ),
    (
        "EmeraldVelvetLuxeInvitation.tsx",
        "EmeraldVelvetLuxeInvitation",
        "Royal Emerald Velvet Soirée",
        "party",
        "emerald-luxe",
        "#064e3b",
        "#f59e0b",
        "background: 'linear-gradient(145deg, #022c22 0%, #064e3b 50%, #065f46 100%)', color: '#ecfdf5'",
        '''<div className="absolute inset-4 pointer-events-none rounded-2xl border-4 border-double border-amber-400/80" />
      <div className="absolute inset-7 pointer-events-none rounded-xl border border-dashed border-emerald-400/30" />''',
        "import { InvitationCornerOrnament } from './invitationDecorations';",
        "<Crown className=\"w-10 h-10 text-amber-400 mx-auto mb-2\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-amber-300 mt-2\">An Evening of Imperial Grandeur & Celebrations</p>"
    ),
    (
        "GoldenBotanicalLuxeInvitation.tsx",
        "GoldenBotanicalLuxeInvitation",
        "Gilded Olive & Botanical Wreath",
        "wedding",
        "botanical-luxe",
        "#3f6212",
        "#ca8a04",
        "background: 'linear-gradient(135deg, #fefce8 0%, #f7fee7 50%, #ffffff 100%)', color: '#1a2e05'",
        '''<div className="absolute inset-5 pointer-events-none rounded-2xl border-2 border-lime-800/40" />
      <div className="absolute inset-8 pointer-events-none rounded-xl border border-dashed border-amber-600/40" />''',
        "import { InvitationLotus } from './invitationDecorations';",
        "<InvitationLotus className=\"mx-auto mb-2\" size={46} color=\"#65a30d\" />",
        "<p className=\"text-xs font-serif uppercase tracking-widest text-lime-900 mt-2\">Rooted in Grace, Blossoming in Eternal Love</p>"
    ),
    (
        "ModernTypographyChicInvitation.tsx",
        "ModernTypographyChicInvitation",
        "Avant-Garde Editorial Typography",
        "party",
        "typography-chic",
        "#09090b",
        "#ea580c",
        "background: '#fefce8', color: '#09090b'",
        '''<div className="absolute inset-6 pointer-events-none border-2 border-black" />''',
        "",
        "<div className=\"w-12 h-1 bg-amber-600 mx-auto mb-4\" />",
        "<p className=\"text-xs font-sans uppercase tracking-[0.3em] font-extrabold text-orange-700 mt-2\">Bold • Modern • Celebratory</p>"
    )
]

for filename, comp_name, title, cat, subcat, p_col, s_col, bg, border, deco_imp, deco_rnd, details in templates:
    content = make_template(comp_name, title, cat, subcat, p_col, s_col, bg, border, deco_imp, deco_rnd, details)
    file_path = os.path.join(INVITATIONS_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {filename}")

print(f"Successfully generated all {len(templates)} unique invitation template components!")
