import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GradeItem } from '../../types';
import { Colors, Shadows } from '../../theme/colors';
import { ChevronRightIcon, AwardIcon } from '../common/Icons';

interface GradeCardProps {
  grade: GradeItem;
  onPress: () => void;
}

export const GradeCard: React.FC<GradeCardProps> = ({ grade, onPress }) => {
  const isHighGrade = grade.totalScore10 >= 8.5;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{grade.subjectCode}</Text>
        </View>
        <View style={styles.creditsBadge}>
          <Text style={styles.creditsText}>{grade.credits} TC</Text>
        </View>
      </View>

      <Text style={styles.subjectName} numberOfLines={2}>
        {grade.subjectName}
      </Text>

      <Text style={styles.semesterText}>{grade.semester}</Text>

      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreBoxLabel}>Hệ 10</Text>
          <Text
            style={[
              styles.scoreBoxValue,
              isHighGrade ? styles.highScoreText : styles.normalScoreText,
            ]}
          >
            {grade.totalScore10.toFixed(1)}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreBoxLabel}>Hệ 4</Text>
          <Text style={styles.scoreBoxValue}>{grade.totalScore4.toFixed(1)}</Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreBoxLabel}>Điểm chữ</Text>
          <View style={styles.letterBadge}>
            <Text style={styles.letterBadgeText}>{grade.letterGrade}</Text>
          </View>
        </View>

        <View style={styles.evaluationBox}>
          <Text style={styles.scoreBoxLabel}>Xếp loại</Text>
          <View style={styles.evaluationRow}>
            {isHighGrade && <AwardIcon size={14} color="#F59E0B" />}
            <Text style={styles.evaluationText}>{grade.evaluation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.passedText}>Trạng thái: Đạt học phần</Text>
        <View style={styles.viewDetail}>
          <Text style={styles.viewDetailText}>Xem chi tiết đầu điểm</Text>
          <ChevronRightIcon size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  creditsBadge: {
    backgroundColor: Colors.cardBackgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditsText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  semesterText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreBoxLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  scoreBoxValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  highScoreText: {
    color: Colors.successDark,
  },
  normalScoreText: {
    color: Colors.textPrimary,
  },
  letterBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 6,
  },
  letterBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  evaluationBox: {
    alignItems: 'center',
  },
  evaluationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  evaluationText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  passedText: {
    fontSize: 12,
    color: Colors.successDark,
    fontWeight: '600',
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },
});
