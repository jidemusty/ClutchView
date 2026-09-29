import { applyMatchEvent, createMatchState } from '../../domain/match-state';
import type { ProjectionDefinition } from '../../domain/projection';
import { DeterministicReplaySource } from './deterministic-replay-source';
import {
  replayEvents,
  replayMatchId,
} from './fixtures/north-london-vs-merseyside';
import { ManualReplayClock } from './testing/manual-replay-clock';

const projections = [
  {
    id: 'projection-marcus-shots',
    playerId: 'player-marcus-bennett',
    stat: 'shots',
    target: 2,
  },
  {
    id: 'projection-marcus-goals',
    playerId: 'player-marcus-bennett',
    stat: 'goals',
    target: 1,
  },
  {
    id: 'projection-alejandro-shots-on-target',
    playerId: 'player-alejandro-fernandez',
    stat: 'shotsOnTarget',
    target: 1,
  },
  {
    id: 'projection-christopher-assists',
    playerId: 'player-christopher-montgomery-wells',
    stat: 'assists',
    target: 1,
  },
] as const satisfies readonly ProjectionDefinition[];

describe('deterministic replay integration', () => {
  it('replays the fixture into final projection state', () => {
    const clock = new ManualReplayClock();

    const source = new DeterministicReplaySource({
      matchId: replayMatchId,
      events: replayEvents,
      clock,
    });

    let matchState = createMatchState({
      matchId: replayMatchId,
      projections,
    });

    source.subscribe(replayMatchId, (event) => {
      matchState = applyMatchEvent(matchState, event);
    });

    source.play();
    clock.advanceBy(8_000);

    expect(matchState.acceptedEventIds).toEqual([
      'event-49-shot',
      'event-57-goal',
      'event-63-shot-on-target',
      'event-68-goal',
    ]);

    expect(matchState.projections).toEqual([
      expect.objectContaining({
        id: 'projection-marcus-shots',
        current: 2,
      }),
      expect.objectContaining({
        id: 'projection-marcus-goals',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-alejandro-shots-on-target',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-christopher-assists',
        current: 1,
      }),
    ]);

    expect(source.getSnapshot()).toEqual({
      status: 'completed',
      speed: 1,
      nextEventIndex: 4,
      totalEvents: 4,
    });
  });
});
