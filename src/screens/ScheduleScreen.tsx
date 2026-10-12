import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { ScheduleCard } from '../components/cards/ScheduleCard';
import { EmptyState } from '../components/common/EmptyState';
import { Colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DayTab {
  dayOfWeek: number;
  label: string;
  shortLabel: string;
}

const DAYS_OF_WEEK: DayTab[] = [
  { dayOfWeek: 2, label: 'Thứ Hai', shortLabel: 'T2' },
  { dayOfWeek: 3, label: 'Thứ Ba', shortLabel: 'T3' },
  { dayOfWeek: 4, label: 'Thứ Tư', shortLabel: 'T4' },
  { dayOfWeek: 5, label: 'Thứ Năm', shortLabel: 'T5' },
  { dayOfWeek: 6, label: 'Thứ Sáu', shortLabel: 'T6' },
  { dayOfWeek: 7, label: 'Thứ Bảy', shortLabel: 'T7' },
  { dayOfWeek: 8, label: 'Chủ Nhật', shortLabel: 'CN' },
];

export const ScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { schedules } = useAppData();

  // Active selected day of week (defaults to Monday / 2)
  const [selectedDay, setSelectedDay] = useState<number>(2);

  // Schedules for selected day
  const daySchedules = useMemo(() => {
    return schedules
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay]);

  const selectedDayInfo = DAYS_OF_WEEK.find(d => d.dayOfWeek === selectedDay);

  return (
    <View style={styles.container}>
      <Header
        title="Thời khóa biểu"
        subtitle={`${selectedDayInfo?.label} • ${daySchedules.length} ca học`}
      />

      {/* Weekday Selector Bar */}
      <View style={styles.weekSelectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekSelectorContent}
        >
          {DAYS_OF_WEEK.map(day => {
            const isSelected = day.dayOfWeek === selectedDay;
            const countForDay = schedules.filter(s => s.dayOfWeek === day.dayOfWeek).length;

            return (
              <TouchableOpacity
                key={day.dayOfWeek}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                ]}
                onPress={() => setSelectedDay(day.dayOfWeek)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayShortText,
                    isSelected && styles.dayShortTextSelected,
                  ]}
                >
                  {day.shortLabel}
                </Text>
                <Text
                  style={[
                    styles.dayCountText,
                    isSelected && styles.dayCountTextSelected,
                  ]}
                >
                  {countForDay > 0 ? `${countForDay} ca` : '-'}
                </Text>
                {isSelected && <View style={styles.selectedDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Schedule Summary Banner */}
      <View style={styles.summaryBanner}>
        <Text style={styles.summaryDayText}>{selectedDayInfo?.label}</Text>
        <Text style={styles.summarySubText}>
          {daySchedules.length > 0
            ? `Tổng cộng ${daySchedules.length} buổi học cần tham gia`
            : 'Không có tiết học theo thời khóa biểu'}
        </Text>
      </View>

      {/* Schedule List */}
      <FlatList
        data={daySchedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
            isToday={selectedDay === 2} // Assuming Monday is current day for demo
            onPress={() =>
              navigation.navigate('ScheduleDetail', { scheduleId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconType="schedule"
            title={`Không có lịch học ${selectedDayInfo?.label}`}
            description="Bạn được nghỉ học vào ngày này hoặc chưa có lịch giảng dạy phân công."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  weekSelectorWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  weekSelectorContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayButton: {
    width: 58,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayShortText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dayShortTextSelected: {
    color: '#FFFFFF',
  },
  dayCountText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  dayCountTextSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 3,
  },
  summaryBanner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryDayText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  summarySubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 28,
  },
});
