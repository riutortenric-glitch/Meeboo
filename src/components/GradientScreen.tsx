import React, { PropsWithChildren } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export function GradientScreen({ children }: PropsWithChildren) {
  return (
    <LinearGradient
      colors={[colors.homeGradientTop, colors.homeGradientBottom]}
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
