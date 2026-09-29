import type { GoalEvent, ShotEvent } from './match-event';
import {
  applyMatchEvent,
  createMatchState,
  type MatchState,
} from './match-state';

const projections = [
  {
    id: 'projection-scorer-shots',
    playerId: 'player-scorer',
    stat: 'shots',
    target: 2,
  },
  {
    id: 'projection-scorer-shots-on-target',
    playerId: 'player-scorer',
    stat: 'shotsOnTarget',
    target: 1,
  },
  {
    id: 'projection-scorer-goals',
    playerId: 'player-scorer',
    stat: 'goals',
    target: 1,
  },
  {
    id: 'projection-assister-assists',
    playerId: 'player-assister',
    stat: 'assists',
    target: 1,
  },
] as const;

function createInitialState(): MatchState {
  return createMatchState({
    matchId: 'match-001',
    projections,
  });
}

describe('applyMatchEvent', () => {
  it('updates only projections affected by a shot', () => {
    const state = createInitialState();

    const event: ShotEvent = {
      id: 'event-001',
      matchId: 'match-001',
      sequence: 1,
      occurredAt: '2026-09-28T20:10:00.000Z',
      minute: 10,
      type: 'shot',
      playerId: 'player-scorer',
      outcome: 'blocked',
    };

    const result = applyMatchEvent(state, event);

    expect(result.projections).toEqual([
      expect.objectContaining({
        id: 'projection-scorer-shots',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-scorer-shots-on-target',
        current: 0,
      }),
      expect.objectContaining({
        id: 'projection-scorer-goals',
        current: 0,
      }),
      expect.objectContaining({
        id: 'projection-assister-assists',
        current: 0,
      }),
    ]);
  });

  it('updates all implied projections for an assisted goal', () => {
    const state = createInitialState();

    const event: GoalEvent = {
      id: 'event-002',
      matchId: 'match-001',
      sequence: 2,
      occurredAt: '2026-09-28T20:20:00.000Z',
      minute: 20,
      type: 'goal',
      playerId: 'player-scorer',
      assistedByPlayerId: 'player-assister',
    };

    const result = applyMatchEvent(state, event);

    expect(result.projections).toEqual([
      expect.objectContaining({
        id: 'projection-scorer-shots',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-scorer-shots-on-target',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-scorer-goals',
        current: 1,
      }),
      expect.objectContaining({
        id: 'projection-assister-assists',
        current: 1,
      }),
    ]);
  });

  it('does not apply the same event twice', () => {
    const state = createInitialState();

    const event: ShotEvent = {
      id: 'event-duplicate',
      matchId: 'match-001',
      sequence: 3,
      occurredAt: '2026-09-28T20:30:00.000Z',
      minute: 30,
      type: 'shot',
      playerId: 'player-scorer',
      outcome: 'blocked',
    };

    const firstResult = applyMatchEvent(state, event);
    const duplicateResult = applyMatchEvent(firstResult, event);

    expect(duplicateResult).toBe(firstResult);
    expect(duplicateResult.acceptedEvents).toHaveLength(1);
    expect(duplicateResult.projections[0].current).toBe(1);
  });

  it('keeps progress above the projection target', () => {
    const firstEvent: ShotEvent = {
      id: 'event-001',
      matchId: 'match-001',
      sequence: 1,
      occurredAt: '2026-09-28T20:10:00.000Z',
      minute: 10,
      type: 'shot',
      playerId: 'player-scorer',
      outcome: 'blocked',
    };

    const secondEvent: ShotEvent = {
      ...firstEvent,
      id: 'event-002',
      sequence: 2,
      minute: 20,
    };

    const thirdEvent: ShotEvent = {
      ...firstEvent,
      id: 'event-003',
      sequence: 3,
      minute: 30,
    };

    const result = [firstEvent, secondEvent, thirdEvent].reduce(
      applyMatchEvent,
      createInitialState(),
    );

    expect(result.projections[0].current).toBe(3);
    expect(result.projections[0].target).toBe(2);
  });

  it('rejects an event from another match', () => {
    const state = createInitialState();

    const event: ShotEvent = {
      id: 'event-wrong-match',
      matchId: 'match-002',
      sequence: 1,
      occurredAt: '2026-09-28T20:10:00.000Z',
      minute: 10,
      type: 'shot',
      playerId: 'player-scorer',
      outcome: 'blocked',
    };

    expect(() => applyMatchEvent(state, event)).toThrow(
      'Cannot apply event for match "match-002" to match "match-001"',
    );
  });
});
