import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { brand, colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { DropletIcon } from './icons';

interface Props {
  glasses: number;
  goal?: number;
  onAdd: () => void;
  size?: number;
}

export function WaterTracker({ glasses, goal = 8, onAdd, size = 20 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: goal }).map((_, i) => (
        <Pressable key={i} onPress={i === glasses ? onAdd : undefined} hitSlop={4}>
          <DropletIcon size={size} color={i < glasses ? brand.blue500 : colors.border} filled={i < glasses} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});
