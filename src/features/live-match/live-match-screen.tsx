import { colors, spacing } from '@/theme/token';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventTimeline } from './components/event-timeline';
import { FreshnessIndicator } from './components/freshness-indicator';
import { MatchHeader } from './components/match-header';
import { ProjectionSection } from './components/projection-section';
import { ReplayControls } from './components/replay-controls';
import { ReplayFaultControls } from './components/replay-fault-controls';
import { useLiveMatchReplay } from './hooks/use-live-match-replay';

export function LiveMatchScreen() {
  const {
    screenModel,
    criticalMoment,
    play,
    pause,
    reset,
    cycleSpeed,
    delayNextEvent,
    toggleConnection,
    emitDuplicate,
    emitOutOfOrder,
  } = useLiveMatchReplay();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MatchHeader match={screenModel.match} />

        <FreshnessIndicator freshness={screenModel.freshness} />

        <ProjectionSection
          projections={screenModel.projections}
          criticalMoment={criticalMoment}
        />

        <EventTimeline events={screenModel.timeline} />

        <ReplayControls
          replay={screenModel.replay}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onCycleSpeed={cycleSpeed}
        />

        <ReplayFaultControls
          replay={screenModel.replay}
          onDelayNextEvent={delayNextEvent}
          onToggleConnection={toggleConnection}
          onEmitDuplicate={emitDuplicate}
          onEmitOutOfOrder={emitOutOfOrder}
        />
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
