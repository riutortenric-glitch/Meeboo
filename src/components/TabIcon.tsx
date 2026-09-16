import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  color: string;
  size?: number;
}

export function HomeIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11L12 4L20 11V20H14V14H10V20H4V11Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function ProgressIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={9} r={5} stroke={color} strokeWidth={2} />
      <Path d="M8 13.5L6 21L12 18L18 21L16 13.5" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function TrainIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12H2M22 12H20M6 12H18M6 8V16M18 8V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function NutritionIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3V10C6 11.6569 7.34315 13 9 13V21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6 3V10" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M18 3C18 3 15 5 15 10C15 12 16.5 13 18 13V21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MeIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 21C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
