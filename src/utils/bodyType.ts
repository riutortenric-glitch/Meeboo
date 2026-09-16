import { Goal, Sex } from '../types';

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

/**
 * Maps BMI + goal to a starting index (0-9) on the appropriate 10-stage
 * Meeboo body scale, per the "BMI to Body Type Calculation" table in the spec.
 * Muscle scale (goal = build_muscle / both) runs lean(0) -> defined(9).
 * Fat scale (goal = lose_fat / be_healthier) runs lean(0) -> heaviest(9).
 */
export function calculateStartingBodyStage(bmi: number, goal: Goal): number {
  const usesMuscleScale = goal === 'build_muscle' || goal === 'both';

  if (bmi < 18.5) return usesMuscleScale ? 0 : 0;
  if (bmi < 22) return usesMuscleScale ? 1 : 1;
  if (bmi < 25) return usesMuscleScale ? 3 : 3;
  if (bmi < 30) return usesMuscleScale ? 5 : 6;
  return usesMuscleScale ? 7 : 9;
}

export function bmiCategoryLabel(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 22) return 'Lean';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function usesMuscleScale(goal: Goal): boolean {
  return goal === 'build_muscle' || goal === 'both';
}

export function sexLabel(sex: Sex): string {
  return sex === 'male' ? 'Male' : sex === 'female' ? 'Female' : 'Other';
}
