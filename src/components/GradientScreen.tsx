import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gradients } from '../theme/colors';

interface Props extends PropsWithChildren {
  variant?: 'hero' | 'soft';
}

export function GradientScreen({ children, variant = 'hero' }: Props) {
  return (
    <LinearGradient
      colors={variant === 'hero' ? gradients.hero : gradients.heroSoft}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
