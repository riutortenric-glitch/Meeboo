import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ProgressBar } from './ProgressBar';

interface Props extends PropsWithChildren {
  label: string;
  consumedG: number;
  goalG: number;
  color: string;
  unit?: string;
}

/** `children` (an icon) renders as a small colored dot before the bar. */
export function MacroBar({ label, consumedG, goalG, color, unit = 'g', children }: Props) {
  return (
    <View style={styles.outer}>
      {children && <View style={[styles.iconDot, { backgroundColor: color + '26' }]}>{children}</View>}
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Text style={typography.bodyMedium}>{label}</Text>
          <Text style={typography.bodyMuted}>
            {Math.round(consumedG)}
            {unit} <Text style={{ color: colors.textFaint }}>/ {goalG}{unit}</Text>
          </Text>
        </View>
        <ProgressBar progress={goalG > 0 ? consumedG / goalG : 0} color={color} height={7} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  row: { flex: 1, gap: spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
});
