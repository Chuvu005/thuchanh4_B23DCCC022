import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {{
 *   id: number|string,
 *   total: number,
 *   letter: string,
 *   course?: { name: string, code: string, credits: number }
 * }} grade - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
function GradeRow({ grade, onPress }) {
  if (!grade) return null;

  const courseName = grade.course?.name || `Môn học #${grade.courseId}`;
  const courseCredits = grade.course?.credits || 3;
  const courseCode = grade.course?.code;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Xem điểm môn ${courseName}, điểm tổng kết ${grade.total}, điểm chữ ${grade.letter}`}
    >
      <View style={styles.leftCol}>
        {courseCode ? (
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{courseCode}</Text>
          </View>
        ) : null}
        <Text style={styles.courseName} numberOfLines={2}>
          {courseName}
        </Text>
        <Text style={styles.creditsText}>{courseCredits} tín chỉ</Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.totalScore}>{grade.total.toFixed(2)}</Text>
        <View style={styles.letterBadge}>
          <Text style={styles.letterText}>{grade.letter}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  leftCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  codeText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.primary,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 2,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalScore: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  letterBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  letterText: {
    ...typography.captionBold,
    color: colors.secondary,
  },
});

export default React.memo(GradeRow);
