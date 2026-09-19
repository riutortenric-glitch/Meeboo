import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { GradientScreen } from '../../components/GradientScreen';
import { CheckIcon, ClockIcon, MuscleGroupIcon, TrainIcon } from '../../components/icons';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function WeekStrip() {
  const today = new Date().getDay();
  return (
    <View style={styles.weekRow}>
      {DAY_LETTERS.map((letter, i) => {
        const isToday = i === today;
        const isPast = i < today;
        return (
          <View key={i} style={[styles.dayPill, isToday && styles.dayPillActive]}>
            <Text style={[styles.dayLetter, isToday && styles.dayLetterActive]}>{letter}</Text>
            <View style={[styles.dayStatus, isToday && styles.dayStatusActive]}>
              {isToday ? (
                <TrainIcon color={colors.primaryBlue} size={12} strokeWidth={2.4} />
              ) : isPast ? (
                <CheckIcon color="rgba(255,255,255,0.55)" size={11} strokeWidth={2.6} />
              ) : (
                <View style={styles.restDash} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function TrainScreen() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState(workoutTemplates[0].id);
  const template = workoutTemplates.find((t) => t.id === selected)!;
  const exercises = template.exerciseIds.map((id) => exerciseById(id)!);
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const completedIds = new Set((activeSession?.completedSets ?? []).map((s) => s.exerciseId));
  const firstExercise = exercises[0];
  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <GradientScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Your custom workouts</Text>
            <Text style={styles.title}>Today, {todayLabel}</Text>
          </View>
          <Avatar size={40} />
        </View>

        <WeekStrip />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          {workoutTemplates.map((t) => {
            const active = t.id === selected;
            return (
              <Pressable key={t.id} onPress={() => setSelected(t.id)} style={[styles.templateChip, active && styles.templateChipActive]}>
                <Text style={[styles.templateChipText, active && styles.templateChipTextActive]}>{t.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sessionCard}>
          <Text style={styles.sessionLabel}>YOUR SESSION</Text>
          <Text style={styles.sessionTitle}>{template.name}</Text>

          <View style={styles.exercisePhoto}>
            <View style={styles.exercisePhotoBadge}>
              <MuscleGroupIcon group={firstExercise.muscleGroup} color={colors.primaryBlue} size={38} strokeWidth={1.9} />
            </View>
          </View>
          <Text style={styles.exerciseLabel}>EXERCISE 1</Text>
          <Text style={styles.exerciseName}>{firstExercise.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{firstExercise.defaultSets} Sets</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{firstExercise.defaultReps} Reps</Text>
            <Text style={styles.metaDot}>·</Text>
            <View style={styles.metaIconRow}>
              <ClockIcon color="rgba(255,255,255,0.7)" size={13} />
              <Text style={styles.metaText}>90s Rest</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              title="Start / Resume"
              onPress={() => navigation.navigate('WorkoutSession', { templateId: template.id })}
              variant="secondary"
              style={{ flex: 1, backgroundColor: colors.white }}
            />
            <Pressable style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Session progress</Text>
          <Text style={styles.progressCount}>({completedIds.size}/{exercises.length})</Text>
        </View>
        <View style={styles.list}>
          {exercises.map((ex) => {
            const done = completedIds.has(ex.id);
            return (
              <View key={ex.id} style={styles.listRow}>
                <View style={styles.listThumb}>
                  <MuscleGroupIcon group={ex.muscleGroup} color={colors.primaryBlue} size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listName}>{ex.name}</Text>
                  <Text style={styles.listMeta}>{ex.defaultSets} × {ex.defaultReps}</Text>
                </View>
                <View style={[styles.checkDot, done && styles.checkDotDone]}>{done && <CheckIcon color="#FFFFFF" size={12} />}</View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 },
  title: { ...typography.h2, color: colors.white, fontSize: 21 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  dayPill: { width: 38, alignItems: 'center', gap: 6 },
  dayPillActive: {},
  dayLetter: { fontFamily: fontFamilies.medium, fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  dayLetterActive: { color: colors.white, fontFamily: fontFamilies.bold },
  dayStatus: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  dayStatusActive: { backgroundColor: colors.white },
  restDash: { width: 8, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.4)' },
  templateRow: { gap: spacing.sm, paddingRight: spacing.xl, marginTop: spacing.lg },
  templateChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.12)' },
  templateChipActive: { backgroundColor: colors.white },
  templateChipText: { fontFamily: fontFamilies.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  templateChipTextActive: { color: colors.primaryBlue },
  sessionCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg },
  sessionLabel: { fontFamily: fontFamilies.semiBold, fontSize: 11.5, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  sessionTitle: { fontFamily: fontFamilies.bold, fontSize: 19, color: colors.white, marginTop: 2, marginBottom: spacing.md },
  exercisePhoto: { height: 100, borderRadius: radii.md, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  exercisePhotoBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  exerciseLabel: { fontFamily: fontFamilies.semiBold, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  exerciseName: { fontFamily: fontFamilies.bold, fontSize: 17, color: colors.white, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  metaText: { fontFamily: fontFamilies.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  metaDot: { color: 'rgba(255,255,255,0.4)' },
  metaIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  editBtn: { paddingHorizontal: spacing.lg, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  editBtnText: { fontFamily: fontFamilies.semiBold, fontSize: 15, color: colors.white },
  progressHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: spacing.xl, marginBottom: spacing.md },
  progressTitle: { ...typography.h3, color: colors.white },
  progressCount: { fontFamily: fontFamilies.medium, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  list: { gap: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radii.md, padding: spacing.md },
  listThumb: { width: 38, height: 38, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  listName: { fontFamily: fontFamilies.semiBold, fontSize: 14, color: colors.white },
  listMeta: { fontFamily: fontFamilies.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  checkDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  checkDotDone: { backgroundColor: colors.successGreen, borderColor: colors.successGreen },
});
