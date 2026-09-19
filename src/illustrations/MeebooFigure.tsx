import React, { useEffect, useId, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { brand, neutral } from '../theme/colors';
import { BodyTrack, getBodyMetrics, torsoPath } from './meebooGeometry';
import { FlameLevel, MeebooFlame } from './MeebooFlame';

export type MeebooTint = 'blue' | 'pink';

function tintStops(tint: MeebooTint) {
  return tint === 'pink'
    ? { light: brand.pink300, mid: brand.pink400, dark: brand.pink700, ink: brand.pink900, edge: '#4A1E33' }
    : { light: brand.blue300, mid: brand.blue400, dark: brand.blue700, ink: brand.blue900, edge: '#0B1730' };
}

interface FigureProps {
  /** 0 = leanest, 9 = most developed on the chosen scale */
  bodyStage?: number;
  track?: BodyTrack;
  flameLevel?: FlameLevel;
  size?: number;
  float?: boolean;
  animated?: boolean;
  tint?: MeebooTint;
  glow?: boolean;
}

const TOP = 108;
const CHEST_Y = 150;
const WAIST_Y = 205;
const BOTTOM = 240;
const HIP_Y = 236;
const LEG_LENGTH = 148;
const VIEW_W = 200;
const VIEW_H = 402;

function FigureDefs({ uid, tint }: { uid: string; tint: MeebooTint }) {
  const c = tintStops(tint);
  return (
    <Defs>
      <RadialGradient id={`headShade-${uid}`} cx="36%" cy="30%" r="78%">
        <Stop offset="0%" stopColor="#F4FAFF" />
        <Stop offset="42%" stopColor={c.light} />
        <Stop offset="100%" stopColor={c.dark} />
      </RadialGradient>
      <LinearGradient id={`bodyShade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor={tint === 'pink' ? brand.pink200 : brand.blue200} />
        <Stop offset="45%" stopColor={c.light} />
        <Stop offset="100%" stopColor={c.dark} />
      </LinearGradient>
      <LinearGradient id={`shortsShade-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={tint === 'pink' ? '#5A2B44' : '#233A5E'} />
        <Stop offset="100%" stopColor={c.edge} />
      </LinearGradient>
      <RadialGradient id={`groundShadow-${uid}`} cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={neutral.ink} stopOpacity={0.24} />
        <Stop offset="100%" stopColor={neutral.ink} stopOpacity={0} />
      </RadialGradient>
    </Defs>
  );
}

export function MeebooFigure({
  bodyStage = 3,
  track = 'muscle',
  flameLevel = 'large',
  size = 160,
  float = true,
  animated = true,
  tint = 'blue',
  glow = false,
}: FigureProps) {
  const bob = useRef(new Animated.Value(0)).current;
  const m = getBodyMetrics(track, bodyStage);
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
  const height = size * (VIEW_H / VIEW_W);

  const shoulderX = 100 - m.shoulderHalf * 0.86;
  const shoulderXR = 100 + m.shoulderHalf * 0.86;
  const hipX = 100 - m.hipHalf * 0.5;
  const hipXR = 100 + m.hipHalf * 0.5;
  const armY = 116;
  const bodyFill = `url(#bodyShade-${uid})`;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ marginBottom: -size * 0.09, zIndex: 2 }}>
        <MeebooFlame level={flameLevel} size={size * 0.32} animated={animated} />
      </View>
      <Animated.View style={{ transform: [{ translateY }], width: size, height }}>
        <Svg width={size} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <FigureDefs uid={uid} tint={tint} />
          {glow && (
            <Defs>
              <RadialGradient id={`figureGlow-${uid}`} cx="50%" cy="42%" r="60%">
                <Stop offset="0%" stopColor={c.light} stopOpacity={0.55} />
                <Stop offset="100%" stopColor={c.light} stopOpacity={0} />
              </RadialGradient>
            </Defs>
          )}
          {glow && <Circle cx={100} cy={170} r={150} fill={`url(#figureGlow-${uid})`} />}

          <Ellipse cx={100} cy={392} rx={m.hipHalf + 34} ry={14} fill={`url(#groundShadow-${uid})`} />

          {/* legs */}
          <G transform={`rotate(5 ${hipX} ${HIP_Y})`}>
            <Rect x={hipX - m.legWidth / 2} y={HIP_Y} width={m.legWidth} height={LEG_LENGTH} rx={m.legWidth / 2} fill={bodyFill} />
          </G>
          <G transform={`rotate(-5 ${hipXR} ${HIP_Y})`}>
            <Rect x={hipXR - m.legWidth / 2} y={HIP_Y} width={m.legWidth} height={LEG_LENGTH} rx={m.legWidth / 2} fill={bodyFill} />
          </G>

          {/* arms (behind torso) */}
          <G transform={`rotate(9 ${shoulderX} ${armY})`}>
            <Rect x={shoulderX - m.armWidth / 2} y={armY} width={m.armWidth} height={126} rx={m.armWidth / 2} fill={bodyFill} />
            {m.bicepBulge > 0.05 && (
              <Ellipse
                cx={shoulderX}
                cy={armY + 32}
                rx={m.armWidth / 2 + m.bicepBulge * 6.5}
                ry={m.armWidth * 0.72}
                fill={c.light}
                opacity={0.55}
              />
            )}
          </G>
          <G transform={`rotate(-9 ${shoulderXR} ${armY})`}>
            <Rect x={shoulderXR - m.armWidth / 2} y={armY} width={m.armWidth} height={126} rx={m.armWidth / 2} fill={bodyFill} />
            {m.bicepBulge > 0.05 && (
              <Ellipse
                cx={shoulderXR}
                cy={armY + 32}
                rx={m.armWidth / 2 + m.bicepBulge * 6.5}
                ry={m.armWidth * 0.72}
                fill={c.light}
                opacity={0.55}
              />
            )}
          </G>

          {/* torso */}
          <Path d={torsoPath(m, TOP, CHEST_Y, WAIST_Y, BOTTOM)} fill={bodyFill} />
          <Ellipse cx={100 - m.chestHalf * 0.42} cy={CHEST_Y - 4} rx={m.chestHalf * 0.38} ry={22} fill="#FFFFFF" opacity={0.14} />

          {track === 'muscle' && m.definitionOpacity > 0 && (
            <G opacity={m.definitionOpacity} stroke={c.ink} strokeWidth={2} strokeLinecap="round" fill="none">
              <Path d={`M100 ${CHEST_Y + 6} L100 ${WAIST_Y - 4}`} />
              <Path d={`M${100 - 10} ${CHEST_Y + 16} L${100 + 10} ${CHEST_Y + 16}`} />
              <Path d={`M${100 - 9} ${CHEST_Y + 32} L${100 + 9} ${CHEST_Y + 32}`} />
              <Path d={`M${100 - m.chestHalf * 0.75} ${CHEST_Y - 14} Q100 ${CHEST_Y - 2} ${100 + m.chestHalf * 0.75} ${CHEST_Y - 14}`} />
            </G>
          )}
          {track === 'fat' && bodyStage > 2 && (
            <G opacity={0.18}>
              <Circle cx={100} cy={WAIST_Y + 4} r={3} fill={c.ink} />
              <Path
                d={`M${100 - m.waistHalf * 0.7} ${WAIST_Y - 6} Q100 ${WAIST_Y + 6} ${100 + m.waistHalf * 0.7} ${WAIST_Y - 6}`}
                stroke={c.ink}
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          )}

          {/* shorts */}
          <Rect
            x={100 - m.hipHalf - 6}
            y={HIP_Y - 22}
            width={(m.hipHalf + 6) * 2}
            height={54}
            rx={20}
            fill={`url(#shortsShade-${uid})`}
          />
          <Rect x={100 - m.hipHalf - 6} y={HIP_Y - 22} width={(m.hipHalf + 6) * 2} height={8} rx={4} fill={tint === 'pink' ? '#7A3E5D' : '#33507D'} opacity={0.7} />

          {/* neck + head */}
          <Rect x={88} y={92} width={24} height={20} rx={9} fill={bodyFill} />
          <Circle cx={100} cy={56} r={46} fill={`url(#headShade-${uid})`} />
          <Ellipse cx={82} cy={38} rx={15} ry={11} fill="#FFFFFF" opacity={0.4} />
          <Ellipse cx={100} cy={94} rx={30} ry={9} fill={c.ink} opacity={0.1} />

          {/* face */}
          <Circle cx={84} cy={54} r={5.6} fill={c.ink} />
          <Circle cx={116} cy={54} r={5.6} fill={c.ink} />
          <Circle cx={82} cy={51.5} r={1.7} fill="#FFFFFF" />
          <Circle cx={114} cy={51.5} r={1.7} fill="#FFFFFF" />
          <Path d="M86 67 Q100 78 114 67" stroke={c.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>
    </View>
  );
}

