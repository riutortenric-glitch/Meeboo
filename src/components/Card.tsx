import { BlurView } from 'expo-blur';
import React, { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radii, shadow, spacing } from '../theme/spacing';

interface Props extends PropsWithChildren {
  style?: ViewStyle;
  variant?: 'light' | 'dark' | 'glass';
  padded?: boolean;
}

export function Card({ children, style, variant = 'light', padded = true }: Props) {
  if (variant === 'glass') {
    return (
      <View style={[styles.base, styles.glassWrap, padded && styles.padded, style]}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.glassOverlay} pointerEvents="none" />
        <View style={padded ? undefined : undefined}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.base, variant === 'dark' ? styles.dark : styles.light, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    ...shadow.card,
    overflow: Platform.OS === 'web' ? ('hidden' as const) : 'visible',
  },
  padded: { padding: spacing.lg },
  light: { backgroundColor: colors.surface },
  dark: { backgroundColor: colors.deepNavy },
  glassWrap: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
