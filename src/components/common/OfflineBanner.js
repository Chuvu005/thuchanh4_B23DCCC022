import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Hiển thị thanh thông báo khi mất kết nối mạng.
 * Đọc trực tiếp từ useNetworkStatus() theo đặc tả mục 5.4.
 */
export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.bannerText}>⚡ Bạn đang offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.offlineBannerBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  bannerText: {
    ...typography.captionBold,
    color: colors.offlineBannerText,
    textAlign: 'center',
  },
});
