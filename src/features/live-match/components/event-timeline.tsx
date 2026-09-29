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
  readonly backgroundColor: string;
}

const eventPresentation: Record<TimelineEventEmphasis, EventPresentation> = {
  standard: {
    markerColor: colors.textSecondary,
    descriptionColor: colors.textSecondary,
    backgroundColor: colors.surface,
  },
  highlight: {
    markerColor: colors.warning,
    descriptionColor: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  critical: {
    markerColor: colors.accent,
    descriptionColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
};

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.eyebrow}>Match activity</Text>
          <Text style={styles.title}>Recent moments</Text>
        </View>

        <Text style={styles.count}>{events.length} events</Text>
      </View>

      <View style={styles.events}>
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
                { backgroundColor: presentation.backgroundColor },
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
    gap: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  count: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  events: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  event: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  timeline: {
    width: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  marker: {
    width: 9,
    height: 9,
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
    width: 44,
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  eventCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    fontWeight: '600',
  },
});
