import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { GradeCard } from '../components/cards/GradeCard';
import { Colors, Shadows } from '../theme/colors';
import {
  GraduationCapIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
  AwardIcon,
  CloseIcon,
  CheckIcon,
} from '../components/common/Icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { profile, grades, updateProfileContact } = useAppData();

  // Contact edit modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [phoneInput, setPhoneInput] = useState(profile.phone);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = () => {
    setEmailInput(profile.email);
    setPhoneInput(profile.phone);
    setIsEditModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!emailInput.trim() || !phoneInput.trim()) {
      Alert.alert('Lỗi', 'Email và số điện thoại không được để trống.');
      return;
    }

    setIsSaving(true);
    const success = await updateProfileContact(emailInput, phoneInput);
    setIsSaving(false);

    if (success) {
      setIsEditModalVisible(false);
      Alert.alert('Thành công', 'Thông tin liên hệ đã được lưu lại thành công!');
    } else {
      Alert.alert('Thất bại', 'Không thể lưu thông tin, vui lòng thử lại.');
    }
  };

  // Header Component for FlatList
  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Profile Information Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.avatar}>
            <GraduationCapIcon size={32} color="#FFFFFF" />
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.fullName}>{profile.fullName}</Text>
            <Text style={styles.studentCode}>MSSV: {profile.studentCode}</Text>
            <View style={styles.classBadge}>
              <Text style={styles.classBadgeText}>{profile.className}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={handleOpenEdit}
            activeOpacity={0.7}
          >
            <EditIcon size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Academic Details */}
        <View style={styles.academicInfoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngành học:</Text>
            <Text style={styles.infoValue}>{profile.major}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Khóa học:</Text>
            <Text style={styles.infoValue}>{profile.academicYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Khoa:</Text>
            <Text style={styles.infoValue}>{profile.faculty}</Text>
          </View>
        </View>

        {/* Contact Info Row */}
        <View style={styles.contactSection}>
          <View style={styles.contactItem}>
            <MailIcon size={16} color={Colors.primary} />
            <Text style={styles.contactText} numberOfLines={1}>
              {profile.email}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <PhoneIcon size={16} color={Colors.primary} />
            <Text style={styles.contactText}>{profile.phone}</Text>
          </View>
        </View>
      </View>

      {/* 2. Academic Summary Stats Banner */}
      <View style={styles.summaryStatsRow}>
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>GPA Học kỳ</Text>
          <Text style={[styles.summaryStatValue, { color: Colors.primary }]}>
            {profile.gpa.toFixed(2)}
          </Text>
          <Text style={styles.summaryStatSub}>Thang điểm 4.0</Text>
        </View>

        <View style={styles.summaryStatDivider} />

        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>CPA Tích lũy</Text>
          <Text style={[styles.summaryStatValue, { color: '#059669' }]}>
            {profile.cpa.toFixed(2)}
          </Text>
          <Text style={styles.summaryStatSub}>Xếp loại: Giỏi</Text>
        </View>

        <View style={styles.summaryStatDivider} />

        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Tín chỉ tích lũy</Text>
          <Text style={[styles.summaryStatValue, { color: '#D97706' }]}>
            {profile.completedCredits} / {profile.totalCredits}
          </Text>
          <Text style={styles.summaryStatSub}>Tiến độ 75%</Text>
        </View>
      </View>

      {/* 3. Section Title */}
      <View style={styles.sectionTitleRow}>
        <AwardIcon size={20} color={Colors.primary} />
        <Text style={styles.sectionTitle}>
          Kết quả học tập môn học ({grades.length} môn)
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Cá nhân & Kết quả"
        subtitle="Hồ sơ sinh viên và bảng điểm học tập"
      />

      <FlatList
        data={grades}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item }) => (
          <GradeCard
            grade={item}
            onPress={() =>
              navigation.navigate('GradeDetail', { gradeId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal: Cập nhật thông tin liên hệ */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật liên hệ</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Chỉnh sửa địa chỉ email và số điện thoại liên lạc của bạn. Thông
              tin sẽ được lưu trữ cục bộ.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email sinh viên</Text>
              <TextInput
                style={styles.modalInput}
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="Nhập địa chỉ email..."
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.modalInput}
                value={phoneInput}
                onChangeText={setPhoneInput}
                placeholder="Nhập số điện thoại..."
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveContact}
                disabled={isSaving}
              >
                <CheckIcon size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.medium,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  nameSection: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  studentCode: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  classBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  academicInfoSection: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  contactSection: {
    paddingTop: 12,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
    ...Shadows.small,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '70%',
    alignSelf: 'center',
  },
  summaryStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  summaryStatSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.cardBackgroundAlt,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
