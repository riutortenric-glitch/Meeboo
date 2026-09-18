import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ProgressBar } from './ProgressBar';

interface Props {
  label: string;
  consumedG: number;
  goalG: number;
  color: string;
}

export function MacroBar({ label, consumedG, goalG, color }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={typography.bodyMedium}>{label}</Text>
        <Text style={typography.bodyMuted}>
          {Math.round(consumedG)}g <Text style={{ color: colors.textFaint }}>/ {goalG}g</Text>
        </Text>
      </View>
      <ProgressBar progress={goalG > 0 ? consumedG / goalG : 0} color={color} height={7} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
});
