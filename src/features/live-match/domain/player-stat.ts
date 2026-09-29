import type { MatchEvent } from './match-event';

export type PlayerStat = 'shots' | 'shotsOnTarget' | 'goals' | 'assists';

export interface PlayerStatChange {
  readonly playerId: string;
  readonly stat: PlayerStat;
  readonly amount: number;
}

export function getPlayerStatChanges(
  event: MatchEvent,
): readonly PlayerStatChange[] {
  switch (event.type) {
    case 'shot':
      return [
        {
          playerId: event.playerId,
          stat: 'shots',
          amount: 1,
        },
      ];

    case 'shotOnTarget':
      return [
        {
          playerId: event.playerId,
          stat: 'shots',
          amount: 1,
        },
        {
          playerId: event.playerId,
          stat: 'shotsOnTarget',
          amount: 1,
        },
      ];

    case 'goal': {
      const scorerChanges: readonly PlayerStatChange[] = [
        {
          playerId: event.playerId,
          stat: 'shots',
          amount: 1,
        },
        {
          playerId: event.playerId,
          stat: 'shotsOnTarget',
          amount: 1,
        },
        {
          playerId: event.playerId,
          stat: 'goals',
          amount: 1,
        },
      ];

      if (event.assistedByPlayerId === undefined) {
        return scorerChanges;
      }

      return [
        ...scorerChanges,
        {
          playerId: event.assistedByPlayerId,
          stat: 'assists',
          amount: 1,
        },
      ];
    }
  }
}
