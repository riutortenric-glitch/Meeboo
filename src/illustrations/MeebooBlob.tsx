import React, { useEffect, useId, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { brand, neutral } from '../theme/colors';
import { FlameLevel, MeebooFlame } from './MeebooFlame';
import { MeebooTint } from './MeebooFigure';

interface Props {
  size?: number;
  flameLevel?: FlameLevel;
  float?: boolean;
  animated?: boolean;
  tint?: MeebooTint;
}

function tintStops(tint: MeebooTint) {
  return tint === 'pink'
    ? { light: brand.pink300, mid: brand.pink400, dark: brand.pink600, limb: brand.pink500, ink: brand.pink900 }
    : { light: brand.blue300, mid: brand.blue400, dark: brand.blue600, limb: brand.blue500, ink: brand.blue900 };
}

/**
 * The round, stub-limbed "logo" Meeboo — used for the brand mark, Home's
 * hero, and anywhere the mascot is the friendly face rather than the body
 * progress avatar (that's MeebooFigure).
 */
export function MeebooBlob({ size = 140, flameLevel = 'large', float = true, animated = true, tint = 'blue' }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const uid = useId();
  const c = tintStops(tint);

  useEffect(() => {
    if (!float) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1900, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const viewH = 128;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ marginBottom: -size * 0.1, zIndex: 2 }}>
        <MeebooFlame level={flameLevel} size={size * 0.34} animated={animated} />
      </View>
      <Animated.View style={{ transform: [{ translateY }], width: size, height: size * (viewH / 112) }}>
        <Svg width={size} height={size * (viewH / 112)} viewBox="0 0 112 128">
          <Defs>
            <RadialGradient id={`blobShade-${uid}`} cx="36%" cy="30%" r="78%">
              <Stop offset="0%" stopColor="#F4FAFF" />
              <Stop offset="42%" stopColor={c.light} />
              <Stop offset="100%" stopColor={c.dark} />
            </RadialGradient>
          </Defs>

          <Ellipse cx={56} cy={122} rx={30} ry={6} fill={neutral.ink} opacity={0.08} />

          {/* stub legs */}
          <Rect x={38} y={96} width={13} height={22} rx={6.5} fill={c.limb} />
          <Rect x={61} y={96} width={13} height={22} rx={6.5} fill={c.limb} />

          {/* stub arms */}
          <Rect x={10} y={62} width={11} height={26} rx={5.5} fill={c.mid} transform="rotate(18 15.5 62)" />
          <Rect x={91} y={62} width={11} height={26} rx={5.5} fill={c.mid} transform="rotate(-18 96.5 62)" />

          {/* body */}
          <Circle cx={56} cy={62} r={44} fill={`url(#blobShade-${uid})`} />
          <Ellipse cx={40} cy={44} rx={16} ry={11} fill="#FFFFFF" opacity={0.4} />

          {/* face */}
          <Circle cx={41} cy={60} r={5.2} fill={c.ink} />
          <Circle cx={71} cy={60} r={5.2} fill={c.ink} />
          <Circle cx={39} cy={57.5} r={1.6} fill="#FFFFFF" />
          <Circle cx={69} cy={57.5} r={1.6} fill="#FFFFFF" />
          <Path d="M46 71 Q56 79 66 71" stroke={c.ink} strokeWidth={3.4} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>
    </View>
  );
}
