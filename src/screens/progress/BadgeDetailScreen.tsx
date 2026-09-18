import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { badgeTiers, muscleGroups, tierForSets } from '../../data/badges';
import { Badge3D } from '../../illustrations/Badge3D';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';

export function BadgeDetailScreen() {
  const route = useRoute<any>();
  const muscleGroup = route.params?.muscleGroup as string;
  const group = muscleGroups.find((g) => g.id === muscleGroup);
  const sets = useWorkoutStore((s) => s.setsForMuscleGroup(muscleGroup as any));
  const currentTier = tierForSets(sets);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{group?.label} badge</Text>
      <Text style={styles.subtitle}>{sets} sets logged · currently {currentTier.label}</Text>

      <View style={styles.list}>
        {badgeTiers.map((t, i) => {
          const isCurrent = t.tier === currentTier.tier;
          const isPast = badgeTiers.findIndex((x) => x.tier === currentTier.tier) > i;
          return (
            <View key={t.tier} style={[styles.row, isCurrent && styles.rowCurrent]}>
              <Badge3D tier={t.tier} size={52} locked={!isCurrent && !isPast} />
              <View style={{ flex: 1 }}>
                <View style={styles.rowHeader}>
                  <Text style={styles.tierName}>{t.label}</Text>
                  {isCurrent && (
                    <View style={styles.currentPill}>
                      <Text style={styles.currentPillText}>You are here</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.tierMeta}>{t.minSets}+ sets · {t.realWorldEquivalent}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  title: { ...typography.h1, fontSize: 24 },
  subtitle: { ...typography.bodyMuted, marginTop: 4, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  rowCurrent: { borderColor: colors.primaryBlue, backgroundColor: colors.lightBlueSurface },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tierName: { fontFamily: fontFamilies.bold, fontSize: 16, color: colors.textPrimary },
  tierMeta: { ...typography.bodyMuted, fontSize: 13, marginTop: 2 },
  currentPill: { backgroundColor: colors.primaryBlue, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  currentPillText: { fontFamily: fontFamilies.semiBold, fontSize: 10.5, color: colors.white },
});
