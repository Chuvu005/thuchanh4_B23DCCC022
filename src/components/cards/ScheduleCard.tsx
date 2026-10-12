import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScheduleItem } from '../../types';
import { Colors, Shadows } from '../../theme/colors';
import { ClockIcon, LocationIcon, ChevronRightIcon } from '../common/Icons';
import { Badge } from '../common/Badge';

interface ScheduleCardProps {
  schedule: ScheduleItem;
  isToday?: boolean;
  onPress: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  isToday = false,
  onPress,
}) => {
  // Determine if this session is past, current, or upcoming
  const getSessionState = (): 'past' | 'current' | 'upcoming' => {
    if (!isToday) {
      return 'upcoming';
    }
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const startInMinutes = startH * 60 + startM;
    const endInMinutes = endH * 60 + endM;

    if (currentTimeInMinutes > endInMinutes) {
      return 'past';
    } else if (currentTimeInMinutes >= startInMinutes && currentTimeInMinutes <= endInMinutes) {
      return 'current';
    }
    return 'upcoming';
  };

  const sessionState = getSessionState();
  const isPast = sessionState === 'past';
  const isCurrent = sessionState === 'current';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isPast && styles.pastCard,
        isCurrent && styles.currentCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.timeSidebar,
          { backgroundColor: isPast ? '#94A3B8' : schedule.color },
        ]}
      >
        <Text style={styles.timeSidebarText}>{schedule.startTime}</Text>
        <View style={styles.timeSidebarDivider} />
        <Text style={styles.timeSidebarText}>{schedule.endTime}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.codeRow}>
            <Text style={[styles.codeText, isPast && styles.pastText]}>
              {schedule.subjectCode}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.shiftText}>{schedule.shift}</Text>
          </View>
          <Badge
            type="schedule"
            scheduleState={sessionState}
            text={
              isCurrent
                ? 'Đang diễn ra'
                : isPast
                ? 'Đã kết thúc'
                : 'Sắp diễn ra'
            }
          />
        </View>

        <Text
          style={[styles.title, isPast && styles.pastTitle]}
          numberOfLines={2}
        >
          {schedule.subjectName}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <LocationIcon size={14} color={isPast ? Colors.textMuted : Colors.primary} />
            <Text style={[styles.infoText, isPast && styles.pastText]}>
              {schedule.room}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <ClockIcon size={14} color={Colors.textMuted} />
            <Text style={[styles.infoText, isPast && styles.pastText]}>
              {schedule.startTime} - {schedule.endTime}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.instructorText, isPast && styles.pastText]} numberOfLines={1}>
            GV: {schedule.instructor}
          </Text>
          <View style={styles.viewDetail}>
            <Text style={[styles.viewDetailText, isPast && styles.pastText]}>Chi tiết</Text>
            <ChevronRightIcon size={16} color={isPast ? Colors.textMuted : Colors.primary} />
          </View>
        </View>

        {schedule.note && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText} numberOfLines={1}>
              Ghi chú: {schedule.note}
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  pastCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  currentCard: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#FAF5FF',
  },
  timeSidebar: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  timeSidebarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  timeSidebarDivider: {
    width: 14,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginVertical: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 6,
  },
  shiftText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  pastTitle: {
    color: '#64748B',
  },
  pastText: {
    color: '#94A3B8',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  instructorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 2,
  },
  noteBox: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.cardBackgroundAlt,
    borderRadius: 6,
  },
  noteText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
