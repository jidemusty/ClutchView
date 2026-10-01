import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/token';
import type {
  LiveMatchScreenModel,
  TimelineEventEmphasis,
} from '../live-match-screen-model';

interface EventTimelineProps {
  readonly events: LiveMatchScreenModel['timeline'];
}

interface EventPresentation {
  readonly markerColor: string;
  readonly descriptionColor: string;
}

const eventPresentation: Record<TimelineEventEmphasis, EventPresentation> = {
  standard: {
    markerColor: colors.textSecondary,
    descriptionColor: colors.textSecondary,
  },
  highlight: {
    markerColor: colors.warning,
    descriptionColor: colors.textPrimary,
  },
  critical: {
    markerColor: colors.accent,
    descriptionColor: colors.accent,
  },
};

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>Match tape</Text>
        <Text
          accessibilityLabel={`${events.length} events`}
          style={styles.count}
        >
          {events.length} SIGNALS
        </Text>
      </View>

      <View style={styles.events}>
        {events.length === 0 && (
          <Text style={styles.emptyState}>
            Start the replay to see key match events here.
          </Text>
        )}

        {events.map((event, index) => {
          const presentation = eventPresentation[event.emphasis];
          const isLast = index === events.length - 1;

          return (
            <View
              accessible
              accessibilityLabel={`${event.minute}, ${event.playerName}, ${event.description}`}
              key={event.id}
              style={[
                styles.event,
                event.emphasis === 'critical' && styles.criticalEvent,
                isLast && styles.lastEvent,
              ]}
            >
              <View style={styles.timeline}>
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: presentation.markerColor },
                  ]}
                />

                {!isLast && <View style={styles.connector} />}
              </View>

              <Text style={styles.minute}>{event.minute}</Text>

              <View style={styles.eventCopy}>
                <Text numberOfLines={1} style={styles.playerName}>
                  {event.playerName}
                </Text>

                <Text
                  style={[
                    styles.description,
                    { color: presentation.descriptionColor },
                  ]}
                >
                  {event.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
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
    fontSize: 18,
    fontWeight: '800',
  },
  count: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  events: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyState: {
    paddingVertical: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  event: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  timeline: {
    width: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  marker: {
    width: 7,
    height: 7,
    marginTop: spacing.md,
    borderRadius: radius.pill,
  },
  connector: {
    width: 1,
    flex: 1,
    marginTop: spacing.xs,
    backgroundColor: colors.border,
  },
  minute: {
    width: 38,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  eventCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  criticalEvent: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.sm,
    backgroundColor: colors.accentMuted,
  },
  lastEvent: {
    borderBottomWidth: 0,
  },
});
