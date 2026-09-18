// Meeboo design system — v2
// Direction: the calm, confident clarity of Apple's HIG (real depth, restrained
// color, generous whitespace) with the warmth and energy of Instagram's
// gradient accents used sparingly on the hero moments (the flame, streaks,
// celebrations). Nothing flat, nothing shouting.

export const brand = {
  // Core blue family — kept from the product spec, deepened for contrast.
  blue50: '#EEF5FF',
  blue100: '#DCEBFF',
  blue200: '#B6D8FF',
  blue300: '#8AC0FF',
  blue400: '#5DA2F7',
  blue500: '#2E7CEB',
  blue600: '#1A63D6', // primary
  blue700: '#154FAE',
  blue800: '#123E85',
  blue900: '#0C2E63',

  // Flame — the emotional core of the product. A real sunset gradient, not a
  // flat orange, so it reads as alive rather than an icon.
  flameCore: '#FFE9A8',
  flameMid: '#FFB74D',
  flameOuter: '#FF7A45',
  flameEdge: '#F0453D',

  // Muscle-badge metals, tuned to feel like the reference medal renders
  // (real metal/gem gradients, not flat tinted circles).
  stone: { base: '#B9C0C8', dark: '#7C848E', light: '#EAEDF1', accent: '#5B636D' },
  bronze: { base: '#C97A44', dark: '#8A4A22', light: '#F0B685', accent: '#6E3A18' },
  silver: { base: '#C7D2DE', dark: '#8695A7', light: '#F5F8FC', accent: '#5C6B7E' },
  gold: { base: '#F6C452', dark: '#C4870F', light: '#FFEBB0', accent: '#8A5A05' },
  emerald: { base: '#33C481', dark: '#0E8C55', light: '#B6F2D6', accent: '#075E38' },
  diamond: { base: '#BEE8FF', dark: '#5FB4EE', light: '#F2FBFF', accent: '#2E7DB8' },
} as const;

export const neutral = {
  ink: '#0B1B32', // near-black, primary text — softer than pure black
  slate: '#334259', // secondary text
  mist: '#7688A3', // tertiary / muted text
  fog: '#AAB8CC', // disabled / placeholder
  cloud: '#EEF3FA', // surfaces / section backgrounds
  pearl: '#F6F9FD', // app background (light)
  hairline: 'rgba(11, 27, 50, 0.08)',
  hairlineStrong: 'rgba(11, 27, 50, 0.14)',
  white: '#FFFFFF',
} as const;

export const semantic = {
  success: '#1FAE72',
  successSoft: '#E3F8EE',
  danger: '#E5484D',
  dangerSoft: '#FDEBEC',
  warning: '#E8A13B',
  warningSoft: '#FDF3E3',
} as const;

// Flat, code-friendly export used throughout the app — mirrors the old
// `colors` shape so screens read naturally, backed by the richer palette above.
export const colors = {
  primaryBlue: brand.blue600,
  primaryBlueDark: brand.blue800,
  primaryBlueLight: brand.blue200,
  homeGradientTop: brand.blue400,
  homeGradientBottom: brand.blue900,
  deepNavy: neutral.ink,
  slate: neutral.slate,
  lightBlueSurface: brand.blue50,
  meebooBlue: brand.blue200,
  meebooBody: brand.blue300,
  flameOrange: brand.flameOuter,
  flameYellow: brand.flameMid,
  successGreen: semantic.success,
  white: neutral.white,
  background: neutral.pearl,
  surface: neutral.white,
  surfaceMuted: neutral.cloud,
  danger: semantic.danger,
  textPrimary: neutral.ink,
  textMuted: neutral.mist,
  textFaint: neutral.fog,
  border: neutral.hairline,
  borderStrong: neutral.hairlineStrong,
} as const;

export type BadgeTier = 'stone' | 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';

export const tierColors: Record<BadgeTier, { primary: string; secondary: string }> = {
  stone: { primary: brand.stone.dark, secondary: brand.stone.light },
  bronze: { primary: brand.bronze.dark, secondary: brand.bronze.light },
  silver: { primary: brand.silver.accent, secondary: brand.silver.light },
  gold: { primary: brand.gold.dark, secondary: brand.gold.light },
  emerald: { primary: brand.emerald.dark, secondary: brand.emerald.light },
  diamond: { primary: brand.diamond.accent, secondary: brand.diamond.light },
};

export const gradients = {
  // App hero backgrounds (Home, Login) — deep, saturated, slightly cinematic.
  hero: [brand.blue400, brand.blue700, brand.blue900] as const,
  heroSoft: [brand.blue300, brand.blue600] as const,
  // Flame — warm sunset core.
  flame: [brand.flameCore, brand.flameMid, brand.flameOuter] as const,
  flameHot: [brand.flameMid, brand.flameOuter, brand.flameEdge] as const,
  // Celebration accent (milestones, streak card) — blue into flame, the one
  // place we let the two brand temperatures touch.
  celebration: [brand.blue500, '#7B5CE0', brand.flameOuter] as const,
  // Subtle glass sheen used on light cards for a soft top-light highlight.
  sheen: ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'] as const,
  darkCard: [neutral.ink, '#132A4C'] as const,
};
