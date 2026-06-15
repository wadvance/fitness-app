import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BMIResult } from '../models/UserProfile';
import { useTheme, lightColors, spacing, borderRadius } from '../styles/theme';

interface Props {
  bmi: BMIResult;
}

export default function BMIChart({ bmi }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const maxScale = 40;
  const position = Math.min((bmi.value / maxScale) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.segment, { backgroundColor: '#F59E0B', flex: 18.5 }]} />
        <View style={[styles.segment, { backgroundColor: '#10B981', flex: 6.5 }]} />
        <View style={[styles.segment, { backgroundColor: '#F97316', flex: 5 }]} />
        <View style={[styles.segment, { backgroundColor: '#EF4444', flex: 10 }]} />
      </View>
      <View style={[styles.indicator, { left: `${position}%` }]} />
    </View>
  );
}

const createStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    height: 20,
    position: 'relative',
    marginVertical: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    height: 12,
  },
  segment: {
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    marginLeft: -10,
    ...({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    }),
  },
});
