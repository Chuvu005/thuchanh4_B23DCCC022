import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import { sessionService } from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import { getDayOfWeekName } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Chi tiết buổi học (SessionDetailScreen)
 * Nhận { id } qua route.params, lấy chi tiết từ API hoặc cache
 */
export default function SessionDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { sessions } = useAppData();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    const title = session?.course?.name ? `Buổi học: ${session.course.name}` : 'Chi tiết buổi học';
    navigation.setOptions({ title });
  }, [navigation, session]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = sessions.find(s => String(s.id) === String(id));
    if (cached) {
      setSession(cached);
    }

    try {
      const data = await sessionService.getById(id);
      if (data) {
        setSession(data);
      }
    } catch (err) {
      if (!cached) {
        setError(err.message || 'Không thể tải thông tin buổi học');
      }
    } finally {
      setLoading(false);
    }
  }, [id, sessions]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học…" />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadDetail} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            {session?.course?.code ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{session.course.code}</Text>
              </View>
            ) : null}
            <Text style={styles.roomBadge}>Phòng: {session?.room}</Text>
          </View>

          <Text style={styles.courseName}>{session?.course?.name || 'Môn học'}</Text>

          <View style={styles.rowsContainer}>
            <InfoRow label="Thứ trong tuần" value={getDayOfWeekName(session?.dayOfWeek)} />
            <InfoRow
              label="Thời gian học"
              value={`${session?.startTime} - ${session?.endTime}`}
            />
            <InfoRow label="Phòng học" value={session?.room} />
            <InfoRow
              label="Giảng viên"
              value={session?.course?.lecturer || 'Chưa cập nhật'}
            />
            <InfoRow
              label="Số tín chỉ"
              value={session?.course?.credits ? `${session.course.credits} tín chỉ` : ''}
            />
            <InfoRow
              label="Ghi chú buổi học"
              value={session?.note || 'Không có ghi chú'}
            />
          </View>
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
  roomBadge: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  courseName: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  rowsContainer: {
    marginTop: spacing.sm,
  },
});
