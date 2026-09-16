export type UnitSystem = 'metric' | 'imperial';
export type Sex = 'male' | 'female' | 'other';
export type Goal = 'lose_fat' | 'build_muscle' | 'both' | 'be_healthier';
export type TrainingType = 'gym' | 'home' | 'none' | 'outdoor' | 'mix';
export type Challenge =
  | 'consistency'
  | 'results'
  | 'motivation'
  | 'no_plan'
  | 'nutrition'
  | 'time';

export interface UserProfile {
  name: string;
  units: UnitSystem;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  trainingType: TrainingType;
  trainingDaysPerWeek: number;
  biggestChallenge: Challenge;
  bmi: number;
  bodyStageIndex: number; // 0-9 index into the 10-stage scale for the user's goal
  onboardingComplete: boolean;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'arms'
  | 'core'
  | 'shoulders'
  | 'legs'
  | 'glutes'
  | 'cardio';

export type BadgeTierName = 'stone' | 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  defaultSets: number;
  defaultReps: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exerciseIds: string[];
}

export interface CompletedSet {
  exerciseId: string;
  reps: number;
  weightKg?: number;
  completedAt: string;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  startedAt: string;
  completedAt?: string;
  completedSets: CompletedSet[];
  mood?: 'great' | 'good' | 'ok' | 'tough';
}

export type RecipeCategory = 'high_protein' | 'high_calorie' | 'low_calorie';

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMin: number;
  difficulty: 'easy' | 'medium' | 'hard';
  uploadedBy: string;
  servingSizeG: number;
  ingredients: string[];
  isUserUploaded?: boolean;
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
  emoji: string;
}
