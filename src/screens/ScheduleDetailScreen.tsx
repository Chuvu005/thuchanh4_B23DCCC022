import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Header } from '../components/common/Header';
import { Colors, Shadows } from '../theme/colors';
import {
  ClockIcon,
  LocationIcon,
  UserIcon,
  BookOpenIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '../components/common/Icons';
import { Badge } from '../components/common/Badge';

type RouteProps = RouteProp<RootStackParamList, 'ScheduleDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const ScheduleDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { scheduleId } = route.params;

  const { getScheduleById, getSubjectById } = useAppData();
  const schedule = getScheduleById(scheduleId);
  const subject = schedule ? getSubjectById(schedule.subjectId) : undefined;

  if (!schedule) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiết buổi học" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tìm thấy thông tin buổi học này.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Chi tiết buổi học"
        subtitle={`${schedule.dayName} • ${schedule.startTime} - ${schedule.endTime}`}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Schedule Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{schedule.subjectCode}</Text>
            </View>
            <Badge
              type="schedule"
              scheduleState="upcoming"
              text={schedule.shift === 'Sáng' ? 'Buổi Sáng' : 'Buổi Chiều'}
            />
          </View>

          <Text style={styles.subjectName}>{schedule.subjectName}</Text>

          <View style={styles.timeBanner}>
            <ClockIcon size={20} color={Colors.primary} />
            <Text style={styles.timeBannerText}>
              {schedule.startTime} - {schedule.endTime}
            </Text>
            <Text style={styles.dayBadgeText}>({schedule.dayName})</Text>
          </View>
        </View>

        {/* Location & Room Details */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Địa điểm & Phòng học</Text>
          <View style={styles.rowItem}>
            <LocationIcon size={18} color={Colors.primary} />
            <View style={styles.rowItemContent}>
              <Text style={styles.rowLabel}>Phòng học:</Text>
              <Text style={styles.rowValueHighlight}>{schedule.room}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <CalendarIcon size={18} color={Colors.primary} />
            <View style={styles.rowItemContent}>
              <Text style={styles.rowLabel}>Thời gian:</Text>
              <Text style={styles.rowValue}>
                {schedule.dayName}, Ca {schedule.shift} ({schedule.startTime} - {schedule.endTime})
              </Text>
            </View>
          </View>
        </View>

        {/* Instructor Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Giảng viên giảng dạy</Text>
          <View style={styles.rowItem}>
            <UserIcon size={18} color={Colors.primary} />
            <View style={styles.rowItemContent}>
              <Text style={styles.rowLabel}>Họ và tên:</Text>
              <Text style={styles.rowValue}>{schedule.instructor}</Text>
            </View>
          </View>

          {subject && (
            <View style={styles.rowItem}>
              <BookOpenIcon size={18} color={Colors.primary} />
              <View style={styles.rowItemContent}>
                <Text style={styles.rowLabel}>Số tín chỉ môn:</Text>
                <Text style={styles.rowValue}>{subject.credits} tín chỉ</Text>
              </View>
            </View>
          )}
        </View>

        {/* Note / Remarks */}
        {schedule.note && (
          <View style={styles.infoCard}>
            <Text style={styles.cardSectionTitle}>Nội dung & Dặn dò</Text>
            <View style={styles.noteBox}>
              <Text style={styles.noteContent}>{schedule.note}</Text>
            </View>
          </View>
        )}

        {/* Navigate to Subject Detail */}
        {subject && (
          <TouchableOpacity
            style={styles.viewSubjectBtn}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: subject.id })
            }
            activeOpacity={0.8}
          >
            <View style={styles.viewSubjectLeft}>
              <BookOpenIcon size={20} color={Colors.primary} />
              <Text style={styles.viewSubjectText}>
                Xem toàn bộ thông tin môn học {subject.code}
              </Text>
            </View>
            <ChevronRightIcon size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
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
  codeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  timeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  timeBannerText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  dayBadgeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.small,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  rowItemContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  rowValueHighlight: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '800',
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  noteContent: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  viewSubjectBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 6,
  },
  viewSubjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  viewSubjectText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
  },
});
