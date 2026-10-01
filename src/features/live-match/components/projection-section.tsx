import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/token';
import type { LiveMatchScreenModel } from '../live-match-screen-model';
import { ProjectionCard } from './projection-card';

interface ProjectionSectionProps {
  readonly projections: LiveMatchScreenModel['projections'];
  readonly criticalMoment?: {
    readonly eventId: string;
    readonly playerId: string;
  };
}

export function ProjectionSection({
  projections,
  criticalMoment,
}: ProjectionSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>Watchlist</Text>
        <Text
          accessibilityLabel={`${projections.length} projections`}
          style={styles.count}
        >
          LIVE PROGRESS / {projections.length}
        </Text>
      </View>

      <View style={styles.cards}>
        {projections.map((projection) => (
          <ProjectionCard
            criticalMomentId={
              criticalMoment?.playerId === projection.playerId
                ? criticalMoment.eventId
                : undefined
            }
            key={projection.id}
            projection={projection}
          />
        ))}
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
  },
  cards: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
