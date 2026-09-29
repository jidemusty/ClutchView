import type { TimedMatchEvent } from '../timed-match-event';

export const replayMatchId = 'match-nla-mc';

export const replayEvents = [
  {
    delayMs: 1_500,
    event: {
      id: 'event-49-shot',
      matchId: replayMatchId,
      sequence: 1,
      occurredAt: '2026-09-28T20:49:00.000Z',
      minute: 49,
      type: 'shot',
      playerId: 'player-marcus-bennett',
      outcome: 'blocked',
    },
  },
  {
    delayMs: 2_000,
    event: {
      id: 'event-57-goal',
      matchId: replayMatchId,
      sequence: 2,
      occurredAt: '2026-09-28T20:57:00.000Z',
      minute: 57,
      type: 'goal',
      playerId: 'player-second-scorer',
      assistedByPlayerId: 'player-christopher-montgomery-wells',
    },
  },
  {
    delayMs: 2_000,
    event: {
      id: 'event-63-shot-on-target',
      matchId: replayMatchId,
      sequence: 3,
      occurredAt: '2026-09-28T21:03:00.000Z',
      minute: 63,
      type: 'shotOnTarget',
      playerId: 'player-alejandro-fernandez',
      outcome: 'saved',
    },
  },
  {
    delayMs: 2_500,
    event: {
      id: 'event-68-goal',
      matchId: replayMatchId,
      sequence: 4,
      occurredAt: '2026-09-28T21:08:00.000Z',
      minute: 68,
      type: 'goal',
      playerId: 'player-marcus-bennett',
    },
  },
] as const satisfies readonly TimedMatchEvent[];
