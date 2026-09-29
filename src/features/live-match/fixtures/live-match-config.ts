import { replayMatchId } from '../data/replay/fixtures/north-london-vs-merseyside';
import type { ProjectionDefinition } from '../domain/projection';

export type TeamId = 'home' | 'away';

export interface PlayerMetadata {
  readonly name: string;
  readonly teamId: TeamId;
  readonly teamAbbreviation: string;
}

export const liveMatchConfig = {
  matchId: replayMatchId,

  initialScore: {
    home: 0,
    away: 1,
  },

  initialClock: '48:00',
  period: 'Second half',

  homeTeam: {
    name: 'North London Athletic',
    abbreviation: 'NLA',
    badgeColor: '#C94F5D',
  },

  awayTeam: {
    name: 'Merseyside City',
    abbreviation: 'MC',
    badgeColor: '#4D73C9',
  },

  players: {
    'player-marcus-bennett': {
      name: 'Marcus Bennett',
      teamId: 'home',
      teamAbbreviation: 'NLA',
    },
    'player-alejandro-fernandez': {
      name: 'Alejandro Fernández',
      teamId: 'away',
      teamAbbreviation: 'MC',
    },
    'player-christopher-montgomery-wells': {
      name: 'Christopher Montgomery-Wells',
      teamId: 'home',
      teamAbbreviation: 'NLA',
    },
    'player-second-scorer': {
      name: 'Daniel Okafor',
      teamId: 'home',
      teamAbbreviation: 'NLA',
    },
  } satisfies Readonly<Record<string, PlayerMetadata>>,

  projections: [
    {
      id: 'projection-marcus-shots',
      playerId: 'player-marcus-bennett',
      stat: 'shots',
      target: 2,
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
  ] satisfies readonly ProjectionDefinition[],
} as const;
