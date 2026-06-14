export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentario (poco o ningún ejercicio)',
  light: 'Ligero (1-3 días/semana)',
  moderate: 'Moderado (3-5 días/semana)',
  active: 'Activo (6-7 días/semana)',
  very_active: 'Muy activo (2x/día o trabajo físico)',
};

export const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Perder peso',
  maintain: 'Mantener peso',
  gain_muscle: 'Ganar músculo',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  home: 'En casa (equipo básico)',
  gym: 'Gimnasio completo',
  minimal: 'Mínimo (solo peso corporal)',
};

export const CALORIE_DEFICIT_FACTOR = 500;
export const PROTEIN_PER_KG = 2.0;
export const FAT_PERCENT = 0.25;
export const CARBS_PERCENT = 0.45;

export const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
