import type { LiveMatchScreenModel } from '../live-match-screen-model';

export const liveMatchFixture = {
  match: {
    homeTeam: {
      name: 'North London Athletic',
      abbreviation: 'NLA',
      badgeColor: '#C94F5D',
      score: 2,
    },
    awayTeam: {
      name: 'Merseyside City',
      abbreviation: 'MC',
      badgeColor: '#4D73C9',
      score: 1,
    },
    clock: '68:24',
    period: 'Second half',
  },
  freshness: {
    status: 'Live',
    detail: 'Updated 2s ago',
  },
  projections: [
    {
      id: 'projection-marcus-bennett-shots',
      playerName: 'Marcus Bennett',
      teamAbbreviation: 'NLA',
      metric: 'Shots',
      current: 1,
      target: 3,
      status: 'active',
    },
    {
      id: 'projection-alejandro-fernandez-shots-on-target',
      playerName: 'Alejandro Fernández',
      teamAbbreviation: 'MC',
      metric: 'Shots on target',
      current: 2,
      target: 3,
      status: 'approaching',
    },
    {
      id: 'projection-christopher-montgomery-wells-assists',
      playerName: 'Christopher Montgomery-Wells',
      teamAbbreviation: 'NLA',
      metric: 'Assists',
      current: 1,
      target: 1,
      status: 'reached',
    },
  ],
  timeline: [
    {
      id: 'event-68-goal',
      minute: "68'",
      playerName: 'Marcus Bennett',
      description: 'Goal',
      emphasis: 'critical',
    },
    {
      id: 'event-63-shot-on-target',
      minute: "63'",
      playerName: 'Alejandro Fernández',
      description: 'Shot on target',
      emphasis: 'highlight',
    },
    {
      id: 'event-57-assist',
      minute: "57'",
      playerName: 'Christopher Montgomery-Wells',
      description: 'Assist',
      emphasis: 'highlight',
    },
    {
      id: 'event-49-shot',
      minute: "49'",
      playerName: 'Marcus Bennett',
      description: 'Shot blocked',
      emphasis: 'standard',
    },
  ],
  replay: {
    state: 'paused',
    speed: '1x',
  },
} satisfies LiveMatchScreenModel;
