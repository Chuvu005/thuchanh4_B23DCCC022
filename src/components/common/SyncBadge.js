import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {boolean} [pending=false] - Trạng thái chờ đồng bộ
 */
export default function SyncBadge({ pending = false }) {
  if (!pending) return null;

  return (
    <View style={styles.badge} accessibilityLabel="Mục chưa đồng bộ lên máy chủ">
      <Text style={styles.icon}>⏳</Text>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.syncBadgeBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 10,
    marginRight: 4,
  },
  text: {
    ...typography.small,
    fontWeight: '600',
    color: colors.syncBadgeText,
  },
});
