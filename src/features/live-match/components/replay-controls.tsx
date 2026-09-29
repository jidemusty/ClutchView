import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  LiveMatchScreenModel,
  ReplayState,
} from '../live-match-screen-model';

interface ReplayControlsProps {
  readonly replay: LiveMatchScreenModel['replay'];
}

const replayStateLabel: Record<ReplayState, string> = {
  playing: 'Playing',
  paused: 'Paused',
};

export function ReplayControls({ replay }: ReplayControlsProps) {
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
          <View
            accessible
            accessibilityLabel="Play replay, unavailable in static preview"
            style={[styles.control, styles.primaryControl]}
          >
            <Text style={styles.primaryControlText}>Play</Text>
          </View>

          <View
            accessible
            accessibilityLabel="Reset replay, unavailable in static preview"
            style={[styles.control, styles.secondaryControl]}
          >
            <Text style={styles.secondaryControlText}>Reset</Text>
          </View>

          <View
            accessible
            accessibilityLabel={`Replay speed, ${replay.speed}`}
            style={[styles.control, styles.speedControl]}
          >
            <Text style={styles.speedLabel}>Speed</Text>
            <Text style={styles.speedValue}>{replay.speed}</Text>
          </View>
        </View>

        <Text style={styles.note}>
          Controls activate when the deterministic replay source is connected.
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
    color: colors.textSecondary,
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
  note: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
