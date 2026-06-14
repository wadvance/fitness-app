import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';

export default function MealDetailScreen({ route }: any) {
  const { meal, recipe } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderIcon}>🍽️</Text>
        <Text style={styles.placeholderText}>Imagen de {recipe.name}</Text>
      </View>

      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recipe.caloriesPerServing}</Text>
          <Text style={styles.statLabel}>Kcal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recipe.protein}g</Text>
          <Text style={styles.statLabel}>Proteína</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recipe.carbs}g</Text>
          <Text style={styles.statLabel}>Carbos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recipe.fat}g</Text>
          <Text style={styles.statLabel}>Grasa</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {recipe.ingredients.map((ing: { foodItemId: string; name: string; quantity: number; unit: string }, idx: number) => (
          <View key={idx} style={styles.ingredientRow}>
            <Text style={styles.ingredientBullet}>•</Text>
            <Text style={styles.ingredientText}>
              {ing.quantity} {ing.unit} {ing.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instrucciones</Text>
        {recipe.instructions.map((step: string, idx: number) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>Preparación: {recipe.prepTime} min</Text>
        <Text style={styles.timeText}>Cocción: {recipe.cookTime} min</Text>
        <Text style={styles.timeText}>Porciones: {recipe.servings}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  imagePlaceholder: {
    height: 200,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  ingredientRow: { flexDirection: 'row', marginBottom: spacing.sm, gap: spacing.sm },
  ingredientBullet: { fontSize: fontSize.md, color: colors.textLight },
  ingredientText: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 },
  stepRow: { flexDirection: 'row', marginBottom: spacing.md, gap: spacing.md },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '700' },
  stepText: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  timeText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
});
