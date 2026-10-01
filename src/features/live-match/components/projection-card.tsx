import { memo, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, spacing } from '@/theme/token';
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
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 220,
            useNativeDriver: Platform.OS !== 'web',
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
        styles.row,
        projection.status === 'reached' && styles.reachedRow,
        { transform: [{ scale }] },
      ]}
    >
      <View style={styles.identity}>
        <Text style={styles.team}>{projection.teamAbbreviation}</Text>
        <View style={styles.player}>
          <Text numberOfLines={1} style={styles.playerName}>
            {projection.playerName}
          </Text>
          <Text style={styles.metric}>{projection.metric}</Text>
        </View>
      </View>

      <View style={styles.valueBlock}>
        <Text style={styles.progressValue}>
          {projection.current}
          <Text style={styles.progressTarget}> / {projection.target}</Text>
        </Text>
        <Text style={[styles.statusText, { color: status.color }]}>
          {projection.status === 'reached' ? 'HIT' : status.label}
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
  row: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reachedRow: {
    backgroundColor: colors.accentMuted,
  },
  identity: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  team: {
    width: 32,
    color: colors.warning,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  player: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  metric: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  valueBlock: {
    width: 64,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  progressValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTarget: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    width: 42,
    height: 3,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
  },
  progressFill: {
    height: '100%',
  },
});
