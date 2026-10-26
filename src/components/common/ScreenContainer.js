import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';

/**
 * @param {React.ReactNode} children - Bắt buộc
 * @param {boolean} [scroll=false] - Cho phép cuộn toàn màn hình
 * @param {object} [style]
 */
export default function ScreenContainer({ children, scroll = false, style }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
