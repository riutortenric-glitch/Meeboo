import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

interface Props {
  consumed: number;
  goal: number;
  size?: number;
}

export function CalorieRing({ consumed, goal, size = 120 }: Props) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 ? Math.min(1, consumed / goal) : 0;
  const remaining = Math.max(0, goal - consumed);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.flameOrange}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.deepNavy }}>{remaining}</Text>
      <Text style={{ fontSize: 12, fontFamily: fontFamilies.regular, color: colors.textMuted }}>kcal left</Text>
    </View>
  );
}
