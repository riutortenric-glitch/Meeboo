import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';

interface Props extends PropsWithChildren {
  style?: ViewStyle;
  dark?: boolean;
}

export function Card({ children, style, dark }: Props) {
  return <View style={[styles.base, dark ? styles.dark : styles.light, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  light: {
    backgroundColor: colors.lightBlueSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dark: {
    backgroundColor: colors.deepNavy,
  },
});
