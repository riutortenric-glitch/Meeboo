import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { exerciseById } from '../data/exercises';
import { CompletedSet, MuscleGroup, WorkoutSession } from '../types';

interface WorkoutState {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  startSession: (templateId: string) => void;
  logSet: (exerciseId: string, reps: number, weightKg?: number) => void;
  completeSession: (mood?: WorkoutSession['mood']) => void;
  discardSession: () => void;
  setsForMuscleGroup: (muscleGroup: MuscleGroup) => number;
  totalCompletedSessions: () => number;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,

      startSession: (templateId) =>
        set({
          activeSession: {
            id: `session_${Date.now()}`,
            templateId,
            startedAt: new Date().toISOString(),
            completedSets: [],
          },
        }),

      logSet: (exerciseId, reps, weightKg) =>
        set((state) => {
          if (!state.activeSession) return state;
          const newSet: CompletedSet = { exerciseId, reps, weightKg, completedAt: new Date().toISOString() };
          return {
            activeSession: {
              ...state.activeSession,
              completedSets: [...state.activeSession.completedSets, newSet],
            },
          };
        }),

      completeSession: (mood) =>
        set((state) => {
          if (!state.activeSession) return state;
          const finished: WorkoutSession = {
            ...state.activeSession,
            completedAt: new Date().toISOString(),
            mood,
          };
          return { sessions: [...state.sessions, finished], activeSession: null };
        }),

      discardSession: () => set({ activeSession: null }),

      setsForMuscleGroup: (muscleGroup) => {
        const { sessions } = get();
        let count = 0;
        for (const session of sessions) {
          for (const s of session.completedSets) {
            const exercise = exerciseById(s.exerciseId);
            if (exercise?.muscleGroup === muscleGroup) count += 1;
          }
        }
        return count;
      },

      totalCompletedSessions: () => get().sessions.length,
    }),
    {
      name: 'meeboo-workouts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
