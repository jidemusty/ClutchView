import type { GoalEvent, ShotEvent, ShotOnTargetEvent } from './match-event';
import { getPlayerStatChanges } from './player-stat';

const eventBase = {
  matchId: 'match-001',
  occurredAt: '2026-09-28T20:24:00.000Z',
  minute: 68,
} as const;

describe('getPlayerStatChanges', () => {
  it('increments shots for a blocked shot', () => {
    const event: ShotEvent = {
      ...eventBase,
      id: 'event-001',
      sequence: 1,
      type: 'shot',
      playerId: 'player-scorer',
      outcome: 'blocked',
    };

    expect(getPlayerStatChanges(event)).toEqual([
      {
        playerId: 'player-scorer',
        stat: 'shots',
        amount: 1,
      },
    ]);
  });

  it('increments shots and shots on target for a saved attempt', () => {
    const event: ShotOnTargetEvent = {
      ...eventBase,
      id: 'event-002',
      sequence: 2,
      type: 'shotOnTarget',
      playerId: 'player-scorer',
      outcome: 'saved',
    };

    expect(getPlayerStatChanges(event)).toEqual([
      {
        playerId: 'player-scorer',
        stat: 'shots',
        amount: 1,
      },
      {
        playerId: 'player-scorer',
        stat: 'shotsOnTarget',
        amount: 1,
      },
    ]);
  });

  it('increments all implied scorer statistics for an unassisted goal', () => {
    const event: GoalEvent = {
      ...eventBase,
      id: 'event-003',
      sequence: 3,
      type: 'goal',
      playerId: 'player-scorer',
    };

    expect(getPlayerStatChanges(event)).toEqual([
      {
        playerId: 'player-scorer',
        stat: 'shots',
        amount: 1,
      },
      {
        playerId: 'player-scorer',
        stat: 'shotsOnTarget',
        amount: 1,
      },
      {
        playerId: 'player-scorer',
        stat: 'goals',
        amount: 1,
      },
    ]);
  });

  it('increments the assisting player for an assisted goal', () => {
    const event: GoalEvent = {
      ...eventBase,
      id: 'event-004',
      sequence: 4,
      type: 'goal',
      playerId: 'player-scorer',
      assistedByPlayerId: 'player-assister',
    };

    expect(getPlayerStatChanges(event)).toEqual([
      {
        playerId: 'player-scorer',
        stat: 'shots',
        amount: 1,
      },
      {
        playerId: 'player-scorer',
        stat: 'shotsOnTarget',
        amount: 1,
      },
      {
        playerId: 'player-scorer',
        stat: 'goals',
        amount: 1,
      },
      {
        playerId: 'player-assister',
        stat: 'assists',
        amount: 1,
      },
    ]);
  });
});
