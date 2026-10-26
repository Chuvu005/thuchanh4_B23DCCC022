import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import { gradeService } from '../../api/gradeService';
import { useAppData } from '../../context/AppDataContext';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Chi tiết điểm môn học (GradeDetailScreen)
 * Nhận { id } qua route.params, tự gọi API lấy dữ liệu và hiển thị chi tiết các đầu điểm
 */
export default function GradeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { grades } = useAppData();

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    const title = grade?.course?.name ? `Điểm: ${grade.course.name}` : 'Chi tiết kết quả học tập';
    navigation.setOptions({ title });
  }, [navigation, grade]);

  const loadGradeDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = grades.find(g => String(g.id) === String(id));
    if (cached) {
      setGrade(cached);
    }

    try {
      const data = await gradeService.getById(id);
      if (data) {
        setGrade(data);
      }
    } catch (err) {
      if (!cached) {
        setError(err.message || 'Không thể tải chi tiết điểm môn học');
      }
    } finally {
      setLoading(false);
    }
  }, [id, grades]);

  useEffect(() => {
    loadGradeDetail();
  }, [loadGradeDetail]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết điểm…" />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadGradeDetail} />
      </ScreenContainer>
    );
  }

  const { scale4 } = toScale4(grade?.total);

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        {/* Thẻ tổng kết điểm */}
        <View style={styles.summaryCard}>
          <Text style={styles.courseName}>{grade?.course?.name || 'Môn học'}</Text>
          <Text style={styles.courseCode}>
            Mã môn: {grade?.course?.code || 'N/A'} • {grade?.course?.credits || 3} tín chỉ
          </Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Hệ 10</Text>
              <Text style={styles.scoreValue}>{Number(grade?.total).toFixed(2)}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Điểm chữ</Text>
              <Text style={styles.scoreValueLetter}>{grade?.letter}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Hệ 4</Text>
              <Text style={styles.scoreValue}>{scale4.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Chi tiết các thành phần điểm */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeading}>Các thành phần điểm</Text>
          <InfoRow
            label="Chuyên cần (10%)"
            value={grade?.attendance !== undefined ? `${grade.attendance} / 10` : '---'}
          />
          <InfoRow
            label="Giữa kỳ (30%)"
            value={grade?.midterm !== undefined ? `${grade.midterm} / 10` : '---'}
          />
          <InfoRow
            label="Cuối kỳ (60%)"
            value={grade?.final !== undefined ? `${grade.final} / 10` : '---'}
          />
          <InfoRow
            label="Tổng kết (Hệ 10)"
            value={grade?.total !== undefined ? `${Number(grade.total).toFixed(2)}` : '---'}
          />
          <InfoRow label="Học kỳ" value={grade?.semester} />
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
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  courseName: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  courseCode: {
    ...typography.caption,
    color: colors.textMuted,
    marginVertical: spacing.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scoreValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '800',
  },
  scoreValueLetter: {
    ...typography.h2,
    color: colors.secondary,
    fontWeight: '800',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeading: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
