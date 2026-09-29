import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  FreshnessTone,
  LiveMatchScreenModel,
} from '../live-match-screen-model';

interface FreshnessIndicatorProps {
  readonly freshness: LiveMatchScreenModel['freshness'];
}

const toneColor: Record<FreshnessTone, string> = {
  current: colors.accent,
  neutral: colors.textSecondary,
  warning: colors.warning,
  offline: '#F06A73',
};

export function FreshnessIndicator({ freshness }: FreshnessIndicatorProps) {
  const accessibilityLabel = `${freshness.status}. ${freshness.detail}`;
  const statusColor = toneColor[freshness.tone];

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
    >
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <Text style={[styles.statusText, { color: statusColor }]}>
        {freshness.status}
      </Text>
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
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
