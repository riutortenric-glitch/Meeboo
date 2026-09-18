import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function HomeIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5L12 4.5L20 11.5V19.5C20 20.05 19.55 20.5 19 20.5H15C14.45 20.5 14 20.05 14 19.5V15.5C14 14.95 13.55 14.5 13 14.5H11C10.45 14.5 10 14.95 10 15.5V19.5C10 20.05 9.55 20.5 9 20.5H5C4.45 20.5 4 20.05 4 19.5V11.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TrainIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2.5 12H4.5M19.5 12H21.5M6.5 8V16M17.5 8V16M6.5 12H17.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function NutritionIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6.5 2.5V9.5C6.5 11.15 7.85 12.5 9.5 12.5V21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.5 2.5V9.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M17.5 2.5C17.5 2.5 14.5 5 14.5 9.5C14.5 11.5 16 12.5 17.5 12.5V21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ProgressIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={4.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M7.5 12.5L5.5 21L12 17.5L18.5 21L16.5 12.5" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

export function MeIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.6} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4.5 21C4.5 16.8 7.8 14 12 14C16.2 14 19.5 16.8 19.5 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ color, size = 18, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5L16 12L9 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ color, size = 18, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5L8 12L15 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ color, size = 22, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 10C6 6.7 8.7 4 12 4C15.3 4 18 6.7 18 10V14L20 17H4L6 14V10Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M10 19.5C10.3 20.4 11.1 21 12 21C12.9 21 13.7 20.4 14 19.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function MoonIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 14.5C18.6 15.7 16.9 16.3 15 16.3C10.4 16.3 6.7 12.6 6.7 8C6.7 6.1 7.3 4.4 8.5 3C4.7 4 2 7.5 2 11.7C2 16.8 6.2 21 11.3 21C15.5 21 19 18.3 20 14.5Z" fill={color} />
    </Svg>
  );
}

export function FootstepsIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={8} cy={6} r={2} fill={color} />
      <Path d="M6.5 10C5.5 10 4.8 11 5.2 12L6.6 17C6.9 18.1 8.6 18.1 8.9 17L9.6 12.4C9.8 11 8.8 10 7.6 10H6.5Z" fill={color} />
      <Circle cx={16.5} cy={9.5} r={2} fill={color} />
      <Path d="M15 13.5C14 13.5 13.3 14.5 13.7 15.5L15 20C15.3 21.1 17 21.1 17.3 20L18.1 15.9C18.3 14.5 17.3 13.5 16.1 13.5H15Z" fill={color} />
    </Svg>
  );
}

export function DropletIcon({ color, size = 18, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C12 3 5.5 10.8 5.5 15C5.5 18.6 8.4 21.5 12 21.5C15.6 21.5 18.5 18.6 18.5 15C18.5 10.8 12 3 12 3Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraIcon({ color, size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8C4 6.9 4.9 6 6 6H8L9.5 4H14.5L16 6H18C19.1 6 20 6.9 20 8V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V8Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx={12} cy={12.5} r={3.6} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function PlusIcon({ color, size = 20, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ color, size = 20, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13L9.5 17.5L19 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ClockIcon({ color, size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7.5V12L15 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function UtensilsIcon({ color, size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 2.5V10.5M4.5 2.5V8C4.5 9.4 5.6 10.5 7 10.5V21.5M9.5 2.5V8C9.5 9.4 8.4 10.5 7 10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 2.5C17 2.5 14.5 4.5 14.5 9C14.5 10.8 15.8 11.5 17 11.5V21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function FlameIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 7 7.5 7 12.5C7 16 9.2 18.5 12 18.5C14.8 18.5 17 16 17 12.5C17 11 16.3 9.5 15.5 8.3C15.3 10 14.3 10.8 13.5 10.5C14 8 12.8 5 12 2Z"
        fill={color}
      />
    </Svg>
  );
}

export function SparkleIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z"
        fill={color}
      />
    </Svg>
  );
}

export function ArrowUpIcon({ color, size = 18, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 19V5M12 5L6 11M12 5L18 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LogoutIcon({ color, size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 8V6C15 4.9 14.1 4 13 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H13C14.1 20 15 19.1 15 18V16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12H21M21 12L17.5 8.5M21 12L17.5 15.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const muscleIconPaths: Record<string, string> = {
  chest: 'M6 8C6 6 8 4 12 4C16 4 18 6 18 8V15C18 17 16 19 12 19C8 19 6 17 6 15V8Z',
  back: 'M12 4L18 8V16L12 20L6 16V8L12 4Z',
  arms: 'M8 6C8 6 6 8 6 11C6 14 8 15 9 15M16 6C16 6 18 8 18 11C18 14 16 15 15 15M9 15V19M15 15V19',
  core: 'M8 5H16V19H8V5ZM8 9H16M8 13H16M12 5V19',
  shoulders: 'M4 12C4 8 7 5 12 5C17 5 20 8 20 12',
  legs: 'M9 4H15L16 12L15 20H13L12 13L11 20H9L8 12L9 4Z',
  glutes: 'M7 6C7 6 6 9 6 12C6 16 8 19 12 19C16 19 18 16 18 12C18 9 17 6 17 6',
  cardio: 'M12 20C12 20 4 14 4 9C4 6 6.2 4 9 4C10.5 4 12 5 12 5C12 5 13.5 4 15 4C17.8 4 20 6 20 9C20 14 12 20 12 20Z',
};

export function MuscleGroupIcon({ group, color, size = 18 }: { group: string; color: string; size?: number }) {
  const d = muscleIconPaths[group] ?? muscleIconPaths.core;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
