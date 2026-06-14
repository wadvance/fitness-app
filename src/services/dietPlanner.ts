import { UserProfile, CaloricNeeds } from '../models/UserProfile';
import { Meal, DayMealPlan, DietPlan, ShoppingListItem, MealTime } from '../models/Meal';
import { recipes as allRecipes } from '../data/recipes';
import { calculateCaloricNeeds } from '../utils/calculations';

interface MealSlot {
  time: MealTime;
  calPercent: number;
  hour: string;
}

const mealSlots: MealSlot[] = [
  { time: 'breakfast', calPercent: 0.25, hour: '08:00' },
  { time: 'lunch', calPercent: 0.35, hour: '13:00' },
  { time: 'dinner', calPercent: 0.25, hour: '20:00' },
  { time: 'snack', calPercent: 0.15, hour: '11:00' },
];

function filterRecipesByMealTime(mealTime: MealTime) {
  switch (mealTime) {
    case 'breakfast':
      return allRecipes.filter(r =>
        r.tags.includes('desayuno') || r.tags.includes('rápido')
      );
    case 'lunch':
      return allRecipes.filter(r =>
        r.tags.includes('almuerzo') || r.tags.includes('completo') || r.tags.includes('alto proteína')
      );
    case 'dinner':
      return allRecipes.filter(r =>
        r.tags.includes('cena') || r.tags.includes('saludable') || r.tags.includes('bajo carbohidratos')
      );
    case 'snack':
      return allRecipes.filter(r =>
        r.tags.includes('snack') || r.tags.includes('rápido') || r.tags.includes('detox')
      );
    default:
      return allRecipes;
  }
}

function pickRecipeForSlot(mealTime: MealTime, usedIds: Set<string>): string {
  const candidates = filterRecipesByMealTime(mealTime).filter(r => !usedIds.has(r.id));
  if (candidates.length === 0) {
    const fallback = allRecipes.filter(r => !usedIds.has(r.id));
    if (fallback.length === 0) return allRecipes[0].id;
    return fallback[Math.floor(Math.random() * fallback.length)].id;
  }
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled[0].id;
}

function getRecipeById(id: string) {
  return allRecipes.find(r => r.id === id)!;
}

export function generateDietPlan(
  profile: UserProfile,
  days: number = 7
): DietPlan {
  const needs = calculateCaloricNeeds(profile);

  const dayPlans: DayMealPlan[] = [];
  const allUsedIds = new Set<string>();

  for (let day = 0; day < days; day++) {
    const meals: Meal[] = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealSlots.forEach(slot => {
      const recipeId = pickRecipeForSlot(slot.time, allUsedIds);
      allUsedIds.add(recipeId);
      const recipe = getRecipeById(recipeId);

      const meal: Meal = {
        id: `day${day}_${slot.time}`,
        mealTime: slot.time,
        recipeId,
        time: slot.hour,
        completed: false,
      };

      meals.push(meal);
      totalCalories += recipe.caloriesPerServing;
      totalProtein += recipe.protein;
      totalCarbs += recipe.carbs;
      totalFat += recipe.fat;
    });

    const date = new Date();
    date.setDate(date.getDate() + day);

    dayPlans.push({
      date: date.toISOString().split('T')[0],
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });
  }

  return {
    id: `diet_${Date.now()}`,
    name: `Plan ${profile.goal === 'lose_weight' ? 'déficit' : profile.goal === 'gain_muscle' ? 'volumen' : 'mantenimiento'}`,
    days: dayPlans,
    createdAt: new Date().toISOString(),
  };
}

export function generateShoppingList(dietPlan: DietPlan, dayCount: number = 7): ShoppingListItem[] {
  const ingredientMap = new Map<string, { quantity: number; unit: string; category: string }>();

  const categoryMap: Record<string, string> = {
    'Avena': 'Granos y Cereales',
    'Proteína en polvo': 'Suplementos',
    'Plátano': 'Frutas',
    'Leche desnatada': 'Lácteos',
    'Pechuga de pollo': 'Carnes',
    'Arroz integral': 'Granos y Cereales',
    'Brócoli': 'Verduras',
    'Aceite de oliva': 'Aceites y Condimentos',
    'Salmón': 'Pescados',
    'Quinoa': 'Granos y Cereales',
    'Espárragos': 'Verduras',
    'Claras de huevo': 'Huevos y Lácteos',
    'Espinacas': 'Verduras',
    'Tomate cherry': 'Verduras',
    'Aguacate': 'Frutas',
    'Maíz': 'Verduras',
    'Frijoles negros': 'Legumbres',
    'Tortilla integral': 'Pan y Tortillas',
    'Pechuga de pavo': 'Carnes Frías',
    'Lechuga': 'Verduras',
    'Tomate': 'Verduras',
    'Queso fresco': 'Lácteos',
    'Yogur griego': 'Lácteos',
    'Granola sin azúcar': 'Granos y Cereales',
    'Frutos rojos': 'Frutas',
    'Manzana verde': 'Frutas',
    'Agua de coco': 'Bebidas',
  };

  const daysToProcess = dietPlan.days.slice(0, dayCount);

  daysToProcess.forEach(day => {
    day.meals.forEach(meal => {
      const recipe = getRecipeById(meal.recipeId);
      recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.quantity += ing.quantity;
        } else {
          ingredientMap.set(key, {
            quantity: ing.quantity,
            unit: ing.unit,
            category: categoryMap[ing.name] || 'Otros',
          });
        }
      });
    });
  });

  const items: ShoppingListItem[] = [];
  ingredientMap.forEach((value, key) => {
    const lookup = allRecipes
      .flatMap(r => r.ingredients)
      .find(i => i.name.toLowerCase() === key);

    items.push({
      id: `shop_${key.replace(/\s+/g, '_')}`,
      name: lookup?.name || key,
      quantity: Math.ceil(value.quantity),
      unit: value.unit,
      category: value.category,
      checked: false,
    });
  });

  return items.sort((a, b) => a.category.localeCompare(b.category));
}

export function getDailyCaloricTarget(profile: UserProfile): CaloricNeeds {
  return calculateCaloricNeeds(profile);
}
