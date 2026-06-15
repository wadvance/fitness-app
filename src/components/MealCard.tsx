import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meal } from '../models/Meal';
import { Recipe } from '../models/Meal';
import { useTheme, spacing, fontSize, borderRadius, shadows } from '../styles/theme';

interface Props {
  meal: Meal;
  recipe: Recipe;
  onPress?: () => void;
  onToggle?: () => void;
}

const mealLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
};

const mealIcons: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function MealCard({ meal, recipe, onPress, onToggle }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={[styles.card, meal.completed && styles.completed]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.mealInfo}>
          <Text style={styles.icon}>{mealIcons[meal.mealTime]}</Text>
          <View>
            <Text style={styles.mealLabel}>{mealLabels[meal.mealTime]}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          <View style={[styles.check, meal.completed && styles.checkActive]}>
            {meal.completed && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.calories}>{recipe.caloriesPerServing} kcal</Text>
      <View style={styles.macros}>
        <Text style={styles.macro}>P: {recipe.protein}g</Text>
        <Text style={styles.macro}>C: {recipe.carbs}g</Text>
        <Text style={styles.macro}>G: {recipe.fat}g</Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  completed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  mealLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  checkbox: {
    padding: 4,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  recipeName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  calories: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  macros: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macro: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
