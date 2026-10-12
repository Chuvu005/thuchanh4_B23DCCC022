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
  AwardIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from '../components/common/Icons';

type RouteProps = RouteProp<RootStackParamList, 'GradeDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const GradeDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { gradeId } = route.params;

  const { getGradeById, getSubjectById } = useAppData();
  const grade = getGradeById(gradeId);
  const subject = grade ? getSubjectById(grade.subjectId) : undefined;

  if (!grade) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiết kết quả học tập" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tìm thấy kết quả học tập này.</Text>
        </View>
      </View>
    );
  }

  const scoreComponents = [
    {
      title: 'Điểm chuyên cần',
      weight: '10%',
      score: grade.attendanceScore,
      weighted: (grade.attendanceScore * 0.1).toFixed(2),
    },
    {
      title: 'Điểm bài tập / Thực hành',
      weight: '20%',
      score: grade.exerciseScore,
      weighted: (grade.exerciseScore * 0.2).toFixed(2),
    },
    {
      title: 'Điểm kiểm tra giữa kỳ',
      weight: '20%',
      score: grade.midtermScore,
      weighted: (grade.midtermScore * 0.2).toFixed(2),
    },
    {
      title: 'Điểm thi kết thúc học phần',
      weight: '50%',
      score: grade.finalExamScore,
      weighted: (grade.finalExamScore * 0.5).toFixed(2),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Chi tiết kết quả học tập"
        subtitle={grade.subjectName}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Score Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{grade.subjectCode}</Text>
            </View>
            <View style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{grade.credits} Tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.subjectTitle}>{grade.subjectName}</Text>
          <Text style={styles.semesterText}>{grade.semester}</Text>

          {/* Big Score Summary Row */}
          <View style={styles.bigScoreRow}>
            <View style={styles.bigScoreBox}>
              <Text style={styles.bigScoreLabel}>Điểm hệ 10</Text>
              <Text style={styles.bigScoreValuePrimary}>
                {grade.totalScore10.toFixed(1)}
              </Text>
            </View>

            <View style={styles.bigScoreDivider} />

            <View style={styles.bigScoreBox}>
              <Text style={styles.bigScoreLabel}>Điểm hệ 4</Text>
              <Text style={styles.bigScoreValueSuccess}>
                {grade.totalScore4.toFixed(1)}
              </Text>
            </View>

            <View style={styles.bigScoreDivider} />

            <View style={styles.bigScoreBox}>
              <Text style={styles.bigScoreLabel}>Điểm chữ</Text>
              <Text style={styles.bigScoreValueLetter}>
                {grade.letterGrade}
              </Text>
            </View>
          </View>

          {/* Evaluation Banner */}
          <View style={styles.evalBanner}>
            <AwardIcon size={18} color="#D97706" />
            <Text style={styles.evalBannerText}>
              Xếp loại: <Text style={styles.evalHighlight}>{grade.evaluation}</Text>
            </Text>
          </View>
        </View>

        {/* Detailed Breakdown Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bảng chi tiết các thành phần điểm</Text>
          <Text style={styles.cardSubtitle}>
            Công thức tính: Tổng = CC x 10% + BT x 20% + GK x 20% + CK x 50%
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>Thành phần</Text>
            <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>Trọng số</Text>
            <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>Điểm</Text>
            <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Quy đổi</Text>
          </View>

          {scoreComponents.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cellText, { flex: 2, fontWeight: '600' }]}>
                {item.title}
              </Text>
              <Text style={[styles.cellSub, { flex: 1, textAlign: 'center' }]}>
                {item.weight}
              </Text>
              <Text
                style={[
                  styles.cellText,
                  { flex: 1, textAlign: 'center', fontWeight: '700' },
                ]}
              >
                {item.score.toFixed(1)}
              </Text>
              <Text
                style={[
                  styles.cellText,
                  { flex: 1, textAlign: 'right', color: Colors.primary, fontWeight: '700' },
                ]}
              >
                {item.weighted}
              </Text>
            </View>
          ))}

          <View style={styles.tableFooterRow}>
            <Text style={styles.footerLabel}>Tổng kết học phần (Hệ 10):</Text>
            <Text style={styles.footerValue}>{grade.totalScore10.toFixed(1)} / 10</Text>
          </View>
        </View>

        {/* Academic Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trạng thái công nhận tín chỉ</Text>
          <View style={styles.statusRow}>
            <CheckCircleIcon size={20} color="#059669" />
            <View style={styles.statusRowContent}>
              <Text style={styles.statusRowTitle}>Đạt học phần (Passed)</Text>
              <Text style={styles.statusRowDesc}>
                Sinh viên đã tích lũy thành công {grade.credits} tín chỉ vào hồ sơ tốt nghiệp.
              </Text>
            </View>
          </View>
        </View>

        {/* View Subject Info Button */}
        {subject && (
          <TouchableOpacity
            style={styles.subjectLinkBtn}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: subject.id })
            }
            activeOpacity={0.8}
          >
            <BookOpenIcon size={20} color={Colors.primary} />
            <Text style={styles.subjectLinkText}>
              Xem thông tin đề cương môn {subject.code}
            </Text>
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
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
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
  subjectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 4,
  },
  semesterText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  bigScoreRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  bigScoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  bigScoreDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '60%',
    alignSelf: 'center',
  },
  bigScoreLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bigScoreValuePrimary: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  bigScoreValueSuccess: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
  },
  bigScoreValueLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D97706',
  },
  evalBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  evalBannerText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  evalHighlight: {
    fontWeight: '800',
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 6,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  cellText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  cellSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tableFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 6,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
  },
  statusRowContent: {
    flex: 1,
  },
  statusRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 2,
  },
  statusRowDesc: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 16,
  },
  subjectLinkBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  subjectLinkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
