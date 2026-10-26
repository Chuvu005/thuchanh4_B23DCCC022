import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {{ id: number|string, code: string, name: string, credits: number, lecturer: string, semester?: string }} course - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
function CourseCard({ course, onPress }) {
  if (!course) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Môn học ${course.name}, mã môn ${course.code}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{course.code}</Text>
        </View>
        <Text style={styles.creditsText}>{course.credits} tín chỉ</Text>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {course.name}
      </Text>

      <View style={styles.lecturerRow}>
        <Text style={styles.lecturerIcon}>👨‍🏫</Text>
        <Text style={styles.lecturerText} numberOfLines={1}>
          {course.lecturer}
        </Text>
      </View>

      {course.semester ? (
        <View style={styles.semesterRow}>
          <Text style={styles.semesterText}>{course.semester}</Text>
        </View>
      ) : null}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  lecturerIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  lecturerText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  semesterRow: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  semesterText: {
    ...typography.small,
    color: colors.textMuted,
  },
});

export default React.memo(CourseCard);
