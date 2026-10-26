import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {number} [gpa=0] - Điểm trung bình tích lũy hệ 4
 * @param {number} [totalCredits=0] - Tổng số tín chỉ tích lũy
 */
export default function GpaSummary({ gpa = 0, totalCredits = 0 }) {
  const formattedGpa = typeof gpa === 'number' ? gpa.toFixed(2) : Number(gpa || 0).toFixed(2);

  return (
    <View style={styles.card}>
      <View style={styles.col}>
        <Text style={styles.label}>Điểm GPA (Hệ 4)</Text>
        <Text style={styles.gpaValue}>{formattedGpa}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.col}>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
        <Text style={styles.creditsValue}>{totalCredits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  col: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  label: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: spacing.xs,
  },
  gpaValue: {
    ...typography.h1,
    color: colors.white,
    fontWeight: '800',
  },
  creditsValue: {
    ...typography.h1,
    color: colors.white,
    fontWeight: '800',
  },
});
