import { colors, radius, spacing } from '@/theme/token';
import { StyleSheet, Text, View } from 'react-native';
import type { TeamDisplay } from '../live-match-screen-model';

interface TeamIdentityProps {
  readonly team: TeamDisplay;
}

export function TeamIdentity({ team }: TeamIdentityProps) {
  return (
    <View accessible accessibilityLabel={team.name} style={styles.container}>
      <View style={[styles.badge, { backgroundColor: team.badgeColor }]}>
        <Text style={styles.abbreviation}>{team.abbreviation}</Text>
      </View>

      <Text numberOfLines={2} style={styles.name}>
        {team.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  abbreviation: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
});
