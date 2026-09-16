import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalorieRing } from '../../components/CalorieRing';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { recipes } from '../../data/recipes';
import { useNutritionStore } from '../../state/nutritionStore';
import { RecipeCategory } from '../../types';
import { nutritionComment } from '../../utils/meebooVoice';

const categories: { id: RecipeCategory; label: string }[] = [
  { id: 'high_protein', label: 'High Protein' },
  { id: 'high_calorie', label: 'High Calorie' },
  { id: 'low_calorie', label: 'Low Calorie' },
];

export function NutritionScreen() {
  const navigation = useNavigation<any>();
  const nutrition = useNutritionStore();
  const todaysMeals = nutrition.todaysMeals();
  const water = nutrition.todaysWaterGlasses();

  const consumed = {
    calories: todaysMeals.reduce((s, m) => s + m.calories, 0),
    protein: todaysMeals.reduce((s, m) => s + m.proteinG, 0),
    carbs: todaysMeals.reduce((s, m) => s + m.carbsG, 0),
    fat: todaysMeals.reduce((s, m) => s + m.fatG, 0),
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <Pressable style={styles.logBtn} onPress={() => navigation.navigate('LogMeal')}>
          <Text style={styles.logBtnText}>+ Log meal</Text>
        </Pressable>
      </View>

      <Card style={styles.dashCard}>
        <View style={styles.dashRow}>
          <CalorieRing consumed={consumed.calories} goal={nutrition.calorieGoal} />
          <View style={styles.macros}>
            <MacroBar label="Protein" value={consumed.protein} goal={nutrition.proteinGoalG} color={colors.primaryBlue} />
            <MacroBar label="Carbs" value={consumed.carbs} goal={nutrition.carbsGoalG} color={colors.flameOrange} />
            <MacroBar label="Fat" value={consumed.fat} goal={nutrition.fatGoalG} color={colors.successGreen} />
          </View>
        </View>
        <Text style={styles.meebooComment}>
          {nutritionComment(consumed.calories, nutrition.calorieGoal, consumed.protein, nutrition.proteinGoalG)}
        </Text>
      </Card>

      <Card style={styles.waterCard}>
        <Text style={styles.waterLabel}>Water — {(water * 0.25).toFixed(2)} L</Text>
        <View style={styles.waterRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Pressable
              key={i}
              onPress={() => i >= water && nutrition.logWaterGlass()}
              style={[styles.drop, i < water && styles.dropFilled]}
            />
          ))}
        </View>
      </Card>

      {todaysMeals.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Today's meals</Text>
          {todaysMeals.map((meal) => (
            <View key={meal.id} style={styles.mealRow}>
              <Text style={styles.mealEmoji}>{meal.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealMacros}>{meal.calories} kcal · {meal.proteinG}g protein</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {categories.map((cat) => (
        <View key={cat.id}>
          <Text style={styles.sectionTitle}>{cat.label}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeRow}>
            {recipes.filter((r) => r.category === cat.id).map((recipe) => (
              <Pressable
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              >
                <View style={styles.recipeThumb} />
                <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
                <Text style={styles.recipeMeta}>{recipe.calories} kcal · {recipe.proteinG}g protein</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}

      <Pressable style={styles.uploadLink} onPress={() => navigation.navigate('UploadRecipe')}>
        <Text style={styles.uploadLinkText}>Share your own recipe →</Text>
      </Pressable>
    </ScrollView>
  );
}

function MacroBar({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  return (
    <View style={{ gap: 4, marginBottom: spacing.sm }}>
      <View style={styles.macroLabelRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{value}g / {goal}g</Text>
      </View>
      <ProgressBar progress={goal > 0 ? value / goal : 0} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: 64, gap: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.h1 },
  logBtn: { backgroundColor: colors.primaryBlue, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  logBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  dashCard: { gap: spacing.md },
  dashRow: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  macros: { flex: 1 },
  macroLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { ...typography.label },
  macroValue: { ...typography.label, color: colors.deepNavy },
  meebooComment: { ...typography.bodyMuted, fontStyle: 'italic' },
  waterCard: { gap: spacing.sm },
  waterLabel: { ...typography.body, fontWeight: '600' },
  waterRow: { flexDirection: 'row', gap: spacing.sm },
  drop: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.border, borderWidth: 1.5, borderColor: colors.primaryBlue },
  dropFilled: { backgroundColor: colors.primaryBlue },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  mealEmoji: { fontSize: 28 },
  mealName: { ...typography.body, fontWeight: '600' },
  mealMacros: { ...typography.bodyMuted, fontSize: 12 },
  recipeRow: { gap: spacing.md, paddingRight: spacing.xl },
  recipeCard: { width: 150, gap: 4 },
  recipeThumb: { width: 150, height: 100, borderRadius: 16, backgroundColor: colors.lightBlueSurface },
  recipeName: { ...typography.body, fontWeight: '600', fontSize: 14 },
  recipeMeta: { ...typography.bodyMuted, fontSize: 11 },
  uploadLink: { alignItems: 'center', paddingVertical: spacing.md },
  uploadLinkText: { color: colors.primaryBlue, fontWeight: '600' },
});
