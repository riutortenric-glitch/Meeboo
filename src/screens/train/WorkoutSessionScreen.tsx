import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { useWorkoutStore } from '../../state/workoutStore';
import { TrainStackParamList } from '../../navigation/types';
import {
  configureNotificationCategories,
  ensureAndroidChannel,
  requestNotificationPermission,
  scheduleRestTimer,
} from '../../utils/notifications';

type Route = RouteProp<TrainStackParamList, 'WorkoutSession'>;

interface QueueItem {
  exerciseId: string;
  setNumber: number;
  totalSets: number;
  targetReps: number;
  isLastSetOfExercise: boolean;
}

const REST_SECONDS = 60;

export function WorkoutSessionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const template = workoutTemplates.find((t) => t.id === route.params.templateId)!;

  const startSession = useWorkoutStore((s) => s.startSession);
  const logSet = useWorkoutStore((s) => s.logSet);
  const completeSession = useWorkoutStore((s) => s.completeSession);

  const queue = useMemo<QueueItem[]>(() => {
    const items: QueueItem[] = [];
    for (const exerciseId of template.exerciseIds) {
      const exercise = exerciseById(exerciseId)!;
      for (let i = 1; i <= exercise.defaultSets; i++) {
        items.push({
          exerciseId,
          setNumber: i,
          totalSets: exercise.defaultSets,
          targetReps: exercise.defaultReps,
          isLastSetOfExercise: i === exercise.defaultSets,
        });
      }
    }
    return items;
  }, [template]);

  const [index, setIndex] = useState(0);
  const [resting, setResting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REST_SECONDS);
  const [repsModalVisible, setRepsModalVisible] = useState(false);
  const [customReps, setCustomReps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startSession(template.id);
    (async () => {
      await ensureAndroidChannel();
      await configureNotificationCategories();
      await requestNotificationPermission();
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = queue[index];
  const exercise = current ? exerciseById(current.exerciseId) : undefined;
  const isFirstSetOfExercise = current?.setNumber === 1;

  const finishWorkout = () => {
    completeSession();
    navigation.replace('WorkoutSummary');
  };

  const advance = () => {
    if (index + 1 >= queue.length) {
      finishWorkout();
      return;
    }
    if (current.isLastSetOfExercise) {
      setIndex(index + 1);
      return;
    }
    startRest();
  };

  const startRest = () => {
    setResting(true);
    setSecondsLeft(REST_SECONDS);
    const nextName = exerciseById(queue[index + 1]?.exerciseId ?? '')?.name ?? 'next exercise';
    scheduleRestTimer(REST_SECONDS, nextName).catch(() => {});
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setResting(false);
          setIndex((i) => i + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    setIndex((i) => i + 1);
  };

  const handleDone = () => {
    logSet(current.exerciseId, current.targetReps);
    advance();
  };

  const handleDifferentReps = () => {
    setCustomReps(current.targetReps);
    setRepsModalVisible(true);
  };

  const confirmCustomReps = () => {
    logSet(current.exerciseId, customReps);
    setRepsModalVisible(false);
    advance();
  };

  if (!current) return null;

  if (resting) {
    const nextName = exerciseById(queue[index + 1]?.exerciseId ?? '')?.name;
    return (
      <View style={styles.restScreen}>
        <Text style={styles.restLabel}>Resting…</Text>
        <Text style={styles.restTimer}>{secondsLeft}s</Text>
        {nextName ? <Text style={styles.restNext}>Next set: {nextName}</Text> : null}
        <Button title="Skip rest" onPress={skipRest} variant="secondary" style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.progressWrap}>
        <ProgressBar progress={(index + 1) / queue.length} />
        <Text style={styles.progressLabel}>Set {index + 1} of {queue.length}</Text>
      </View>

      <View style={styles.body}>
        {isFirstSetOfExercise && index > 0 ? <Text style={styles.transition}>Next up</Text> : null}
        <Text style={styles.exerciseName}>{exercise?.name}</Text>
        <Text style={styles.setInfo}>Set {current.setNumber} of {current.totalSets} · {current.targetReps} reps</Text>
        <Text style={styles.readyText}>Ready when you are.</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Different reps" onPress={handleDifferentReps} variant="secondary" style={{ flex: 1 }} />
        <Button title="Done" onPress={handleDone} style={{ flex: 1 }} />
      </View>

      <Modal transparent visible={repsModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How many reps?</Text>
            <View style={styles.repsPicker}>
              <Pressable style={styles.repsBtn} onPress={() => setCustomReps(Math.max(0, customReps - 1))}>
                <Text style={styles.repsBtnText}>-</Text>
              </Pressable>
              <Text style={styles.repsValue}>{customReps}</Text>
              <Pressable style={styles.repsBtn} onPress={() => setCustomReps(customReps + 1)}>
                <Text style={styles.repsBtnText}>+</Text>
              </Pressable>
            </View>
            <Button title="Log set" onPress={confirmCustomReps} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white, justifyContent: 'space-between' },
  progressWrap: { padding: spacing.xl, paddingTop: 64, gap: spacing.sm },
  progressLabel: { ...typography.label },
  body: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  transition: { ...typography.label, color: colors.primaryBlue },
  exerciseName: { ...typography.h1, textAlign: 'center' },
  setInfo: { ...typography.body, color: colors.textMuted },
  readyText: { ...typography.bodyMuted, marginTop: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.xl },
  restScreen: { flex: 1, backgroundColor: colors.deepNavy, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  restLabel: { ...typography.h3, color: colors.white },
  restTimer: { fontSize: 64, fontFamily: fontFamilies.bold, color: colors.white },
  restNext: { ...typography.body, color: colors.white, opacity: 0.8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(12,48,96,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: colors.white, borderRadius: 20, padding: spacing.xl, width: '80%', gap: spacing.lg, alignItems: 'center' },
  modalTitle: { ...typography.h3 },
  repsPicker: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  repsBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center' },
  repsBtnText: { fontSize: 24, fontFamily: fontFamilies.bold, color: colors.primaryBlue },
  repsValue: { fontSize: 32, fontFamily: fontFamilies.bold, minWidth: 60, textAlign: 'center' },
});
