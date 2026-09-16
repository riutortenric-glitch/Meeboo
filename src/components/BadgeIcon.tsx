import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { BadgeTier, tierColors } from '../theme/colors';

interface Props {
  tier: BadgeTier;
  size?: number;
}

const glyphs: Record<BadgeTier, string> = {
  stone: 'M -6 2 L 0 -6 L 6 2 M -5 4 L 5 4',
  bronze: 'M -5 -5 Q 0 -8 5 -5 L 5 2 Q 0 5 -5 2 Z',
  silver: 'M 0 -6 L 5 -3 L 5 3 L 0 6 L -5 3 L -5 -3 Z',
  gold: 'M 0 -7 L 2 -2 L 7 -2 L 3 1 L 5 6 L 0 3 L -5 6 L -3 1 L -7 -2 L -2 -2 Z',
  emerald: 'M -5 -3 L 0 -6 L 5 -3 L 5 3 L 0 6 L -5 3 Z',
  diamond: 'M -6 -1 L 0 -6 L 6 -1 L 0 7 Z',
};

export function BadgeIcon({ tier, size = 56 }: Props) {
  const { primary, secondary } = tierColors[tier];
  return (
    <Svg width={size} height={size} viewBox="-16 -16 32 32">
      <Circle cx={0} cy={0} r={15} fill={secondary} stroke={primary} strokeWidth={2} />
      <Path d={glyphs[tier]} fill={primary} stroke={primary} strokeWidth={0.6} strokeLinejoin="round" />
    </Svg>
  );
}
