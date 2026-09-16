import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { LoggedMeal, Recipe } from '../types';

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

interface NutritionState {
  mealsByDay: Record<string, LoggedMeal[]>;
  waterGlassesByDay: Record<string, number>;
  userRecipes: Recipe[];
  calorieGoal: number;
  proteinGoalG: number;
  carbsGoalG: number;
  fatGoalG: number;
  logMeal: (meal: Omit<LoggedMeal, 'id' | 'loggedAt'>) => void;
  logWaterGlass: () => void;
  addUserRecipe: (recipe: Recipe) => void;
  todaysMeals: () => LoggedMeal[];
  todaysWaterGlasses: () => number;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      mealsByDay: {},
      waterGlassesByDay: {},
      userRecipes: [],
      calorieGoal: 2400,
      proteinGoalG: 160,
      carbsGoalG: 260,
      fatGoalG: 75,

      logMeal: (meal) =>
        set((state) => {
          const key = todayKey();
          const newMeal: LoggedMeal = { ...meal, id: `meal_${Date.now()}`, loggedAt: new Date().toISOString() };
          const existing = state.mealsByDay[key] ?? [];
          return { mealsByDay: { ...state.mealsByDay, [key]: [...existing, newMeal] } };
        }),

      logWaterGlass: () =>
        set((state) => {
          const key = todayKey();
          const current = state.waterGlassesByDay[key] ?? 0;
          return { waterGlassesByDay: { ...state.waterGlassesByDay, [key]: Math.min(8, current + 1) } };
        }),

      addUserRecipe: (recipe) => set((state) => ({ userRecipes: [recipe, ...state.userRecipes] })),

      todaysMeals: () => get().mealsByDay[todayKey()] ?? [],
      todaysWaterGlasses: () => get().waterGlassesByDay[todayKey()] ?? 0,
    }),
    {
      name: 'meeboo-nutrition',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
