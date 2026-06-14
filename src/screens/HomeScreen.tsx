import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';
import { DAYS_OF_WEEK } from '../utils/constants';
import BMIChart from '../components/BMIChart';
import MacroPieChart from '../components/MacroPieChart';
import CalorieProgress from '../components/CalorieProgress';
import { calculateBMI } from '../utils/calculations';

export default function HomeScreen({ navigation }: any) {
  const { state } = useApp();
  const { profile, caloricNeeds, workoutPlan, dietPlan } = state;

  if (!profile || !caloricNeeds) return null;

  const bmi = calculateBMI(profile.weight, profile.height);
  const today = new Date().getDay();
  const todayWorkout = workoutPlan?.weeks[state.currentWeek]?.days.find(d => d.dayOfWeek === today);

  const todayMeals = dietPlan?.days[0];
  const consumedCalories = todayMeals?.meals
    .filter(m => m.completed)
    .reduce((sum, m) => {
      const recipe = dietPlan?.days[0]?.meals.find(me => me.id === m.id);
      return sum;
    }, 0) || 0;

  const totalTodayCalories = todayMeals?.totalCalories || 0;

  const macroData = {
    protein: caloricNeeds.protein,
    carbs: caloricNeeds.carbs,
    fat: caloricNeeds.fat,
    proteinCal: caloricNeeds.protein * 4,
    carbsCal: caloricNeeds.carbs * 4,
    fatCal: caloricNeeds.fat * 9,
    total: caloricNeeds.goalCalories,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Hoy es {DAYS_OF_WEEK[today]}</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.statValue}>{profile.weight} kg</Text>
          <Text style={styles.statLabel}>Peso actual</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.accent + '30' }]}>
          <Text style={styles.statValue}>{bmi.value}</Text>
          <Text style={styles.statLabel}>IMC</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.secondary + '15' }]}>
          <Text style={styles.statValue}>{caloricNeeds.goalCalories}</Text>
          <Text style={styles.statLabel}>Kcal/día</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tu IMC</Text>
          <Text style={[styles.sectionBadge, { color: bmi.color }]}>{bmi.category}</Text>
        </View>
        <BMIChart bmi={bmi} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Macros del día</Text>
        <MacroPieChart data={macroData} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Calorías</Text>
        <CalorieProgress consumed={0} goal={caloricNeeds.goalCalories} label={`Meta: ${caloricNeeds.goalCalories} kcal`} />
      </View>

      {todayWorkout && (
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => navigation.navigate('Training')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Entrenamiento de hoy</Text>
            <Text style={styles.sectionArrow}>→</Text>
          </View>
          <Text style={styles.workoutName}>{todayWorkout.name}</Text>
          <Text style={styles.workoutSets}>{todayWorkout.sets.length} ejercicios</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.sectionCard}
        onPress={() => navigation.navigate('Diet')}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Plan de comidas de hoy</Text>
          <Text style={styles.sectionArrow}>→</Text>
        </View>
        <Text style={styles.mealCount}>{todayMeals?.meals.length || 0} comidas planeadas</Text>
        <Text style={styles.mealCalories}>{totalTodayCalories} kcal totales</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  sectionBadge: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  sectionArrow: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: '700',
  },
  workoutName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  workoutSets: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  mealCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  mealCalories: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
