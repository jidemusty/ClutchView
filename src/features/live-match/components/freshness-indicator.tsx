import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type { LiveMatchScreenModel } from '../live-match-screen-model';

interface FreshnessIndicatorProps {
  readonly freshness: LiveMatchScreenModel['freshness'];
}

export function FreshnessIndicator({ freshness }: FreshnessIndicatorProps) {
  const accessibilityLabel = `${freshness.status}. ${freshness.detail}`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
    >
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>{freshness.status}</Text>
      <Text style={styles.detail}>{freshness.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
  statusText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
