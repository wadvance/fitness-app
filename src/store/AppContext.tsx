import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserProfile, CaloricNeeds } from '../models/UserProfile';
import { WorkoutPlan } from '../models/Exercise';
import { DietPlan, ShoppingListItem } from '../models/Meal';
import { calculateCaloricNeeds } from '../utils/calculations';
import { generateWorkoutPlan } from '../services/exerciseAI';
import { generateDietPlan, generateShoppingList } from '../services/dietPlanner';

interface AppState {
  profile: UserProfile | null;
  caloricNeeds: CaloricNeeds | null;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DietPlan | null;
  shoppingList: ShoppingListItem[];
  isLoading: boolean;
  isOnboarded: boolean;
  currentWeek: number;
  currentDay: number;
}

type Action =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_CALORIC_NEEDS'; payload: CaloricNeeds }
  | { type: 'SET_WORKOUT_PLAN'; payload: WorkoutPlan }
  | { type: 'SET_DIET_PLAN'; payload: DietPlan }
  | { type: 'SET_SHOPPING_LIST'; payload: ShoppingListItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'SET_CURRENT_WEEK'; payload: number }
  | { type: 'SET_CURRENT_DAY'; payload: number }
  | { type: 'TOGGLE_WORKOUT_DAY'; payload: { weekIndex: number; dayIndex: number } }
  | { type: 'TOGGLE_MEAL'; payload: { dayIndex: number; mealIndex: number } }
  | { type: 'TOGGLE_SHOPPING_ITEM'; payload: string }
  | { type: 'GENERATE_ALL'; payload: UserProfile };

const initialState: AppState = {
  profile: null,
  caloricNeeds: null,
  workoutPlan: null,
  dietPlan: null,
  shoppingList: [],
  isLoading: false,
  isOnboarded: false,
  currentWeek: 0,
  currentDay: 0,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_CALORIC_NEEDS':
      return { ...state, caloricNeeds: action.payload };
    case 'SET_WORKOUT_PLAN':
      return { ...state, workoutPlan: action.payload };
    case 'SET_DIET_PLAN':
      return { ...state, dietPlan: action.payload };
    case 'SET_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ONBOARDED':
      return { ...state, isOnboarded: action.payload };
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'SET_CURRENT_DAY':
      return { ...state, currentDay: action.payload };
    case 'TOGGLE_WORKOUT_DAY': {
      if (!state.workoutPlan) return state;
      const plan = { ...state.workoutPlan };
      const week = { ...plan.weeks[action.payload.weekIndex] };
      const days = [...week.days];
      days[action.payload.dayIndex] = {
        ...days[action.payload.dayIndex],
        completed: !days[action.payload.dayIndex].completed,
      };
      week.days = days;
      plan.weeks = [...plan.weeks];
      plan.weeks[action.payload.weekIndex] = week;
      return { ...state, workoutPlan: plan };
    }
    case 'TOGGLE_MEAL': {
      if (!state.dietPlan) return state;
      const plan = { ...state.dietPlan };
      const days = [...plan.days];
      const meals = [...days[action.payload.dayIndex].meals];
      meals[action.payload.mealIndex] = {
        ...meals[action.payload.mealIndex],
        completed: !meals[action.payload.mealIndex].completed,
      };
      days[action.payload.dayIndex] = { ...days[action.payload.dayIndex], meals };
      plan.days = days;
      return { ...state, dietPlan: plan };
    }
    case 'TOGGLE_SHOPPING_ITEM': {
      const list = state.shoppingList.map(item =>
        item.id === action.payload ? { ...item, checked: !item.checked } : item
      );
      return { ...state, shoppingList: list };
    }
    case 'GENERATE_ALL': {
      const profile = action.payload;
      const needs = calculateCaloricNeeds(profile);
      const workout = generateWorkoutPlan(profile);
      const diet = generateDietPlan(profile, 7);
      const shopping = generateShoppingList(diet, 7);
      return {
        ...state,
        profile,
        caloricNeeds: needs,
        workoutPlan: workout,
        dietPlan: diet,
        shoppingList: shopping,
        isOnboarded: true,
      };
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
