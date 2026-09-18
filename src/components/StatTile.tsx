import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii, shadow, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface Props extends PropsWithChildren {
  label: string;
  value: string;
  sublabel?: string;
  accentColor?: string;
  dark?: boolean;
}

/** Home screen stat card — dark navy card for the anchor stat, soft white cards for the rest, per the design system's component rules. */
export function StatTile({ label, value, sublabel, accentColor = colors.primaryBlue, dark = false, children }: Props) {
  return (
    <View style={[styles.card, dark && styles.dark]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: dark ? 'rgba(255,255,255,0.14)' : accentColor + '1A' }]}>
          {children}
        </View>
        <Text style={[typography.label, dark && { color: 'rgba(255,255,255,0.65)' }]}>{label}</Text>
      </View>
      <Text style={[styles.value, dark && { color: colors.white }]}>{value}</Text>
      {sublabel ? <Text style={[styles.sublabel, dark && { color: 'rgba(255,255,255,0.55)' }]}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.lg,
    minWidth: '46%',
    gap: 2,
    ...shadow.card,
  },
  dark: { backgroundColor: colors.deepNavy },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  iconCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  value: { ...typography.statNumber },
  sublabel: { ...typography.bodyMuted, fontSize: 12.5, marginTop: 1 },
});
