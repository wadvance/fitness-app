import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';

export default function ShoppingListScreen() {
  const { state, dispatch } = useApp();
  const { shoppingList } = state;

  const categories = [...new Set(shoppingList.map(item => item.category))];
  const checkedCount = shoppingList.filter(i => i.checked).length;

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: id });
  };

  if (shoppingList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Lista vacía</Text>
        <Text style={styles.emptyText}>Completa tu perfil para generar una lista de compras</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de compras</Text>
        <Text style={styles.subtitle}>
          {checkedCount} de {shoppingList.length} artículos
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(checkedCount / shoppingList.length) * 100}%` },
          ]}
        />
      </View>

      {categories.map(category => {
        const items = shoppingList.filter(i => i.category === category);
        return (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemRow, item.checked && styles.itemRowChecked]}
                onPress={() => handleToggle(item.id)}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxActive]}>
                  {item.checked && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center' },
  header: { marginBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  categorySection: { marginBottom: spacing.lg },
  categoryTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  itemRowChecked: { opacity: 0.5 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: colors.white, fontSize: 14, fontWeight: '700' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  itemNameChecked: { textDecorationLine: 'line-through', color: colors.textLight },
  itemQuantity: { fontSize: fontSize.xs, color: colors.textSecondary },
});
