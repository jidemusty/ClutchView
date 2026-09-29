import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

const cardWidth = 280;
const cardGap = spacing.lg;

export function ProjectionSection({
  projections,
  criticalMoment,
}: ProjectionSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>Players to watch</Text>
        <Text
          accessibilityLabel={`${projections.length} projections`}
          style={styles.count}
        >
          {projections.length}
        </Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.cards}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + cardGap}
      >
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
      </ScrollView>
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
  count: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  cards: {
    gap: cardGap,
    paddingRight: spacing.lg,
  },
});
