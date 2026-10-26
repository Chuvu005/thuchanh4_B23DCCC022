import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {{
 *   id: number|string,
 *   courseId: number|string,
 *   dayOfWeek: number,
 *   startTime: string,
 *   endTime: string,
 *   room: string,
 *   note?: string,
 *   course?: { name: string, code: string, lecturer?: string }
 * }} session - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
function SessionCard({ session, onPress }) {
  if (!session) return null;

  const courseName = session.course?.name || `Môn học #${session.courseId}`;
  const courseCode = session.course?.code;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Buổi học môn ${courseName}, phòng ${session.room}, thời gian ${session.startTime} đến ${session.endTime}`}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{session.startTime}</Text>
        <Text style={styles.timeDivider}>|</Text>
        <Text style={styles.timeText}>{session.endTime}</Text>
      </View>

      <View style={styles.dividerVertical} />

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          {courseCode ? (
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{courseCode}</Text>
            </View>
          ) : null}
          <Text style={styles.roomText}>📍 {session.room}</Text>
        </View>

        <Text style={styles.courseName} numberOfLines={2}>
          {courseName}
        </Text>

        {session.note ? (
          <Text style={styles.noteText} numberOfLines={1}>
            📝 {session.note}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  timeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  timeDivider: {
    ...typography.small,
    color: colors.textLight,
    marginVertical: 2,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeBadgeText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.primary,
  },
  roomText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  noteText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default React.memo(SessionCard);
