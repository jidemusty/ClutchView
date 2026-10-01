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
        <Text style={styles.clock}>{match.clock}</Text>
        <View style={styles.liveRule} />
        <Text style={styles.period}>{match.period}</Text>
      </View>

      <View style={styles.scoreBlock}>
        <Text style={styles.scoreLabel}>MATCH SCORE</Text>

        <View style={styles.matchup}>
          <TeamIdentity team={match.homeTeam} />

          <Text accessibilityLabel={scoreLabel} style={styles.score}>
            {match.homeTeam.score}
            <Text style={styles.scoreDivider}> : </Text>
            {match.awayTeam.score}
          </Text>

          <TeamIdentity team={match.awayTeam} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: radius.broadcastPanel,
  },
  matchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  period: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  clock: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  liveRule: {
    width: 20,
    height: 1,
    backgroundColor: colors.warning,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  score: {
    minWidth: 112,
    flexShrink: 0,
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
    letterSpacing: -1.5,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
