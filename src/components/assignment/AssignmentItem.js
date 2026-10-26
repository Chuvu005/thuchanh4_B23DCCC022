import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {{
 *   id: number|string,
 *   title: string,
 *   dueDate: string,
 *   status: 'todo' | 'done',
 *   course?: { name: string, code: string }
 * }} assignment - Bắt buộc
 * @param {boolean} [pending=false]
 * @param {() => void} onPress - Bắt buộc
 * @param {() => void} onToggleStatus - Bắt buộc
 */
function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}) {
  if (!assignment) return null;

  const overdue = isOverdue(assignment.dueDate, assignment.status);
  const courseName = assignment.course?.name || '';

  return (
    <TouchableOpacity
      style={[styles.card, overdue ? styles.cardOverdue : null]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${assignment.title}, hạn nộp ${formatDate(assignment.dueDate, true)}`}
    >
      <View style={styles.topRow}>
        <View style={styles.badgesGroup}>
          {courseName ? (
            <View style={styles.courseBadge}>
              <Text style={styles.courseBadgeText} numberOfLines={1}>
                {assignment.course?.code || courseName}
              </Text>
            </View>
          ) : null}
          <SyncBadge pending={pending} />
        </View>

        <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      </View>

      <Text style={[styles.title, assignment.status === 'done' && styles.titleDone]} numberOfLines={2}>
        {assignment.title}
      </Text>

      {courseName ? (
        <Text style={styles.courseName} numberOfLines={1}>
          📚 {courseName}
        </Text>
      ) : null}

      <View style={styles.bottomRow}>
        <Text style={[styles.dueDate, overdue ? styles.dueDateOverdue : null]}>
          ⏰ Hạn nộp: {formatDate(assignment.dueDate, true)}
        </Text>
        {overdue ? <Text style={styles.overdueBadge}>Quá hạn</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  cardOverdue: {
    borderColor: colors.danger,
    backgroundColor: '#FFFDFD',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  courseBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: 140,
  },
  courseBadgeText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  courseName: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dueDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '600',
  },
  overdueBadge: {
    ...typography.small,
    color: colors.danger,
    backgroundColor: colors.overdueBadgeBg,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '700',
  },
});

export default React.memo(AssignmentItem);
