import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, fontSize, borderRadius } from '../styles/theme';

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
  proteinCal: number;
  carbsCal: number;
  fatCal: number;
  total: number;
}

interface Props {
  data: MacroData;
}

export default function MacroPieChart({ data }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const pProtein = data.total > 0 ? (data.proteinCal / data.total) * 100 : 0;
  const pCarbs = data.total > 0 ? (data.carbsCal / data.total) * 100 : 0;
  const pFat = data.total > 0 ? (data.fatCal / data.total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.segment, { flex: pProtein, backgroundColor: '#6C63FF' }]} />
        <View style={[styles.segment, { flex: pCarbs, backgroundColor: '#FFD93D' }]} />
        <View style={[styles.segment, { flex: pFat, backgroundColor: '#FF6B6B' }]} />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#6C63FF' }]} />
          <Text style={styles.legendText}>Proteína {data.protein}g</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FFD93D' }]} />
          <Text style={styles.legendText}>Carbos {data.carbs}g</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Grasa {data.fat}g</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  barContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
