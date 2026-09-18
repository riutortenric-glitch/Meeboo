import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, RadialGradient, Stop } from 'react-native-svg';
import { BadgeTier, brand } from '../theme/colors';

interface Props {
  tier: BadgeTier;
  size?: number;
  locked?: boolean;
}

const metals: Record<BadgeTier, { base: string; dark: string; light: string; accent: string }> = {
  stone: brand.stone,
  bronze: brand.bronze,
  silver: brand.silver,
  gold: brand.gold,
  emerald: brand.emerald,
  diamond: brand.diamond,
};

function StoneGlyph({ c }: { c: string }) {
  return (
    <G fill={c}>
      <Polygon points="26,12 38,34 14,34" />
      <Polygon points="16,34 22,20 28,34" fill="#FFFFFF" opacity={0.3} />
    </G>
  );
}

function BronzeGlyph({ c }: { c: string }) {
  return (
    <G fill={c}>
      <Path d="M26 12 C34 12 39 18 39 27 C39 33 35 37 31 39 L31 30 C31 27 29 25 26 25 C23 25 21 27 21 30 L21 39 C17 37 13 33 13 27 C13 18 18 12 26 12 Z" />
      <Path d="M22 15 L26 10 L30 15" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}

function SilverGlyph({ c }: { c: string }) {
  return (
    <G fill="none" stroke={c} strokeWidth={2.6} strokeLinejoin="round">
      <Path d="M26 11 L38 15 L38 25 C38 33 32 38 26 41 C20 38 14 33 14 25 L14 15 Z" />
      <Path d="M31 25 A6 6 0 1 1 26 18 A5 5 0 0 0 31 25 Z" fill={c} stroke="none" />
    </G>
  );
}

function GoldGlyph({ c }: { c: string }) {
  const points = Array.from({ length: 10 }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const r = i % 2 === 0 ? 16 : 8;
    return `${26 + r * Math.cos(angle)},${26 + r * Math.sin(angle)}`;
  });
  return (
    <G>
      <Polygon points={points.join(' ')} fill={c} />
      <Circle cx={26} cy={26} r={7.5} fill="#FFFFFF" opacity={0.85} />
    </G>
  );
}

function EmeraldGlyph({ c }: { c: string }) {
  return <Polygon points="26,10 38,18 34,38 18,38 14,18" fill={c} />;
}

function DiamondGlyph({ c }: { c: string }) {
  return (
    <G fill={c}>
      <Polygon points="16,18 36,18 26,40" />
      <Polygon points="26,10 33,18 19,18" />
    </G>
  );
}

const glyphFor: Record<BadgeTier, (c: string) => React.ReactElement> = {
  stone: (c) => <StoneGlyph c={c} />,
  bronze: (c) => <BronzeGlyph c={c} />,
  silver: (c) => <SilverGlyph c={c} />,
  gold: (c) => <GoldGlyph c={c} />,
  emerald: (c) => <EmeraldGlyph c={c} />,
  diamond: (c) => <DiamondGlyph c={c} />,
};

/**
 * A glossy, lit medal — radial highlight top-left, dark rim shadow bottom
 * right, recessed inner face — rather than a flat tinted circle.
 */
export function Badge3D({ tier, size = 64, locked = false }: Props) {
  const m = metals[tier];
  const gradId = `medal-${tier}`;
  const faceId = `medalFace-${tier}`;
  const glyphColor = tier === 'gold' || tier === 'bronze' ? '#FFFFFF' : tier === 'stone' ? m.dark : '#FFFFFF';

  return (
    <View style={{ width: size, height: size, opacity: locked ? 0.4 : 1 }}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Defs>
          <RadialGradient id={gradId} cx="34%" cy="28%" r="75%">
            <Stop offset="0%" stopColor={m.light} />
            <Stop offset="55%" stopColor={m.base} />
            <Stop offset="100%" stopColor={m.dark} />
          </RadialGradient>
          <LinearGradient id={faceId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={m.base} />
            <Stop offset="100%" stopColor={m.dark} />
          </LinearGradient>
        </Defs>

        <Circle cx={26} cy={26} r={25} fill={`url(#${gradId})`} />
        <Circle cx={26} cy={26} r={25} fill="none" stroke={m.dark} strokeOpacity={0.35} strokeWidth={1} />
        <Circle cx={26} cy={26} r={20.5} fill={`url(#${faceId})`} opacity={locked ? 0.7 : 0.92} />
        <Circle cx={26} cy={26} r={20.5} fill="none" stroke={m.light} strokeOpacity={0.5} strokeWidth={1} />

        {glyphFor[tier](locked ? m.dark : glyphColor)}

        <Path d="M10 14 A22 22 0 0 1 34 8" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}
