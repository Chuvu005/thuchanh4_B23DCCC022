import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateAssignmentForm } from '../../utils/validators';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Thêm bài tập mới (AssignmentFormScreen)
 * Kiểm tra dữ liệu: tiêu đề không rỗng, hạn nộp không ở quá khứ
 * Gửi POST hoặc đưa vào hàng đợi outbox khi offline
 */
export default function AssignmentFormScreen({ navigation }) {
  const { courses, addAssignment } = useAppData();

  // Mặc định hạn nộp là 7 ngày tới lúc 23:59
  const defaultFutureDate = new Date();
  defaultFutureDate.setDate(defaultFutureDate.getDate() + 7);
  defaultFutureDate.setHours(23, 59, 0, 0);

  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses.length > 0 ? courses[0].id : null
  );
  const [description, setDescription] = useState('');
  const [dueDateIso, setDueDateIso] = useState(defaultFutureDate.toISOString());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Đặt nhanh hạn nộp
  const setQuickDueDate = days => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    setDueDateIso(d.toISOString());
    setErrors(prev => ({ ...prev, dueDate: undefined }));
  };

  const handleSubmit = async () => {
    const validation = validateAssignmentForm({
      title,
      dueDate: dueDateIso,
      courseId: selectedCourseId,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await addAssignment({
        title,
        courseId: selectedCourseId,
        description,
        dueDate: dueDateIso,
      });

      Alert.alert('Thành công', 'Đã lưu bài tập mới!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể lưu bài tập');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Thông tin bài tập</Text>

        <FormInput
          label="Tiêu đề bài tập *"
          value={title}
          onChangeText={val => {
            setTitle(val);
            if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
          }}
          placeholder="Ví dụ: Thực hành 4: API & Offline"
          error={errors.title}
        />

        {/* Chọn môn học */}
        <View style={styles.courseSelectSection}>
          <Text style={styles.label}>Môn học *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
            {courses.map(course => {
              const isSelected = String(selectedCourseId) === String(course.id);
              return (
                <TouchableOpacity
                  key={`course-opt-${course.id}`}
                  style={[
                    styles.courseChip,
                    isSelected ? styles.courseChipSelected : styles.courseChipNormal,
                  ]}
                  onPress={() => {
                    setSelectedCourseId(course.id);
                    if (errors.courseId) setErrors(prev => ({ ...prev, courseId: undefined }));
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Chọn môn ${course.name}`}
                >
                  <Text
                    style={[
                      styles.courseChipText,
                      isSelected ? styles.courseChipTextSelected : styles.courseChipTextNormal,
                    ]}
                  >
                    {course.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors.courseId ? <Text style={styles.errorText}>{errors.courseId}</Text> : null}
        </View>

        {/* Hạn nộp */}
        <View style={styles.dueDateSection}>
          <Text style={styles.label}>Hạn nộp *</Text>
          <Text style={styles.currentDueDateText}>
            ⏰ {formatDate(dueDateIso, true)}
          </Text>

          <View style={styles.quickDateRow}>
            <Text style={styles.quickDateLabel}>Chọn nhanh:</Text>
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setQuickDueDate(1)}
              accessibilityRole="button"
              accessibilityLabel="Hạn nộp ngày mai"
            >
              <Text style={styles.quickDateBtnText}>+1 ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setQuickDueDate(3)}
              accessibilityRole="button"
              accessibilityLabel="Hạn nộp 3 ngày tới"
            >
              <Text style={styles.quickDateBtnText}>+3 ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setQuickDueDate(7)}
              accessibilityRole="button"
              accessibilityLabel="Hạn nộp 7 ngày tới"
            >
              <Text style={styles.quickDateBtnText}>+7 ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setQuickDueDate(14)}
              accessibilityRole="button"
              accessibilityLabel="Hạn nộp 14 ngày tới"
            >
              <Text style={styles.quickDateBtnText}>+14 ngày</Text>
            </TouchableOpacity>
          </View>
          {errors.dueDate ? <Text style={styles.errorText}>{errors.dueDate}</Text> : null}
        </View>

        <FormInput
          label="Mô tả chi tiết"
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập yêu cầu bài tập, ghi chú..."
          multiline
          numberOfLines={4}
        />

        <AppButton
          title="Lưu bài tập"
          variant="primary"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
          accessibilityLabel="Lưu bài tập mới"
        />
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
  heading: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseSelectSection: {
    marginBottom: spacing.md,
  },
  courseScroll: {
    flexDirection: 'row',
  },
  courseChip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseChipNormal: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  courseChipText: {
    ...typography.captionBold,
  },
  courseChipTextSelected: {
    color: colors.white,
  },
  courseChipTextNormal: {
    color: colors.textSecondary,
  },
  dueDateSection: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentDueDateText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  quickDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  quickDateLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  quickDateBtn: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickDateBtnText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
