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
  MailIcon,
  PhoneIcon,
  ChevronRightIcon,
  AwardIcon,
  AssignmentIcon,
  CalendarIcon,
} from '../components/common/Icons';
import { Badge } from '../components/common/Badge';

type RouteProps = RouteProp<RootStackParamList, 'SubjectDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const SubjectDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { subjectId } = route.params;

  const {
    getSubjectById,
    getScheduleBySubject,
    getAssignmentsBySubject,
    getGradeBySubject,
  } = useAppData();

  const subject = getSubjectById(subjectId);
  const subjectSchedules = getScheduleBySubject(subjectId);
  const subjectAssignments = getAssignmentsBySubject(subjectId);
  const subjectGrade = getGradeBySubject(subjectId);

  if (!subject) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiết môn học" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tìm thấy thông tin môn học này.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={subject.name}
        subtitle={`${subject.code} • ${subject.credits} tín chỉ`}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Main Info Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.badgeRow}>
              <View style={[styles.codeBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.codeText}>{subject.code}</Text>
              </View>
              <View style={styles.semesterBadge}>
                <Text style={styles.semesterText}>{subject.semester}</Text>
              </View>
            </View>
            <View style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{subject.credits} Tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.title}>{subject.name}</Text>
          <Text style={styles.descriptionText}>{subject.description}</Text>

          {/* Instructor Contact Info */}
          <View style={styles.instructorBox}>
            <Text style={styles.instructorSectionTitle}>Giảng viên phụ trách</Text>
            <Text style={styles.instructorName}>{subject.instructor}</Text>
            <View style={styles.instructorContactRow}>
              <View style={styles.contactItem}>
                <MailIcon size={14} color={Colors.primary} />
                <Text style={styles.contactText}>{subject.instructorEmail}</Text>
              </View>
              <View style={styles.contactItem}>
                <PhoneIcon size={14} color={Colors.primary} />
                <Text style={styles.contactText}>{subject.instructorPhone}</Text>
              </View>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Tiến độ môn học</Text>
              <Text style={styles.progressPercent}>{subject.progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${subject.progress}%`, backgroundColor: subject.color },
                ]}
              />
            </View>
          </View>
        </View>

        {/* 2. Lịch học của môn */}
        <View style={styles.sectionHeader}>
          <CalendarIcon size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>
            Lịch học trong tuần ({subjectSchedules.length})
          </Text>
        </View>

        {subjectSchedules.length > 0 ? (
          subjectSchedules.map(sch => (
            <TouchableOpacity
              key={sch.id}
              style={styles.scheduleItemCard}
              onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: sch.id })}
              activeOpacity={0.8}
            >
              <View style={[styles.scheduleStrip, { backgroundColor: sch.color }]} />
              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleHeaderRow}>
                  <Text style={styles.scheduleDay}>{sch.dayName} ({sch.shift})</Text>
                  <View style={styles.roomBadge}>
                    <LocationIcon size={12} color={Colors.primary} />
                    <Text style={styles.roomText}>{sch.room}</Text>
                  </View>
                </View>
                <View style={styles.scheduleTimeRow}>
                  <ClockIcon size={14} color={Colors.textSecondary} />
                  <Text style={styles.scheduleTimeText}>
                    {sch.startTime} - {sch.endTime}
                  </Text>
                </View>
                {sch.note && (
                  <Text style={styles.scheduleNoteText} numberOfLines={1}>
                    Ghi chú: {sch.note}
                  </Text>
                )}
              </View>
              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có lịch học cụ thể cho môn này.</Text>
          </View>
        )}

        {/* 3. Danh sách bài tập của môn */}
        <View style={styles.sectionHeader}>
          <AssignmentIcon size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>
            Bài tập & Đồ án ({subjectAssignments.length})
          </Text>
        </View>

        {subjectAssignments.length > 0 ? (
          subjectAssignments.map(asn => (
            <TouchableOpacity
              key={asn.id}
              style={styles.assignmentItemCard}
              onPress={() =>
                navigation.navigate('AssignmentDetail', { assignmentId: asn.id })
              }
              activeOpacity={0.8}
            >
              <View style={styles.assignmentTopRow}>
                <Text style={styles.assignmentTitle} numberOfLines={1}>
                  {asn.title}
                </Text>
                <Badge status={asn.status} />
              </View>
              <View style={styles.assignmentFooterRow}>
                <View style={styles.assignmentDueRow}>
                  <ClockIcon size={14} color={Colors.textMuted} />
                  <Text style={styles.assignmentDueText}>
                    Hạn: {asn.dueDateFormatted}
                  </Text>
                </View>
                <ChevronRightIcon size={16} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Môn học này hiện chưa có bài tập nào.</Text>
          </View>
        )}

        {/* 4. Kết quả học tập liên quan */}
        <View style={styles.sectionHeader}>
          <AwardIcon size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Kết quả học tập liên quan</Text>
        </View>

        {subjectGrade ? (
          <TouchableOpacity
            style={styles.gradeBox}
            onPress={() =>
              navigation.navigate('GradeDetail', { gradeId: subjectGrade.id })
            }
            activeOpacity={0.8}
          >
            <View style={styles.gradeHeaderRow}>
              <Text style={styles.gradeTitle}>Bảng điểm chi tiết học phần</Text>
              <View style={styles.letterBadge}>
                <Text style={styles.letterBadgeText}>
                  Điểm: {subjectGrade.letterGrade}
                </Text>
              </View>
            </View>

            <View style={styles.scoreGrid}>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreColLabel}>Chuyên cần (10%)</Text>
                <Text style={styles.scoreColValue}>{subjectGrade.attendanceScore}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreColLabel}>Bài tập (20%)</Text>
                <Text style={styles.scoreColValue}>{subjectGrade.exerciseScore}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreColLabel}>Giữa kỳ (20%)</Text>
                <Text style={styles.scoreColValue}>{subjectGrade.midtermScore}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreColLabel}>Cuối kỳ (50%)</Text>
                <Text style={styles.scoreColValue}>{subjectGrade.finalExamScore}</Text>
              </View>
            </View>

            <View style={styles.gradeFooterRow}>
              <Text style={styles.totalScoreText}>
                Tổng kết hệ 10: <Text style={styles.highlightScore}>{subjectGrade.totalScore10.toFixed(1)}</Text> | Hệ 4: <Text style={styles.highlightScore}>{subjectGrade.totalScore4.toFixed(1)}</Text>
              </Text>
              <View style={styles.viewDetailRow}>
                <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                <ChevronRightIcon size={14} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có kết quả học tập cho môn này.</Text>
          </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.small,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  semesterBadge: {
    backgroundColor: Colors.cardBackgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  semesterText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  creditsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditsText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  instructorBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  instructorSectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  instructorContactRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressSection: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.cardBackgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scheduleItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  scheduleStrip: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 10,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scheduleDay: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  roomText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  scheduleTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scheduleNoteText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  assignmentItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  assignmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  assignmentFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignmentDueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignmentDueText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  gradeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.small,
  },
  gradeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  letterBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  letterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  scoreGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreColLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  scoreColValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gradeFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalScoreText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  highlightScore: {
    fontWeight: '700',
    color: Colors.primary,
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
