import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNutritionStore } from '../../state/nutritionStore';
import { estimateNutritionFromPhoto } from '../../utils/nutritionEstimate';

interface Estimate {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  emoji: string;
}

export function LogMealScreen() {
  const navigation = useNavigation<any>();
  const logMeal = useNutritionStore((s) => s.logMeal);
  const todaysMeals = useNutritionStore((s) => s.todaysMeals());
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const repeatCandidates = useMemo(() => {
    const seen = new Map<string, number>();
    for (const m of todaysMeals) seen.set(m.name, (seen.get(m.name) ?? 0) + 1);
    return [...seen.entries()].filter(([, count]) => count >= 1).map(([name]) => name).slice(0, 3);
  }, [todaysMeals]);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    setEstimate(estimateNutritionFromPhoto(uri));
  };

  const confirmLog = () => {
    if (!estimate) return;
    logMeal(estimate);
    navigation.goBack();
  };

  const logRepeat = (name: string) => {
    const meal = todaysMeals.find((m) => m.name === name);
    if (!meal) return;
    logMeal(meal);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Log a meal</Text>

      {!estimate ? (
        <>
          <Pressable style={styles.cameraBtn} onPress={takePhoto}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.cameraLabel}>Snap a photo</Text>
            <Text style={styles.cameraHint}>Meeboo estimates calories and macros automatically</Text>
          </Pressable>

          {repeatCandidates.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Log again</Text>
              {repeatCandidates.map((name) => (
                <Pressable key={name} style={styles.repeatRow} onPress={() => logRepeat(name)}>
                  <Text style={styles.repeatName}>{name}</Text>
                  <Text style={styles.repeatAction}>1 tap</Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      ) : (
        <Card style={styles.resultCard}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.resultPhoto} /> : null}
          <Text style={styles.resultEmoji}>{estimate.emoji}</Text>
          <Text style={styles.resultName}>{estimate.name}</Text>
          <Text style={styles.resultCalories}>{estimate.calories} kcal</Text>
          <View style={styles.macroRow}>
            <Text style={styles.macroText}>P {estimate.proteinG}g</Text>
            <Text style={styles.macroText}>C {estimate.carbsG}g</Text>
            <Text style={styles.macroText}>F {estimate.fatG}g</Text>
          </View>
          <View style={styles.resultActions}>
            <Button title="Retake" onPress={() => { setEstimate(null); setPhotoUri(null); }} variant="secondary" style={{ flex: 1 }} />
            <Button title="Confirm" onPress={confirmLog} style={{ flex: 1 }} />
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white, padding: spacing.xl, paddingTop: 24, gap: spacing.lg },
  title: { ...typography.h2 },
  cameraBtn: {
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 20,
    paddingVertical: spacing.xxl, alignItems: 'center', gap: spacing.xs,
  },
  cameraIcon: { fontSize: 40 },
  cameraLabel: { ...typography.h3 },
  cameraHint: { ...typography.bodyMuted, textAlign: 'center' },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  repeatRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.lightBlueSurface, borderRadius: 14, padding: spacing.md, marginBottom: spacing.sm,
  },
  repeatName: { ...typography.body, fontWeight: '600' },
  repeatAction: { color: colors.primaryBlue, fontWeight: '700', fontSize: 12 },
  resultCard: { alignItems: 'center', gap: spacing.xs },
  resultPhoto: { width: '100%', height: 160, borderRadius: 16, marginBottom: spacing.sm },
  resultEmoji: { fontSize: 40 },
  resultName: { ...typography.h3 },
  resultCalories: { ...typography.h2, color: colors.primaryBlue },
  macroRow: { flexDirection: 'row', gap: spacing.lg, marginVertical: spacing.sm },
  macroText: { ...typography.bodyMuted, fontWeight: '600' },
  resultActions: { flexDirection: 'row', gap: spacing.md, width: '100%', marginTop: spacing.md },
});
