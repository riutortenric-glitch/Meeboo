import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BodyTypeCarousel } from '../../components/BodyTypeCarousel';
import { Button } from '../../components/Button';
import { GaugeDial } from '../../components/GaugeDial';
import { ChevronLeftIcon, HomeIcon, MountainIcon, SparkleIcon, TrainIcon } from '../../components/icons';
import { MetricDial } from '../../components/MetricDial';
import { ProgressBar } from '../../components/ProgressBar';
import { GradientScreen } from '../../components/GradientScreen';
import { MeebooBlob } from '../../illustrations/MeebooBlob';
import { bodyStageLabels } from '../../illustrations/meebooGeometry';
import { useUserStore } from '../../state/userStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';
import { Challenge, Goal, Sex, TrainingType, UnitSystem } from '../../types';
import { bmiCategoryLabel, calculateBmi, usesMuscleScale } from '../../utils/bodyType';

interface Draft {
  name: string;
  sex: Sex;
  units: UnitSystem;
  goal: Goal | null;
  age: number;
  heightCm: number;
  weightKg: number;
  currentBodyIndex: number;
  goalBodyIndex: number;
  trainingDaysPerWeek: number;
  trainingType: TrainingType | null;
  biggestChallenge: Challenge | null;
}

const initialDraft: Draft = {
  name: '',
  sex: 'male',
  units: 'metric',
  goal: null,
  age: 25,
  heightCm: 175,
  weightKg: 75,
  currentBodyIndex: 3,
  goalBodyIndex: 6,
  trainingDaysPerWeek: 3,
  trainingType: null,
  biggestChallenge: null,
};

const TOTAL_STEPS = 9;

