import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AssignmentStatus } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { Colors, Shadows } from '../theme/colors';
import {
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  BookOpenIcon,
  EditIcon,
  CheckIcon,
} from '../components/common/Icons';
import { Badge } from '../components/common/Badge';

type RouteProps = RouteProp<RootStackParamList, 'AssignmentDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const AssignmentDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { assignmentId } = route.params;

  const {
    getAssignmentById,
    updateAssignmentStatus,
    updateAssignmentNotes,
  } = useAppData();

  const assignment = getAssignmentById(assignmentId);

  const [studentNotes, setStudentNotes] = useState(
    assignment?.studentNotes || '',
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  if (!assignment) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiết bài tập" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tìm thấy thông tin bài tập.</Text>
        </View>
      </View>
    );
  }

  const isOverdue = assignment.status === 'overdue';
  const isCompleted = assignment.status === 'completed';

  const statusChoices: { key: AssignmentStatus; label: string }[] = [
    { key: 'pending', label: 'Chưa thực hiện' },
    { key: 'in_progress', label: 'Đang thực hiện' },
    { key: 'completed', label: 'Đã hoàn thành' },
    { key: 'overdue', label: 'Quá hạn' },
  ];

  const handleStatusSelect = async (status: AssignmentStatus) => {
    await updateAssignmentStatus(assignment.id, status);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await updateAssignmentNotes(assignment.id, studentNotes);
    setIsSavingNotes(false);
    setIsEditingNotes(false);
    Alert.alert('Thành công', 'Đã lưu ghi chú bài tập thành công!');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Chi tiết bài tập"
        subtitle={assignment.subjectName}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overdue / Due Soon Alert Banner */}
        {isOverdue && (
          <View style={styles.overdueBanner}>
            <AlertCircleIcon size={18} color="#DC2626" />
            <Text style={styles.overdueBannerText}>
              Bài tập này đã quá thời hạn nộp bài quy định!
            </Text>
          </View>
        )}

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectBadgeText}>{assignment.subjectCode}</Text>
            </View>
            <Badge status={assignment.status} />
          </View>

          <Text style={styles.assignmentTitle}>{assignment.title}</Text>

          <View style={styles.metaRow}>
            <BookOpenIcon size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{assignment.subjectName}</Text>
          </View>

          <View style={styles.dueDateBox}>
            <ClockIcon size={18} color={isOverdue ? '#DC2626' : Colors.primary} />
            <View>
              <Text style={styles.dueDateLabel}>Hạn nộp bài:</Text>
              <Text
                style={[
                  styles.dueDateValue,
                  isOverdue && styles.dueDateValueOverdue,
                ]}
              >
                {assignment.dueDateFormatted}
              </Text>
            </View>
          </View>
        </View>

        {/* Update Status Selector */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cập nhật trạng thái bài tập</Text>
          <Text style={styles.sectionSubtitle}>
            Chọn trạng thái hiện tại để theo dõi tiến độ:
          </Text>

          <View style={styles.statusButtonsContainer}>
            {statusChoices.map(item => {
              const isSelected = assignment.status === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.statusBtn,
                    isSelected && styles.statusBtnSelected,
                  ]}
                  onPress={() => handleStatusSelect(item.key)}
                  activeOpacity={0.7}
                >
                  {isSelected && <CheckCircleIcon size={16} color="#FFFFFF" />}
                  <Text
                    style={[
                      styles.statusBtnText,
                      isSelected && styles.statusBtnTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả bài tập</Text>
          <Text style={styles.descriptionText}>{assignment.description}</Text>
        </View>

        {/* Requirements List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Yêu cầu chi tiết & Tiêu chí</Text>
          {assignment.requirements && assignment.requirements.length > 0 ? (
            assignment.requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <View style={styles.reqBullet}>
                  <Text style={styles.reqBulletText}>{index + 1}</Text>
                </View>
                <Text style={styles.reqText}>{req}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.descriptionText}>
              Theo dõi hướng dẫn trực tiếp từ giảng viên trên lớp.
            </Text>
          )}
        </View>

        {/* Student Personal Notes */}
        <View style={styles.card}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Ghi chú cá nhân của bạn</Text>
            {!isEditingNotes ? (
              <TouchableOpacity
                onPress={() => setIsEditingNotes(true)}
                style={styles.editNotesBtn}
              >
                <EditIcon size={16} color={Colors.primary} />
                <Text style={styles.editNotesText}>Sửa</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSaveNotes}
                style={styles.saveNotesBtn}
                disabled={isSavingNotes}
              >
                <CheckIcon size={16} color="#FFFFFF" />
                <Text style={styles.saveNotesText}>Lưu</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingNotes ? (
            <TextInput
              style={styles.notesInput}
              value={studentNotes}
              onChangeText={setStudentNotes}
              placeholder="Nhập ghi chú cá nhân, link nộp bài, phân công nhóm..."
              multiline
              numberOfLines={4}
            />
          ) : (
            <View style={styles.notesDisplayBox}>
              <Text
                style={[
                  styles.notesDisplayText,
                  !studentNotes && styles.notesEmptyText,
                ]}
              >
                {studentNotes ||
                  'Chưa có ghi chú nào. Bấm nút "Sửa" ở trên để thêm ghi chú của bạn.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  errorBox: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 15,
  },
  overdueBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  overdueBannerText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.small,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dueDateBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dueDateLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  dueDateValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  dueDateValueOverdue: {
    color: '#DC2626',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusBtnTextSelected: {
    color: '#FFFFFF',
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 10,
  },
  reqBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  reqBulletText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  reqText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 19,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  editNotesText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  saveNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.success,
  },
  saveNotesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  notesDisplayBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
  },
  notesDisplayText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  notesEmptyText: {
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
});
