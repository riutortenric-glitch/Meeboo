import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CheckIcon } from '../../components/icons';
import { MeebooFigure } from '../../illustrations/MeebooFigure';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { tintForSex, usesMuscleScale } from '../../utils/bodyType';
import { workoutCompleteLine } from '../../utils/meebooVoice';

export function WorkoutSummaryScreen() {
  const navigation = useNavigation<any>();
  const profile = useUserStore((s) => s.profile);
  const sessions = useWorkoutStore((s) => s.sessions);
  const last = sessions[sessions.length - 1];
  const totalSets = last?.completedSets.length ?? 0;
  const durationMin = last?.completedAt
    ? Math.max(1, Math.round((new Date(last.completedAt).getTime() - new Date(last.startedAt).getTime()) / 60000))
    : 0;
  const track = usesMuscleScale(profile?.goal ?? 'build_muscle') ? 'muscle' : 'fat';

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <MeebooFigure size={130} bodyStage={profile?.bodyStageIndex ?? 3} track={track} flameLevel="large" tint={tintForSex(profile?.sex)} />
        <Text style={styles.title}>Workout complete</Text>
        <Text style={styles.subtitle}>{workoutCompleteLine(totalSets)}</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Sets logged</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{durationMin}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </Card>
      </View>

      <View style={styles.checklist}>
        {['Exercises completed with sets logged', 'Total volume added to your badges', 'Meeboo has celebrated with you'].map((line) => (
          <View key={line} style={styles.checkRow}>
            <View style={styles.checkDot}>
              <CheckIcon color={colors.white} size={12} />
            </View>
            <Text style={styles.checkText}>{line}</Text>
          </View>
        ))}
      </View>

      <Button title="Back to home" onPress={() => navigation.navigate('TrainHub')} style={{ marginTop: 'auto' as any }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  title: { ...typography.h1, fontSize: 26, marginTop: spacing.lg },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statValue: { ...typography.statNumberLarge },
  statLabel: { ...typography.bodyMuted, fontSize: 12.5, marginTop: 2 },
  checklist: { marginTop: spacing.xl, gap: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.successGreen, alignItems: 'center', justifyContent: 'center' },
  checkText: { ...typography.bodyMedium, flex: 1 },
});
