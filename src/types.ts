export type ExerciseCategory = 'push' | 'pull' | 'legs' | 'core';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  rest: number; // seconds
  category: ExerciseCategory;
}

export interface SetLog {
  setNumber: number;
  reps: number;
  reachedFailure: boolean;
  timestamp: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  sessionName: string;
  date: number; // timestamp
  exercises: ExerciseLog[];
  completed: boolean;
}

export interface ParsedWorkout {
  sessionName: string;
  exercises: Exercise[];
}
