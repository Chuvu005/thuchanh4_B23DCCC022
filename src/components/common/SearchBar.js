import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {string} value - Bắt buộc
 * @param {(text: string) => void} onChangeText - Bắt buộc
 * @param {string} [placeholder="Tìm kiếm…"]
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm…',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        accessibilityLabel="Ô tìm kiếm"
        returnKeyType="search"
        autoCapitalize="none"
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Xóa nội dung tìm kiếm"
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
});
