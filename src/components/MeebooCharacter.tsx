import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { FlameLevel, MeebooFlame } from './MeebooFlame';

interface Props {
  /** 0 = leanest/smallest build, 9 = most developed/heaviest build on the user's chosen scale */
  bodyStage?: number;
  flameLevel?: FlameLevel;
  size?: number;
  float?: boolean;
}

/**
 * Meeboo's body width/limb thickness scales with bodyStage so the avatar
 * visually reflects progress without ever showing a real body photo.
 */
export function MeebooCharacter({ bodyStage = 3, flameLevel = 'large', size = 140, float = true }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const stage = Math.max(0, Math.min(9, bodyStage));
  const bodyWidthScale = 0.82 + (stage / 9) * 0.5;
  const limbWidthScale = 0.8 + (stage / 9) * 0.7;

  useEffect(() => {
    if (!float) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: size, height: size * 1.15 }}>
      <View style={{ marginBottom: -4 }}>
        <MeebooFlame level={flameLevel} />
      </View>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path
            d={`M${50 - 14 * limbWidthScale} 72 L${50 - 14 * limbWidthScale} 92`}
            stroke={colors.primaryBlue}
            strokeWidth={7 * limbWidthScale}
            strokeLinecap="round"
          />
          <Path
            d={`M${50 + 14 * limbWidthScale} 72 L${50 + 14 * limbWidthScale} 92`}
            stroke={colors.primaryBlue}
            strokeWidth={7 * limbWidthScale}
            strokeLinecap="round"
          />
          <Path
            d={`M${50 - 20 * limbWidthScale} 55 L${50 - 30 * limbWidthScale} 68`}
            stroke={colors.primaryBlue}
            strokeWidth={6 * limbWidthScale}
            strokeLinecap="round"
          />
          <Path
            d={`M${50 + 20 * limbWidthScale} 55 L${50 + 30 * limbWidthScale} 68`}
            stroke={colors.primaryBlue}
            strokeWidth={6 * limbWidthScale}
            strokeLinecap="round"
          />
          <Circle cx={50} cy={40} r={26 * bodyWidthScale} fill={colors.meebooBlue} stroke={colors.primaryBlue} strokeWidth={2.5} />
          <Circle cx={41} cy={37} r={3.2} fill={colors.deepNavy} />
          <Circle cx={59} cy={37} r={3.2} fill={colors.deepNavy} />
          <Path d="M40 47 Q50 55 60 47" stroke={colors.deepNavy} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>
    </View>
  );
}
