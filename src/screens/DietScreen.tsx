import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { useTheme, spacing, fontSize, borderRadius, shadows } from '../styles/theme';
import MealCard from '../components/MealCard';
import CalorieProgress from '../components/CalorieProgress';
import { recipes as allRecipes } from '../data/recipes';

export default function DietScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { state, dispatch } = useApp();
  const { dietPlan } = state;
  const [selectedDay, setSelectedDay] = useState(0);

  if (!dietPlan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sin plan de dieta</Text>
        <Text style={styles.emptyText}>Completa tu perfil para generar un plan alimenticio</Text>
      </View>
    );
  }

  const day = dietPlan.days[selectedDay];
  if (!day) return null;

  const consumedCalories = day.meals
    .filter(m => m.completed)
    .reduce((sum, m) => {
      const recipe = allRecipes.find(r => r.id === m.recipeId);
      return sum + (recipe?.caloriesPerServing || 0);
    }, 0);

  const handleToggleMeal = (mealIndex: number) => {
    dispatch({ type: 'TOGGLE_MEAL', payload: { dayIndex: selectedDay, mealIndex } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Plan de alimentación</Text>
      <Text style={styles.subtitle}>{dietPlan.name}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayNav}>
        {dietPlan.days.map((d, idx) => {
          const date = new Date(d.date + 'T00:00:00');
          const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
          return (
            <TouchableOpacity
              key={d.date}
              style={[styles.dayTab, idx === selectedDay && styles.dayTabActive]}
              onPress={() => setSelectedDay(idx)}
            >
              <Text style={[styles.dayTabDay, idx === selectedDay && styles.dayTabTextActive]}>
                {dayName}
              </Text>
              <Text style={[styles.dayTabDate, idx === selectedDay && styles.dayTabTextActive]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.calorieSection}>
        <CalorieProgress
          consumed={consumedCalories}
          goal={day.totalCalories}
          label={`${day.totalCalories} kcal meta diaria`}
        />
      </View>

      <View style={styles.macroRow}>
        <View style={styles.macroCard}>
          <Text style={styles.macroValue}>{day.totalProtein}g</Text>
          <Text style={styles.macroLabel}>Proteína</Text>
        </View>
        <View style={styles.macroCard}>
          <Text style={styles.macroValue}>{day.totalCarbs}g</Text>
          <Text style={styles.macroLabel}>Carbos</Text>
        </View>
        <View style={styles.macroCard}>
          <Text style={styles.macroValue}>{day.totalFat}g</Text>
          <Text style={styles.macroLabel}>Grasa</Text>
        </View>
      </View>

      {day.meals.map((meal, idx) => {
        const recipe = allRecipes.find(r => r.id === meal.recipeId);
        if (!recipe) return null;
        return (
          <MealCard
            key={meal.id}
            meal={meal}
            recipe={recipe}
            onPress={() => navigation.navigate('MealDetail', { meal, recipe })}
            onToggle={() => handleToggleMeal(idx)}
          />
        );
      })}

      <TouchableOpacity
        style={styles.shoppingBtn}
        onPress={() => navigation.navigate('ShoppingList')}
      >
        <Text style={styles.shoppingBtnText}>Ver lista de compras</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center' },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  dayNav: { marginBottom: spacing.md },
  dayTab: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.sm,
    minWidth: 60,
  },
  dayTabActive: { backgroundColor: colors.primary },
  dayTabDay: { fontSize: fontSize.xs, color: colors.textSecondary },
  dayTabDate: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  dayTabTextActive: { color: colors.white },
  calorieSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  macroRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  macroCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  macroValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.primary },
  macroLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  shoppingBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.lg,
  },
  shoppingBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
});
