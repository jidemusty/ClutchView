import { colors, radius, spacing } from '@/theme/token';
import { StyleSheet, Text, View } from 'react-native';
import type { LiveMatchScreenModel } from '../live-match-screen-model';
import { TeamIdentity } from './team-identity';

interface MatchHeaderProps {
  readonly match: LiveMatchScreenModel['match'];
}

export function MatchHeader({ match }: MatchHeaderProps) {
  const scoreLabel = `Score, ${match.homeTeam.name} ${match.homeTeam.score}, ${match.awayTeam.name} ${match.awayTeam.score}`;

  return (
    <View style={styles.container}>
      <View style={styles.matchStatus}>
        <Text style={styles.period}>{match.period}</Text>
        <Text style={styles.clock}>{match.clock}</Text>
      </View>

      <View style={styles.matchup}>
        <TeamIdentity team={match.homeTeam} />

        <View style={styles.scoreContainer}>
          <Text accessibilityLabel={scoreLabel} style={styles.score}>
            {match.homeTeam.score}
            <Text style={styles.scoreDivider}> – </Text>
            {match.awayTeam.score}
          </Text>
        </View>

        <TeamIdentity team={match.awayTeam} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.broadcastPanel,
  },
  matchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  period: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  clock: {
    color: colors.textSecondary,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  scoreContainer: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
