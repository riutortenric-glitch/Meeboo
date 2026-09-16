import { daysSinceLastWorkout } from './flame';
import { WorkoutSession } from '../types';

export function homeGreeting(name: string, sessions: WorkoutSession[]): string {
  const days = daysSinceLastWorkout(sessions);
  if (days === null) return `Hey ${name || 'there'}. I'm Meeboo. Let's start your streak today.`;
  if (days === 0) return `Nice work today, ${name}. Already showing up beats almost everyone.`;
  if (days === 1) return `Good to see you, ${name}. Yesterday counted. Let's stack another.`;
  if (days <= 4) return `${days} days. I'm not mad. I'm just... look at me. Look at my flame.`;
  return `You are back. The flame is small but it is still there. Let us rebuild it.`;
}

export function nutritionComment(caloriesConsumed: number, calorieGoal: number, proteinConsumed: number, proteinGoal: number): string {
  const proteinPct = proteinGoal > 0 ? proteinConsumed / proteinGoal : 0;
  if (proteinPct >= 1) return "Protein target hit already. My flame just got a little bigger.";
  if (caloriesConsumed === 0) return "Nothing logged yet today. Snap a photo whenever you eat — two taps, that's it.";
  const remaining = Math.max(0, calorieGoal - caloriesConsumed);
  return `${remaining} kcal left today. ${Math.round(proteinPct * 100)}% of your protein target so far.`;
}

export function workoutCompleteLine(totalSets: number): string {
  if (totalSets >= 20) return "You absolute machine. That was a serious session.";
  if (totalSets >= 12) return "Solid work in there. Your flame just grew.";
  return "Logged. Every set counts, even the short sessions.";
}
