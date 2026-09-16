import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { bmiCategoryLabel } from '../../utils/bodyType';

export function ProfileScreen() {
  const profile = useUserStore((s) => s.profile);
  const resetUser = useUserStore((s) => s.reset);
  const totalSessions = useWorkoutStore((s) => s.totalCompletedSessions());

  const handleDeleteData = () => {
    Alert.alert(
      'Delete all data',
      'This removes your profile, workouts, and nutrition history from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeMany(['meeboo-user-profile', 'meeboo-workouts', 'meeboo-nutrition']);
            resetUser();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <MeebooCharacter size={110} flameLevel="medium" bodyStage={profile?.bodyStageIndex ?? 3} goal={profile?.goal} float={false} />
        <Text style={styles.name}>{profile?.name ?? 'You'}</Text>
      </View>

      <Card style={styles.infoCard}>
        <Row label="Goal" value={goalLabel(profile?.goal)} />
        <Row label="Training" value={`${profile?.trainingDaysPerWeek ?? '-'} days / week`} />
        <Row label="Units" value={profile?.units === 'imperial' ? 'Imperial' : 'Metric'} />
        <Row label="BMI" value={profile ? `${profile.bmi.toFixed(1)} · ${bmiCategoryLabel(profile.bmi)}` : '-'} />
        <Row label="Workouts logged" value={String(totalSessions)} last />
      </Card>

      <Text style={styles.sectionTitle}>Connections</Text>
      <Card style={styles.infoCard}>
        <Row label="Apple Health" value="Not connected" />
        <Row label="Calendar" value="Not connected" last />
      </Card>
      <Text style={styles.hint}>
        Health and calendar integrations need HealthKit / Calendar permissions set up in a native build — not available inside Expo Go.
      </Text>

      <Button title="Delete all my data" onPress={handleDeleteData} variant="secondary" style={styles.deleteBtn} />
    </ScrollView>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function goalLabel(goal?: string) {
  switch (goal) {
    case 'lose_fat': return 'Lose fat';
    case 'build_muscle': return 'Build muscle';
    case 'both': return 'Both';
    case 'be_healthier': return 'Just be healthier';
    default: return '-';
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: 64, gap: spacing.lg, paddingBottom: spacing.xxxl },
  hero: { alignItems: 'center' },
  name: { ...typography.h2, marginTop: spacing.sm },
  infoCard: { gap: 0 },
  sectionTitle: { ...typography.h3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.bodyMuted },
  rowValue: { ...typography.body, fontWeight: '600' },
  hint: { ...typography.bodyMuted, fontSize: 12 },
  deleteBtn: { marginTop: spacing.md, borderColor: colors.danger },
});
