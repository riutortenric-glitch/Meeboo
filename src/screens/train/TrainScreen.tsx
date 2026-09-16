import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { exerciseById, workoutTemplates } from '../../data/exercises';
import { useWorkoutStore } from '../../state/workoutStore';

export function TrainScreen() {
  const navigation = useNavigation<any>();
  const sessions = useWorkoutStore((s) => s.sessions);
  const lastSession = sessions[sessions.length - 1];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Train</Text>
        <Text style={styles.subtitle}>Pick today's session. Everything after this happens from your notifications.</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={workoutTemplates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.templateCard}>
            <Text style={styles.templateName}>{item.name}</Text>
            <Text style={styles.templateExercises}>
              {item.exerciseIds.map((id) => exerciseById(id)?.name).join(' · ')}
            </Text>
            <Button
              title="Start workout"
              onPress={() => navigation.navigate('WorkoutSession', { templateId: item.id })}
              style={styles.startBtn}
            />
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListFooterComponent={
          lastSession ? (
            <Pressable onPress={() => navigation.navigate('WorkoutSummary')} style={styles.lastSessionLink}>
              <Text style={styles.lastSessionText}>View your last workout summary →</Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { padding: spacing.xl, paddingTop: 64, gap: spacing.xs },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodyMuted },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  templateCard: { gap: spacing.sm },
  templateName: { ...typography.h3 },
  templateExercises: { ...typography.bodyMuted, fontSize: 13 },
  startBtn: { marginTop: spacing.sm },
  lastSessionLink: { paddingVertical: spacing.lg, alignItems: 'center' },
  lastSessionText: { color: colors.primaryBlue, fontWeight: '600' },
});
