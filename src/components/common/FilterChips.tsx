import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../../theme/colors';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map(option => {
          const isSelected = option.id === selectedId;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.chip, isSelected && styles.selectedChip]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {option.label}
              </Text>
              {option.count !== undefined && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected ? styles.selectedCountBadge : styles.unselectedCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected ? styles.selectedCountText : styles.unselectedCountText,
                    ]}
                  >
                    {option.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  unselectedCountBadge: {
    backgroundColor: Colors.cardBackgroundAlt,
  },
  selectedCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unselectedCountText: {
    color: Colors.textSecondary,
  },
  selectedCountText: {
    color: '#FFFFFF',
  },
});
