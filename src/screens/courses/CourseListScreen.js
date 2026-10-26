import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

/**
 * Màn hình danh sách môn học (CourseListScreen)
 * Tìm kiếm theo tên/mã, lọc theo học kỳ, kéo làm mới, hỗ trợ offline
 */
export default function CourseListScreen({ navigation }) {
  const { courses, loading, error, lastUpdated, reloadAll } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  // Danh sách các học kỳ có trong môn học
  const semesterOptions = useMemo(() => {
    const semesters = Array.from(new Set(courses.map(c => c.semester).filter(Boolean)));
    return ['Tất cả', ...semesters];
  }, [courses]);

  // Lọc và tìm kiếm môn học
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSemester =
        selectedSemester === 'Tất cả' || course.semester === selectedSemester;
      return matchSearch && matchSemester;
    });
  }, [courses, searchQuery, selectedSemester]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadAll();
    setRefreshing(false);
  };

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  if (error && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={reloadAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.headerArea}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm môn học theo tên hoặc mã môn…"
        />
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
        data={filteredCourses}
        keyExtractor={item => `course-${item.id}`}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học nào"
            description={
              searchQuery || selectedSemester !== 'Tất cả'
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc học kỳ lọc.'
                : 'Danh sách môn học hiện đang trống.'
            }
            actionLabel="Đặt lại bộ lọc"
            onAction={
              searchQuery || selectedSemester !== 'Tất cả'
                ? () => {
                    setSearchQuery('');
                    setSelectedSemester('Tất cả');
                  }
                : undefined
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
    paddingTop: spacing.sm,
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
