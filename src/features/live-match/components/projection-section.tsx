import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/token';
import type { LiveMatchScreenModel } from '../live-match-screen-model';
import { ProjectionCard } from './projection-card';

interface ProjectionSectionProps {
  readonly projections: LiveMatchScreenModel['projections'];
}

const cardWidth = 280;
const cardGap = spacing.lg;

export function ProjectionSection({ projections }: ProjectionSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>Live card</Text>
          <Text style={styles.title}>Players to watch</Text>
        </View>

        <Text style={styles.count}>{projections.length} projections</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.cards}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + cardGap}
      >
        {projections.map((projection) => (
          <ProjectionCard key={projection.id} projection={projection} />
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
  headingCopy: {
    flex: 1,
    gap: spacing.xs,
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
  cards: {
    gap: cardGap,
    paddingRight: spacing.lg,
  },
});