interface HeadProps {
  size?: number;
  flameLevel?: FlameLevel;
  animated?: boolean;
  tint?: MeebooTint;
}

/** Small head-only avatar for nav bars, profile bubbles, chat rows. */
export function MeebooHead({ size = 40, flameLevel, animated = false, tint = 'blue' }: HeadProps) {
  const uid = useId();
  const c = tintStops(tint);
  return (
    <View style={{ alignItems: 'center', width: size, height: size * (flameLevel ? 1.5 : 1.08) }}>
      {flameLevel && (
        <View style={{ marginBottom: -size * 0.22 }}>
          <MeebooFlame level={flameLevel} size={size * 0.34} animated={animated} />
        </View>
      )}
      <Svg width={size} height={size * 1.08} viewBox="0 0 100 108">
        <Defs>
          <RadialGradient id={`headShadeSmall-${uid}`} cx="36%" cy="30%" r="78%">
            <Stop offset="0%" stopColor="#F4FAFF" />
            <Stop offset="42%" stopColor={c.light} />
            <Stop offset="100%" stopColor={c.dark} />
          </RadialGradient>
        </Defs>
        <Circle cx={50} cy={50} r={46} fill={`url(#headShadeSmall-${uid})`} />
        <Ellipse cx={34} cy={34} rx={14} ry={10} fill="#FFFFFF" opacity={0.4} />
        <Circle cx={36} cy={48} r={5.4} fill={c.ink} />
        <Circle cx={64} cy={48} r={5.4} fill={c.ink} />
        <Circle cx={34} cy={45.5} r={1.6} fill="#FFFFFF" />
        <Circle cx={62} cy={45.5} r={1.6} fill="#FFFFFF" />
        <Path d="M38 60 Q50 70 62 60" stroke={c.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}
