import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { ChevronLeftIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { MeebooHead } from '../../illustrations/MeebooFigure';
import { useUserStore } from '../../state/userStore';
import { colors } from '../../theme/colors';
import { radii, shadow, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { Challenge, Goal, Sex, TrainingType, UnitSystem } from '../../types';
import { bmiCategoryLabel, calculateBmi, calculateStartingBodyStage } from '../../utils/bodyType';

interface Draft {
  name: string;
  units: UnitSystem;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal | null;
  trainingType: TrainingType | null;
  trainingDaysPerWeek: number | null;
  biggestChallenge: Challenge | null;
}

const initialDraft: Draft = {
  name: '',
  units: 'metric',
  sex: 'male',
  age: 25,
  heightCm: 175,
  weightKg: 75,
  goal: null,
  trainingType: null,
  trainingDaysPerWeek: null,
  biggestChallenge: null,
};

const TOTAL_STEPS = 8;

function Stepper({ value, onChange, step = 1, suffix = '' }: { value: number; onChange: (v: number) => void; step?: number; suffix?: string }) {
  return (
    <View style={s.stepperRow}>
      <Pressable style={s.stepperBtn} onPress={() => onChange(Math.round((value - step) * 10) / 10)}>
        <Text style={s.stepperBtnText}>–</Text>
      </Pressable>
      <Text style={s.stepperValue}>
        {value}
        <Text style={s.stepperSuffix}>{suffix}</Text>
      </Text>
      <Pressable style={s.stepperBtn} onPress={() => onChange(Math.round((value + step) * 10) / 10)}>
        <Text style={s.stepperBtnText}>+</Text>
      </Pressable>
    </View>
  );
}

function OptionCard({ label, sublabel, selected, onPress }: { label: string; sublabel?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[s.option, selected && s.optionSelected]} onPress={onPress}>
      <View style={[s.radio, selected && s.radioSelected]}>{selected && <View style={s.radioDot} />}</View>
      <View style={{ flex: 1 }}>
        <Text style={[s.optionLabel, selected && s.optionLabelSelected]}>{label}</Text>
        {sublabel ? <Text style={s.optionSublabel}>{sublabel}</Text> : null}
      </View>
    </Pressable>
  );
}

export function OnboardingScreen() {
  const setProfile = useUserStore((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);

  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  const bmi = useMemo(() => calculateBmi(draft.heightCm, draft.weightKg), [draft.heightCm, draft.weightKg]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return draft.name.trim().length > 0;
      case 4:
        return !!draft.goal;
      case 5:
        return !!draft.trainingType;
      case 6:
        return !!draft.trainingDaysPerWeek;
      case 7:
        return !!draft.biggestChallenge;
      default:
        return true;
    }
  }, [step, draft]);

  const finish = () => {
    if (!draft.goal || !draft.trainingType || !draft.trainingDaysPerWeek || !draft.biggestChallenge) return;
    const computedBmi = calculateBmi(draft.heightCm, draft.weightKg);
    setProfile({
      name: draft.name.trim(),
      units: draft.units,
      sex: draft.sex,
      age: draft.age,
      heightCm: draft.heightCm,
      weightKg: draft.weightKg,
      goal: draft.goal,
      trainingType: draft.trainingType,
      trainingDaysPerWeek: draft.trainingDaysPerWeek,
      biggestChallenge: draft.biggestChallenge,
      bmi: computedBmi,
      bodyStageIndex: calculateStartingBodyStage(computedBmi, draft.goal),
      onboardingComplete: true,
    });
  };

  const next = () => {
    if (step === TOTAL_STEPS - 1) {
      finish();
    } else {
      setStep((v) => v + 1);
    }
  };

  const questions = [
    "Hey, I'm Meeboo. What should I call you?",
    'Which units do you use?',
    "Tell me a bit about you — this shapes your calorie targets.",
    "Now your height and weight — used to set your starting point.",
    "What's your main goal right now?",
    'How do you usually train?',
    'How many days a week can you commit?',
    "What's held you back the most before?",
  ];

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        {step > 0 ? (
          <Pressable onPress={() => setStep((v) => v - 1)} style={s.backBtn}>
            <ChevronLeftIcon color={colors.textMuted} size={20} />
          </Pressable>
        ) : (
          <View style={s.backBtn} />
        )}
        <View style={{ flex: 1 }}>
          <ProgressBar progress={(step + 1) / TOTAL_STEPS} height={6} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.meebooRow}>
          <MeebooHead size={44} />
          <View style={s.bubble}>
            <Text style={s.bubbleText}>{questions[step]}</Text>
          </View>
        </View>

        {step === 0 && (
          <TextInput
            value={draft.name}
            onChangeText={(v) => patch({ name: v })}
            placeholder="Your name"
            placeholderTextColor={colors.textFaint}
            style={s.input}
            autoFocus
          />
        )}

        {step === 1 && (
          <View style={s.rowGap}>
            {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
              <OptionCard key={u} label={u === 'metric' ? 'Metric (kg / cm)' : 'Imperial (lbs / ft)'} selected={draft.units === u} onPress={() => patch({ units: u })} />
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={s.rowGap}>
            <View style={s.sexRow}>
              {(['male', 'female', 'other'] as Sex[]).map((sx) => (
                <Pressable key={sx} onPress={() => patch({ sex: sx })} style={[s.sexPill, draft.sex === sx && s.sexPillActive]}>
                  <Text style={[s.sexPillText, draft.sex === sx && s.sexPillTextActive]}>{sx[0].toUpperCase() + sx.slice(1)}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.fieldLabel}>Age</Text>
            <Stepper value={draft.age} onChange={(v) => patch({ age: Math.max(12, Math.min(80, v)) })} />
          </View>
        )}

        {step === 3 && (
          <View style={s.rowGap}>
            <Text style={s.fieldLabel}>Height (cm)</Text>
            <Stepper value={draft.heightCm} onChange={(v) => patch({ heightCm: Math.max(120, Math.min(220, v)) })} suffix=" cm" />
            <Text style={s.fieldLabel}>Weight (kg)</Text>
            <Stepper value={draft.weightKg} onChange={(v) => patch({ weightKg: Math.max(35, Math.min(200, v)) })} step={0.5} suffix=" kg" />
            <View style={s.bmiCard}>
              <Text style={s.bmiValue}>{bmi.toFixed(1)}</Text>
              <Text style={s.bmiLabel}>BMI · {bmiCategoryLabel(bmi)}</Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={s.rowGap}>
            {[
              { v: 'lose_fat' as Goal, label: 'Lose fat' },
              { v: 'build_muscle' as Goal, label: 'Build muscle' },
              { v: 'both' as Goal, label: 'Both' },
              { v: 'be_healthier' as Goal, label: 'Just be healthier' },
            ].map((o) => (
              <OptionCard key={o.v} label={o.label} selected={draft.goal === o.v} onPress={() => patch({ goal: o.v })} />
            ))}
          </View>
        )}

        {step === 5 && (
          <View style={s.rowGap}>
            {[
              { v: 'gym' as TrainingType, label: 'Full gym' },
              { v: 'home' as TrainingType, label: 'Home with equipment' },
              { v: 'none' as TrainingType, label: 'No equipment' },
              { v: 'outdoor' as TrainingType, label: 'Outdoor sports' },
              { v: 'mix' as TrainingType, label: 'A mix' },
            ].map((o) => (
              <OptionCard key={o.v} label={o.label} selected={draft.trainingType === o.v} onPress={() => patch({ trainingType: o.v })} />
            ))}
          </View>
        )}

        {step === 6 && (
          <View style={s.daysRow}>
            {[2, 3, 4, 5, 6].map((d) => (
              <Pressable key={d} onPress={() => patch({ trainingDaysPerWeek: d })} style={[s.dayCircle, draft.trainingDaysPerWeek === d && s.dayCircleActive]}>
                <Text style={[s.dayCircleText, draft.trainingDaysPerWeek === d && s.dayCircleTextActive]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 7 && (
          <View style={s.rowGap}>
            {[
              { v: 'consistency' as Challenge, label: 'Staying consistent' },
              { v: 'results' as Challenge, label: 'Not seeing results' },
              { v: 'motivation' as Challenge, label: 'Motivation' },
              { v: 'no_plan' as Challenge, label: 'Not knowing what to do' },
              { v: 'nutrition' as Challenge, label: 'Eating well' },
              { v: 'time' as Challenge, label: 'Finding time' },
            ].map((o) => (
              <OptionCard key={o.v} label={o.label} selected={draft.biggestChallenge === o.v} onPress={() => patch({ biggestChallenge: o.v })} />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={s.footer}>
        <Button title={step === TOTAL_STEPS - 1 ? "Let's go" : 'Continue'} onPress={next} disabled={!canAdvance} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  meebooRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  bubble: { flex: 1, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.lg, ...shadow.card },
  bubbleText: { ...typography.h3, fontSize: 17 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 18,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
    ...shadow.card,
  },
  rowGap: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  optionSelected: { borderColor: colors.primaryBlue, backgroundColor: colors.lightBlueSurface },
  optionLabel: { ...typography.bodyMedium },
  optionLabelSelected: { color: colors.primaryBlue },
  optionSublabel: { ...typography.bodyMuted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primaryBlue },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primaryBlue },
  fieldLabel: { ...typography.label, marginTop: spacing.sm },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.lg, ...shadow.card },
  stepperBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lightBlueSurface, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontSize: 22, fontFamily: fontFamilies.bold, color: colors.primaryBlue },
  stepperValue: { ...typography.statNumberLarge, minWidth: 90, textAlign: 'center' },
  stepperSuffix: { fontSize: 16, fontFamily: fontFamilies.medium, color: colors.textMuted },
  bmiCard: { alignItems: 'center', backgroundColor: colors.deepNavy, borderRadius: radii.md, padding: spacing.lg },
  bmiValue: { fontSize: 28, fontFamily: fontFamilies.bold, color: colors.white },
  bmiLabel: { fontSize: 13, fontFamily: fontFamilies.medium, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  sexRow: { flexDirection: 'row', gap: spacing.sm },
  sexPill: { flex: 1, paddingVertical: spacing.md, borderRadius: radii.pill, backgroundColor: colors.surface, alignItems: 'center', ...shadow.card },
  sexPillActive: { backgroundColor: colors.primaryBlue },
  sexPillText: { ...typography.bodyMedium },
  sexPillTextActive: { color: colors.white },
  daysRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
  dayCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  dayCircleActive: { backgroundColor: colors.primaryBlue },
  dayCircleText: { fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textPrimary },
  dayCircleTextActive: { color: colors.white },
  footer: { padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
});
