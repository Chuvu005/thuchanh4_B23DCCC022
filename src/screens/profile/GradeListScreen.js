import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import GradeRow from '../../components/grade/GradeRow';
import GpaSummary from '../../components/grade/GpaSummary';
import FilterChips from '../../components/common/FilterChips';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

/**
 * Màn hình Bảng điểm (GradeListScreen)
 * Lọc theo học kỳ, tính GPA hệ 4 có trọng số tín chỉ, xem chi tiết
 */
export default function GradeListScreen({ navigation }) {
  const { grades, courses, loading, error, lastUpdated, reloadAll } = useAppData();
  const [selectedSemester, setSelectedSemester] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  // Danh sách các học kỳ từ grades
  const semesterOptions = useMemo(() => {
    const list = Array.from(new Set(grades.map(g => g.semester).filter(Boolean)));
    return ['Tất cả', ...list];
  }, [grades]);

  // Lọc điểm theo học kỳ
  const filteredGrades = useMemo(() => {
    return grades.filter(g => {
      if (selectedSemester === 'Tất cả') return true;
      return g.semester === selectedSemester;
    });
  }, [grades, selectedSemester]);

  // Tính GPA cho tập điểm đang xem (nếu lọc theo học kỳ thì tính GPA học kỳ đó)
  const { gpa, totalCredits } = useMemo(() => {
    return calcGpa(filteredGrades, courses);
  }, [filteredGrades, courses]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập…" />
      </ScreenContainer>
    );
  }

  if (error && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={reloadAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.headerArea}>
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
        <View style={styles.lastUpdatedWrapper}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredGrades}
        keyExtractor={item => `grade-${item.id}`}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có điểm"
            description={
              selectedSemester !== 'Tất cả'
                ? `Không có điểm môn học nào trong học kỳ "${selectedSemester}".`
                : 'Chưa có kết quả học tập nào được ghi nhận.'
            }
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
  headerArea: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    backgroundColor: colors.background,
  },
  lastUpdatedWrapper: {
    marginVertical: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
