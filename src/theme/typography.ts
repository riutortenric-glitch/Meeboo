import { colors } from './colors';

// Poppins carries the brand's warm, rounded personality on display type;
// sizes/weights/tracking below follow an Apple HIG-style scale so hierarchy
// stays legible and calm rather than "every heading is bold and huge."
export const fontFamilies = {
  black: 'Poppins_800ExtraBold',
  bold: 'Poppins_700Bold',
  semiBold: 'Poppins_600SemiBold',
  medium: 'Poppins_500Medium',
  regular: 'Poppins_400Regular',
};

export const typography = {
  fontFamily: fontFamilies.regular,

  // Display — hero numbers, splash logo
  display: { fontFamily: fontFamilies.black, fontSize: 40, lineHeight: 44, letterSpacing: -0.5, color: colors.textPrimary },
  logo: { fontFamily: fontFamilies.black, fontSize: 26, lineHeight: 30, letterSpacing: -0.3, color: colors.textPrimary },

  // Headings
  h1: { fontFamily: fontFamilies.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.4, color: colors.textPrimary },
  h2: { fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2, color: colors.textPrimary },
  h3: { fontFamily: fontFamilies.semiBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.1, color: colors.textPrimary },

  // Body
  bodyLarge: { fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25, color: colors.textPrimary },
  body: { fontFamily: fontFamilies.regular, fontSize: 15.5, lineHeight: 22, color: colors.textPrimary },
  bodyMedium: { fontFamily: fontFamilies.medium, fontSize: 15.5, lineHeight: 22, color: colors.textPrimary },
  bodyMuted: { fontFamily: fontFamilies.regular, fontSize: 14.5, lineHeight: 21, color: colors.textMuted },

  // UI
  notification: { fontFamily: fontFamilies.medium, fontSize: 14.5, lineHeight: 20, color: colors.textPrimary },
  statNumber: { fontFamily: fontFamilies.bold, fontSize: 24, lineHeight: 28, letterSpacing: -0.3, color: colors.textPrimary },
  statNumberLarge: { fontFamily: fontFamilies.bold, fontSize: 32, lineHeight: 36, letterSpacing: -0.5, color: colors.textPrimary },
  label: { fontFamily: fontFamilies.semiBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: colors.textMuted },
  caption: { fontFamily: fontFamilies.medium, fontSize: 11.5, lineHeight: 15, letterSpacing: 0.2, color: colors.textFaint },
  button: { fontFamily: fontFamilies.semiBold, fontSize: 16, letterSpacing: -0.1 },
};
