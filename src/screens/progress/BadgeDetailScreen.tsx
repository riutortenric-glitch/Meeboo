import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BadgeIcon } from '../../components/BadgeIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { badgeTiers, muscleGroups, tierForSets } from '../../data/badges';
import { useWorkoutStore } from '../../state/workoutStore';
import { MuscleGroup } from '../../types';
import { ProgressStackParamList } from '../../navigation/types';

type Route = RouteProp<ProgressStackParamList, 'BadgeDetail'>;

export function BadgeDetailScreen() {
  const route = useRoute<Route>();
  const muscleGroup = route.params.muscleGroup as MuscleGroup;
  const setsForMuscleGroup = useWorkoutStore((s) => s.setsForMuscleGroup);
  const sets = setsForMuscleGroup(muscleGroup);
  const currentTier = tierForSets(sets);
  const group = muscleGroups.find((g) => g.id === muscleGroup);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{group?.label} badge</Text>
      <Text style={styles.subtitle}>{sets} total sets logged</Text>

      {badgeTiers.map((t) => {
        const reached = sets >= t.minSets;
        const isCurrent = t.tier === currentTier.tier;
        return (
          <View key={t.tier} style={[styles.row, isCurrent && styles.rowCurrent]}>
            <BadgeIcon tier={t.tier} size={44} />
            <View style={styles.rowText}>
              <Text style={[styles.tierLabel, !reached && styles.tierLabelMuted]}>{t.label}</Text>
              <Text style={styles.tierMeta}>{t.minSets}+ sets · {t.realWorldEquivalent}</Text>
            </View>
            {reached && <Text style={styles.check}>✓</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: 24, gap: spacing.md, paddingBottom: spacing.xxxl },
  title: { ...typography.h2 },
  subtitle: { ...typography.bodyMuted, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.lightBlueSurface,
  },
  rowCurrent: { borderWidth: 2, borderColor: colors.primaryBlue },
  rowText: { flex: 1 },
  tierLabel: { ...typography.body, fontWeight: '700' },
  tierLabelMuted: { color: colors.textMuted },
  tierMeta: { ...typography.bodyMuted, fontSize: 12, marginTop: 2 },
  check: { color: colors.successGreen, fontSize: 20, fontWeight: '700' },
});
