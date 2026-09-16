import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';
import { flameAsset } from '../assets/mascotAssets';

export type FlameLevel = 'large' | 'medium' | 'small';

const widthForLevel: Record<FlameLevel, number> = { large: 40, medium: 30, small: 20 };
// Size (not opacity) carries the large/medium/small distinction — a translucent
// flame optically blends with whatever's behind it (muddy on the blue gradient).
const opacityForLevel: Record<FlameLevel, number> = { large: 1, medium: 1, small: 0.92 };
const ASPECT = flameAsset.height / flameAsset.width;

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface Props {
  level: FlameLevel;
}

export function MeebooFlame({ level }: Props) {
  const flicker = useRef(new Animated.Value(0)).current;
  const width = widthForLevel[level];
  const height = width * ASPECT;

  useEffect(() => {
    const duration = level === 'small' ? 1400 : level === 'medium' ? 1000 : 700;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [level]);

  const scale = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] });
  const rotate = flicker.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] });

  return (
    <AnimatedImage
      source={flameAsset.source}
      resizeMode="contain"
      style={{
        width,
        height,
        opacity: opacityForLevel[level],
        transform: [{ scale }, { rotate }],
      }}
    />
  );
}
