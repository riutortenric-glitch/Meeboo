import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CameraIcon } from '../../components/icons';
import { useNutritionStore } from '../../state/nutritionStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { estimateNutritionFromPhoto } from '../../utils/nutritionEstimate';

export function LogMealScreen() {
  const navigation = useNavigation<any>();
  const logMeal = useNutritionStore((s) => s.logMeal);
  const [result, setResult] = useState<ReturnType<typeof estimateNutritionFromPhoto> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const snap = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(estimateNutritionFromPhoto('mock'));
      setAnalyzing(false);
    }, 900);
  };

  const confirm = () => {
    if (!result) return;
    logMeal(result);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      {!result ? (
        <Pressable style={[styles.captureArea, analyzing && { opacity: 0.6 }]} onPress={snap} disabled={analyzing}>
          <CameraIcon color={colors.primaryBlue} size={40} />
          <Text style={styles.captureText}>{analyzing ? 'Meeboo is looking…' : 'Tap to snap your meal'}</Text>
        </Pressable>
      ) : (
        <View style={styles.resultWrap}>
          <Text style={styles.emoji}>{result.emoji}</Text>
          <Text style={styles.mealName}>{result.name}</Text>
          <Card style={styles.macroCard}>
            <Text style={styles.calories}>{result.calories} kcal</Text>
            <View style={styles.macroRow}>
              <View style={styles.macroItem}><Text style={styles.macroValue}>{result.proteinG}g</Text><Text style={styles.macroLabel}>Protein</Text></View>
              <View style={styles.macroItem}><Text style={styles.macroValue}>{result.carbsG}g</Text><Text style={styles.macroLabel}>Carbs</Text></View>
              <View style={styles.macroItem}><Text style={styles.macroValue}>{result.fatG}g</Text><Text style={styles.macroLabel}>Fat</Text></View>
            </View>
          </Card>
        </View>
      )}

      <View style={styles.footer}>
        {result ? (
          <Button title="Log this meal" onPress={confirm} />
        ) : (
          <Text style={styles.hint}>Meeboo estimates calories and macros from the photo — no typing needed.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'space-between' },
  captureArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.lightBlueSurface,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    borderStyle: 'dashed',
    marginVertical: spacing.xl,
  },
  captureText: { fontFamily: fontFamilies.medium, fontSize: 15, color: colors.primaryBlue },
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emoji: { fontSize: 56 },
  mealName: { ...typography.h2 },
  macroCard: { alignItems: 'center', marginTop: spacing.lg, paddingVertical: spacing.xl, width: '100%' },
  calories: { fontFamily: fontFamilies.black, fontSize: 30, color: colors.textPrimary, marginBottom: spacing.lg },
  macroRow: { flexDirection: 'row', gap: spacing.xxl },
  macroItem: { alignItems: 'center' },
  macroValue: { fontFamily: fontFamilies.bold, fontSize: 18, color: colors.textPrimary },
  macroLabel: { ...typography.bodyMuted, fontSize: 12 },
  footer: { paddingTop: spacing.md },
  hint: { ...typography.bodyMuted, textAlign: 'center' },
});
