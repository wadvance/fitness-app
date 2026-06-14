export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'glutes' | 'abs' | 'full_body';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'dumbbell' | 'barbell' | 'machine' | 'cable' | 'bodyweight' | 'band' | 'kettlebell';

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  muscleGroup: MuscleGroup;
  difficulty: ExerciseDifficulty;
  equipment: EquipmentType;
  animationUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  tips: string[];
  commonMistakes: string[];
}

export interface ExerciseSet {
  exerciseId: string;
  reps: number;
  weight?: number;
  restSeconds: number;
  order: number;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: number;
  sets: ExerciseSet[];
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  weeks: WorkoutWeek[];
  createdAt: string;
}

export interface WorkoutWeek {
  weekNumber: number;
  days: WorkoutDay[];
}
