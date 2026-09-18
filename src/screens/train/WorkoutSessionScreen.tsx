import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MuscleGroupIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import {
  configureNotificationCategories,
  requestNotificationPermission,
  scheduleRestTimer,
} from '../../utils/notifications';

const REST_SECONDS = 60;

export function WorkoutSessionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { templateId } = route.params;
  const template = workoutTemplates.find((t) => t.id === templateId)!;
  const exercises = useMemo(() => template.exerciseIds.map((id) => exerciseById(id)!), [template]);

  const startSession = useWorkoutStore((s) => s.startSession);
  const logSet = useWorkoutStore((s) => s.logSet);
  const completeSession = useWorkoutStore((s) => s.completeSession);

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REST_SECONDS);

  const exercise = exercises[exIdx];
  const isLastSet = setIdx + 1 >= exercise.defaultSets;
  const isLastExercise = exIdx + 1 >= exercises.length;

  useEffect(() => {
    startSession(templateId);
    requestNotificationPermission().then((granted) => {
      if (granted) configureNotificationCategories();
    });
  }, []);

  useEffect(() => {
    if (!resting) return;
    if (secondsLeft <= 0) {
      setResting(false);
      advance();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [resting, secondsLeft]);

  const nextExerciseName = () => {
    if (!isLastSet) return exercise.name;
    return isLastExercise ? 'Finish' : exercises[exIdx + 1].name;
  };

  const advance = () => {
    if (!isLastSet) {
      setSetIdx((v) => v + 1);
    } else if (!isLastExercise) {
      setExIdx((v) => v + 1);
      setSetIdx(0);
    } else {
      completeSession();
      navigation.replace('WorkoutSummary');
    }
  };

  const logAndRest = (reps: number) => {
    logSet(exercise.id, reps, undefined);
    if (isLastSet && isLastExercise) {
      completeSession();
      navigation.replace('WorkoutSummary');
      return;
    }
    scheduleRestTimer(REST_SECONDS, nextExerciseName());
    setSecondsLeft(REST_SECONDS);
    setResting(true);
  };

  const totalSetsPlanned = exercises.reduce((sum, e) => sum + e.defaultSets, 0);
  const setsDoneSoFar = exercises.slice(0, exIdx).reduce((sum, e) => sum + e.defaultSets, 0) + setIdx;

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <ProgressBar progress={setsDoneSoFar / totalSetsPlanned} height={6} />
        <Text style={styles.topBarText}>
          Exercise {exIdx + 1} of {exercises.length}
        </Text>
      </View>

      {resting ? (
        <View style={styles.restWrap}>
          <Text style={styles.restLabel}>Resting…</Text>
          <Text style={styles.restTimer}>{secondsLeft}s</Text>
          <Text style={styles.restNext}>Next: {nextExerciseName()}</Text>
          <Pressable onPress={() => { setResting(false); advance(); }} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip rest</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.sessionWrap}>
          <View style={styles.exerciseIconBig}>
            <MuscleGroupIcon group={exercise.muscleGroup} color={colors.primaryBlue} size={32} />
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.setLabel}>
            Set {setIdx + 1} of {exercise.defaultSets} · {exercise.defaultReps} reps
          </Text>

          <Card style={styles.readyCard}>
            <Text style={styles.readyText}>Ready when you are.</Text>
          </Card>

          <View style={styles.actionRow}>
            <Button title="Different reps" variant="secondary" onPress={() => logAndRest(Math.max(1, exercise.defaultReps - 2))} style={{ flex: 1 }} />
            <Button title="Done" onPress={() => logAndRest(exercise.defaultReps)} style={{ flex: 1 }} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  topBar: { gap: spacing.sm, marginTop: spacing.md },
  topBarText: { ...typography.bodyMuted, textAlign: 'center' },
  sessionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  exerciseIconBig: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  exerciseName: { ...typography.h1, fontSize: 26, textAlign: 'center' },
  setLabel: { ...typography.bodyMuted, fontSize: 16 },
  readyCard: { marginTop: spacing.xl, marginBottom: spacing.xl, paddingVertical: spacing.xl, alignItems: 'center', width: '100%' },
  readyText: { ...typography.bodyLarge, color: colors.textMuted },
  actionRow: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  restWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  restLabel: { ...typography.h3, color: colors.textMuted },
  restTimer: { fontFamily: fontFamilies.black, fontSize: 72, color: colors.primaryBlue, letterSpacing: -1 },
  restNext: { ...typography.bodyMuted, fontSize: 16, marginBottom: spacing.xl },
  skipBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.pill, backgroundColor: colors.surfaceMuted, ...shadow.subtle },
  skipBtnText: { fontFamily: fontFamilies.semiBold, fontSize: 14, color: colors.textMuted },
});
