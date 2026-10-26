import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector, { getTodayDayOfWeek } from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

/**
 * Màn hình Thời khóa biểu (ScheduleScreen)
 * Chọn ngày bằng DaySelector, hiển thị danh sách các buổi học trong ngày
 */
export default function ScheduleScreen({ navigation }) {
  const { sessions, loading, error, lastUpdated, reloadAll } = useAppData();
  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());
  const [refreshing, setRefreshing] = useState(false);

  // Lọc các buổi học theo thứ được chọn
  const daySessions = useMemo(() => {
    return sessions
      .filter(s => Number(s.dayOfWeek) === Number(selectedDay))
      .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  }, [sessions, selectedDay]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  if (loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu…" />
      </ScreenContainer>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={reloadAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      {/* Thanh chọn ngày trong tuần */}
      <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

      <View style={styles.lastUpdatedWrapper}>
        <LastUpdatedText timestamp={lastUpdated} />
      </View>

      <FlatList
        data={daySessions}
        keyExtractor={item => `session-${item.id}`}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            description="Bạn không có tiết học nào trong ngày này. Hãy tận hưởng thời gian rảnh hoặc ôn bài nhé!"
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lastUpdatedWrapper: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
