import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

export type FlameLevel = 'large' | 'medium' | 'small';

const sizeForLevel: Record<FlameLevel, number> = { large: 34, medium: 26, small: 18 };
const opacityForLevel: Record<FlameLevel, number> = { large: 1, medium: 0.85, small: 0.55 };

interface Props {
  level: FlameLevel;
}

export function MeebooFlame({ level }: Props) {
  const flicker = useRef(new Animated.Value(0)).current;
  const size = sizeForLevel[level];

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
    <Animated.View
      style={{
        width: size,
        height: size * 1.25,
        opacity: opacityForLevel[level],
        transform: [{ scale }, { rotate }],
      }}
    >
      <Svg width={size} height={size * 1.25} viewBox="0 0 24 30">
        <Path
          d="M12 0C12 6 4 9 4 17C4 23.6 8.4 30 12 30C15.6 30 20 23.6 20 17C20 9 12 6 12 0Z"
          fill={colors.flameOrange}
        />
        <Path
          d="M12 8C12 12 8 14 8 19C8 23 10.2 27 12 27C13.8 27 16 23 16 19C16 14 12 12 12 8Z"
          fill={colors.flameYellow}
        />
      </Svg>
    </Animated.View>
  );
}
