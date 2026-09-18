import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { brand } from '../theme/colors';

export type FlameLevel = 'large' | 'medium' | 'small';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const sizeForLevel: Record<FlameLevel, number> = { large: 1, medium: 0.8, small: 0.6 };
const glowForLevel: Record<FlameLevel, number> = { large: 0.55, medium: 0.4, small: 0.22 };

interface Props {
  level?: FlameLevel;
  size?: number;
  animated?: boolean;
}

/**
 * A layered, gradient-shaded flame — reads as lit from within rather than a
 * flat icon. Glow behind it is a radial gradient (not a filter blur) so it
 * renders identically on web, iOS and Android.
 */
export function MeebooFlame({ level = 'large', size = 44, animated = true }: Props) {
  const flicker = useRef(new Animated.Value(0)).current;
  const scaleFactor = sizeForLevel[level];
  const glowOpacity = glowForLevel[level];

  useEffect(() => {
    if (!animated) return;
    const duration = level === 'small' ? 1500 : level === 'medium' ? 1100 : 850;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 0, duration, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [level, animated]);

  const scale = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] });
  const rotate = flicker.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  const w = size * scaleFactor;
  const h = w * 1.3;

  return (
    <AnimatedSvg
      width={w * 1.8}
      height={h * 1.5}
      viewBox="0 0 72 78"
      style={{ transform: [{ scale }, { rotate }] }}
    >
      <Defs>
        <RadialGradient id="flameGlow" cx="50%" cy="55%" r="55%">
          <Stop offset="0%" stopColor={brand.flameMid} stopOpacity={glowOpacity} />
          <Stop offset="100%" stopColor={brand.flameMid} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="flameOuterFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={brand.flameMid} />
          <Stop offset="55%" stopColor={brand.flameOuter} />
          <Stop offset="100%" stopColor={brand.flameEdge} />
        </LinearGradient>
        <LinearGradient id="flameInnerFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFDF3" />
          <Stop offset="60%" stopColor={brand.flameCore} />
          <Stop offset="100%" stopColor={brand.flameMid} />
        </LinearGradient>
      </Defs>

      <Ellipse cx={36} cy={40} rx={34} ry={36} fill="url(#flameGlow)" />

      <Path
        d="M36 4 C22 20 14 32 14 46 C14 61 24 71 36 71 C48 71 58 61 58 46 C58 32 50 20 36 4 Z"
        fill="url(#flameOuterFill)"
      />
      <Path
        d="M36 22 C28 32 24 41 24 50 C24 59.5 29.4 65 36 65 C42.6 65 48 59.5 48 50 C48 41 44 32 36 22 Z"
        fill="url(#flameInnerFill)"
      />
      <Ellipse cx={30} cy={38} rx={4.5} ry={7} fill="#FFFFFF" opacity={0.5} />
    </AnimatedSvg>
  );
}
