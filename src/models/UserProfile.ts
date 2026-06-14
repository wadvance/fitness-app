export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle';
export type Equipment = 'home' | 'gym' | 'minimal';

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  goal: Goal;
  equipment: Equipment;
  targetWeight?: number;
}

export interface BMIResult {
  value: number;
  category: string;
  color: string;
}

export interface CaloricNeeds {
  tmb: number;
  tdee: number;
  goalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  deficit: number;
}
