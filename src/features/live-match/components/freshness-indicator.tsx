import { colors, radius, spacing } from '@/theme/token';
import { StyleSheet, Text, View } from 'react-native';
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
      <View style={styles.status}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{freshness.status}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.detail}>{freshness.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
  },
  status: {
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
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
