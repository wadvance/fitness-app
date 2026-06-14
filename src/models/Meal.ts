export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface Ingredient {
  foodItemId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  caloriesPerServing: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  tags: string[];
}

export interface Meal {
  id: string;
  mealTime: MealTime;
  recipeId: string;
  time: string;
  completed: boolean;
}

export interface DayMealPlan {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DietPlan {
  id: string;
  name: string;
  days: DayMealPlan[];
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}
