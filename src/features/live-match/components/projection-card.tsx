import { memo, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  ProjectionDisplay,
  ProjectionStatus,
} from '../live-match-screen-model';

interface StatusPresentation {
  readonly label: string;
  readonly color: string;
  readonly backgroundColor: string;
}

const statusPresentation: Record<ProjectionStatus, StatusPresentation> = {
  active: {
    label: 'In progress',
    color: colors.textSecondary,
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

export interface ProjectionCardProps {
  readonly projection: ProjectionDisplay;
  readonly criticalMomentId?: string;
}

export function areProjectionCardPropsEqual(
  previous: ProjectionCardProps,
  next: ProjectionCardProps,
): boolean {
  return (
    previous.criticalMomentId === next.criticalMomentId &&
    previous.projection.id === next.projection.id &&
    previous.projection.playerId === next.projection.playerId &&
    previous.projection.stat === next.projection.stat &&
    previous.projection.playerName === next.projection.playerName &&
    previous.projection.teamAbbreviation === next.projection.teamAbbreviation &&
    previous.projection.metric === next.projection.metric &&
    previous.projection.current === next.projection.current &&
    previous.projection.target === next.projection.target &&
    previous.projection.status === next.projection.status
  );
}

function ProjectionCardComponent({
  projection,
  criticalMomentId,
}: ProjectionCardProps) {
  const status = statusPresentation[projection.status];
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    scale.setValue(1);

    if (criticalMomentId === undefined) {
      return;
    }

    let isCancelled = false;
    let animation: Animated.CompositeAnimation | undefined;

    void AccessibilityInfo.isReduceMotionEnabled().then(
      (isReducedMotionEnabled) => {
        if (isCancelled || isReducedMotionEnabled) {
          return;
        }

        animation = Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.025,
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]);

        animation.start();
      },
    );

    return () => {
      isCancelled = true;
      animation?.stop();
      scale.setValue(1);
    };
  }, [criticalMomentId, scale]);

  const progressRatio =
    projection.target > 0
      ? Math.min(Math.max(projection.current / projection.target, 0), 1)
      : 0;

  const progressWidth: `${number}%` = `${progressRatio * 100}%`;

  return (
    <Animated.View
      style={[
        styles.card,
        projection.status === 'reached' && styles.reachedCard,
        { transform: [{ scale }] },
      ]}
    >
      <View style={styles.metadata}>
        <Text style={styles.team}>{projection.teamAbbreviation}</Text>

        <Text style={[styles.statusText, { color: status.color }]}>
          {status.label}
        </Text>
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
    </Animated.View>
  );
}

export const ProjectionCard = memo(
  ProjectionCardComponent,
  areProjectionCardPropsEqual,
);

const styles = StyleSheet.create({
  card: {
    width: 280,
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
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
    fontSize: 12,
    fontWeight: '700',
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
