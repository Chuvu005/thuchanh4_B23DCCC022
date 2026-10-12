import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AssignmentStatus } from '../../types';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  status?: AssignmentStatus;
  type?: 'schedule' | 'grade' | 'custom';
  text?: string;
  scheduleState?: 'past' | 'current' | 'upcoming';
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  type = 'custom',
  text,
  scheduleState,
  variant,
}) => {
  let bgColor = Colors.cardBackgroundAlt;
  let textColor = Colors.textSecondary;
  let label = text || '';

  if (status) {
    switch (status) {
      case 'completed':
        bgColor = Colors.badgeCompletedBg;
        textColor = Colors.badgeCompletedText;
        label = 'Đã hoàn thành';
        break;
      case 'in_progress':
        bgColor = Colors.badgeInProgressBg;
        textColor = Colors.badgeInProgressText;
        label = 'Đang thực hiện';
        break;
      case 'pending':
        bgColor = Colors.badgePendingBg;
        textColor = Colors.badgePendingText;
        label = 'Chưa thực hiện';
        break;
      case 'overdue':
        bgColor = Colors.badgeOverdueBg;
        textColor = Colors.badgeOverdueText;
        label = 'Quá hạn';
        break;
    }
  } else if (type === 'schedule' && scheduleState) {
    switch (scheduleState) {
      case 'past':
        bgColor = '#F1F5F9';
        textColor = '#64748B';
        label = label || 'Đã kết thúc';
        break;
      case 'current':
        bgColor = Colors.badgeInProgressBg;
        textColor = Colors.badgeInProgressText;
        label = label || 'Đang diễn ra';
        break;
      case 'upcoming':
        bgColor = Colors.primaryLight;
        textColor = Colors.primary;
        label = label || 'Sắp diễn ra';
        break;
    }
  } else if (variant) {
    switch (variant) {
      case 'success':
        bgColor = Colors.successLight;
        textColor = Colors.successDark;
        break;
      case 'warning':
        bgColor = Colors.warningLight;
        textColor = Colors.warningDark;
        break;
      case 'danger':
        bgColor = Colors.dangerLight;
        textColor = Colors.dangerDark;
        break;
      case 'info':
        bgColor = Colors.infoLight;
        textColor = Colors.infoDark;
        break;
      case 'purple':
        bgColor = Colors.purpleLight;
        textColor = Colors.purple;
        break;
      case 'neutral':
        bgColor = Colors.cardBackgroundAlt;
        textColor = Colors.textSecondary;
        break;
    }
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
