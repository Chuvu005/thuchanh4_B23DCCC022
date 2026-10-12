import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppData } from '../context/AppDataContext';
import { Colors, Shadows } from '../theme/colors';
import {
  GraduationCapIcon,
  ChevronRightIcon,
  ClockIcon,
  LocationIcon,
  BookOpenIcon,
  AssignmentIcon,
  AlertCircleIcon,
} from '../components/common/Icons';
import { Badge } from '../components/common/Badge';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const {
    profile,
    subjects,
    schedules,
    assignments,
    uncompletedAssignmentsCount,
  } = useAppData();

  // Subjects in current semester
  const currentSemesterSubjects = subjects.filter(
    s => s.semester === profile.currentSemester,
  );

  // Today schedule (default to Monday/Thứ Hai = 2 for rich demo display)
  const todaySchedules = schedules.filter(s => s.dayOfWeek === 2);

  // Upcoming assignments (not completed, sorted)
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. Header Profile Banner */}
      <View style={[styles.profileBanner, { paddingTop: insets.top + 16 }]}>
        <View style={styles.profileTopRow}>
          <View style={styles.avatarCircle}>
            <GraduationCapIcon size={28} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.fullNameText}>{profile.fullName}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.studentCodeBadge}>
                <Text style={styles.studentCodeText}>MSSV: {profile.studentCode}</Text>
              </View>
              <View style={styles.classBadge}>
                <Text style={styles.classText}>Lớp: {profile.className}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.semesterIndicator}>
          <Text style={styles.semesterText}>Niên khóa: {profile.currentSemester}</Text>
        </View>
      </View>

      {/* 2. Key Stats: GPA & Uncompleted Assignments */}
      <View style={styles.statsContainer}>
        {/* GPA Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => {
            // Can switch to profile or open first grade
            navigation.navigate('GradeDetail', { gradeId: 'grd-01' });
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconCircle, { backgroundColor: '#EEF2FF' }]}>
            <BookOpenIcon size={20} color={Colors.primary} />
          </View>
          <Text style={styles.statLabel}>GPA Học kỳ</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>
            {profile.gpa.toFixed(2)}
          </Text>
          <Text style={styles.statSubtext}>Thang điểm 4.0 / Xuất sắc</Text>
        </TouchableOpacity>

        {/* Uncompleted Assignments Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Assignments');
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconCircle, { backgroundColor: '#FFFBEB' }]}>
            <AssignmentIcon size={20} color="#D97706" />
          </View>
          <Text style={styles.statLabel}>Bài tập chưa nộp</Text>
          <Text style={[styles.statValue, { color: '#D97706' }]}>
            {uncompletedAssignmentsCount}
          </Text>
          <Text style={styles.statSubtext}>Cần hoàn thành sớm</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Lịch học hôm nay */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Lịch học hôm nay (Thứ Hai)</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Schedule');
          }}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>Xem cả tuần</Text>
          <ChevronRightIcon size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {todaySchedules.length > 0 ? (
        todaySchedules.map((schedule, idx) => (
          <TouchableOpacity
            key={schedule.id}
            style={[
              styles.todayScheduleCard,
              idx === 0 && styles.firstScheduleHighlight,
            ]}
            onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: schedule.id })}
            activeOpacity={0.8}
          >
            <View style={[styles.scheduleColorBar, { backgroundColor: schedule.color }]} />
            <View style={styles.scheduleContent}>
              <View style={styles.scheduleRowTop}>
                <Text style={styles.scheduleSubjectName} numberOfLines={1}>
                  {schedule.subjectName}
                </Text>
                <Badge
                  type="schedule"
                  scheduleState={idx === 0 ? 'current' : 'upcoming'}
                  text={idx === 0 ? 'Sắp diễn ra' : 'Buổi chiều'}
                />
              </View>

              <View style={styles.scheduleMetaRow}>
                <View style={styles.scheduleMetaItem}>
                  <ClockIcon size={14} color={Colors.textSecondary} />
                  <Text style={styles.scheduleMetaText}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
                <View style={styles.scheduleMetaItem}>
                  <LocationIcon size={14} color={Colors.primary} />
                  <Text style={[styles.scheduleMetaText, { fontWeight: '700', color: Colors.primary }]}>
                    Phòng {schedule.room}
                  </Text>
                </View>
              </View>

              <Text style={styles.scheduleInstructorText}>
                GV: {schedule.instructor}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyTodayBox}>
          <Text style={styles.emptyTodayText}>Hôm nay bạn không có lịch học!</Text>
        </View>
      )}

      {/* 4. Bài tập sắp đến hạn nộp */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Assignments');
          }}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <ChevronRightIcon size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {upcomingAssignments.map(assignment => {
        const isOverdue = assignment.status === 'overdue';
        const isDueSoon = assignment.status === 'in_progress';

        return (
          <TouchableOpacity
            key={assignment.id}
            style={[
              styles.assignmentCard,
              isOverdue && styles.assignmentCardOverdue,
              isDueSoon && styles.assignmentCardDueSoon,
            ]}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: assignment.id })
            }
            activeOpacity={0.8}
          >
            <View style={styles.assignmentTopRow}>
              <View style={styles.subjectCodeMiniBadge}>
                <Text style={styles.subjectCodeMiniText}>
                  {assignment.subjectCode}
                </Text>
              </View>
              <Badge status={assignment.status} />
            </View>

            <Text style={styles.assignmentTitle} numberOfLines={2}>
              {assignment.title}
            </Text>

            <View style={styles.assignmentBottomRow}>
              <View style={styles.dueTimeRow}>
                {isOverdue ? (
                  <AlertCircleIcon size={14} color="#DC2626" />
                ) : (
                  <ClockIcon size={14} color={isDueSoon ? '#D97706' : Colors.textMuted} />
                )}
                <Text
                  style={[
                    styles.dueTimeText,
                    isOverdue && styles.overdueText,
                    isDueSoon && styles.dueSoonText,
                  ]}
                >
                  Hạn nộp: {assignment.dueDateFormatted}
                </Text>
              </View>
              <ChevronRightIcon size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* 5. Môn học đang học trong kỳ */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>
            Môn học học kỳ này ({currentSemesterSubjects.length})
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Subjects');
          }}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>Danh sách môn</Text>
          <ChevronRightIcon size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectScroll}
      >
        {currentSemesterSubjects.map(subject => (
          <TouchableOpacity
            key={subject.id}
            style={styles.subjectHorizontalCard}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: subject.id })
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.subjectCardTopBar,
                { backgroundColor: subject.color },
              ]}
            />
            <View style={styles.subjectCardContent}>
              <View style={styles.subjectCardBadgeRow}>
                <Text style={styles.subjectCardCode}>{subject.code}</Text>
                <Text style={styles.subjectCardCredits}>{subject.credits} TC</Text>
              </View>
              <Text style={styles.subjectCardName} numberOfLines={2}>
                {subject.name}
              </Text>
              <Text style={styles.subjectCardInstructor} numberOfLines={1}>
                {subject.instructor}
              </Text>

              {/* Progress */}
              <View style={styles.subjectCardProgress}>
                <View style={styles.subjectCardProgressTrack}>
                  <View
                    style={[
                      styles.subjectCardProgressBar,
                      {
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.subjectCardProgressText}>
                  {subject.progress}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileBanner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Shadows.medium,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  fullNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  studentCodeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentCodeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  classBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  semesterIndicator: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  semesterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: -16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIndicator: {
    width: 4,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  todayScheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  firstScheduleHighlight: {
    borderColor: Colors.primary,
  },
  scheduleColorBar: {
    width: 6,
  },
  scheduleContent: {
    flex: 1,
    padding: 12,
  },
  scheduleRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleSubjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 6,
  },
  scheduleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scheduleInstructorText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyTodayBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTodayText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  assignmentCardOverdue: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  assignmentCardDueSoon: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFDF5',
  },
  assignmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectCodeMiniBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subjectCodeMiniText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  assignmentBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  dueTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  overdueText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  dueSoonText: {
    color: '#D97706',
    fontWeight: '700',
  },
  subjectScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 4,
  },
  subjectHorizontalCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  subjectCardTopBar: {
    height: 4,
  },
  subjectCardContent: {
    padding: 12,
  },
  subjectCardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subjectCardCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  subjectCardCredits: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  subjectCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
    height: 36,
    marginBottom: 4,
  },
  subjectCardInstructor: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  subjectCardProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectCardProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.cardBackgroundAlt,
    borderRadius: 2,
    overflow: 'hidden',
  },
  subjectCardProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  subjectCardProgressText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
