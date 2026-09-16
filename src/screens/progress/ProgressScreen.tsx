import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Card } from '../../components/Card';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { shadow, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { muscleGroups, nextTierForSets, tierForSets } from '../../data/badges';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { computeFlameLevel } from '../../utils/flame';
import { bmiCategoryLabel } from '../../utils/bodyType';

export function ProgressScreen() {
  const navigation = useNavigation<any>();
  const profile = useUserStore((s) => s.profile);
  const sessions = useWorkoutStore((s) => s.sessions);
  const setsForMuscleGroup = useWorkoutStore((s) => s.setsForMuscleGroup);
  const totalSessions = useWorkoutStore((s) => s.totalCompletedSessions());

  const flameLevel = computeFlameLevel(sessions);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <MeebooCharacter size={140} flameLevel={flameLevel} bodyStage={profile?.bodyStageIndex ?? 3} goal={profile?.goal} />
        <Text style={styles.name}>{profile?.name ?? 'You'}</Text>
        {profile ? (
          <Text style={styles.meta}>BMI {profile.bmi.toFixed(1)} · {bmiCategoryLabel(profile.bmi)}</Text>
        ) : null}
      </View>

      <View style={styles.countersRow}>
        <Card style={styles.counterCard}>
          <Text style={styles.counterValue}>{totalSessions}</Text>
          <Text style={styles.counterLabel}>Workouts</Text>
        </Card>
        <Card style={styles.counterCard}>
          <Text style={styles.counterValue}>
            {muscleGroups.reduce((sum, g) => sum + setsForMuscleGroup(g.id), 0)}
          </Text>
          <Text style={styles.counterLabel}>Total sets</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Muscle badges</Text>
      <View style={styles.grid}>
        {muscleGroups.map((g) => {
          const sets = setsForMuscleGroup(g.id);
          const tier = tierForSets(sets);
          const next = nextTierForSets(sets);
          const progress = next ? (sets - tier.minSets) / (next.minSets - tier.minSets) : 1;
          return (
            <Pressable
              key={g.id}
              style={styles.badgeCard}
              onPress={() => navigation.navigate('BadgeDetail', { muscleGroup: g.id })}
            >
              <BadgeIcon tier={tier.tier} size={52} />
              <Text style={styles.badgeMuscle}>{g.label}</Text>
              <Text style={styles.badgeTier}>{tier.label}</Text>
              <ProgressBar progress={progress} height={5} />
              <Text style={styles.badgeSub}>{next ? `${next.minSets - sets} sets to ${next.label}` : 'Max tier'}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: 64, paddingBottom: spacing.xxxl, gap: spacing.lg },
  hero: { alignItems: 'center' },
  name: { ...typography.h2, marginTop: spacing.sm },
  meta: { ...typography.bodyMuted, marginTop: 2 },
  countersRow: { flexDirection: 'row', gap: spacing.md },
  counterCard: { flex: 1, alignItems: 'center' },
  counterValue: { ...typography.h2 },
  counterLabel: { ...typography.label, marginTop: 2 },
  sectionTitle: { ...typography.h3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  badgeCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    paddingTop: spacing.lg,
    alignItems: 'center',
    gap: 4,
    ...shadow.card,
  },
  badgeMuscle: { ...typography.body, fontWeight: '700', marginTop: spacing.xs },
  badgeTier: { ...typography.bodyMuted, fontSize: 13, marginBottom: spacing.xs },
  badgeSub: { ...typography.bodyMuted, fontSize: 11, marginTop: 4, textAlign: 'center' },
});
