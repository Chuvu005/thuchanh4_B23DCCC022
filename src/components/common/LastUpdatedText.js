import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatDateTime } from '../../utils/date';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

/**
 * @param {string|number|Date} [timestamp]
 */
export default function LastUpdatedText({ timestamp }) {
  if (!timestamp) return null;

  const formatted = formatDateTime(timestamp);
  if (!formatted) return null;

  return (
    <Text style={styles.text}>
      Cập nhật lần cuối: {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
