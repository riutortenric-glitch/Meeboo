import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { bodyForStage, fatScale, muscleScale } from '../assets/mascotAssets';
import { Goal } from '../types';
import { FlameLevel, MeebooFlame } from './MeebooFlame';

interface Props {
  /** 0 = leanest, 9 = most developed on the user's chosen scale */
  bodyStage?: number;
  goal?: Goal;
  flameLevel?: FlameLevel;
  /** Target width in px; height follows the sprite's own aspect ratio */
  size?: number;
  float?: boolean;
}

const usesMuscleScale = (goal?: Goal) => goal === 'build_muscle' || goal === 'both';

export function MeebooCharacter({ bodyStage = 3, goal = 'build_muscle', flameLevel = 'large', size = 140, float = true }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const scale = usesMuscleScale(goal) ? muscleScale : fatScale;
  const body = bodyForStage(scale, bodyStage);
  const bodyHeight = size * (body.height / body.width);

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
    <View style={{ alignItems: 'center' }}>
      <View style={{ marginBottom: -Math.max(4, size * 0.05) }}>
        <MeebooFlame level={flameLevel} />
      </View>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image source={body.source} resizeMode="contain" style={{ width: size, height: bodyHeight }} />
      </Animated.View>
    </View>
  );
}
