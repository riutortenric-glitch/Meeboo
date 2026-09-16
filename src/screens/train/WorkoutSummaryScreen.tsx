import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { workoutCompleteLine } from '../../utils/meebooVoice';

export function WorkoutSummaryScreen() {
  const navigation = useNavigation<any>();
  const sessions = useWorkoutStore((s) => s.sessions);
  const profile = useUserStore((s) => s.profile);
  const session = sessions[sessions.length - 1];

  if (!session) {
    return (
      <View style={styles.empty}>
        <Text style={typography.body}>No workout to show yet.</Text>
      </View>
    );
  }

  const template = workoutTemplates.find((t) => t.id === session.templateId);
  const durationMin = session.completedAt
    ? Math.round((new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : 0;

  const setsByExercise = session.completedSets.reduce<Record<string, number>>((acc, s) => {
    acc[s.exerciseId] = (acc[s.exerciseId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <MeebooCharacter size={110} flameLevel="large" bodyStage={profile?.bodyStageIndex ?? 3} />
        <Text style={styles.title}>Workout complete</Text>
        <Text style={styles.celebrate}>{workoutCompleteLine(session.completedSets.length)}</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{Object.keys(setsByExercise).length}</Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{session.completedSets.length}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{durationMin}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>{template?.name}</Text>
      {Object.entries(setsByExercise).map(([exerciseId, count]) => (
        <View key={exerciseId} style={styles.exerciseRow}>
          <Text style={styles.exerciseName}>{exerciseById(exerciseId)?.name}</Text>
          <Text style={styles.exerciseSets}>{count} sets</Text>
        </View>
      ))}

      <Button title="Back to Train" onPress={() => navigation.navigate('TrainHub')} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl, paddingTop: 48, gap: spacing.lg, paddingBottom: spacing.xxxl },
  hero: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.h2, marginTop: spacing.sm },
  celebrate: { ...typography.bodyMuted, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h2 },
  statLabel: { ...typography.label },
  sectionTitle: { ...typography.h3, marginTop: spacing.md },
  exerciseRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  exerciseName: { ...typography.body },
  exerciseSets: { ...typography.bodyMuted },
});
