import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { useUserStore } from '../../state/userStore';
import { Challenge, Goal, Sex, TrainingType, UnitSystem } from '../../types';
import { bmiCategoryLabel, calculateBmi, calculateStartingBodyStage } from '../../utils/bodyType';

const TOTAL_STEPS = 8;

function OptionButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.option, selected && styles.optionSelected]}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <View style={styles.stepperRow}>
      <Pressable style={styles.stepperBtn} onPress={() => onChange(Math.max(min, value - 1))}>
        <Text style={styles.stepperBtnText}>-</Text>
      </Pressable>
      <Text style={styles.stepperValue}>{value}{suffix ?? ''}</Text>
      <Pressable style={styles.stepperBtn} onPress={() => onChange(Math.min(max, value + 1))}>
        <Text style={styles.stepperBtnText}>+</Text>
      </Pressable>
    </View>
  );
}

export function OnboardingScreen() {
  const updateProfile = useUserStore((s) => s.updateProfile);
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState(22);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [goal, setGoal] = useState<Goal>('build_muscle');
  const [trainingType, setTrainingType] = useState<TrainingType>('gym');
  const [trainingDays, setTrainingDays] = useState(4);
  const [challenge, setChallenge] = useState<Challenge>('consistency');

  const heightDisplay = units === 'metric' ? `${heightCm} cm` : `${Math.round(heightCm / 2.54)} in`;
  const weightDisplay = units === 'metric' ? `${weightKg} kg` : `${Math.round(weightKg * 2.20462)} lb`;

  const bmi = useMemo(() => calculateBmi(heightCm, weightKg), [heightCm, weightKg]);

  const finishOnboarding = () => {
    const startingStage = calculateStartingBodyStage(bmi, goal);
    updateProfile({
      name: name.trim() || 'there',
      units,
      sex,
      age,
      heightCm,
      weightKg,
      goal,
      trainingType,
      trainingDaysPerWeek: trainingDays,
      biggestChallenge: challenge,
      bmi,
      bodyStageIndex: startingStage,
      onboardingComplete: true,
    });
  };

  const next = () => (step < TOTAL_STEPS - 1 ? setStep(step + 1) : finishOnboarding());
  const back = () => step > 0 && setStep(step - 1);

  const canAdvance = () => {
    if (step === 0) return name.trim().length > 0;
    return true;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <ProgressBar progress={(step + 1) / TOTAL_STEPS} />
        <Text style={styles.stepLabel}>Step {step + 1} of {TOTAL_STEPS}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.meebooRow}>
          <MeebooCharacter size={72} flameLevel="medium" float={false} />
        </View>

        {step === 0 && (
          <>
            <Text style={styles.question}>What should I call you?</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
            />
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.question}>Which units do you use?</Text>
            <View style={styles.optionRow}>
              <OptionButton label="Metric (kg / cm)" selected={units === 'metric'} onPress={() => setUnits('metric')} />
              <OptionButton label="Imperial (lb / ft)" selected={units === 'imperial'} onPress={() => setUnits('imperial')} />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.question}>Sex and age</Text>
            <View style={styles.optionRow}>
              <OptionButton label="Male" selected={sex === 'male'} onPress={() => setSex('male')} />
              <OptionButton label="Female" selected={sex === 'female'} onPress={() => setSex('female')} />
              <OptionButton label="Other" selected={sex === 'other'} onPress={() => setSex('other')} />
            </View>
            <Text style={styles.subLabel}>Age</Text>
            <Stepper value={age} onChange={setAge} min={12} max={80} />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.question}>Height and weight</Text>
            <Text style={styles.subLabel}>Height — {heightDisplay}</Text>
            <Stepper value={heightCm} onChange={setHeightCm} min={120} max={220} suffix=" cm" />
            <Text style={styles.subLabel}>Weight — {weightDisplay}</Text>
            <Stepper value={weightKg} onChange={setWeightKg} min={35} max={180} suffix=" kg" />
            {bmi > 0 && (
              <View style={styles.bmiCard}>
                <Text style={styles.bmiText}>BMI {bmi.toFixed(1)} — {bmiCategoryLabel(bmi)}</Text>
              </View>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.question}>What's your goal?</Text>
            <View style={styles.optionColumn}>
              <OptionButton label="Lose fat" selected={goal === 'lose_fat'} onPress={() => setGoal('lose_fat')} />
              <OptionButton label="Build muscle" selected={goal === 'build_muscle'} onPress={() => setGoal('build_muscle')} />
              <OptionButton label="Both" selected={goal === 'both'} onPress={() => setGoal('both')} />
              <OptionButton label="Just be healthier" selected={goal === 'be_healthier'} onPress={() => setGoal('be_healthier')} />
            </View>
          </>
        )}

        {step === 5 && (
          <>
            <Text style={styles.question}>How do you train?</Text>
            <View style={styles.optionColumn}>
              <OptionButton label="Full gym" selected={trainingType === 'gym'} onPress={() => setTrainingType('gym')} />
              <OptionButton label="Home with equipment" selected={trainingType === 'home'} onPress={() => setTrainingType('home')} />
              <OptionButton label="No equipment" selected={trainingType === 'none'} onPress={() => setTrainingType('none')} />
              <OptionButton label="Outdoor sports" selected={trainingType === 'outdoor'} onPress={() => setTrainingType('outdoor')} />
              <OptionButton label="Mix" selected={trainingType === 'mix'} onPress={() => setTrainingType('mix')} />
            </View>
          </>
        )}

        {step === 6 && (
          <>
            <Text style={styles.question}>Training days per week</Text>
            <View style={styles.optionRow}>
              {[2, 3, 4, 5, 6].map((d) => (
                <OptionButton key={d} label={String(d)} selected={trainingDays === d} onPress={() => setTrainingDays(d)} />
              ))}
            </View>
          </>
        )}

        {step === 7 && (
          <>
            <Text style={styles.question}>What's been your biggest challenge?</Text>
            <View style={styles.optionColumn}>
              <OptionButton label="Staying consistent" selected={challenge === 'consistency'} onPress={() => setChallenge('consistency')} />
              <OptionButton label="Not seeing results" selected={challenge === 'results'} onPress={() => setChallenge('results')} />
              <OptionButton label="Motivation" selected={challenge === 'motivation'} onPress={() => setChallenge('motivation')} />
              <OptionButton label="Not knowing what to do" selected={challenge === 'no_plan'} onPress={() => setChallenge('no_plan')} />
              <OptionButton label="Eating well" selected={challenge === 'nutrition'} onPress={() => setChallenge('nutrition')} />
              <OptionButton label="Finding time" selected={challenge === 'time'} onPress={() => setChallenge('time')} />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Back" onPress={back} variant="ghost" style={styles.backBtn} />}
        <Button
          title={step === TOTAL_STEPS - 1 ? "Let's go" : 'Next'}
          onPress={next}
          disabled={!canAdvance()}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { paddingTop: 56, paddingHorizontal: spacing.xl, gap: spacing.sm },
  stepLabel: { ...typography.label },
  body: { padding: spacing.xl, gap: spacing.md },
  meebooRow: { alignItems: 'center', marginBottom: spacing.sm },
  question: { ...typography.h2, marginBottom: spacing.md },
  subLabel: { ...typography.label, marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 18,
    color: colors.deepNavy,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  optionColumn: { gap: spacing.sm },
  option: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: { borderColor: colors.primaryBlue, backgroundColor: colors.lightBlueSurface },
  optionText: { ...typography.body, fontFamily: fontFamilies.semiBold },
  optionTextSelected: { color: colors.primaryBlue },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepperBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lightBlueSurface,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnText: { fontSize: 22, fontFamily: fontFamilies.bold, color: colors.primaryBlue },
  stepperValue: { ...typography.h3, minWidth: 90, textAlign: 'center' },
  bmiCard: { backgroundColor: colors.lightBlueSurface, borderRadius: 14, padding: spacing.md, marginTop: spacing.lg },
  bmiText: { ...typography.body, fontFamily: fontFamilies.semiBold, textAlign: 'center' },
  footer: { flexDirection: 'row', gap: spacing.md, padding: spacing.xl, paddingBottom: spacing.xl },
  backBtn: { flex: 0.4 },
  nextBtn: { flex: 1 },
});
