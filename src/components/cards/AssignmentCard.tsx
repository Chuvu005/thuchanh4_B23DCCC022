import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Assignment, AssignmentStatus } from '../../types';
import { Colors, Shadows } from '../../theme/colors';
import { ClockIcon, ChevronRightIcon, AlertCircleIcon, CheckIcon } from '../common/Icons';
import { Badge } from '../common/Badge';

interface AssignmentCardProps {
  assignment: Assignment;
  onPress: () => void;
  onQuickToggleStatus?: (id: string, newStatus: AssignmentStatus) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onPress,
  onQuickToggleStatus,
}) => {
  const isOverdue = assignment.status === 'overdue';
  const isCompleted = assignment.status === 'completed';
  const isInProgress = assignment.status === 'in_progress';

  // Check if due soon (e.g. within 3 days or status is in_progress / pending)
  const isDueSoon = !isCompleted && !isOverdue && assignment.dueDateFormatted.includes('15/10');

  const getNextStatus = (current: AssignmentStatus): AssignmentStatus => {
    switch (current) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'pending';
      case 'overdue':
        return 'completed';
    }
  };

  const handleToggle = () => {
    if (onQuickToggleStatus) {
      onQuickToggleStatus(assignment.id, getNextStatus(assignment.status));
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isOverdue && styles.overdueCard,
        isDueSoon && styles.dueSoonCard,
        isCompleted && styles.completedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Alert banner if overdue or due soon */}
      {isOverdue && (
        <View style={styles.alertBannerOverdue}>
          <AlertCircleIcon size={14} color="#DC2626" />
          <Text style={styles.alertBannerOverdueText}>Đã quá hạn nộp bài!</Text>
        </View>
      )}
      {isDueSoon && (
        <View style={styles.alertBannerDueSoon}>
          <ClockIcon size={14} color="#D97706" />
          <Text style={styles.alertBannerDueSoonText}>Sắp đến hạn nộp bài</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectCodeText}>{assignment.subjectCode}</Text>
          </View>
          <Badge status={assignment.status} />
        </View>

        <Text
          style={[styles.title, isCompleted && styles.completedTitleText]}
          numberOfLines={2}
        >
          {assignment.title}
        </Text>

        <Text style={styles.subjectNameText} numberOfLines={1}>
          Môn: {assignment.subjectName}
        </Text>

        <View style={styles.dueDateRow}>
          <ClockIcon size={14} color={isOverdue ? '#EF4444' : isDueSoon ? '#F59E0B' : Colors.textMuted} />
          <Text
            style={[
              styles.dueDateText,
              isOverdue && styles.overdueDueDateText,
              isDueSoon && styles.dueSoonDueDateText,
            ]}
          >
            Hạn nộp: {assignment.dueDateFormatted}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[
              styles.quickStatusBtn,
              isCompleted ? styles.quickStatusBtnDone : styles.quickStatusBtnActive,
            ]}
            onPress={handleToggle}
            activeOpacity={0.7}
          >
            {isCompleted ? (
              <CheckIcon size={14} color="#059669" />
            ) : (
              <View style={styles.quickStatusDot} />
            )}
            <Text
              style={[
                styles.quickStatusBtnText,
                isCompleted ? styles.quickStatusBtnTextDone : styles.quickStatusBtnTextActive,
              ]}
            >
              {isCompleted
                ? 'Đã xong (Bấm để mở lại)'
                : isInProgress
                ? 'Đang làm -> Đánh dấu xong'
                : 'Chưa làm -> Bắt đầu làm'}
            </Text>
          </TouchableOpacity>

          <View style={styles.viewDetailWrapper}>
            <Text style={styles.viewDetailText}>Chi tiết</Text>
            <ChevronRightIcon size={16} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  overdueCard: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  dueSoonCard: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFDF5',
  },
  completedCard: {
    borderColor: Colors.border,
    backgroundColor: '#FBFDFB',
    opacity: 0.9,
  },
  alertBannerOverdue: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertBannerOverdueText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  alertBannerDueSoon: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertBannerDueSoonText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectCodeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  completedTitleText: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  subjectNameText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dueDateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  overdueDueDateText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  dueSoonDueDateText: {
    color: '#D97706',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  quickStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickStatusBtnActive: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.border,
  },
  quickStatusBtnDone: {
    backgroundColor: Colors.badgeCompletedBg,
    borderColor: '#A7F3D0',
  },
  quickStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  quickStatusBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickStatusBtnTextActive: {
    color: Colors.textPrimary,
  },
  quickStatusBtnTextDone: {
    color: Colors.badgeCompletedText,
  },
  viewDetailWrapper: {
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
