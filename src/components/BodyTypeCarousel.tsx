import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MeebooFigure, MeebooTint } from '../illustrations/MeebooFigure';
import { BodyTrack } from '../illustrations/meebooGeometry';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface Props {
  track: BodyTrack;
  tint: MeebooTint;
  index: number;
  onChange: (i: number) => void;
  labels: string[];
}

export function BodyTypeCarousel({ track, tint, index, onChange, labels }: Props) {
  const prev = index - 1;
  const next = index + 1;

  return (
    <View>
      <View style={styles.row}>
        <Pressable onPress={() => onChange(Math.max(0, index - 1))} style={styles.arrowBtn} disabled={index === 0}>
          <ChevronLeftIcon color={index === 0 ? 'rgba(255,255,255,0.3)' : colors.white} size={22} />
        </Pressable>

        <View style={styles.stage}>
          {prev >= 0 && (
            <View style={[styles.side, { left: 0 }]}>
              <MeebooFigure size={56} bodyStage={prev} track={track} tint={tint} flameLevel="small" float={false} animated={false} />
            </View>
          )}
          <View style={styles.center}>
            <MeebooFigure size={128} bodyStage={index} track={track} tint={tint} flameLevel="medium" float={false} glow />
          </View>
          {next <= 9 && (
            <View style={[styles.side, { right: 0 }]}>
              <MeebooFigure size={56} bodyStage={next} track={track} tint={tint} flameLevel="small" float={false} animated={false} />
            </View>
          )}
        </View>

        <Pressable onPress={() => onChange(Math.min(9, index + 1))} style={styles.arrowBtn} disabled={index === 9}>
          <ChevronRightIcon color={index === 9 ? 'rgba(255,255,255,0.3)' : colors.white} size={22} />
        </Pressable>
      </View>
      <Text style={styles.caption}>{labels[index]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginTop: 8 },
  arrowBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: 60 },
  stage: { width: 240, height: 320, alignItems: 'center', justifyContent: 'flex-end' },
  center: { opacity: 1 },
  side: { position: 'absolute', bottom: 8, opacity: 0.45 },
  caption: { textAlign: 'center', fontFamily: fontFamilies.semiBold, fontSize: 14, color: colors.white, marginTop: 10 },
});
