import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {'todo' | 'done'} [status='todo']
 * @param {() => void} onToggle - Bắt buộc
 */
export default function StatusToggle({ status = 'todo', onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={[styles.container, isDone ? styles.containerDone : styles.containerTodo]}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={isDone ? 'Đánh dấu bài tập chưa hoàn thành' : 'Đánh dấu bài tập đã hoàn thành'}
    >
      <Text style={styles.icon}>{isDone ? '✓' : '○'}</Text>
      <Text style={[styles.text, isDone ? styles.textDone : styles.textTodo]}>
        {isDone ? 'Đã xong' : 'Chưa xong'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  containerDone: {
    backgroundColor: colors.completedBadgeBg,
    borderColor: colors.success,
  },
  containerTodo: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  text: {
    ...typography.captionBold,
  },
  textDone: {
    color: colors.completedBadgeText,
  },
  textTodo: {
    color: colors.textSecondary,
  },
});
