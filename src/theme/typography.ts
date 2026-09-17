import { colors } from './colors';

// Poppins is the "decorate the app" font — a bold, rounded geometric sans in
// the same family as the friendly, high-personality display type popular on
// Instagram-adjacent apps. Loaded via expo-font in App.tsx before first render.
export const fontFamilies = {
  black: 'Poppins_800ExtraBold',
  bold: 'Poppins_700Bold',
  semiBold: 'Poppins_600SemiBold',
  medium: 'Poppins_500Medium',
  regular: 'Poppins_400Regular',
};

export const typography = {
  fontFamily: fontFamilies.regular,
  logo: { fontFamily: fontFamilies.black, fontSize: 34, color: colors.deepNavy, letterSpacing: 1 },
  h1: { fontFamily: fontFamilies.bold, fontSize: 29, color: colors.deepNavy },
  h2: { fontFamily: fontFamilies.bold, fontSize: 23, color: colors.deepNavy },
  h3: { fontFamily: fontFamilies.semiBold, fontSize: 18, color: colors.deepNavy },
  body: { fontFamily: fontFamilies.regular, fontSize: 16, color: colors.deepNavy, lineHeight: 22.4 },
  bodyMuted: { fontFamily: fontFamilies.regular, fontSize: 15, color: colors.textMuted, lineHeight: 21 },
  notification: { fontFamily: fontFamilies.medium, fontSize: 15, color: colors.deepNavy },
  statNumber: { fontFamily: fontFamilies.bold, fontSize: 22, color: colors.deepNavy },
  label: { fontFamily: fontFamilies.semiBold, fontSize: 12.5, color: colors.textMuted, letterSpacing: 0.2 },
};
