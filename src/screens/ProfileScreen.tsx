import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/theme';
import { ACTIVITY_LABELS, GOAL_LABELS, EQUIPMENT_LABELS } from '../utils/constants';
import { calculateBMI } from '../utils/calculations';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const { profile, caloricNeeds } = state;

  if (!profile || !caloricNeeds) return null;

  const bmi = calculateBMI(profile.weight, profile.height);

  const handleReset = () => {
    dispatch({ type: 'SET_ONBOARDED', payload: false });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.sex === 'male' ? '👤' : '👩'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos personales</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Edad</Text>
          <Text style={styles.value}>{profile.age} años</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sexo</Text>
          <Text style={styles.value}>{profile.sex === 'male' ? 'Hombre' : 'Mujer'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Peso</Text>
          <Text style={styles.value}>{profile.weight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estatura</Text>
          <Text style={styles.value}>{profile.height} cm</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Actividad</Text>
          <Text style={styles.value}>{ACTIVITY_LABELS[profile.activityLevel]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Objetivo</Text>
          <Text style={styles.value}>{GOAL_LABELS[profile.goal]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipo</Text>
          <Text style={styles.value}>{EQUIPMENT_LABELS[profile.equipment]}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resultados</Text>
        <View style={styles.row}>
          <Text style={styles.label}>IMC</Text>
          <Text style={[styles.value, { color: bmi.color }]}>{bmi.value} - {bmi.category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>TMB</Text>
          <Text style={styles.value}>{caloricNeeds.tmb} kcal</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>TDEE</Text>
          <Text style={styles.value}>{caloricNeeds.tdee} kcal</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Calorías objetivo</Text>
          <Text style={[styles.value, { color: colors.primary }]}>{caloricNeeds.goalCalories} kcal</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Proteína</Text>
          <Text style={styles.value}>{caloricNeeds.protein} g/día</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Carbohidratos</Text>
          <Text style={styles.value}>{caloricNeeds.carbs} g/día</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Grasa</Text>
          <Text style={styles.value}>{caloricNeeds.fat} g/día</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>Reiniciar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarContainer: { alignItems: 'center', marginVertical: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 36 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: { fontSize: fontSize.sm, color: colors.textSecondary },
  value: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  resetBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.error,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resetBtnText: { color: colors.error, fontSize: fontSize.md, fontWeight: '700' },
});
