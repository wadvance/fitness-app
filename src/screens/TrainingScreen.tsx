import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';
import ExerciseCard from '../components/ExerciseCard';
import { getExerciseById } from '../services/exerciseAI';

export default function TrainingScreen({ navigation }: any) {
  const { state, dispatch } = useApp();
  const { workoutPlan, currentWeek, currentDay } = state;

  if (!workoutPlan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sin plan de entrenamiento</Text>
        <Text style={styles.emptyText}>Completa tu perfil para generar un plan personalizado</Text>
      </View>
    );
  }

  const week = workoutPlan.weeks[currentWeek];
  const day = week?.days[currentDay];

  const handleToggleDay = (dayIndex: number) => {
    dispatch({ type: 'TOGGLE_WORKOUT_DAY', payload: { weekIndex: currentWeek, dayIndex } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{workoutPlan.name}</Text>
        <Text style={styles.subtitle}>Semana {currentWeek + 1} de {workoutPlan.weeks.length}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekNav}>
        {week.days.map((d, idx) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.dayTab, idx === currentDay && styles.dayTabActive]}
            onPress={() => dispatch({ type: 'SET_CURRENT_DAY', payload: idx })}
          >
            <Text style={[styles.dayTabText, idx === currentDay && styles.dayTabTextActive]}>
              {d.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.daySection}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{day?.name}</Text>
          <TouchableOpacity
            style={[styles.completeBtn, day?.completed && styles.completeBtnActive]}
            onPress={() => day && handleToggleDay(currentDay)}
          >
            <Text style={[styles.completeBtnText, day?.completed && styles.completeBtnTextActive]}>
              {day?.completed ? '✓ Completado' : 'Marcar completo'}
            </Text>
          </TouchableOpacity>
        </View>

        {day?.sets.map((set, idx) => {
          const exercise = getExerciseById(set.exerciseId);
          if (!exercise) return null;
          return (
            <TouchableOpacity
              key={set.exerciseId + idx}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise, set })}
            >
              <ExerciseCard
                exercise={exercise}
                reps={set.reps}
                weight={set.weight}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.weekNavButtons}>
        <TouchableOpacity
          style={[styles.navBtn, currentWeek <= 0 && styles.navBtnDisabled]}
          disabled={currentWeek <= 0}
          onPress={() => dispatch({ type: 'SET_CURRENT_WEEK', payload: currentWeek - 1 })}
        >
          <Text style={styles.navBtnText}>Semana anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, currentWeek >= workoutPlan.weeks.length - 1 && styles.navBtnDisabled]}
          disabled={currentWeek >= workoutPlan.weeks.length - 1}
          onPress={() => dispatch({ type: 'SET_CURRENT_WEEK', payload: currentWeek + 1 })}
        >
          <Text style={styles.navBtnText}>Siguiente semana</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center' },
  header: { marginBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  weekNav: { marginBottom: spacing.md },
  dayTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.sm,
  },
  dayTabActive: { backgroundColor: colors.primary },
  dayTabText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  dayTabTextActive: { color: colors.white },
  daySection: { marginBottom: spacing.md },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dayTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  completeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.success,
  },
  completeBtnActive: { backgroundColor: colors.success },
  completeBtnText: { fontSize: fontSize.sm, color: colors.success, fontWeight: '600' },
  completeBtnTextActive: { color: colors.white },
  weekNavButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.sm,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
});
