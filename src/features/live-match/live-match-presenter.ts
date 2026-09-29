import type { ReplaySnapshot } from './data/replay/replay-controller';
import type { MatchEvent } from './domain/match-event';
import type { MatchState } from './domain/match-state';
import type { PlayerStat } from './domain/player-stat';
import {
  liveMatchConfig,
  type PlayerMetadata,
  type TeamId,
} from './fixtures/live-match-config';
import type {
  LiveMatchScreenModel,
  ProjectionMetric,
  ProjectionStatus,
  TimelineEventDisplay,
} from './live-match-screen-model';

const metricLabel: Record<PlayerStat, ProjectionMetric> = {
  shots: 'Shots',
  shotsOnTarget: 'Shots on target',
  goals: 'Goals',
  assists: 'Assists',
};

interface Score {
  readonly home: number;
  readonly away: number;
}

export function presentLiveMatch(
  matchState: MatchState,
  replaySnapshot: ReplaySnapshot,
): LiveMatchScreenModel {
  const score = getScore(matchState.acceptedEvents);

  const latestEvent =
    matchState.acceptedEvents[matchState.acceptedEvents.length - 1];

  return {
    match: {
      homeTeam: {
        ...liveMatchConfig.homeTeam,
        score: score.home,
      },
      awayTeam: {
        ...liveMatchConfig.awayTeam,
        score: score.away,
      },
      clock:
        latestEvent === undefined
          ? liveMatchConfig.initialClock
          : `${latestEvent.minute}:00`,
      period: liveMatchConfig.period,
    },

    freshness: presentFreshness(replaySnapshot),

    projections: matchState.projections.map((projection) => {
      const player = getPlayer(projection.playerId);

      return {
        id: projection.id,
        playerName: player.name,
        teamAbbreviation: player.teamAbbreviation,
        metric: metricLabel[projection.stat],
        current: projection.current,
        target: projection.target,
        status: getProjectionStatus(projection.current, projection.target),
      };
    }),

    timeline: matchState.acceptedEvents.flatMap(presentTimelineEvent).reverse(),

    replay: {
      state: replaySnapshot.status,
      speed: `${replaySnapshot.speed}x`,
    },
  };
}

function presentFreshness(
  snapshot: ReplaySnapshot,
): LiveMatchScreenModel['freshness'] {
  switch (snapshot.status) {
    case 'idle':
      return {
        status: 'Ready',
        detail: 'Replay not started',
      };

    case 'playing':
      return {
        status: 'Replay',
        detail: `Event ${snapshot.nextEventIndex + 1} of ${snapshot.totalEvents}`,
      };

    case 'paused':
      return {
        status: 'Paused',
        detail: `Event ${snapshot.nextEventIndex} of ${snapshot.totalEvents}`,
      };

    case 'completed':
      return {
        status: 'Complete',
        detail: `${snapshot.totalEvents} events replayed`,
      };
  }
}

function getProjectionStatus(
  current: number,
  target: number,
): ProjectionStatus {
  if (current >= target) {
    return 'reached';
  }

  if (target > 0 && current / target >= 0.5) {
    return 'approaching';
  }

  return 'active';
}

function getScore(events: readonly MatchEvent[]): Score {
  return events
    .filter((event) => event.type === 'goal')
    .reduce<Score>((score, event) => {
      const player = getPlayer(event.playerId);

      return incrementScore(score, player.teamId);
    }, liveMatchConfig.initialScore);
}

function incrementScore(score: Score, teamId: TeamId): Score {
  if (teamId === 'home') {
    return {
      ...score,
      home: score.home + 1,
    };
  }

  return {
    ...score,
    away: score.away + 1,
  };
}

function presentTimelineEvent(
  event: MatchEvent,
): readonly TimelineEventDisplay[] {
  switch (event.type) {
    case 'shot': {
      const player = getPlayer(event.playerId);

      return [
        {
          id: event.id,
          minute: `${event.minute}'`,
          playerName: player.name,
          description:
            event.outcome === 'blocked' ? 'Shot blocked' : 'Shot off target',
          emphasis: 'standard',
        },
      ];
    }

    case 'shotOnTarget': {
      const player = getPlayer(event.playerId);

      return [
        {
          id: event.id,
          minute: `${event.minute}'`,
          playerName: player.name,
          description: 'Shot on target',
          emphasis: 'highlight',
        },
      ];
    }

    case 'goal': {
      const rows: TimelineEventDisplay[] = [];

      if (hasProjectionForPlayer(event.playerId)) {
        const scorer = getPlayer(event.playerId);

        rows.push({
          id: `${event.id}-goal`,
          minute: `${event.minute}'`,
          playerName: scorer.name,
          description: 'Goal',
          emphasis: 'critical',
        });
      }

      if (
        event.assistedByPlayerId !== undefined &&
        hasProjectionForPlayer(event.assistedByPlayerId)
      ) {
        const assister = getPlayer(event.assistedByPlayerId);

        rows.push({
          id: `${event.id}-assist`,
          minute: `${event.minute}'`,
          playerName: assister.name,
          description: 'Assist',
          emphasis: 'highlight',
        });
      }

      return rows;
    }
  }
}

function hasProjectionForPlayer(playerId: string): boolean {
  return liveMatchConfig.projections.some(
    (projection) => projection.playerId === playerId,
  );
}

function getPlayer(playerId: string): PlayerMetadata {
  const player: PlayerMetadata | undefined =
    liveMatchConfig.players[playerId as keyof typeof liveMatchConfig.players];

  if (player === undefined) {
    throw new Error(`Missing display metadata for player "${playerId}"`);
  }

  return player;
}
