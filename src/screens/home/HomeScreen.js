import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import { daysLeft } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Tổng quan (HomeScreen)
 * Hiển thị họ tên, mã SV, môn đang học, bài tập đến hạn trong 7 ngày tới, số thay đổi chưa đồng bộ
 */
export default function HomeScreen({ navigation }) {
  const {
    student,
    courses,
    assignments,
    lastUpdated,
    loading,
    error,
    reloadAll,
    toggleAssignmentStatus,
  } = useAppData();

  const { pendingCount, syncing, syncNow, isOnline, isItemPending } = useSync();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  // Lọc bài tập đến hạn trong 7 ngày tới (0 <= daysLeft <= 7)
  const upcomingAssignments = useMemo(() => {
    return assignments.filter(item => {
      const days = daysLeft(item.dueDate);
      return days >= 0 && days <= 7;
    });
  }, [assignments]);

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin tổng quan…" />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={reloadAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scroll
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.content}>
        {/* Header Thông tin sinh viên */}
        <View style={styles.studentCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>
              {student?.fullName ? student.fullName.split(' ').pop().charAt(0) : 'SV'}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.studentName}>{student?.fullName || 'Sinh viên'}</Text>
            <Text style={styles.studentMeta}>
              {student?.studentCode} • {student?.className}
            </Text>
          </View>
        </View>

        {/* Thanh cảnh báo đồng bộ nếu có thay đổi chưa đẩy lên server */}
        {pendingCount > 0 ? (
          <View style={styles.syncCard}>
            <View style={styles.syncCardLeft}>
              <Text style={styles.syncIcon}>⏳</Text>
              <View>
                <Text style={styles.syncTitle}>Thay đổi chưa đồng bộ</Text>
                <Text style={styles.syncSubtitle}>
                  Có {pendingCount} thao tác đang đợi mạng
                </Text>
              </View>
            </View>
            {isOnline ? (
              <AppButton
                title="Đồng bộ ngay"
                onPress={syncNow}
                loading={syncing}
                variant="primary"
                style={styles.syncButton}
                accessibilityLabel="Đồng bộ dữ liệu ngay"
              />
            ) : (
              <Text style={styles.offlineText}>Đang ngoại tuyến</Text>
            )}
          </View>
        ) : null}

        {/* Thời gian cập nhật lần cuối */}
        <View style={styles.lastUpdatedContainer}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>

        {/* Thống kê nhanh */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{courses.length}</Text>
            <Text style={styles.statLabel}>Môn đang học</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {assignments.filter(a => a.status === 'todo').length}
            </Text>
            <Text style={styles.statLabel}>Bài tập cần làm</Text>
          </View>
        </View>

        {/* Danh sách bài tập đến hạn 7 ngày tới */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bài tập đến hạn (7 ngày tới)</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_TAB)}
            accessibilityRole="button"
            accessibilityLabel="Xem tất cả bài tập"
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Xem tất cả ({assignments.length})</Text>
          </TouchableOpacity>
        </View>

        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map(item => (
            <AssignmentItem
              key={`home-assign-${item.id}`}
              assignment={item}
              pending={isItemPending(item.id, 'assignment')}
              onPress={() =>
                navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
              }
              onToggleStatus={() => toggleAssignmentStatus(item.id)}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>🎉 Không có bài tập nào đến hạn trong 7 ngày tới</Text>
          </View>
        )}

        {/* Danh sách môn học */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Môn học học kỳ này</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.COURSE_TAB)}
            accessibilityRole="button"
            accessibilityLabel="Xem tất cả môn học"
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Xem tất cả ({courses.length})</Text>
          </TouchableOpacity>
        </View>

        {courses.slice(0, 3).map(course => (
          <CourseCard
            key={`home-course-${course.id}`}
            course={course}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
            }
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  studentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.white,
  },
  studentInfo: {
    flex: 1,
  },
  welcomeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  studentName: {
    ...typography.h2,
    color: colors.text,
  },
  studentMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.syncBadgeBg,
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  syncCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncIcon: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  syncTitle: {
    ...typography.bodyBold,
    color: colors.syncBadgeText,
  },
  syncSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  syncButton: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  offlineText: {
    ...typography.captionBold,
    color: colors.danger,
  },
  lastUpdatedContainer: {
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAllBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  seeAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
