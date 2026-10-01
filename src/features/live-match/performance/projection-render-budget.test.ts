import { areProjectionCardPropsEqual } from '../components/projection-card';
import {
  replayEvents,
  replayMatchId,
} from '../data/replay/fixtures/north-london-vs-merseyside';
import type { ReplaySnapshot } from '../data/replay/replay-controller';
import { applyMatchEvent, createMatchState } from '../domain/match-state';
import { liveMatchConfig } from '../fixtures/live-match-config';
import { presentLiveMatch } from '../live-match-presenter';

const replaySnapshots: readonly ReplaySnapshot[] = replayEvents.map(
  (_, index) => ({
    status: index === replayEvents.length - 1 ? 'completed' : 'playing',
    connectionStatus: 'current',
    speed: 4,
    nextEventIndex: index + 1,
    totalEvents: replayEvents.length,
    bufferedEventCount: 0,
    canEmitDuplicate: true,
    canEmitOutOfOrder: index + 2 < replayEvents.length,
  }),
);

describe('projection card render budget', () => {
  it('renders only cards affected by the deterministic replay', () => {
    let matchState = createMatchState({
      matchId: replayMatchId,
      projections: liveMatchConfig.projections,
    });

    let previousModel = presentLiveMatch(matchState, {
      status: 'idle',
      connectionStatus: 'current',
      speed: 4,
      nextEventIndex: 0,
      totalEvents: replayEvents.length,
      bufferedEventCount: 0,
      canEmitDuplicate: false,
      canEmitOutOfOrder: false,
    });

    let optimizedRenderCount = previousModel.projections.length;
    const baselineRenderCount =
      previousModel.projections.length * (replayEvents.length + 1);
    let previousGoalId: string | undefined;
    let previousGoalPlayerId: string | undefined;

    replayEvents.forEach(({ event }, index) => {
      matchState = applyMatchEvent(matchState, event);

      const snapshot = replaySnapshots[index];

      if (snapshot === undefined) {
        throw new Error(`Missing replay snapshot for event index ${index}`);
      }

      const nextModel = presentLiveMatch(matchState, snapshot);

      const latestGoal = [...matchState.acceptedEvents]
        .reverse()
        .find((acceptedEvent) => acceptedEvent.type === 'goal');

      for (const nextProjection of nextModel.projections) {
        const previousProjection = previousModel.projections.find(
          (projection) => projection.id === nextProjection.id,
        );

        if (previousProjection === undefined) {
          throw new Error(`Missing previous projection "${nextProjection.id}"`);
        }

        const previousCriticalMomentId =
          previousGoalPlayerId === previousProjection.playerId
            ? previousGoalId
            : undefined;
        const nextCriticalMomentId =
          latestGoal?.playerId === nextProjection.playerId
            ? latestGoal.id
            : undefined;

        if (
          !areProjectionCardPropsEqual(
            {
              projection: previousProjection,
              criticalMomentId: previousCriticalMomentId,
            },
            {
              projection: nextProjection,
              criticalMomentId: nextCriticalMomentId,
            },
          )
        ) {
          optimizedRenderCount += 1;
        }
      }

      previousModel = nextModel;
      previousGoalId = latestGoal?.id;
      previousGoalPlayerId = latestGoal?.playerId;
    });

    expect(baselineRenderCount).toBe(15);
    expect(optimizedRenderCount).toBe(7);
  });
});
