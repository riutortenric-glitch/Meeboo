import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  progress: number; // 0-1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.primaryBlue, trackColor = colors.border, height = 8 }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: clamped, duration: 650, useNativeDriver: false }).start();
  }, [clamped]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
