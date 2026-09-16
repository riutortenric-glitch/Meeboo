import { Platform } from 'react-native';
import { colors } from './colors';

const fontFamily = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const typography = {
  fontFamily,
  h1: { fontFamily, fontSize: 30, fontWeight: '700' as const, color: colors.deepNavy },
  h2: { fontFamily, fontSize: 24, fontWeight: '700' as const, color: colors.deepNavy },
  h3: { fontFamily, fontSize: 19, fontWeight: '700' as const, color: colors.deepNavy },
  body: { fontFamily, fontSize: 16, fontWeight: '400' as const, color: colors.deepNavy, lineHeight: 22.4 },
  bodyMuted: { fontFamily, fontSize: 15, fontWeight: '400' as const, color: colors.textMuted, lineHeight: 21 },
  notification: { fontFamily, fontSize: 15, fontWeight: '500' as const, color: colors.deepNavy },
  statNumber: { fontFamily, fontSize: 22, fontWeight: '700' as const, color: colors.deepNavy },
  label: { fontFamily, fontSize: 13, fontWeight: '600' as const, color: colors.textMuted },
};
