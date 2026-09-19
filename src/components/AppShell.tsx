import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeebooFlame } from '../illustrations/MeebooFlame';
import { brand, colors } from '../theme/colors';
import { radii, shadow, spacing } from '../theme/spacing';
import { fontFamilies, typography } from '../theme/typography';
import { HomeIcon, MeIcon, NutritionIcon, ProgressIcon, SparkleIcon, TrainIcon } from './icons';
import { ProgressBar } from './ProgressBar';

export type TabKey = 'Home' | 'Progress' | 'Train' | 'Nutrition' | 'Me';

export const TAB_ITEMS: { key: TabKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: 'Home', label: 'Home', Icon: HomeIcon },
  { key: 'Progress', label: 'Progress', Icon: ProgressIcon },
  { key: 'Train', label: 'Train', Icon: TrainIcon },
  { key: 'Nutrition', label: 'Nutrition', Icon: NutritionIcon },
  { key: 'Me', label: 'Me', Icon: MeIcon },
];

const SIDEBAR_BREAKPOINT = 860;

export function useIsSidebarLayout() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= SIDEBAR_BREAKPOINT;
}

interface ShellProps {
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  streakLabel?: string;
}

export function Sidebar({ active, onSelect, streakLabel = "You're 2 workouts away from your next badge." }: ShellProps) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <SparkleIcon color={colors.white} size={18} />
        </View>
        <Text style={styles.wordmark}>meeboo</Text>
      </View>

      <View style={styles.navList}>
        {TAB_ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              style={[styles.navItem, isActive && styles.navItemActive]}
            >
              <Icon color={isActive ? colors.primaryBlue : colors.textMuted} size={20} strokeWidth={2} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakFlame}>
          <MeebooFlame level="medium" size={30} />
        </View>
        <Text style={styles.streakTitle}>Keep your flame alive</Text>
        <Text style={styles.streakBody}>{streakLabel}</Text>
        <View style={{ marginTop: spacing.sm }}>
          <ProgressBar progress={0.6} color={brand.flameMid} trackColor="rgba(255,255,255,0.18)" height={6} />
        </View>
      </View>
    </View>
  );
}

export function BottomTabBar({ active, onSelect }: ShellProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TAB_ITEMS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <Pressable key={key} onPress={() => onSelect(key)} style={styles.bottomItem}>
            <Icon color={isActive ? colors.primaryBlue : colors.textFaint} size={22} strokeWidth={2} />
            <Text style={[styles.bottomLabel, isActive && { color: colors.primaryBlue, fontFamily: fontFamilies.semiBold }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xxl, paddingHorizontal: spacing.sm },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: radii.xs,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.subtle,
  },
  wordmark: { ...typography.logo, fontSize: 21 },
  navList: { gap: 2 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  navItemActive: { backgroundColor: brand.blue50 },
  navLabel: { ...typography.bodyMedium, color: colors.textMuted },
  navLabelActive: { color: colors.primaryBlue, fontFamily: fontFamilies.semiBold },
  streakCard: {
    marginTop: 'auto',
    backgroundColor: colors.deepNavy,
    borderRadius: radii.md,
    padding: spacing.lg,
    ...shadow.soft,
  },
  streakFlame: { marginBottom: spacing.xs },
  streakTitle: { fontFamily: fontFamilies.bold, fontSize: 15, color: colors.white, marginBottom: 4 },
  streakBody: { fontFamily: fontFamilies.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 17 },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  bottomItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  bottomLabel: { fontFamily: fontFamilies.medium, fontSize: 11, color: colors.textFaint },
});
