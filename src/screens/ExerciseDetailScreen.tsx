import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';

export default function ExerciseDetailScreen({ route }: any) {
  const { exercise, set } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderIcon}>🏋️</Text>
        <Text style={styles.placeholderText}>Video demostrativo</Text>
      </View>

      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.description}>{exercise.description}</Text>

      {set && (
        <View style={styles.setInfo}>
          <View style={styles.setStat}>
            <Text style={styles.setStatValue}>{set.reps}</Text>
            <Text style={styles.setStatLabel}>Repeticiones</Text>
          </View>
          {set.weight && (
            <View style={styles.setStat}>
              <Text style={styles.setStatValue}>{set.weight} kg</Text>
              <Text style={styles.setStatLabel}>Peso</Text>
            </View>
          )}
          <View style={styles.setStat}>
            <Text style={styles.setStatValue}>{set.restSeconds}s</Text>
            <Text style={styles.setStatLabel}>Descanso</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consejos para buena técnica</Text>
        {exercise.tips.map((tip: string, idx: number) => (
          <View key={idx} style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Errores comunes</Text>
        {exercise.commonMistakes.map((mistake: string, idx: number) => (
          <View key={idx} style={styles.tipRow}>
            <Text style={[styles.tipBullet, { color: colors.error }]}>✕</Text>
            <Text style={styles.tipText}>{mistake}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  imagePlaceholder: {
    height: 220,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  placeholderIcon: { fontSize: 48 },
  placeholderText: { fontSize: fontSize.sm, color: colors.textLight, marginTop: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  description: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.lg },
  setInfo: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  setStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  setStatValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
  setStatLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  tipRow: { flexDirection: 'row', marginBottom: spacing.sm, gap: spacing.sm },
  tipBullet: { fontSize: fontSize.md, color: colors.success, width: 16 },
  tipText: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1, lineHeight: 20 },
});
