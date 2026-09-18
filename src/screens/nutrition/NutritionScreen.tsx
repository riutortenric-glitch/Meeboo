import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { CameraIcon, PlusIcon, UtensilsIcon } from '../../components/icons';
import { MacroBar } from '../../components/MacroBar';
import { WaterTracker } from '../../components/WaterTracker';
import { CalorieRing } from '../../components/CalorieRing';
import { Header } from '../../components/Header';
import { recipes } from '../../data/recipes';
import { RecipeCategory } from '../../types';
import { brand, colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { useNutritionStore } from '../../state/nutritionStore';
import { nutritionComment } from '../../utils/meebooVoice';

const categories: { id: RecipeCategory; label: string; color: string }[] = [
  { id: 'high_protein', label: 'High Protein', color: brand.blue500 },
  { id: 'high_calorie', label: 'High Calorie', color: brand.flameOuter },
  { id: 'low_calorie', label: 'Low Calorie', color: '#1FAE72' },
];

function RecipeCard({ id, name, calories, proteinG, category, color, onPress }: any) {
  return (
    <Pressable style={styles.recipeCard} onPress={onPress}>
      <View style={[styles.recipeThumb, { backgroundColor: color + '1F' }]}>
        <UtensilsIcon color={color} size={20} />
      </View>
      <Text style={styles.recipeName} numberOfLines={2}>{name}</Text>
      <Text style={styles.recipeMeta}>{calories} kcal · {proteinG}g protein</Text>
    </Pressable>
  );
}

export function NutritionScreen() {
  const navigation = useNavigation<any>();
  const nutrition = useNutritionStore();
  const todaysMeals = nutrition.todaysMeals();
  const caloriesEaten = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const proteinEaten = todaysMeals.reduce((sum, m) => sum + m.proteinG, 0);
  const carbsEaten = todaysMeals.reduce((sum, m) => sum + m.carbsG, 0);
  const fatEaten = todaysMeals.reduce((sum, m) => sum + m.fatG, 0);
  const water = nutrition.todaysWaterGlasses();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header
        title="Nutrition"
        right={
          <Pressable style={styles.uploadBtn} onPress={() => navigation.navigate('UploadRecipe')}>
            <PlusIcon color={colors.primaryBlue} size={18} />
          </Pressable>
        }
      />

      <Card style={styles.dashboard}>
        <View style={styles.dashboardTop}>
          <CalorieRing consumed={caloriesEaten} goal={nutrition.calorieGoal} />
          <View style={styles.macros}>
            <MacroBar label="Protein" consumedG={proteinEaten} goalG={nutrition.proteinGoalG} color={brand.blue500} />
            <MacroBar label="Carbs" consumedG={carbsEaten} goalG={nutrition.carbsGoalG} color={brand.flameMid} />
            <MacroBar label="Fat" consumedG={fatEaten} goalG={nutrition.fatGoalG} color="#B084F0" />
          </View>
        </View>
        <Text style={styles.comment}>{nutritionComment(caloriesEaten, nutrition.calorieGoal, proteinEaten, nutrition.proteinGoalG)}</Text>
        <View style={styles.waterRow}>
          <Text style={styles.waterLabel}>Water</Text>
          <WaterTracker glasses={water} onAdd={nutrition.logWaterGlass} />
        </View>
      </Card>

      <Pressable style={styles.logMealBtn} onPress={() => navigation.navigate('LogMeal')}>
        <CameraIcon color={colors.white} size={18} />
        <Text style={styles.logMealText}>Snap a meal to log it</Text>
      </Pressable>

      {categories.map((cat) => {
        const items = recipes.filter((r) => r.category === cat.id);
        return (
          <View key={cat.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{cat.label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeRow}>
              {items.map((r) => (
                <RecipeCard
                  key={r.id}
                  {...r}
                  color={cat.color}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: r.id })}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  uploadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center' },
  dashboard: { gap: spacing.md },
  dashboardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  macros: { flex: 1, gap: spacing.sm },
  comment: { ...typography.bodyMuted, fontSize: 13.5, fontStyle: 'italic' },
  waterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  waterLabel: { ...typography.label },
  logMealBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryBlue,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadow.glow,
  },
  logMealText: { fontFamily: fontFamilies.semiBold, fontSize: 15, color: colors.white },
  section: { marginTop: spacing.xl },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  recipeRow: { gap: spacing.md, paddingRight: spacing.xl },
  recipeCard: { width: 150, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, ...shadow.card },
  recipeThumb: { width: '100%', height: 80, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  recipeName: { fontFamily: fontFamilies.semiBold, fontSize: 13.5, color: colors.textPrimary, minHeight: 34 },
  recipeMeta: { fontFamily: fontFamilies.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
});
