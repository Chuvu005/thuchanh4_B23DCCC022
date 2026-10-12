import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AssignmentStatus } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { SearchBar } from '../components/common/SearchBar';
import { FilterChips, FilterOption } from '../components/common/FilterChips';
import { AssignmentCard } from '../components/cards/AssignmentCard';
import { EmptyState } from '../components/common/EmptyState';
import { Colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AssignmentsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { assignments, updateAssignmentStatus } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Status Filter Options with item counts
  const statusOptions: FilterOption[] = useMemo(() => {
    return [
      { id: 'all', label: 'Tất cả', count: assignments.length },
      {
        id: 'pending',
        label: 'Chưa thực hiện',
        count: assignments.filter(a => a.status === 'pending').length,
      },
      {
        id: 'in_progress',
        label: 'Đang thực hiện',
        count: assignments.filter(a => a.status === 'in_progress').length,
      },
      {
        id: 'completed',
        label: 'Đã hoàn thành',
        count: assignments.filter(a => a.status === 'completed').length,
      },
      {
        id: 'overdue',
        label: 'Quá hạn',
        count: assignments.filter(a => a.status === 'overdue').length,
      },
    ];
  }, [assignments]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asn => {
      const matchSearch =
        asn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asn.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asn.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' || asn.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [assignments, searchQuery, selectedStatus]);

  const handleQuickStatusChange = async (
    id: string,
    newStatus: AssignmentStatus,
  ) => {
    await updateAssignmentStatus(id, newStatus);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Quản lý bài tập"
        subtitle={`${filteredAssignments.length} bài tập hiển thị`}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm kiếm bài tập theo tên hoặc môn học..."
        onClear={() => setSearchQuery('')}
      />

      <FilterChips
        options={statusOptions}
        selectedId={selectedStatus}
        onSelect={setSelectedStatus}
      />

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AssignmentCard
            assignment={item}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: item.id })
            }
            onQuickToggleStatus={handleQuickStatusChange}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconType="assignment"
            title="Không có bài tập nào"
            description="Không tìm thấy bài tập nào phù hợp với bộ lọc hiện tại."
            actionText="Xem tất cả bài tập"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedStatus('all');
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
