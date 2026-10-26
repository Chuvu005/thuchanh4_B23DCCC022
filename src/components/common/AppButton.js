import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {string} title - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 * @param {'primary' | 'outline'} [variant='primary']
 * @param {boolean} [loading=false]
 * @param {boolean} [disabled=false]
 * @param {string} [accessibilityLabel]
 * @param {object} [style]
 */
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.buttonOutline : styles.buttonPrimary,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.textOutline : styles.textPrimary,
            isDisabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
    textAlign: 'center',
  },
  textPrimary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
