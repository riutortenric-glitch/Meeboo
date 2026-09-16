import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { recipeById, recipes } from '../../data/recipes';
import { useNutritionStore } from '../../state/nutritionStore';
import { NutritionStackParamList } from '../../navigation/types';

type Route = RouteProp<NutritionStackParamList, 'RecipeDetail'>;

const emojiForCategory = { high_protein: '🍗', high_calorie: '🔥', low_calorie: '🥗' } as const;

export function RecipeDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<any>();
  const logMeal = useNutritionStore((s) => s.logMeal);
  const recipe = recipeById(route.params.recipeId) ?? recipes.find((r) => r.isUserUploaded && r.id === route.params.recipeId);

  if (!recipe) return null;

  const maxMacro = Math.max(recipe.proteinG, recipe.carbsG, recipe.fatG);

  const handleLog = () => {
    logMeal({
      name: recipe.name,
      calories: recipe.calories,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      emoji: emojiForCategory[recipe.category],
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoLabel}>▶ Cooking video</Text>
      </View>

      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.meta}>
        {recipe.prepTimeMin} min · {recipe.difficulty} · by {recipe.uploadedBy}
      </Text>

      <View style={styles.calorieRow}>
        <Text style={styles.calories}>{recipe.calories} kcal</Text>
        <Text style={styles.serving}>per {recipe.servingSizeG}g serving</Text>
      </View>

      <View style={styles.macroBlock}>
        <MacroLine label="Protein" grams={recipe.proteinG} max={maxMacro} color={colors.primaryBlue} />
        <MacroLine label="Carbs" grams={recipe.carbsG} max={maxMacro} color={colors.flameOrange} />
        <MacroLine label="Fat" grams={recipe.fatG} max={maxMacro} color={colors.successGreen} />
      </View>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((ing, i) => (
        <Text key={i} style={styles.ingredient}>• {ing}</Text>
      ))}

      <Button title="Log this meal" onPress={handleLog} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

function MacroLine({ label, grams, max, color }: { label: string; grams: number; max: number; color: string }) {
  return (
    <View style={{ gap: 4, marginBottom: spacing.sm }}>
      <View style={styles.macroLabelRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{grams}g</Text>
      </View>
      <ProgressBar progress={max > 0 ? grams / max : 0} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: 24, paddingBottom: spacing.xxxl, gap: 4 },
  videoPlaceholder: {
    height: 200, borderRadius: 20, backgroundColor: colors.deepNavy,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  videoLabel: { color: colors.white, fontSize: 16, fontWeight: '600' },
  title: { ...typography.h2 },
  meta: { ...typography.bodyMuted, marginBottom: spacing.md },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.lg },
  calories: { ...typography.h2 },
  serving: { ...typography.bodyMuted },
  macroBlock: { marginBottom: spacing.lg },
  macroLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { ...typography.label },
  macroValue: { ...typography.label, color: colors.deepNavy },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  ingredient: { ...typography.body, marginBottom: 4 },
});
