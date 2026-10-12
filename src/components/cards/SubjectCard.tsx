import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subject } from '../../types';
import { Colors, Shadows } from '../../theme/colors';
import { ChevronRightIcon, LocationIcon } from '../common/Icons';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.colorStrip, { backgroundColor: subject.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{subject.code}</Text>
          </View>
          <View style={styles.creditsBadge}>
            <Text style={styles.creditsText}>{subject.credits} tín chỉ</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {subject.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.instructorText} numberOfLines={1}>
            GV: {subject.instructor}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.roomWrapper}>
            <LocationIcon size={14} color={Colors.textMuted} />
            <Text style={styles.roomText}>{subject.room}</Text>
          </View>
          <View style={styles.arrowWrapper}>
            <Text style={styles.viewDetailText}>Chi tiết</Text>
            <ChevronRightIcon size={16} color={Colors.primary} />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Tiến độ học phần</Text>
            <Text style={styles.progressValue}>{subject.progress}%</Text>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  colorStrip: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
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
    backgroundColor: Colors.cardBackgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditsText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginBottom: 8,
  },
  roomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  arrowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 5,
    backgroundColor: Colors.cardBackgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
