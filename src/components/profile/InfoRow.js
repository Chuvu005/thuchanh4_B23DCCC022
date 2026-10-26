import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {string} label - Bắt buộc
 * @param {string|number} [value=""]
 */
export default function InfoRow({ label, value = '' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value !== null && value !== undefined && value !== '' ? String(value) : '---'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    minHeight: 44,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    paddingLeft: spacing.sm,
  },
});
