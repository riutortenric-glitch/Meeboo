import { FlameLevel } from '../components/MeebooFlame';
import { WorkoutSession } from '../types';

/**
 * Large flame = active in the last 2 days, medium = 3-4 days quiet,
 * small = 5+ days quiet, per the spec's flame states.
 */
export function computeFlameLevel(sessions: WorkoutSession[]): FlameLevel {
  const completed = sessions.filter((s) => s.completedAt);
  if (completed.length === 0) return 'small';
  const lastDate = new Date(completed[completed.length - 1].completedAt!);
  const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 2) return 'large';
  if (daysSince <= 4) return 'medium';
  return 'small';
}

export function daysSinceLastWorkout(sessions: WorkoutSession[]): number | null {
  const completed = sessions.filter((s) => s.completedAt);
  if (completed.length === 0) return null;
  const lastDate = new Date(completed[completed.length - 1].completedAt!);
  return Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
}
