import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { brand, colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  consumed: number;
  goal: number;
  size?: number;
}

export function CalorieRing({ consumed, goal, size = 132 }: Props) {
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 ? Math.min(1, consumed / goal) : 0;
  const remaining = Math.max(0, goal - consumed);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 750, useNativeDriver: false }).start();
  }, [progress]);

  const dashoffset = anim.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <LinearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={brand.flameMid} />
            <Stop offset="100%" stopColor={brand.flameOuter} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#calorieGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={{ fontSize: 22, fontFamily: fontFamilies.bold, color: colors.textPrimary, letterSpacing: -0.3 }}>{remaining}</Text>
      <Text style={{ fontSize: 12.5, fontFamily: fontFamilies.medium, color: colors.textMuted }}>kcal left</Text>
    </View>
  );
}
