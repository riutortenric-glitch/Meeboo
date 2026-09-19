import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GradientScreen } from '../../components/GradientScreen';
import { ChevronRightIcon, MuscleGroupIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { badgeTiers, muscleGroups, nextTierForSets, tierForSets } from '../../data/badges';
import { Badge3D } from '../../illustrations/Badge3D';
import { MeebooFigure } from '../../illustrations/MeebooFigure';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { tintForSex, usesMuscleScale } from '../../utils/bodyType';

const RING_SIZE = 320;
const RING_RADIUS = 138;
const RING_COUNT = 6;

export function ProgressScreen() {
  const navigation = useNavigation<any>();
  const profile = useUserStore((s) => s.profile);
  const workout = useWorkoutStore();
  const track = usesMuscleScale(profile?.goal ?? 'build_muscle') ? 'muscle' : 'fat';

  const rows = muscleGroups.map((g) => {
    const sets = workout.setsForMuscleGroup(g.id);
    const tier = tierForSets(sets);
    const next = nextTierForSets(sets);
    const progress = next ? (sets - tier.minSets) / (next.minSets - tier.minSets) : 1;
    return { ...g, sets, tier, next, progress };
  });

  const ringRows = rows.slice(0, RING_COUNT);

  return (
    <GradientScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>Your muscle development</Text>
          </View>
        </View>

        <View style={styles.ring}>
          <View style={styles.ringCenter}>
            <MeebooFigure size={112} bodyStage={profile?.bodyStageIndex ?? 3} track={track} flameLevel="large" float={false} tint={tintForSex(profile?.sex)} />
          </View>
          {ringRows.map((r, i) => {
            const angle = -90 + (360 / RING_COUNT) * i;
            const rad = (angle * Math.PI) / 180;
            const x = RING_SIZE / 2 + RING_RADIUS * Math.cos(rad) - 26;
            const y = RING_SIZE / 2 + RING_RADIUS * Math.sin(rad) - 26;
            return (
              <View key={r.id} style={[styles.ringBadge, { left: x, top: y }]}>
                <Badge3D tier={r.tier.tier} size={52} />
              </View>
            );
          })}
        </View>

        <View style={styles.list}>
          {rows.map((r) => (
            <Pressable key={r.id} style={styles.row} onPress={() => navigation.navigate('BadgeDetail', { muscleGroup: r.id })}>
              <Badge3D tier={r.tier.tier} size={36} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={styles.rowTop}>
                  <View style={styles.rowLabelRow}>
                    <MuscleGroupIcon group={r.id} color="rgba(255,255,255,0.75)" size={13} />
                    <Text style={styles.rowLabel}>{r.label}</Text>
                  </View>
                  <Text style={styles.rowPercent}>{Math.round(Math.min(1, r.progress) * 100)}%</Text>
                </View>
                <ProgressBar progress={r.progress} height={6} color="#FFFFFF" trackColor="rgba(255,255,255,0.2)" />
              </View>
              <ChevronRightIcon color="rgba(255,255,255,0.55)" size={16} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...typography.h1, color: colors.white },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  ring: { width: RING_SIZE, height: RING_SIZE, alignSelf: 'center', marginTop: spacing.lg },
  ringCenter: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ringBadge: { position: 'absolute', width: 52, height: 52 },
  list: { marginTop: spacing.xl, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: radii.md,
    padding: spacing.md,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  rowLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowLabel: { fontFamily: fontFamilies.semiBold, fontSize: 14.5, color: colors.white },
  rowPercent: { fontFamily: fontFamilies.bold, fontSize: 13.5, color: colors.white },
});
