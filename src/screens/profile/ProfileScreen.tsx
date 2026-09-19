import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { ChevronRightIcon, LogoutIcon } from '../../components/icons';
import { MeebooFigure } from '../../illustrations/MeebooFigure';
import { useNutritionStore } from '../../state/nutritionStore';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { bmiCategoryLabel, sexLabel, tintForSex, usesMuscleScale } from '../../utils/bodyType';

const goalLabels: Record<string, string> = {
  lose_fat: 'Lose fat',
  build_muscle: 'Build muscle',
  both: 'Build muscle & lose fat',
  be_healthier: 'Be healthier',
};

const trainingLabels: Record<string, string> = {
  gym: 'Gym training',
  home: 'Home training',
  none: 'No equipment',
  outdoor: 'Outdoor sports',
  mix: 'Mixed training',
};

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[detailStyles.row, !last && detailStyles.rowBorder]}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

function SettingsRow({ label, danger, last, onPress }: { label: string; danger?: boolean; last?: boolean; onPress?: () => void }) {
  return (
    <Pressable style={[detailStyles.row, !last && detailStyles.rowBorder]} onPress={onPress}>
      <Text style={[detailStyles.label, danger && { color: colors.danger }, { fontFamily: fontFamilies.medium }]}>{label}</Text>
      <ChevronRightIcon color={colors.textFaint} size={16} />
    </Pressable>
  );
}

export function ProfileScreen() {
  const profile = useUserStore((s) => s.profile);
  const resetUser = useUserStore((s) => s.reset);
  const workout = useWorkoutStore();
  const nutrition = useNutritionStore();

  if (!profile) return null;
  const track = usesMuscleScale(profile.goal) ? 'muscle' : 'fat';
  const heightLabel = profile.units === 'metric' ? `${profile.heightCm} cm` : `${Math.round(profile.heightCm / 2.54)} in`;
  const weightLabel = profile.units === 'metric' ? `${profile.weightKg} kg` : `${Math.round(profile.weightKg * 2.205)} lb`;

  const confirmDelete = () => {
    Alert.alert('Delete all data?', 'This removes your profile, workouts and nutrition history from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          resetUser();
          workout.discardSession();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Your profile" />

      <Card style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <MeebooFigure size={56} bodyStage={profile.bodyStageIndex} track={track} flameLevel="medium" float={false} tint={tintForSex(profile.sex)} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileEyebrow}>Your Meeboo profile</Text>
          <Text style={styles.profileName}>{profile.name || 'Friend'}</Text>
          <Text style={styles.profileTags}>
            {goalLabels[profile.goal]} · {trainingLabels[profile.trainingType]}
          </Text>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit profile</Text>
        </Pressable>
      </Card>

      <Text style={styles.sectionTitle}>Your details</Text>
      <Card padded={false}>
        <DetailRow label="Goal" value={goalLabels[profile.goal]} />
        <DetailRow label="Training schedule" value={`${profile.trainingDaysPerWeek} days / week`} />
        <DetailRow label="Body stats" value={`${heightLabel} · ${weightLabel}`} />
        <DetailRow label="BMI" value={`${profile.bmi.toFixed(1)} · ${bmiCategoryLabel(profile.bmi)}`} />
        <DetailRow label="Units" value={profile.units === 'metric' ? 'Metric' : 'Imperial'} last />
      </Card>

      <Text style={styles.sectionTitle}>Your journey</Text>
      <View style={styles.statsRow}>
        <Card style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{workout.totalCompletedSessions()}</Text>
          <Text style={styles.miniStatLabel}>Workouts</Text>
        </Card>
        <Card style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{nutrition.userRecipes.length}</Text>
          <Text style={styles.miniStatLabel}>Recipes shared</Text>
        </Card>
        <Card style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{sexLabel(profile.sex)}</Text>
          <Text style={styles.miniStatLabel}>Sex</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Settings & connections</Text>
      <Card padded={false}>
        <SettingsRow label="Apple Health" />
        <SettingsRow label="Calendar" />
        <SettingsRow label="Notifications" />
        <SettingsRow label="Delete all my data" danger onPress={confirmDelete} last />
      </Card>

      <Pressable style={styles.signOut} onPress={resetUser}>
        <LogoutIcon color={colors.textMuted} size={16} />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarWrap: { width: 68, height: 113, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  profileEyebrow: { ...typography.label, marginBottom: 2 },
  profileName: { ...typography.h1, fontSize: 24 },
  profileTags: { ...typography.bodyMuted, marginTop: 2 },
  editBtn: { backgroundColor: colors.lightBlueSurface, borderRadius: radii.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  editBtnText: { fontFamily: fontFamilies.semiBold, fontSize: 13.5, color: colors.primaryBlue },
  sectionTitle: { ...typography.h3, marginTop: spacing.xl, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  miniStat: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  miniStatValue: { fontFamily: fontFamilies.bold, fontSize: 18, color: colors.textPrimary },
  miniStatLabel: { ...typography.bodyMuted, fontSize: 11.5, marginTop: 2, textAlign: 'center' },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl, paddingVertical: spacing.md },
  signOutText: { fontFamily: fontFamilies.medium, fontSize: 14, color: colors.textMuted },
});

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { ...typography.body },
  value: { fontFamily: fontFamilies.semiBold, fontSize: 15, color: colors.textPrimary },
});
