import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserState {
  profile: UserProfile | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  reset: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  units: 'metric',
  sex: 'male',
  age: 25,
  heightCm: 175,
  weightKg: 75,
  goal: 'build_muscle',
  trainingType: 'gym',
  trainingDaysPerWeek: 4,
  biggestChallenge: 'consistency',
  bmi: 0,
  bodyStageIndex: 3,
  onboardingComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((state) => ({ profile: state.profile ? { ...state.profile, ...patch } : { ...defaultProfile, ...patch } })),
      reset: () => set({ profile: null }),
    }),
    {
      name: 'meeboo-user-profile',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export { defaultProfile };
