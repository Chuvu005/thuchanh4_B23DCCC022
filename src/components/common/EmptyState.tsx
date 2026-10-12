import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchIcon, BookOpenIcon, AssignmentIcon, CalendarIcon } from './Icons';
import { Colors } from '../../theme/colors';

interface EmptyStateProps {
  iconType?: 'search' | 'subject' | 'assignment' | 'schedule';
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconType = 'search',
  title = 'Không tìm thấy dữ liệu',
  description = 'Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.',
  actionText,
  onActionPress,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'subject':
        return <BookOpenIcon size={44} color={Colors.textMuted} />;
      case 'assignment':
        return <AssignmentIcon size={44} color={Colors.textMuted} />;
      case 'schedule':
        return <CalendarIcon size={44} color={Colors.textMuted} />;
      default:
        return <SearchIcon size={44} color={Colors.textMuted} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionText && onActionPress && (
        <TouchableOpacity style={styles.actionBtn} onPress={onActionPress} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
