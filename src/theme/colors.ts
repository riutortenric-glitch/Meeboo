export const colors = {
  primaryBlue: '#1A6FCF',
  homeGradientTop: '#5DA8F5',
  homeGradientBottom: '#3379D1',
  deepNavy: '#0C3060',
  lightBlueSurface: '#EEF4FD',
  meebooBlue: '#C8E0F8',
  flameOrange: '#F97316',
  flameYellow: '#FBBF24',
  successGreen: '#10A86A',
  white: '#FFFFFF',
  danger: '#E5484D',
  textMuted: '#6B84A3',
  border: 'rgba(12, 48, 96, 0.08)',
} as const;

export type BadgeTier = 'stone' | 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';

export const tierColors: Record<BadgeTier, { primary: string; secondary: string }> = {
  stone: { primary: '#9CA3AF', secondary: '#D1D5DB' },
  bronze: { primary: '#B4713A', secondary: '#DDA05F' },
  silver: { primary: '#9FB3C8', secondary: '#DCE6F0' },
  gold: { primary: '#F5B92E', secondary: '#FDE39B' },
  emerald: { primary: '#159A5B', secondary: '#7BDBAA' },
  diamond: { primary: '#5DA8F5', secondary: '#BFE0FF' },
};
