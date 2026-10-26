/**
 * @param {string} title - Bắt buộc
 * @param {string} [description]
 * @param {string} [actionLabel]
 * @param {() => void} [onAction]
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function EmptyState({
  title,
  description = '',
  actionLabel = 'Thử lại',
  onAction,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction ? (
        <AppButton
          title={actionLabel}
          variant="outline"
          onPress={onAction}
          style={styles.actionButton}
          accessibilityLabel={actionLabel}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  actionButton: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});
