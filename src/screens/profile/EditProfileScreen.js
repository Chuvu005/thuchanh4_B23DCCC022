import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateStudentProfile } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Màn hình Chỉnh sửa thông tin cá nhân (EditProfileScreen)
 * Kiểm tra dữ liệu đầu vào, gửi PATCH hoặc lưu outbox khi offline
 */
export default function EditProfileScreen({ navigation }) {
  const { student, updateStudentProfile } = useAppData();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    const validation = validateStudentProfile({
      fullName,
      email,
      phone,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await updateStudentProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật thông tin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Cập nhật thông tin sinh viên</Text>

        <FormInput
          label="Mã sinh viên"
          value={student?.studentCode || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <FormInput
          label="Lớp sinh hoạt"
          value={student?.className || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <FormInput
          label="Chuyên ngành"
          value={student?.major || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <FormInput
          label="Họ và tên *"
          value={fullName}
          onChangeText={val => {
            setFullName(val);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
          }}
          placeholder="Nhập họ và tên đầy đủ"
          error={errors.fullName}
        />

        <FormInput
          label="Email *"
          value={email}
          onChangeText={val => {
            setEmail(val);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          placeholder="example@student.edu.vn"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Số điện thoại *"
          value={phone}
          onChangeText={val => {
            setPhone(val);
            if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
          }}
          placeholder="0912345678"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <AppButton
          title="Lưu thay đổi"
          variant="primary"
          onPress={handleSave}
          loading={submitting}
          style={styles.saveButton}
          accessibilityLabel="Lưu thông tin cá nhân mới"
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
  saveButton: {
    marginTop: spacing.md,
  },
});
