import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Thông tin cá nhân (ProfileScreen)
 * Mã SV, họ tên, lớp, ngành, email, SĐT, GPA tóm tắt
 */
export default function ProfileScreen({ navigation }) {
  const { student, grades, courses, loading, error, lastUpdated, reloadAll } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  // Tính GPA tóm tắt có trọng số theo tín chỉ
  const { gpa, totalCredits } = useMemo(() => {
    return calcGpa(grades, courses);
  }, [grades, courses]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải hồ sơ sinh viên…" />
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
        {/* Avatar và tên */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student?.fullName ? student.fullName.split(' ').pop().charAt(0) : 'SV'}
            </Text>
          </View>
          <Text style={styles.fullName}>{student?.fullName}</Text>
          <Text style={styles.subText}>
            {student?.studentCode} • {student?.className}
          </Text>
        </View>

        {/* Tóm tắt GPA */}
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />

        {/* Bảng thông tin chi tiết */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Thông tin học tập</Text>
          <InfoRow label="Mã sinh viên" value={student?.studentCode} />
          <InfoRow label="Lớp sinh hoạt" value={student?.className} />
          <InfoRow label="Chuyên ngành" value={student?.major} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
          <InfoRow label="Email sinh viên" value={student?.email} />
          <InfoRow label="Số điện thoại" value={student?.phone} />
        </View>

        {/* Các nút hành động */}
        <View style={styles.actionButtons}>
          <AppButton
            title="Chỉnh sửa thông tin"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            style={styles.button}
            accessibilityLabel="Chỉnh sửa thông tin cá nhân"
          />
          <AppButton
            title="Xem kết quả học tập"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
            style={styles.button}
            accessibilityLabel="Xem bảng điểm học tập"
          />
        </View>

        <View style={styles.lastUpdatedContainer}>
          <LastUpdatedText timestamp={lastUpdated} />
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
  },
  fullName: {
    ...typography.h2,
    color: colors.text,
  },
  subText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
  },
  lastUpdatedContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
});
