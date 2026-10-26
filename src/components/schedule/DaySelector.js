import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { day: 2, label: 'T2', fullLabel: 'Thứ Hai' },
  { day: 3, label: 'T3', fullLabel: 'Thứ Ba' },
  { day: 4, label: 'T4', fullLabel: 'Thứ Tư' },
  { day: 5, label: 'T5', fullLabel: 'Thứ Năm' },
  { day: 6, label: 'T6', fullLabel: 'Thứ Sáu' },
  { day: 7, label: 'T7', fullLabel: 'Thứ Bảy' },
  { day: 8, label: 'CN', fullLabel: 'Chủ Nhật' },
];

/**
 * Lấy thứ hiện tại theo quy ước: 2 = Thứ 2 ... 8 = Chủ nhật
 */
export function getTodayDayOfWeek() {
  const jsDay = new Date().getDay(); // 0 = CN, 1 = T2 ... 6 = T7
  return jsDay === 0 ? 8 : jsDay + 1;
}

/**
 * @param {number} [selectedDay] - Thứ được chọn (2 - 8)
 * @param {(day: number) => void} onSelectDay - Bắt buộc
 */
export default function DaySelector({
  selectedDay = getTodayDayOfWeek(),
  onSelectDay,
}) {
  return (
    <View style={styles.container}>
      {DAYS.map(item => {
        const isSelected = selectedDay === item.day;
        return (
          <TouchableOpacity
            key={`day-${item.day}`}
            style={[styles.dayButton, isSelected ? styles.dayButtonSelected : styles.dayButtonNormal]}
            onPress={() => onSelectDay(item.day)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Chọn lịch học ${item.fullLabel}`}
          >
            <Text
              style={[
                styles.dayText,
                isSelected ? styles.dayTextSelected : styles.dayTextNormal,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
  },
  dayButtonNormal: {
    backgroundColor: 'transparent',
  },
  dayText: {
    ...typography.captionBold,
  },
  dayTextSelected: {
    color: colors.white,
  },
  dayTextNormal: {
    color: colors.textSecondary,
  },
});
