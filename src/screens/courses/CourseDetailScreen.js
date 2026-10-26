import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { courseService } from '../../api/courseService';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Chi tiết môn học (CourseDetailScreen)
 * Nhận { id } qua route.params, tự gọi API lấy dữ liệu và fallback cache
 */
export default function CourseDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { courses, sessions, assignments, toggleAssignmentStatus } = useAppData();
  const { isItemPending } = useSync();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cập nhật tiêu đề màn hình theo tên môn học
  useLayoutEffect(() => {
    if (course?.name) {
      navigation.setOptions({
        title: course.name,
      });
    } else {
      navigation.setOptions({
        title: 'Chi tiết môn học',
      });
    }
  }, [navigation, course]);

  const loadCourseDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Kiểm tra trong danh sách courses hiện có (cache)
    const cachedItem = courses.find(c => String(c.id) === String(id));
    if (cachedItem) {
      setCourse(cachedItem);
    }

    // 2. Gọi API lấy chi tiết môn học
    try {
      const data = await courseService.getById(id);
      if (data) {
        setCourse(data);
      }
    } catch (err) {
      // Nếu không có cả cache lẫn mạng thì báo lỗi
      if (!cachedItem) {
        setError(err.message || 'Không thể tải chi tiết môn học');
      }
    } finally {
      setLoading(false);
    }
  }, [id, courses]);

  useEffect(() => {
    loadCourseDetail();
  }, [loadCourseDetail]);

  // Lấy các buổi học của môn này
  const courseSessions = sessions.filter(
    s => String(s.courseId) === String(id)
  );

  // Lấy các bài tập của môn này
  const courseAssignments = assignments.filter(
    a => String(a.courseId) === String(id)
  );

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadCourseDetail} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        {/* Thẻ tổng quan môn học */}
        <View style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{course?.code}</Text>
            </View>
            <Text style={styles.creditsText}>{course?.credits} tín chỉ</Text>
          </View>

          <Text style={styles.courseTitle}>{course?.name}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giảng viên:</Text>
            <Text style={styles.infoValue}>{course?.lecturer}</Text>
          </View>

          {course?.semester ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Học kỳ:</Text>
              <Text style={styles.infoValue}>{course.semester}</Text>
            </View>
          ) : null}

          {course?.description ? (
            <View style={styles.descContainer}>
              <Text style={styles.descLabel}>Mô tả môn học:</Text>
              <Text style={styles.descText}>{course.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Lịch học của môn */}
        <Text style={styles.sectionTitle}>Lịch học ({courseSessions.length})</Text>
        {courseSessions.length > 0 ? (
          courseSessions.map(session => (
            <SessionCard
              key={`session-${session.id}`}
              session={session}
              onPress={() =>
                navigation.navigate(ROUTES.SESSION_DETAIL, { id: session.id })
              }
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có lịch học cho môn này</Text>
          </View>
        )}

        {/* Bài tập của môn */}
        <Text style={styles.sectionTitle}>Bài tập ({courseAssignments.length})</Text>
        {courseAssignments.length > 0 ? (
          courseAssignments.map(assign => (
            <AssignmentItem
              key={`assign-${assign.id}`}
              assignment={assign}
              pending={isItemPending(assign.id, 'assignment')}
              onPress={() =>
                navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: assign.id })
              }
              onToggleStatus={() => toggleAssignmentStatus(assign.id)}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có bài tập cho môn này</Text>
          </View>
        )}
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
  headerCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  creditsText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  courseTitle: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  infoLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    width: 90,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  descContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  descLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  descText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
