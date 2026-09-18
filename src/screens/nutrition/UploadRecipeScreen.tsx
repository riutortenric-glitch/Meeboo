import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CameraIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { RecipeCategory } from '../../types';
import { useNutritionStore } from '../../state/nutritionStore';
import { colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { estimateNutritionFromIngredients } from '../../utils/nutritionEstimate';

const categoryOptions: { id: RecipeCategory; label: string }[] = [
  { id: 'high_protein', label: 'High Protein' },
  { id: 'high_calorie', label: 'High Calorie' },
  { id: 'low_calorie', label: 'Low Calorie' },
];

export function UploadRecipeScreen() {
  const navigation = useNavigation<any>();
  const addUserRecipe = useNutritionStore((s) => s.addUserRecipe);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('high_protein');
  const [servingSizeG, setServingSizeG] = useState('350');
  const [ingredientsText, setIngredientsText] = useState('');
  const [videoAttached, setVideoAttached] = useState(false);

  const ingredients = ingredientsText.split('\n').map((s) => s.trim()).filter(Boolean);
  const nutrition = estimateNutritionFromIngredients(ingredients, Number(servingSizeG) || 300);

  const finish = () => {
    addUserRecipe({
      id: `user_${Date.now()}`,
      name: name || 'My recipe',
      category,
      servingSizeG: Number(servingSizeG) || 300,
      ingredients,
      uploadedBy: 'You',
      prepTimeMin: 20,
      difficulty: 'easy',
      isUserUploaded: true,
      ...nutrition,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ProgressBar progress={(step + 1) / 3} height={6} />
      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 && (
          <View style={styles.stepGap}>
            <Text style={styles.stepTitle}>Name your recipe</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Recipe name" placeholderTextColor={colors.textFaint} style={styles.input} />
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categoryOptions.map((c) => (
                <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.chip, category === c.id && styles.chipActive]}>
                  <Text style={[styles.chipText, category === c.id && styles.chipTextActive]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Serving size (g)</Text>
            <TextInput value={servingSizeG} onChangeText={setServingSizeG} keyboardType="numeric" style={styles.input} />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepGap}>
            <Text style={styles.stepTitle}>Show how it's made</Text>
            <Pressable style={styles.videoBox} onPress={() => setVideoAttached(true)}>
              <CameraIcon color={colors.primaryBlue} size={28} />
              <Text style={styles.videoText}>{videoAttached ? 'Video attached' : 'Upload a cooking video (max 5 min)'}</Text>
            </Pressable>
            <Text style={styles.fieldLabel}>Ingredients — one per line</Text>
            <TextInput
              value={ingredientsText}
              onChangeText={setIngredientsText}
              placeholder={'200g chicken breast\n150g rice\nbroccoli'}
              placeholderTextColor={colors.textFaint}
              style={[styles.input, styles.multiline]}
              multiline
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepGap}>
            <Text style={styles.stepTitle}>Meeboo did the math</Text>
            <Card style={styles.resultCard}>
              <Text style={styles.resultCalories}>{nutrition.calories} kcal</Text>
              <Text style={styles.resultSub}>per {servingSizeG}g serving</Text>
              <View style={styles.macroGrid}>
                <View style={styles.macroItem}><Text style={styles.macroValue}>{nutrition.proteinG}g</Text><Text style={styles.macroLabel}>Protein</Text></View>
                <View style={styles.macroItem}><Text style={styles.macroValue}>{nutrition.carbsG}g</Text><Text style={styles.macroLabel}>Carbs</Text></View>
                <View style={styles.macroItem}><Text style={styles.macroValue}>{nutrition.fatG}g</Text><Text style={styles.macroLabel}>Fat</Text></View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={step === 2 ? 'Share recipe' : 'Continue'}
          onPress={() => (step === 2 ? finish() : setStep((v) => v + 1))}
          disabled={step === 0 && !name.trim()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, maxWidth: 600, width: '100%', alignSelf: 'center' },
  stepGap: { gap: spacing.md },
  stepTitle: { ...typography.h2, marginBottom: spacing.sm },
  fieldLabel: { ...typography.label, marginTop: spacing.sm },
  input: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, fontSize: 15, fontFamily: fontFamilies.medium, color: colors.textPrimary, ...shadow.card },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surfaceMuted },
  chipActive: { backgroundColor: colors.primaryBlue },
  chipText: { fontFamily: fontFamilies.semiBold, fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: colors.white },
  videoBox: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.lightBlueSurface, borderRadius: radii.md, paddingVertical: spacing.xxl, borderWidth: 1.5, borderColor: colors.primaryBlue, borderStyle: 'dashed' },
  videoText: { fontFamily: fontFamilies.medium, fontSize: 13.5, color: colors.primaryBlue, textAlign: 'center', paddingHorizontal: spacing.xl },
  resultCard: { alignItems: 'center', paddingVertical: spacing.xl },
  resultCalories: { fontFamily: fontFamilies.black, fontSize: 34, color: colors.textPrimary },
  resultSub: { ...typography.bodyMuted, marginTop: 2, marginBottom: spacing.lg },
  macroGrid: { flexDirection: 'row', gap: spacing.xxl },
  macroItem: { alignItems: 'center' },
  macroValue: { fontFamily: fontFamilies.bold, fontSize: 18, color: colors.textPrimary },
  macroLabel: { ...typography.bodyMuted, fontSize: 12 },
  footer: { padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border },
});
