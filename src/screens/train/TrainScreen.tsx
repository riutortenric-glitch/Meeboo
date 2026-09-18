import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { MuscleGroupIcon } from '../../components/icons';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';

export function TrainScreen() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState(workoutTemplates[0].id);
  const template = workoutTemplates.find((t) => t.id === selected)!;
  const exercises = template.exerciseIds.map((id) => exerciseById(id)!);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Train" />

      <Text style={styles.sectionTitle}>Choose a plan</Text>
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

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>{template.name}</Text>
        <Text style={styles.cardMeta}>{exercises.length} exercises</Text>
        <View style={styles.exerciseList}>
          {exercises.map((ex) => (
            <View key={ex.id} style={styles.exerciseRow}>
              <View style={styles.exerciseIcon}>
                <MuscleGroupIcon group={ex.muscleGroup} color={colors.primaryBlue} size={16} />
              </View>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseSets}>{ex.defaultSets} × {ex.defaultReps}</Text>
            </View>
          ))}
        </View>
        <Button
          title="Start workout"
          onPress={() => navigation.navigate('WorkoutSession', { templateId: template.id })}
          style={{ marginTop: spacing.lg }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  templateRow: { gap: spacing.sm, paddingRight: spacing.xl },
  templateChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surfaceMuted },
  templateChipActive: { backgroundColor: colors.primaryBlue },
  templateChipText: { fontFamily: fontFamilies.semiBold, fontSize: 13.5, color: colors.textMuted },
  templateChipTextActive: { color: colors.white },
  cardTitle: { ...typography.h2, fontSize: 20 },
  cardMeta: { ...typography.bodyMuted, marginTop: 2 },
  exerciseList: { marginTop: spacing.lg, gap: spacing.sm },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  exerciseIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center' },
  exerciseName: { ...typography.bodyMedium, flex: 1 },
  exerciseSets: { ...typography.bodyMuted, fontSize: 13.5 },
});
