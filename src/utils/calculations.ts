import { UserProfile, BMIResult, CaloricNeeds } from '../models/UserProfile';
import { ACTIVITY_MULTIPLIERS, CALORIE_DEFICIT_FACTOR, PROTEIN_PER_KG, FAT_PERCENT, CARBS_PERCENT } from './constants';

export function calculateBMI(weight: number, height: number): BMIResult {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Bajo peso';
    color = '#F59E0B';
  } else if (bmi < 25) {
    category = 'Normal';
    color = '#10B981';
  } else if (bmi < 30) {
    category = 'Sobrepeso';
    color = '#F97316';
  } else {
    category = 'Obesidad';
    color = '#EF4444';
  }

  return { value: Math.round(bmi * 10) / 10, category, color };
}

export function calculateTMB(profile: UserProfile): number {
  const { weight, height, age, sex } = profile;

  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(tmb: number, activityLevel: string): number {
  return Math.round(tmb * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateCaloricNeeds(profile: UserProfile): CaloricNeeds {
  const tmb = calculateTMB(profile);
  const tdee = calculateTDEE(tmb, profile.activityLevel);

  let goalCalories: number;
  let deficit = 0;

  switch (profile.goal) {
    case 'lose_weight':
      deficit = CALORIE_DEFICIT_FACTOR;
      goalCalories = tdee - deficit;
      break;
    case 'gain_muscle':
      goalCalories = tdee + 300;
      break;
    case 'maintain':
    default:
      goalCalories = tdee;
      break;
  }

  const protein = Math.round(profile.weight * PROTEIN_PER_KG);
  const proteinCalories = protein * 4;
  const fatCalories = Math.round(goalCalories * FAT_PERCENT);
  const fat = Math.round(fatCalories / 9);
  const carbs = Math.round((goalCalories - proteinCalories - fatCalories) / 4);

  return {
    tmb: Math.round(tmb),
    tdee,
    goalCalories,
    protein,
    carbs,
    fat,
    deficit,
  };
}

export function calculateMacroPercentage(calories: number, macroGrams: number, calPerGram: number): number {
  return Math.round(((macroGrams * calPerGram) / calories) * 100);
}
