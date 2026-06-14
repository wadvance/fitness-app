import { UserProfile } from '../models/UserProfile';
import { Exercise, ExerciseSet, WorkoutDay, WorkoutPlan, WorkoutWeek } from '../models/Exercise';
import { exercises as allExercises } from '../data/exercises';

function filterByEquipment(equipment: string): Exercise[] {
  switch (equipment) {
    case 'minimal':
      return allExercises.filter(e => e.equipment === 'bodyweight');
    case 'home':
      return allExercises.filter(e =>
        e.equipment === 'bodyweight' || e.equipment === 'dumbbell' || e.equipment === 'band'
      );
    case 'gym':
      return allExercises;
    default:
      return allExercises;
  }
}

function filterByDifficulty(difficulty: string): Exercise[] {
  switch (difficulty) {
    case 'beginner':
      return allExercises.filter(e => e.difficulty === 'beginner');
    case 'intermediate':
      return allExercises.filter(e =>
        e.difficulty === 'beginner' || e.difficulty === 'intermediate'
      );
    case 'advanced':
      return allExercises;
    default:
      return allExercises;
  }
}

function getUserDifficulty(profile: UserProfile): string {
  if (profile.age > 50 || profile.activityLevel === 'sedentary') return 'beginner';
  if (profile.activityLevel === 'light' || profile.activityLevel === 'moderate') return 'intermediate';
  return 'advanced';
}

function pickExercises(
  pool: Exercise[],
  muscleGroup: string,
  count: number
): Exercise[] {
  const filtered = pool.filter(e => e.muscleGroup === muscleGroup);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function generateSetsForExercise(
  exercise: Exercise,
  weekNumber: number,
  difficulty: string
): ExerciseSet {
  const baseReps = exercise.difficulty === 'beginner' ? 10 : 12;
  const baseSets = exercise.difficulty === 'beginner' ? 3 : 4;

  const repsAdjustment = weekNumber > 1 ? Math.floor(weekNumber * 1.5) : 0;
  const reps = baseReps + repsAdjustment;

  const weight = difficulty === 'beginner' ? undefined : Math.max(5, 10 + weekNumber * 2);

  return {
    exerciseId: exercise.id,
    reps,
    weight,
    restSeconds: exercise.difficulty === 'beginner' ? 60 : 45,
    order: 0,
  };
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const userDifficulty = getUserDifficulty(profile);
  const equipment = profile.equipment;

  let availableExercises = filterByEquipment(equipment);
  availableExercises = availableExercises.filter(e =>
    filterByDifficulty(userDifficulty).includes(e)
  );

  const weeks: WorkoutWeek[] = [];
  const totalWeeks = 4;

  for (let week = 1; week <= totalWeeks; week++) {
    const days: WorkoutDay[] = [];

    const dayConfigs = [
      { name: 'Pecho y Tríceps', muscleGroups: ['chest', 'triceps'] },
      { name: 'Espalda y Bíceps', muscleGroups: ['back', 'biceps'] },
      { name: 'Piernas y Abdomen', muscleGroups: ['legs', 'glutes', 'abs'] },
      { name: 'Hombros y Full Body', muscleGroups: ['shoulders', 'full_body'] },
    ];

    dayConfigs.forEach((config, index) => {
      const sets: ExerciseSet[] = [];
      let order = 0;

      config.muscleGroups.forEach(mg => {
        const picked = pickExercises(availableExercises, mg as any, 2);
        picked.forEach(ex => {
          const set = generateSetsForExercise(ex, week, userDifficulty);
          set.order = order++;
          sets.push(set);
        });
      });

      days.push({
        id: `week${week}_day${index}`,
        name: config.name,
        dayOfWeek: index,
        sets,
        completed: false,
      });
    });

    weeks.push({ weekNumber: week, days });
  }

  return {
    id: `plan_${Date.now()}`,
    name: `Plan ${profile.goal === 'lose_weight' ? 'quema grasa' : 'volumen'} - ${userDifficulty}`,
    description: `Plan personalizado de ${totalWeeks} semanas para ${profile.goal === 'lose_weight' ? 'perder peso' : profile.goal === 'gain_muscle' ? 'ganar músculo' : 'mantener'}`,
    weeks,
    createdAt: new Date().toISOString(),
  };
}

export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find(e => e.id === id);
}

export function calculateProgressiveOverload(
  currentReps: number,
  completedSets: number,
  totalSets: number,
  currentWeight?: number
): { newReps: number; newWeight?: number } {
  const completionRate = completedSets / totalSets;
  let newReps = currentReps;
  let newWeight = currentWeight;

  if (completionRate >= 0.8) {
    newReps = currentReps + 2;
    if (newReps >= 15 && currentWeight) {
      newReps = 10;
      newWeight = currentWeight + 2.5;
    }
  }

  return { newReps, newWeight };
}
