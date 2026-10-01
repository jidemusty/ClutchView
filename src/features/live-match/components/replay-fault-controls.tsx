import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type { LiveMatchScreenModel } from '../live-match-screen-model';

interface ReplayFaultControlsProps {
  readonly replay: LiveMatchScreenModel['replay'];
  readonly onDelayNextEvent: () => void;
  readonly onToggleConnection: () => void;
  readonly onEmitDuplicate: () => void;
  readonly onEmitOutOfOrder: () => void;
}

export function ReplayFaultControls({
  replay,
  onDelayNextEvent,
  onToggleConnection,
  onEmitDuplicate,
  onEmitOutOfOrder,
}: ReplayFaultControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = replay.state === 'completed';
  const isDisconnected = replay.connectionStatus === 'disconnected';
  const isReconnecting = replay.connectionStatus === 'reconnecting';
  const canDelay =
    (replay.state === 'playing' || replay.state === 'paused') &&
    replay.connectionStatus === 'current';
  const canToggleConnection =
    !isReconnecting &&
    (isDisconnected || (replay.state !== 'idle' && !isCompleted));

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Hide fault lab' : 'Show fault lab'}
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((current) => !current)}
        style={styles.heading}
      >
        <View>
          <Text style={styles.title}>Fault lab</Text>
          <Text style={styles.detail}>Transport failure controls</Text>
        </View>
        <Text style={styles.disclosure}>{isExpanded ? '−' : '+'}</Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.controls}>
          <FaultButton
            disabled={!canDelay}
            label="Delay next"
            onPress={onDelayNextEvent}
          />
          <FaultButton
            disabled={!canToggleConnection}
            label={
              isReconnecting
                ? 'Reconnecting'
                : isDisconnected
                  ? 'Reconnect'
                  : 'Disconnect'
            }
            onPress={onToggleConnection}
          />
          <FaultButton
            disabled={!replay.canEmitDuplicate}
            label="Duplicate"
            onPress={onEmitDuplicate}
          />
          <FaultButton
            disabled={!replay.canEmitOutOfOrder}
            label="Out of order"
            onPress={onEmitOutOfOrder}
          />
        </View>
      )}
    </View>
  );
}

interface FaultButtonProps {
  readonly disabled: boolean;
  readonly label: string;
  readonly onPress: () => void;
}

function FaultButton({ disabled, label, onPress }: FaultButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        pressed && styles.pressedControl,
        disabled && styles.disabledControl,
      ]}
    >
      <Text style={styles.controlText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  heading: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  disclosure: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '400',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  control: {
    minHeight: 44,
    minWidth: 112,
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.control,
  },
  controlText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  pressedControl: {
    opacity: 0.68,
  },
  disabledControl: {
    opacity: 0.4,
  },
});
