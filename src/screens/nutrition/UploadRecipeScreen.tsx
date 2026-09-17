import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { useNutritionStore } from '../../state/nutritionStore';
import { RecipeCategory } from '../../types';
import { estimateNutritionFromIngredients } from '../../utils/nutritionEstimate';

const categories: { id: RecipeCategory; label: string }[] = [
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
  const [servingSize, setServingSize] = useState('300');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [ingredientsText, setIngredientsText] = useState('');

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      videoMaxDuration: 300,
    });
    if (!result.canceled) setVideoUri(result.assets[0].uri);
  };

  const finish = () => {
    const ingredients = ingredientsText.split('\n').map((s) => s.trim()).filter(Boolean);
    const serving = parseInt(servingSize, 10) || 300;
    const nutrition = estimateNutritionFromIngredients(ingredients, serving);
    addUserRecipe({
      id: `user_${Date.now()}`,
      name: name.trim() || 'My recipe',
      category,
      servingSizeG: serving,
      ingredients,
      uploadedBy: 'You',
      isUserUploaded: true,
      prepTimeMin: 15,
      difficulty: 'easy',
      ...nutrition,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <ProgressBar progress={(step + 1) / 3} />
        <Text style={styles.stepLabel}>Step {step + 1} of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {step === 0 && (
          <>
            <Text style={styles.question}>Name your recipe</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Recipe name" placeholderTextColor={colors.textMuted} style={styles.input} />
            <Text style={styles.subLabel}>Category</Text>
            <View style={styles.optionRow}>
              {categories.map((c) => (
                <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.option, category === c.id && styles.optionSelected]}>
                  <Text style={[styles.optionText, category === c.id && styles.optionTextSelected]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.subLabel}>Serving size (grams)</Text>
            <TextInput value={servingSize} onChangeText={setServingSize} keyboardType="number-pad" style={styles.input} />
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.question}>Upload a cooking video</Text>
            <Text style={styles.hint}>Maximum 5 minutes.</Text>
            <Pressable style={styles.videoPicker} onPress={pickVideo}>
              <Text style={styles.videoPickerText}>{videoUri ? 'Video selected ✓' : 'Choose video'}</Text>
            </Pressable>
            <Text style={styles.subLabel}>Ingredients — one per line</Text>
            <TextInput
              value={ingredientsText}
              onChangeText={setIngredientsText}
              multiline
              numberOfLines={6}
              placeholder={'200g chicken breast\n150g rice\nbroccoli'}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.multiline]}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.question}>Ready to share</Text>
            <Text style={styles.hint}>
              Meeboo calculates the full nutrition breakdown from your ingredient list automatically — you don't need to count anything.
            </Text>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Back" onPress={() => setStep(step - 1)} variant="ghost" style={{ flex: 0.4 }} />}
        <Button
          title={step === 2 ? 'Share recipe' : 'Next'}
          onPress={() => (step === 2 ? finish() : setStep(step + 1))}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { paddingTop: 24, paddingHorizontal: spacing.xl, gap: spacing.sm },
  stepLabel: { ...typography.label },
  body: { padding: spacing.xl, gap: spacing.md },
  question: { ...typography.h2 },
  hint: { ...typography.bodyMuted },
  subLabel: { ...typography.label, marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 14,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: 16, color: colors.deepNavy,
  },
  multiline: { height: 120, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  optionSelected: { borderColor: colors.primaryBlue, backgroundColor: colors.lightBlueSurface },
  optionText: { ...typography.body, fontFamily: fontFamilies.semiBold, fontSize: 14 },
  optionTextSelected: { color: colors.primaryBlue },
  videoPicker: {
    height: 140, borderRadius: 16, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  videoPickerText: { color: colors.primaryBlue, fontFamily: fontFamilies.semiBold },
  footer: { flexDirection: 'row', gap: spacing.md, padding: spacing.xl },
});
