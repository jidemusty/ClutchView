import { colors, spacing } from '@/theme/token';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventTimeline } from './components/event-timeline';
import { FreshnessIndicator } from './components/freshness-indicator';
import { MatchHeader } from './components/match-header';
import { ProjectionSection } from './components/projection-section';
import { ReplayControls } from './components/replay-control';
import { liveMatchFixture } from './fixtures/live-match-fixture';

export function LiveMatchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MatchHeader match={liveMatchFixture.match} />
        <FreshnessIndicator freshness={liveMatchFixture.freshness} />
        <ProjectionSection projections={liveMatchFixture.projections} />
        <EventTimeline events={liveMatchFixture.timeline} />
        <ReplayControls replay={liveMatchFixture.replay} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
});
