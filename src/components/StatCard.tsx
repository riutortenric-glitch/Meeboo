import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface Props extends PropsWithChildren {
  label: string;
  value: string;
  sublabel?: string;
  iconColor?: string;
}

export function StatCard({ label, value, sublabel, iconColor = colors.primaryBlue, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '22' }]}>{children}</View>
        <Text style={typography.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    minWidth: '46%',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  iconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  value: { ...typography.statNumber },
  sublabel: { ...typography.bodyMuted, fontSize: 12, marginTop: 2 },
});
