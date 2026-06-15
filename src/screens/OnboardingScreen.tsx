import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../store/AppContext';
import { UserProfile, Sex, ActivityLevel, Goal, Equipment } from '../models/UserProfile';
import { useTheme, spacing, fontSize, borderRadius, shadows } from '../styles/theme';
import { ACTIVITY_LABELS, GOAL_LABELS, EQUIPMENT_LABELS } from '../utils/constants';
import { calculateBMI, calculateCaloricNeeds } from '../utils/calculations';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    equipment: 'home',
  });

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = () => {
    dispatch({ type: 'GENERATE_ALL', payload: profile as UserProfile });
  };

  const steps = [
    <View key="step0" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Datos básicos</Text>
      <Text style={styles.stepSubtitle}>Cuéntanos sobre ti para personalizar tu experiencia</Text>

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Ej: 25"
        placeholderTextColor={colors.textLight}
        value={profile.age?.toString() || ''}
        onChangeText={t => updateProfile('age', parseInt(t) || 0)}
      />

      <Text style={styles.label}>Peso actual (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ej: 70"
        placeholderTextColor={colors.textLight}
        value={profile.weight?.toString() || ''}
        onChangeText={t => updateProfile('weight', parseFloat(t) || 0)}
      />

      <Text style={styles.label}>Estatura (in)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ej: 67"
        placeholderTextColor={colors.textLight}
        value={profile.height?.toString() || ''}
        onChangeText={t => updateProfile('height', parseFloat(t) || 0)}
      />
    </View>,

    <View key="step1" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Sexo y actividad</Text>
      <Text style={styles.stepSubtitle}>Selecciona tu sexo biológico y nivel de actividad</Text>

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.optionsRow}>
        {(['male', 'female'] as Sex[]).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.optionBtn, profile.sex === s && styles.optionBtnActive]}
            onPress={() => updateProfile('sex', s)}
          >
            <Text style={[styles.optionText, profile.sex === s && styles.optionTextActive]}>
              {s === 'male' ? 'Hombre' : 'Mujer'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Nivel de actividad física</Text>
      {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={[styles.optionLong, profile.activityLevel === key && styles.optionLongActive]}
          onPress={() => updateProfile('activityLevel', key)}
        >
          <View style={[styles.radio, profile.activityLevel === key && styles.radioActive]} />
          <Text style={[styles.optionLongText, profile.activityLevel === key && styles.optionLongTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>,

    <View key="step2" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Objetivo y equipo</Text>
      <Text style={styles.stepSubtitle}>¿Qué quieres lograr y con qué equipo cuentas?</Text>

      <Text style={styles.label}>Objetivo principal</Text>
      {Object.entries(GOAL_LABELS).map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={[styles.optionLong, profile.goal === key && styles.optionLongActive]}
          onPress={() => updateProfile('goal', key)}
        >
          <View style={[styles.radio, profile.goal === key && styles.radioActive]} />
          <Text style={[styles.optionLongText, profile.goal === key && styles.optionLongTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Equipo disponible</Text>
      {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={[styles.optionLong, profile.equipment === key && styles.optionLongActive]}
          onPress={() => updateProfile('equipment', key)}
        >
          <View style={[styles.radio, profile.equipment === key && styles.radioActive]} />
          <Text style={[styles.optionLongText, profile.equipment === key && styles.optionLongTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>,

    <View key="step3" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tu resumen</Text>
      <Text style={styles.stepSubtitle}>Basado en tus datos, calculamos lo siguiente:</Text>

      {profile.weight && profile.height && (
        <>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Índice de Masa Corporal (IMC)</Text>
            <Text style={styles.resultValue}>
              {calculateBMI(profile.weight, profile.height).value}
            </Text>
            <Text style={[styles.resultCategory, { color: calculateBMI(profile.weight, profile.height).color }]}>
              {calculateBMI(profile.weight, profile.height).category}
            </Text>
          </View>

          {(() => {
            const needs = calculateCaloricNeeds(profile as UserProfile);
            return (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Tasa Metabólica Basal (TMB)</Text>
                <Text style={styles.resultValue}>{needs.tmb} kcal/día</Text>
                <Text style={styles.resultLabel}>Gasto calórico total (TDEE)</Text>
                <Text style={styles.resultValue}>{needs.tdee} kcal/día</Text>
                <View style={styles.divider} />
                <Text style={styles.resultLabel}>Calorías objetivo</Text>
                <Text style={[styles.resultValue, { color: colors.primary }]}>
                  {needs.goalCalories} kcal/día
                </Text>
                {profile.goal === 'lose_weight' && (
                  <Text style={styles.deficitText}>
                    Déficit de {needs.deficit} kcal/día para perder ~0.5kg/semana
                  </Text>
                )}
              </View>
            );
          })()}
        </>
      )}
    </View>,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>

        {steps[step]}

        <View style={styles.buttonRow}>
          {step > 0 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setStep(s => s - 1)}
            >
              <Text style={styles.secondaryButtonText}>Atrás</Text>
            </TouchableOpacity>
          )}
          {step < steps.length - 1 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(s => s + 1)}
            >
              <Text style={styles.primaryButtonText}>Siguiente</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleFinish}
            >
              <Text style={styles.primaryButtonText}>¡Empezar!</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.xxl },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 30,
    borderRadius: 5,
  },
  stepContainer: {},
  stepTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
  },
  optionLong: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  optionLongActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  radioActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionLongText: {
    fontSize: fontSize.sm,
    color: colors.text,
    flex: 1,
  },
  optionLongTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  resultLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resultCategory: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  deficitText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.lg,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
