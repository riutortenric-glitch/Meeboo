import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsSidebarLayout } from '../../components/AppShell';
import { AskMeebooBar } from '../../components/AskMeebooBar';
import { Button } from '../../components/Button';
import { GradientScreen } from '../../components/GradientScreen';
import { BellIcon, DropletIcon, FlameIcon, FootstepsIcon, MoonIcon } from '../../components/icons';
import { StatTile } from '../../components/StatTile';
import { MeebooBlob } from '../../illustrations/MeebooBlob';
import { useNutritionStore } from '../../state/nutritionStore';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { tintForSex } from '../../utils/bodyType';
import { computeFlameLevel } from '../../utils/flame';
import { homeGreeting } from '../../utils/meebooVoice';

function greetingTime() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

const SLEEP_SPARKLINE = [0.5, 0.7, 0.4, 0.9, 0.6, 1, 0.5, 0.8];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const profile = useUserStore((s) => s.profile);
  const sessions = useWorkoutStore((s) => s.sessions);
  const nutrition = useNutritionStore();
  const [question, setQuestion] = useState('');
  const isSidebar = useIsSidebarLayout();

  const flameLevel = computeFlameLevel(sessions);
  const greeting = homeGreeting(profile?.name ?? '', sessions);
  const todaysMeals = nutrition.todaysMeals();
  const caloriesEaten = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const water = nutrition.todaysWaterGlasses();

  const goToTrain = () => {
    if (isSidebar) return; // sidebar layout switches tabs via the shell, not stack nav
    navigation.navigate?.('Train');
  };

  return (
    <GradientScreen>
      <ScrollView contentContainerStyle={[styles.content, isSidebar && styles.contentWide]} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSmall}>Good {greetingTime()},</Text>
            <Text style={styles.name}>{profile?.name || 'friend'} 👋</Text>
          </View>
          <Pressable style={styles.bellBtn}>
            <BellIcon color={colors.white} size={20} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <MeebooBlob size={116} flameLevel={flameLevel} tint={tintForSex(profile?.sex)} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{greeting}</Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <AskMeebooBar value={question} onChangeText={setQuestion} onSubmit={() => setQuestion('')} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatTile label="Sleep" value="7h 22m" sublabel="Synced from Health" sparkline={SLEEP_SPARKLINE} dark>
            <MoonIcon color={colors.white} size={16} />
          </StatTile>
          <StatTile label="Calories left" value={`${Math.max(0, nutrition.calorieGoal - caloriesEaten)}`} sublabel={`${caloriesEaten} / ${nutrition.calorieGoal} kcal`}>
            <FlameIcon color={colors.flameOrange} size={16} />
          </StatTile>
          <StatTile label="Steps" value="8,432" sublabel="10,000 steps" progress={8432 / 10000}>
            <FootstepsIcon color={colors.successGreen} size={16} />
          </StatTile>
          <StatTile label="Water" value={`${(water * 0.25).toFixed(2)} L`} sublabel="2.6 L goal" progress={(water * 0.25) / 2.6}>
            <DropletIcon color={colors.primaryBlue} size={16} />
          </StatTile>
        </View>

        <Button title="Start workout" onPress={goToTrain} variant="dark" style={styles.startBtn} />
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
  contentWide: { paddingTop: spacing.xxxl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetingSmall: { ...typography.body, color: 'rgba(255,255,255,0.85)' },
  name: { ...typography.h1, color: colors.white },
  bellBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5A5F', borderWidth: 1.5, borderColor: colors.homeGradientTop },
  heroCard: { alignItems: 'center', marginTop: spacing.lg },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    maxWidth: '92%',
  },
  speechText: { ...typography.body, color: colors.white, textAlign: 'center' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.white },
  viewAll: { fontFamily: fontFamilies.medium, fontSize: 13.5, color: 'rgba(255,255,255,0.75)' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  startBtn: { marginTop: spacing.sm },
});
