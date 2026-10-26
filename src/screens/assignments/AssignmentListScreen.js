import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const FILTER_OPTIONS = ['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn'];

/**
 * Màn hình danh sách bài tập (AssignmentListScreen)
 * Lọc theo Tất cả / Chưa xong / Đã xong / Quá hạn
 * Nút thêm bài tập mới, cập nhật lạc quan trạng thái, đồng bộ offline
 */
export default function AssignmentListScreen({ navigation }) {
  const {
    assignments,
    loading,
    error,
    lastUpdated,
    reloadAll,
    toggleAssignmentStatus,
  } = useAppData();

  const { isItemPending } = useSync();
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const overdue = isOverdue(item.dueDate, item.status);
      if (selectedFilter === 'Chưa xong') {
        return item.status === 'todo';
      }
      if (selectedFilter === 'Đã xong') {
        return item.status === 'done';
      }
      if (selectedFilter === 'Quá hạn') {
        return overdue;
      }
      return true;
    });
  }, [assignments, selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={reloadAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.filterAndActionRow}>
          <View style={styles.filterWrapper}>
            <FilterChips
              options={FILTER_OPTIONS}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          </View>
          <AppButton
            title="+ Thêm"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
            style={styles.addButton}
            accessibilityLabel="Thêm bài tập mới"
          />
        </View>

        <View style={styles.lastUpdatedWrapper}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => `assign-${item.id}`}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={isItemPending(item.id, 'assignment')}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập nào"
            description={
              selectedFilter !== 'Tất cả'
                ? `Không có bài tập nào ở trạng thái "${selectedFilter}".`
                : 'Bạn chưa có bài tập nào được giao.'
            }
            actionLabel="Thêm bài tập"
            onAction={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
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
  topArea: {
    backgroundColor: colors.background,
    paddingTop: spacing.xs,
  },
  filterAndActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  filterWrapper: {
    flex: 1,
  },
  addButton: {
    minHeight: 40,
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  lastUpdatedWrapper: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
