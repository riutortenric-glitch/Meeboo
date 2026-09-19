import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  majorStep?: number;
  pxPerUnit?: number;
}

const METAL_STOPS = ['#8B929C', '#DDE1E6', '#F4F6F8', '#C7CCD2', '#9299A3'] as const;

/** A brushed-metal ruler scrubber — scroll to pick a value, snaps to the nearest unit. */
export function MetricDial({ label, value, onChange, min, max, unit, majorStep = 10, pxPerUnit = 10 }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const hasScrolledInitially = useRef(false);

  const onLayout = (e: any) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
    if (!hasScrolledInitially.current) {
      hasScrolledInitially.current = true;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ x: (value - min) * pxPerUnit, animated: false });
      });
    }
  };

  const commit = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const raw = min + x / pxPerUnit;
    const clamped = Math.max(min, Math.min(max, Math.round(raw)));
    onChange(clamped);
    scrollRef.current?.scrollTo({ x: (clamped - min) * pxPerUnit, animated: true });
  };

  const ticks = [];
  for (let v = min; v <= max; v++) {
    const isMajor = v % majorStep === 0;
    ticks.push(
      <View key={v} style={{ width: pxPerUnit, alignItems: 'center' }}>
        <View style={[styles.tick, isMajor ? styles.tickMajor : styles.tickMinor]} />
        {isMajor && <Text style={styles.tickLabel}>{v}</Text>}
      </View>
    );
  }

  const padding = containerWidth / 2;

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          <Text style={styles.unit}> {unit}</Text>
        </Text>
      </View>

      <View style={styles.rail} onLayout={onLayout}>
        <LinearGradient colors={METAL_STOPS} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        {containerWidth > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onMomentumScrollEnd={commit}
            contentContainerStyle={{ paddingHorizontal: padding, alignItems: 'center', height: 76 }}
          >
            {ticks}
          </ScrollView>
        )}
        <View pointerEvents="none" style={styles.pointerWrap}>
          <View style={styles.pointerTri} />
          <View style={styles.pointerLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'center', marginBottom: 10 },
  label: { fontFamily: fontFamilies.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.4, textTransform: 'uppercase' },
  value: { fontFamily: fontFamilies.black, fontSize: 30, color: colors.white, marginTop: 2 },
  unit: { fontFamily: fontFamilies.medium, fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  rail: { height: 76, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  tick: { borderRadius: 1 },
  tickMinor: { width: 1.5, height: 16, backgroundColor: 'rgba(11,27,50,0.35)', marginTop: 6 },
  tickMajor: { width: 2.5, height: 30, backgroundColor: 'rgba(11,27,50,0.6)' },
  tickLabel: { fontFamily: fontFamilies.semiBold, fontSize: 11, color: 'rgba(11,27,50,0.7)', marginTop: 3 },
  pointerWrap: { position: 'absolute', left: '50%', top: 0, bottom: 0, marginLeft: -1, alignItems: 'center' },
  pointerTri: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primaryBlue,
  },
  pointerLine: { width: 2, flex: 1, backgroundColor: colors.primaryBlue },
});
