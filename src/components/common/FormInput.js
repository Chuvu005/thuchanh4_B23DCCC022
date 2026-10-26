import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {string} label - Bắt buộc
 * @param {string} value - Bắt buộc
 * @param {(text: string) => void} onChangeText - Bắt buộc
 * @param {string} [error]
 * @param {string} [placeholder]
 * @param {string} [keyboardType='default']
 * @param {boolean} [multiline=false]
 * @param {number} [numberOfLines=1]
 * @param {boolean} [editable=true]
 */
export default function FormInput({
  label,
  value,
  onChangeText,
  error,
  placeholder = '',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    color: colors.text,
    ...typography.body,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.textMuted,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
