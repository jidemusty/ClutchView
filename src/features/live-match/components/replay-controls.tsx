import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  LiveMatchScreenModel,
  ReplayState,
} from '../live-match-screen-model';

interface ReplayControlsProps {
  readonly replay: LiveMatchScreenModel['replay'];
  readonly onPlay: () => void;
  readonly onPause: () => void;
  readonly onReset: () => void;
  readonly onCycleSpeed: () => void;
}

const replayStateLabel: Record<ReplayState, string> = {
  idle: 'Ready',
  playing: 'Playing',
  paused: 'Paused',
  completed: 'Complete',
};

export function ReplayControls({
  replay,
  onPlay,
  onPause,
  onReset,
  onCycleSpeed,
}: ReplayControlsProps) {
  const isPlaying = replay.state === 'playing';
  const isCompleted = replay.state === 'completed';

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>Demo replay</Text>

        <View style={styles.state}>
          <View style={styles.stateDot} />
          <Text style={styles.stateText}>{replayStateLabel[replay.state]}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause replay' : 'Play replay'}
            accessibilityState={{ disabled: isCompleted }}
            disabled={isCompleted}
            onPress={isPlaying ? onPause : onPlay}
            style={({ pressed }) => [
              styles.control,
              styles.primaryControl,
              pressed && styles.pressedControl,
              isCompleted && styles.disabledControl,
            ]}
          >
            <Text style={styles.primaryControlText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset replay"
            onPress={onReset}
            style={({ pressed }) => [
              styles.control,
              styles.secondaryControl,
              pressed && styles.pressedControl,
            ]}
          >
            <Text style={styles.secondaryControlText}>Reset</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Change replay speed, currently ${replay.speed} times`}
            accessibilityHint="Cycles between 1, 2, and 4 times speed"
            onPress={onCycleSpeed}
            style={({ pressed }) => [
              styles.control,
              styles.speedControl,
              pressed && styles.pressedControl,
            ]}
          >
            <Text style={styles.speedLabel}>Speed</Text>
            <Text style={styles.speedValue}>{replay.speed}x</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Replay the same match sequence at 1x, 2x, or 4x speed.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  state: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateDot: {
    width: 7,
    height: 7,
    backgroundColor: colors.textSecondary,
    borderRadius: radius.pill,
  },
  stateText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  panel: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  control: {
    minWidth: 88,
    minHeight: 48,
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
  },
  primaryControl: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryControlText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryControl: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryControlText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  speedControl: {
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  speedValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
  },
  pressedControl: {
    opacity: 0.68,
  },
  disabledControl: {
    opacity: 0.4,
  },
  note: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