function OptionCard({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[s.option, selected && s.optionSelected]} onPress={onPress}>
      <View style={[s.radio, selected && s.radioSelected]}>{selected && <View style={s.radioDot} />}</View>
      <Text style={[s.optionLabel, selected && s.optionLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function OnboardingScreen() {
  const setProfile = useUserStore((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);

  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  const bmi = useMemo(() => calculateBmi(draft.heightCm, draft.weightKg), [draft.heightCm, draft.weightKg]);
  const track = draft.goal ? (usesMuscleScale(draft.goal) ? 'muscle' : 'fat') : 'muscle';
  const tint = draft.sex === 'female' ? 'pink' : 'blue';

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return draft.name.trim().length > 0;
      case 3:
        return !!draft.goal;
      case 7:
        return !!draft.trainingType;
      case 8:
        return !!draft.biggestChallenge;
      default:
        return true;
    }
  }, [step, draft]);

  const finish = () => {
    if (!draft.goal || !draft.trainingType || !draft.biggestChallenge) return;
    const computedBmi = calculateBmi(draft.heightCm, draft.weightKg);
    setProfile({
      name: draft.name.trim(),
      sex: draft.sex,
      units: draft.units,
      age: draft.age,
      heightCm: draft.heightCm,
      weightKg: draft.weightKg,
      goal: draft.goal,
      trainingType: draft.trainingType,
      trainingDaysPerWeek: draft.trainingDaysPerWeek,
      biggestChallenge: draft.biggestChallenge,
      bmi: computedBmi,
      bodyStageIndex: draft.currentBodyIndex,
      goalBodyStageIndex: draft.goalBodyIndex,
      onboardingComplete: true,
    });
  };

  const next = () => (step === TOTAL_STEPS - 1 ? finish() : setStep((v) => v + 1));

  return (
    <GradientScreen>
      <View style={s.topBar}>
        {step > 0 ? (
          <Pressable onPress={() => setStep((v) => v - 1)} style={s.backBtn}>
            <ChevronLeftIcon color={colors.white} size={20} />
          </Pressable>
        ) : (
          <View style={s.backBtn} />
        )}
        <View style={{ flex: 1 }}>
          <ProgressBar progress={(step + 1) / TOTAL_STEPS} height={6} color={colors.white} trackColor="rgba(255,255,255,0.22)" />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View style={s.centerStep}>
            <MeebooBlob size={90} float={false} />
            <Text style={s.question}>Hey, I'm Meeboo.{'\n'}What should I call you?</Text>
            <TextInput
              value={draft.name}
              onChangeText={(v) => patch({ name: v })}
              placeholder="Your name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={s.input}
              autoFocus
            />
          </View>
        )}

        {step === 1 && (
          <View style={s.centerStep}>
            <Text style={s.eyebrow}>Profile Quiz: Step 1</Text>
            <Text style={s.question}>Are you male or female?</Text>
            <View style={s.sexRow}>
              {(['male', 'female'] as Sex[]).map((sx) => (
                <Pressable key={sx} onPress={() => patch({ sex: sx })} style={[s.sexCard, draft.sex === sx && s.sexCardActive]}>
                  <MeebooBlob size={78} float={false} tint={sx === 'female' ? 'pink' : 'blue'} />
                  <Text style={s.sexCardLabel}>{sx === 'male' ? 'MALE' : 'FEMALE'}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={s.centerStep}>
            <Text style={s.question}>Which units do you use?</Text>
            <View style={s.rowGap}>
              {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
                <OptionCard key={u} label={u === 'metric' ? 'Metric (kg / cm)' : 'Imperial (lbs / ft)'} selected={draft.units === u} onPress={() => patch({ units: u })} />
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={s.centerStep}>
            <Text style={s.question}>What's your main goal right now?</Text>
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
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={s.eyebrow}>Profile Quiz: Advanced Setup</Text>
            <Text style={[s.question, { marginBottom: spacing.xl }]}>Tell us your stats — we'll use it for your plans.</Text>
            <View style={{ gap: spacing.xxl }}>
              <MetricDial label="Select your height" value={draft.heightCm} onChange={(v) => patch({ heightCm: v })} min={120} max={220} unit="cm" />
              <MetricDial label="Select your weight" value={draft.weightKg} onChange={(v) => patch({ weightKg: v })} min={35} max={180} unit="kg" />
              <MetricDial label="Select your age" value={draft.age} onChange={(v) => patch({ age: v })} min={12} max={80} unit="yrs" />
            </View>
            <View style={s.bmiCard}>
              <Text style={s.bmiValue}>{bmi.toFixed(1)}</Text>
              <Text style={s.bmiLabel}>BMI · {bmiCategoryLabel(bmi)}</Text>
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={s.centerStep}>
            <Text style={s.question}>What is your current body type?</Text>
            <BodyTypeCarousel track={track} tint={tint} index={draft.currentBodyIndex} onChange={(i) => patch({ currentBodyIndex: i })} labels={bodyStageLabels[track]} />
            <Text style={s.hint}>Swipe with the arrows to choose the image that best represents you.</Text>
          </View>
        )}

        {step === 6 && (
          <View style={s.centerStep}>
            <Text style={s.question}>What would you like your body to look like?</Text>
            <BodyTypeCarousel track={track} tint={tint} index={draft.goalBodyIndex} onChange={(i) => patch({ goalBodyIndex: i })} labels={bodyStageLabels[track]} />
            <Text style={s.hint}>This is your goal — Meeboo will grow toward it as you train.</Text>
          </View>
        )}

        {step === 7 && (
          <View style={s.centerStep}>
            <Text style={s.eyebrow}>Workout Baseline</Text>
            <GaugeDial label="Weekly workouts" value={draft.trainingDaysPerWeek} max={6} onChange={(v) => patch({ trainingDaysPerWeek: v })} />
            <Text style={[s.question, { marginTop: spacing.xxl, marginBottom: spacing.md }]}>Where do you train?</Text>
            <View style={s.locationGrid}>
              {[
                { v: 'home' as TrainingType, label: 'Home', Icon: HomeIcon },
                { v: 'gym' as TrainingType, label: 'Gym', Icon: TrainIcon },
                { v: 'outdoor' as TrainingType, label: 'Outdoors/Sport', Icon: MountainIcon },
                { v: 'none' as TrainingType, label: 'First time', Icon: SparkleIcon },
              ].map(({ v, label, Icon }) => {
                const active = draft.trainingType === v;
                return (
                  <Pressable key={v} onPress={() => patch({ trainingType: v })} style={[s.locationCard, active && s.locationCardActive]}>
                    <Icon color={active ? colors.primaryBlue : colors.white} size={20} />
                    <Text style={[s.locationLabel, active && s.locationLabelActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 8 && (
          <View style={s.centerStep}>
            <Text style={s.question}>What's held you back the most before?</Text>
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
          </View>
        )}
      </ScrollView>

      <View style={s.footer}>
        <Button title={step === TOTAL_STEPS - 1 ? "Let's go" : 'Next'} onPress={next} disabled={!canAdvance} variant="secondary" />
      </View>
    </GradientScreen>
  );
}

const s = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, flexGrow: 1 },
  centerStep: { alignItems: 'center' },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.4, marginBottom: spacing.sm, textTransform: 'uppercase' },
  question: { ...typography.h2, color: colors.white, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 17,
    fontFamily: fontFamilies.medium,
    color: colors.white,
    textAlign: 'center',
  },
  rowGap: { gap: spacing.md, width: '100%' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.22)' },
  optionLabel: { fontFamily: fontFamilies.medium, fontSize: 15.5, color: 'rgba(255,255,255,0.9)' },
  optionLabelSelected: { color: colors.white, fontFamily: fontFamilies.semiBold },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.white },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.white },
  sexRow: { flexDirection: 'row', gap: spacing.lg, width: '100%' },
  sexCard: { flex: 1, alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radii.lg, paddingVertical: spacing.xl, borderWidth: 1.5, borderColor: 'transparent' },
  sexCardActive: { borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.2)' },
  sexCardLabel: { fontFamily: fontFamilies.bold, fontSize: 13, color: colors.white, letterSpacing: 0.5 },
  bmiCard: { alignItems: 'center', backgroundColor: 'rgba(6,20,40,0.4)', borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.xxl },
  bmiValue: { fontFamily: fontFamilies.bold, fontSize: 26, color: colors.white },
  bmiLabel: { fontFamily: fontFamilies.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  hint: { fontFamily: fontFamilies.regular, fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  locationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, width: '100%' },
  locationCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  locationCardActive: { backgroundColor: colors.white, borderColor: colors.white },
  locationLabel: { fontFamily: fontFamilies.semiBold, fontSize: 13.5, color: colors.white },
  locationLabelActive: { color: colors.primaryBlue },
  footer: { padding: spacing.xl },
});
