import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from '../../components/Button';
import { GradientScreen } from '../../components/GradientScreen';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { StatCard } from '../../components/StatCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNutritionStore } from '../../state/nutritionStore';
import { useUserStore } from '../../state/userStore';
import { useWorkoutStore } from '../../state/workoutStore';
import { computeFlameLevel } from '../../utils/flame';
import { homeGreeting } from '../../utils/meebooVoice';

function IconDot({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Path d="M7 0 L14 7 L7 14 L0 7 Z" fill={color} />
    </Svg>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const profile = useUserStore((s) => s.profile);
  const sessions = useWorkoutStore((s) => s.sessions);
  const nutrition = useNutritionStore();
  const [question, setQuestion] = useState('');

  const flameLevel = computeFlameLevel(sessions);
  const greeting = homeGreeting(profile?.name ?? '', sessions);
  const todaysMeals = nutrition.todaysMeals();
  const caloriesEaten = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const water = nutrition.todaysWaterGlasses();

  return (
    <GradientScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.greetingSmall}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},</Text>
          <Text style={styles.name}>{profile?.name ?? 'friend'}</Text>
        </View>

        <View style={styles.meebooWrap}>
          <MeebooCharacter size={150} flameLevel={flameLevel} bodyStage={profile?.bodyStageIndex ?? 3} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{greeting}</Text>
          </View>
        </View>

        <View style={styles.askBar}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ask me anything about your training..."
            placeholderTextColor={colors.textMuted}
            style={styles.askInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Sleep" value="7h 22m" sublabel="Synced from Health"><IconDot color={colors.primaryBlue} /></StatCard>
          <StatCard label="Calories left" value={`${Math.max(0, nutrition.calorieGoal - caloriesEaten)}`} sublabel={`${caloriesEaten} kcal logged`}><IconDot color={colors.flameOrange} /></StatCard>
          <StatCard label="Steps" value="8,432" sublabel="10,000 goal"><IconDot color={colors.successGreen} /></StatCard>
          <StatCard label="Water" value={`${(water * 0.25).toFixed(2)} L`} sublabel={`${water}/8 glasses`}><IconDot color={colors.primaryBlue} /></StatCard>
        </View>

        <Button
          title="Start workout"
          onPress={() => navigation.navigate('Train')}
          style={styles.startBtn}
        />
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  topRow: { marginTop: spacing.sm },
  greetingSmall: { ...typography.body, color: colors.white, opacity: 0.85 },
  name: { ...typography.h1, color: colors.white },
  meebooWrap: { alignItems: 'center', marginVertical: spacing.md },
  speechBubble: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    maxWidth: '90%',
  },
  speechText: { ...typography.body, textAlign: 'center' },
  askBar: { backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: spacing.lg, paddingVertical: 4 },
  askInput: { fontSize: 15, color: colors.deepNavy, paddingVertical: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.white },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  startBtn: { marginTop: spacing.sm, backgroundColor: colors.deepNavy },
});
