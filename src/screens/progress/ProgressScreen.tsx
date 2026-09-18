import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { MuscleGroupIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { badgeTiers, muscleGroups, nextTierForSets, tierForSets } from '../../data/badges';
import { Badge3D } from '../../illustrations/Badge3D';
import { MeebooFigure } from '../../illustrations/MeebooFigure';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { usesMuscleScale } from '../../utils/bodyType';

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

  const totalSets = rows.reduce((sum, r) => sum + r.sets, 0);
  const badgesEarned = rows.filter((r) => r.tier.tier !== 'stone').length;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Progress" />

      <Card style={styles.avatarCard}>
        <MeebooFigure size={120} bodyStage={profile?.bodyStageIndex ?? 3} track={track} flameLevel="large" float={false} />
        <Text style={styles.goalLabel}>{track === 'muscle' ? 'Building muscle' : 'Getting leaner'}</Text>
        <View style={styles.countRow}>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{totalSets}</Text>
            <Text style={styles.countLabel}>Total sets</Text>
          </View>
          <View style={styles.countDivider} />
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{badgesEarned}</Text>
            <Text style={styles.countLabel}>Badges earned</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Muscle badges</Text>
      <View style={styles.grid}>
        {rows.map((r) => (
          <Pressable key={r.id} style={styles.badgeCard} onPress={() => navigation.navigate('BadgeDetail', { muscleGroup: r.id })}>
            <Badge3D tier={r.tier.tier} size={56} />
            <View style={styles.badgeLabelRow}>
              <MuscleGroupIcon group={r.id} color={colors.textMuted} size={13} />
              <Text style={styles.badgeLabel}>{r.label}</Text>
            </View>
            <Text style={styles.badgeTier}>{r.tier.label}</Text>
            <View style={{ width: '100%', marginTop: spacing.xs }}>
              <ProgressBar progress={r.progress} height={5} />
            </View>
            <Text style={styles.badgeSets}>{r.next ? `${r.next.minSets - r.sets} sets to ${r.next.label}` : 'Max tier'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  avatarCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  goalLabel: { ...typography.bodyMuted, marginTop: spacing.sm },
  countRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: spacing.xxl },
  countItem: { alignItems: 'center' },
  countValue: { ...typography.h1, fontSize: 26 },
  countLabel: { ...typography.bodyMuted, fontSize: 12.5 },
  countDivider: { width: 1, height: 32, backgroundColor: colors.border },
  sectionTitle: { ...typography.h3, marginTop: spacing.xl, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  badgeCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  badgeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  badgeLabel: { fontFamily: fontFamilies.semiBold, fontSize: 14.5, color: colors.textPrimary },
  badgeTier: { fontFamily: fontFamilies.medium, fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs },
  badgeSets: { fontFamily: fontFamilies.regular, fontSize: 11.5, color: colors.textFaint, marginTop: spacing.xs, textAlign: 'center' },
});
