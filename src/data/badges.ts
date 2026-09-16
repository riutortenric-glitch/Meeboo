import { BadgeTierName, MuscleGroup } from '../types';

export const muscleGroups: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'legs', label: 'Legs' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'cardio', label: 'Cardio' },
];

export interface TierDefinition {
  tier: BadgeTierName;
  label: string;
  minSets: number;
  realWorldEquivalent: string;
}

export const badgeTiers: TierDefinition[] = [
  { tier: 'stone', label: 'Stone', minSets: 0, realWorldEquivalent: 'Complete beginner. Just started.' },
  { tier: 'bronze', label: 'Bronze', minSets: 25, realWorldEquivalent: 'Roughly 2-3 months of once-weekly training.' },
  { tier: 'silver', label: 'Silver', minSets: 100, realWorldEquivalent: 'Roughly 6 months of consistent training.' },
  { tier: 'gold', label: 'Gold', minSets: 250, realWorldEquivalent: 'Roughly 1 year of training.' },
  { tier: 'emerald', label: 'Emerald', minSets: 500, realWorldEquivalent: 'Roughly 2 years of serious training.' },
  { tier: 'diamond', label: 'Diamond', minSets: 1000, realWorldEquivalent: 'Elite level. Multi-year dedicated athlete.' },
];

export function tierForSets(sets: number): TierDefinition {
  let current = badgeTiers[0];
  for (const t of badgeTiers) {
    if (sets >= t.minSets) current = t;
  }
  return current;
}

export function nextTierForSets(sets: number): TierDefinition | null {
  const idx = badgeTiers.findIndex((t) => t.tier === tierForSets(sets).tier);
  return badgeTiers[idx + 1] ?? null;
}
