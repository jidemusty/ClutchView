import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  ProjectionDisplay,
  ProjectionStatus,
} from '../live-match-screen-model';

interface ProjectionCardProps {
  readonly projection: ProjectionDisplay;
}

interface StatusPresentation {
  readonly label: string;
  readonly color: string;
  readonly backgroundColor: string;
}

const statusPresentation: Record<ProjectionStatus, StatusPresentation> = {
  active: {
    label: 'In progress',
    color: colors.accent,
    backgroundColor: colors.surfaceElevated,
  },
  approaching: {
    label: 'Close',
    color: colors.warning,
    backgroundColor: colors.surfaceElevated,
  },
  reached: {
    label: 'Reached',
    color: colors.accent,
    backgroundColor: colors.accentMuted,
  },
};

export function ProjectionCard({ projection }: ProjectionCardProps) {
  const status = statusPresentation[projection.status];

  const progressRatio =
    projection.target > 0
      ? Math.min(Math.max(projection.current / projection.target, 0), 1)
      : 0;

  const progressWidth: `${number}%` = `${progressRatio * 100}%`;

  return (
    <View
      style={[
        styles.card,
        projection.status === 'reached' && styles.reachedCard,
      ]}
    >
      <View style={styles.metadata}>
        <Text style={styles.team}>{projection.teamAbbreviation}</Text>

        <View
          style={[styles.status, { backgroundColor: status.backgroundColor }]}
        >
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.player}>
        <Text numberOfLines={2} style={styles.playerName}>
          {projection.playerName}
        </Text>
        <Text style={styles.metric}>{projection.metric}</Text>
      </View>

      <View style={styles.progressSummary}>
        <Text style={styles.progressValue}>
          {projection.current}
          <Text style={styles.progressTarget}> / {projection.target}</Text>
        </Text>
        <Text style={styles.progressLabel}>Current</Text>
      </View>

      <View
        accessible
        accessibilityLabel={`${projection.playerName}, ${projection.metric}`}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: projection.target,
          now: projection.current,
          text: `${projection.current} of ${projection.target}, ${status.label}`,
        }}
        style={styles.progressTrack}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
              backgroundColor: status.color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  reachedCard: {
    borderColor: colors.accent,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  team: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  player: {
    minHeight: 58,
    gap: spacing.xs,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
  },
  metric: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  progressValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTarget: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 7,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.pill,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
