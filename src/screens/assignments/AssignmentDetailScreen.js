import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import StatusToggle from '../../components/assignment/StatusToggle';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import { assignmentService } from '../../api/assignmentService';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Chi tiết bài tập (AssignmentDetailScreen)
 * Nhận { id } qua route.params, tự gọi API và hỗ trợ cập nhật trạng thái
 */
export default function AssignmentDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { assignments, toggleAssignmentStatus } = useAppData();
  const { isItemPending } = useSync();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu mới nhất từ Context nếu assignment trong context thay đổi
  useEffect(() => {
    const updatedFromContext = assignments.find(a => String(a.id) === String(id));
    if (updatedFromContext) {
      setAssignment(updatedFromContext);
    }
  }, [assignments, id]);

  useLayoutEffect(() => {
    const title = assignment?.title ? assignment.title : 'Chi tiết bài tập';
    navigation.setOptions({ title });
  }, [navigation, assignment]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = assignments.find(a => String(a.id) === String(id));
    if (cached) {
      setAssignment(cached);
    }

    try {
      const data = await assignmentService.getById(id);
      if (data) {
        setAssignment(data);
      }
    } catch (err) {
      if (!cached) {
        setError(err.message || 'Không thể tải chi tiết bài tập');
      }
    } finally {
      setLoading(false);
    }
  }, [id, assignments]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const currentAssignment = assignments.find(a => String(a.id) === String(id)) || assignment;

  const handleToggle = () => {
    if (currentAssignment) {
      toggleAssignmentStatus(currentAssignment.id);
    }
  };

  if (loading && !currentAssignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && !currentAssignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadDetail} />
      </ScreenContainer>
    );
  }

  const overdue = isOverdue(currentAssignment?.dueDate, currentAssignment?.status);
  const pending = isItemPending(currentAssignment?.id, 'assignment');

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.badges}>
              {currentAssignment?.course?.code ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{currentAssignment.course.code}</Text>
                </View>
              ) : null}
              <SyncBadge pending={pending} />
            </View>

            <StatusToggle
              status={currentAssignment?.status}
              onToggle={handleToggle}
            />
          </View>

          <Text style={[styles.title, currentAssignment?.status === 'done' && styles.titleDone]}>
            {currentAssignment?.title}
          </Text>

          <View style={styles.rowsContainer}>
            <InfoRow
              label="Môn học"
              value={currentAssignment?.course?.name || 'Chưa cập nhật'}
            />
            <InfoRow
              label="Hạn nộp"
              value={formatDate(currentAssignment?.dueDate, true)}
            />
            <InfoRow
              label="Trạng thái"
              value={
                currentAssignment?.status === 'done'
                  ? 'Đã hoàn thành'
                  : overdue
                  ? 'Quá hạn nộp'
                  : 'Chưa hoàn thành'
              }
            />
            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(currentAssignment?.updatedAt, true)}
            />
          </View>

          {currentAssignment?.description ? (
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>Mô tả yêu cầu:</Text>
              <Text style={styles.descText}>{currentAssignment.description}</Text>
            </View>
          ) : null}
        </View>
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
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  rowsContainer: {
    marginTop: spacing.sm,
  },
  descSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  descLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  descText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
});
