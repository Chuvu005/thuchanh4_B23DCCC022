import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Array<string | { label: string, value: string }>} options - Bắt buộc
 * @param {string} selected - Giá trị đang được chọn, bắt buộc
 * @param {(value: string) => void} onSelect - Bắt buộc
 */
export default function FilterChips({ options = [], selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      {options.map((option, index) => {
        const label = typeof option === 'string' ? option : option.label;
        const value = typeof option === 'string' ? option : option.value;
        const isSelected = selected === value;

        return (
          <TouchableOpacity
            key={`chip-${index}-${value}`}
            style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
            onPress={() => onSelect(value)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Lọc theo ${label}`}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 52,
    marginVertical: spacing.xs,
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.captionBold,
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
});
