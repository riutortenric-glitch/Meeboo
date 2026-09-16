import { Exercise, WorkoutTemplate } from '../types';

export const exercises: Exercise[] = [
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'chest', defaultSets: 4, defaultReps: 8 },
  { id: 'push_up', name: 'Push Up', muscleGroup: 'chest', defaultSets: 3, defaultReps: 12 },
  { id: 'cable_fly', name: 'Cable Fly', muscleGroup: 'chest', defaultSets: 3, defaultReps: 12 },
  { id: 'chest_dip', name: 'Chest Dip', muscleGroup: 'chest', defaultSets: 3, defaultReps: 10 },

  { id: 'pull_up', name: 'Pull Up', muscleGroup: 'back', defaultSets: 4, defaultReps: 8 },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'back', defaultSets: 3, defaultReps: 10 },
  { id: 'seated_row', name: 'Seated Row', muscleGroup: 'back', defaultSets: 3, defaultReps: 10 },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', defaultSets: 4, defaultReps: 6 },

  { id: 'bicep_curl', name: 'Bicep Curl', muscleGroup: 'arms', defaultSets: 3, defaultReps: 12 },
  { id: 'tricep_dip', name: 'Tricep Dip', muscleGroup: 'arms', defaultSets: 3, defaultReps: 12 },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'arms', defaultSets: 3, defaultReps: 12 },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'arms', defaultSets: 3, defaultReps: 12 },

  { id: 'plank', name: 'Plank', muscleGroup: 'core', defaultSets: 3, defaultReps: 1 },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'core', defaultSets: 3, defaultReps: 15 },
  { id: 'leg_raise', name: 'Leg Raise', muscleGroup: 'core', defaultSets: 3, defaultReps: 12 },
  { id: 'ab_wheel', name: 'Ab Wheel', muscleGroup: 'core', defaultSets: 3, defaultReps: 10 },

  { id: 'overhead_press', name: 'Overhead Press', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: 8 },
  { id: 'lateral_raise', name: 'Lateral Raise', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 12 },
  { id: 'front_raise', name: 'Front Raise', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 12 },
  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 15 },

  { id: 'squat', name: 'Squat', muscleGroup: 'legs', defaultSets: 4, defaultReps: 8 },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'legs', defaultSets: 3, defaultReps: 10 },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs', defaultSets: 3, defaultReps: 10 },
  { id: 'leg_curl', name: 'Leg Curl', muscleGroup: 'legs', defaultSets: 3, defaultReps: 12 },
  { id: 'calf_raise', name: 'Calf Raise', muscleGroup: 'legs', defaultSets: 3, defaultReps: 15 },

  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'glutes', defaultSets: 4, defaultReps: 10 },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'glutes', defaultSets: 3, defaultReps: 12 },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscleGroup: 'glutes', defaultSets: 3, defaultReps: 10 },
];

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'push_day',
    name: 'Push Day',
    exerciseIds: ['bench_press', 'overhead_press', 'chest_dip', 'lateral_raise', 'tricep_pushdown'],
  },
  {
    id: 'pull_day',
    name: 'Pull Day',
    exerciseIds: ['pull_up', 'seated_row', 'lat_pulldown', 'bicep_curl', 'face_pull'],
  },
  {
    id: 'leg_day',
    name: 'Leg Day',
    exerciseIds: ['squat', 'romanian_deadlift', 'leg_press', 'hip_thrust', 'calf_raise'],
  },
  {
    id: 'full_body',
    name: 'Full Body',
    exerciseIds: ['squat', 'bench_press', 'pull_up', 'plank', 'glute_bridge'],
  },
];

export function exerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
