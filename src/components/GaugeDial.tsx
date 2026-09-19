import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
  size?: number;
}

const SWEEP = 270;

export function GaugeDial({ label, value, max, onChange, size = 220 }: Props) {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (SWEEP / 360);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value / max, duration: 500, useNativeDriver: false }).start();
  }, [value]);

  const fillOffset = anim.interpolate({ inputRange: [0, 1], outputRange: [arcLength, 0] });

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '135deg' }] }}>
          <Defs>
            <LinearGradient id="gaugeFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.primaryBlue} />
              <Stop offset="100%" stopColor="#5DA2F7" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gaugeFill)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={fillOffset}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        <Text style={styles.value}>{value}</Text>
      </View>

      <View style={styles.numberRow}>
        {Array.from({ length: max + 1 }).map((_, n) => (
          <Pressable key={n} onPress={() => onChange(n)} style={[styles.numberCircle, n === value && styles.numberCircleActive]}>
            <Text style={[styles.numberText, n === value && styles.numberTextActive]}>{n}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fontFamilies.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.4, textTransform: 'uppercase' },
  value: { fontFamily: fontFamilies.black, fontSize: 48, color: colors.white, letterSpacing: -1 },
  numberRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  numberCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.14)' },
  numberCircleActive: { backgroundColor: colors.white },
  numberText: { fontFamily: fontFamilies.semiBold, fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  numberTextActive: { color: colors.primaryBlue },
});
