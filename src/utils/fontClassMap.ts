/**
 * Static Tailwind CSS v4 class mappings & explicit inline CSS font-family fallbacks.
 * Replaces dynamic template-literal classes like `font-${fontFamily}` which are stripped
 * by @tailwindcss/vite during production builds (`vite build`).
 */
export const STATIC_FONT_CLASS_MAP = {
  jakarta: 'font-jakarta',
  inter: 'font-inter',
  poppins: 'font-poppins',
  playfair: 'font-playfair',
  cormorant: 'font-cormorant',
  cinzel: 'font-cinzel',
  rozha: 'font-rozha',
  yatra: 'font-yatra',
  jetbrains: 'font-jetbrains',
  gujarati: 'font-gujarati',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
} as const;

export const FONT_FAMILY_CSS_MAP = {
  jakarta: "'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif",
  inter: "'Inter', 'Noto Sans Gujarati', sans-serif",
  poppins: "'Poppins', 'Noto Sans Gujarati', sans-serif",
  playfair: "'Playfair Display', 'Noto Sans Gujarati', serif",
  cormorant: "'Cormorant Garamond', 'Noto Sans Gujarati', serif",
  cinzel: "'Cinzel', 'Noto Sans Gujarati', serif",
  rozha: "'Rozha One', 'Noto Sans Gujarati', serif",
  yatra: "'Yatra One', 'Noto Sans Gujarati', cursive",
  jetbrains: "'JetBrains Mono', 'Noto Sans Gujarati', monospace",
  gujarati: "'Noto Sans Gujarati', 'Plus Jakarta Sans', sans-serif",
  sans: "'Plus Jakarta Sans', 'Noto Sans Gujarati', system-ui, -apple-system, sans-serif",
  serif: "'Playfair Display', 'Noto Sans Gujarati', Georgia, serif",
  mono: "'JetBrains Mono', 'Noto Sans Gujarati', monospace",
} as const;

export type StaticFontKey = keyof typeof STATIC_FONT_CLASS_MAP;

export function getStaticFontClass(
  fontFamily?: string,
  fallback: StaticFontKey = 'jakarta'
): string {
  if (fontFamily && fontFamily in STATIC_FONT_CLASS_MAP) {
    return STATIC_FONT_CLASS_MAP[fontFamily as StaticFontKey];
  }
  return STATIC_FONT_CLASS_MAP[fallback];
}

export function getFontFamilyCss(
  fontFamily?: string,
  fallback: StaticFontKey = 'jakarta'
): string {
  if (fontFamily && fontFamily in FONT_FAMILY_CSS_MAP) {
    return FONT_FAMILY_CSS_MAP[fontFamily as StaticFontKey];
  }
  return FONT_FAMILY_CSS_MAP[fallback];
}
