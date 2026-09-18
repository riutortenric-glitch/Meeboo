import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ClockIcon, UtensilsIcon } from '../../components/icons';
import { MacroBar } from '../../components/MacroBar';
import { brand, colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { recipeById } from '../../data/recipes';
import { useNutritionStore } from '../../state/nutritionStore';

export function RecipeDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const recipe = recipeById(route.params.recipeId)!;
  const logMeal = useNutritionStore((s) => s.logMeal);

  const logThis = () => {
    logMeal({
      name: recipe.name,
      calories: recipe.calories,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      emoji: '🍽️',
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <UtensilsIcon color={colors.primaryBlue} size={26} />
      </View>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.author}>By {recipe.uploadedBy}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <ClockIcon color={colors.textMuted} size={14} />
          <Text style={styles.metaText}>{recipe.prepTimeMin} min</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>{recipe.difficulty}</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>{recipe.servingSizeG}g serving</Text>
        </View>
      </View>

      <Card style={{ marginTop: spacing.lg, gap: spacing.md }}>
        <View style={styles.calorieHeader}>
          <Text style={styles.calorieValue}>{recipe.calories}</Text>
          <Text style={styles.calorieLabel}>kcal per serving</Text>
        </View>
        <MacroBar label="Protein" consumedG={recipe.proteinG} goalG={Math.max(recipe.proteinG, 1)} color={brand.blue500} />
        <MacroBar label="Carbs" consumedG={recipe.carbsG} goalG={Math.max(recipe.carbsG, 1)} color={brand.flameMid} />
        <MacroBar label="Fat" consumedG={recipe.fatG} goalG={Math.max(recipe.fatG, 1)} color="#B084F0" />
      </Card>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientList}>
        {recipe.ingredients.map((ing) => (
          <View key={ing} style={styles.ingredientRow}>
            <View style={styles.dot} />
            <Text style={styles.ingredientText}>{ing}</Text>
          </View>
        ))}
      </View>

      <Button title="Log this meal" onPress={logThis} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 600, width: '100%', alignSelf: 'center' },
  hero: { width: 72, height: 72, borderRadius: radii.md, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, fontSize: 24 },
  author: { ...typography.bodyMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 6 },
  metaText: { fontFamily: fontFamilies.medium, fontSize: 12.5, color: colors.textMuted, textTransform: 'capitalize' },
  calorieHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  calorieValue: { fontFamily: fontFamilies.black, fontSize: 30, color: colors.textPrimary },
  calorieLabel: { ...typography.bodyMuted },
  sectionTitle: { ...typography.h3, marginTop: spacing.xl, marginBottom: spacing.md },
  ingredientList: { gap: spacing.sm },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primaryBlue },
  ingredientText: { ...typography.body },
});
