import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../models/Exercise';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';

interface Props {
  exercise: Exercise;
  reps?: number;
  weight?: number;
  onPress?: () => void;
}

const muscleColors: Record<string, string> = {
  chest: '#EF4444',
  back: '#8B5CF6',
  shoulders: '#F97316',
  biceps: '#EC4899',
  triceps: '#14B8A6',
  legs: '#3B82F6',
  glutes: '#F59E0B',
  abs: '#10B981',
  full_body: '#6B7280',
};

export default function ExerciseCard({ exercise, reps, weight, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: muscleColors[exercise.muscleGroup] || '#6B7280' }]}>
          <Text style={styles.badgeText}>{exercise.muscleGroup}</Text>
        </View>
        <Text style={styles.difficulty}>{exercise.difficulty}</Text>
      </View>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{exercise.description}</Text>
      {(reps || weight) && (
        <View style={styles.stats}>
          {reps && <Text style={styles.stat}>{reps} reps</Text>}
          {weight && <Text style={styles.stat}>{weight} kg</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficulty: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});
