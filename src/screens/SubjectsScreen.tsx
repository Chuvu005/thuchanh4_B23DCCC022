import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Subject } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { SearchBar } from '../components/common/SearchBar';
import { FilterChips, FilterOption } from '../components/common/FilterChips';
import { SubjectCard } from '../components/cards/SubjectCard';
import { EmptyState } from '../components/common/EmptyState';
import { Colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubjectsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { subjects } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Semester filter options
  const semesterOptions: FilterOption[] = useMemo(() => {
    const semesters = Array.from(new Set(subjects.map(s => s.semester)));
    return [
      { id: 'all', label: 'Tất cả học kỳ', count: subjects.length },
      ...semesters.map(sem => ({
        id: sem,
        label: sem,
        count: subjects.filter(s => s.semester === sem).length,
      })),
    ];
  }, [subjects]);

  // Filtered list
  const filteredSubjects = useMemo(() => {
    return subjects.filter(sub => {
      const matchSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSemester =
        selectedSemester === 'all' || sub.semester === selectedSemester;

      return matchSearch && matchSemester;
    });
  }, [subjects, searchQuery, selectedSemester]);

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách môn học"
        subtitle={`${filteredSubjects.length} môn học đã đăng ký`}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm theo tên môn, mã môn, giảng viên..."
        onClear={() => setSearchQuery('')}
      />

      <FilterChips
        options={semesterOptions}
        selectedId={selectedSemester}
        onSelect={setSelectedSemester}
      />

      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconType="subject"
            title="Không tìm thấy môn học nào"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn học kỳ khác."
            actionText="Đặt lại bộ lọc"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedSemester('all');
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 28,
  },
});
