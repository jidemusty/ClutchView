import {
  replayEvents,
  replayMatchId,
} from './data/replay/fixtures/north-london-vs-merseyside';
import type { ReplaySnapshot } from './data/replay/replay-controller';
import type { MatchEvent } from './domain/match-event';
import { applyMatchEvent, createMatchState } from './domain/match-state';
import { liveMatchConfig } from './fixtures/live-match-config';
import { presentLiveMatch } from './live-match-presenter';

const idleSnapshot: ReplaySnapshot = {
  status: 'idle',
  connectionStatus: 'current',
  speed: 1,
  nextEventIndex: 0,
  totalEvents: replayEvents.length,
  bufferedEventCount: 0,
  canEmitDuplicate: false,
  canEmitOutOfOrder: false,
};

describe('presentLiveMatch', () => {
  it('presents the initial replay state', () => {
    const matchState = createMatchState({
      matchId: replayMatchId,
      projections: liveMatchConfig.projections,
    });

    const result = presentLiveMatch(matchState, idleSnapshot);

    expect(result.match.homeTeam.score).toBe(0);
    expect(result.match.awayTeam.score).toBe(1);
    expect(result.match.clock).toBe('48:00');
    expect(result.freshness).toEqual({
      status: 'Ready',
      detail: 'Replay not started',
      tone: 'current',
    });
    expect(result.projections.map(({ current }) => current)).toEqual([0, 0, 0]);
    expect(result.timeline).toEqual([]);
    expect(result.replay).toEqual({
      state: 'idle',
      connectionStatus: 'current',
      speed: 1,
      bufferedEventCount: 0,
      canEmitDuplicate: false,
      canEmitOutOfOrder: false,
    });
  });

  it('presents the completed replay state', () => {
    const matchState = replayEvents.reduce(
      (state, { event }) => applyMatchEvent(state, event),
      createMatchState({
        matchId: replayMatchId,
        projections: liveMatchConfig.projections,
      }),
    );

    const completedSnapshot: ReplaySnapshot = {
      status: 'completed',
      connectionStatus: 'current',
      speed: 1,
      nextEventIndex: replayEvents.length,
      totalEvents: replayEvents.length,
      bufferedEventCount: 0,
      canEmitDuplicate: true,
      canEmitOutOfOrder: false,
    };

    const result = presentLiveMatch(matchState, completedSnapshot);

    expect(result.match.homeTeam.score).toBe(2);
    expect(result.match.awayTeam.score).toBe(1);
    expect(result.match.clock).toBe('68:00');

    expect(result.projections.map(({ current }) => current)).toEqual([2, 1, 1]);

    expect(
      result.timeline.map(({ minute, playerName, description }) => ({
        minute,
        playerName,
        description,
      })),
    ).toEqual([
      {
        minute: "68'",
        playerName: 'Marcus Bennett',
        description: 'Goal',
      },
      {
        minute: "63'",
        playerName: 'Alejandro Fernández',
        description: 'Shot on target',
      },
      {
        minute: "57'",
        playerName: 'Christopher Montgomery-Wells',
        description: 'Assist',
      },
      {
        minute: "49'",
        playerName: 'Marcus Bennett',
        description: 'Shot blocked',
      },
    ]);

    expect(result.freshness).toEqual({
      status: 'Complete',
      detail: '4 events replayed',
      tone: 'current',
    });
  });

  it('marks disconnected data as stale and reports buffered events', () => {
    const matchState = createMatchState({
      matchId: replayMatchId,
      projections: liveMatchConfig.projections,
    });

    const result = presentLiveMatch(matchState, {
      ...idleSnapshot,
      connectionStatus: 'disconnected',
      bufferedEventCount: 2,
    });

    expect(result.freshness).toEqual({
      status: 'Disconnected',
      detail: '2 events waiting',
      tone: 'offline',
    });
  });

  it('surfaces a missing sequence instead of presenting future data', () => {
    const matchState = applyMatchEvent(
      createMatchState({
        matchId: replayMatchId,
        projections: liveMatchConfig.projections,
      }),
      replayEvents[1].event,
    );

    const result = presentLiveMatch(matchState, idleSnapshot);

    expect(result.timeline).toEqual([]);
    expect(result.freshness).toEqual({
      status: 'Delayed',
      detail: 'Waiting for event 1',
      tone: 'warning',
    });
  });

  it('keeps the goal before its assist when presenting newest events', () => {
    const matchState = createMatchState({
      matchId: replayMatchId,
      projections: liveMatchConfig.projections,
    });

    const goalWithAssist: MatchEvent = {
      id: 'event-goal-with-assist',
      matchId: replayMatchId,
      sequence: 1,
      occurredAt: '2026-09-28T20:57:00.000Z',
      minute: 57,
      type: 'goal',
      playerId: 'player-marcus-bennett',
      assistedByPlayerId: 'player-christopher-montgomery-wells',
    };

    const result = presentLiveMatch(
      applyMatchEvent(matchState, goalWithAssist),
      idleSnapshot,
    );

    expect(
      result.timeline.map(({ playerName, description }) => ({
        playerName,
        description,
      })),
    ).toEqual([
      {
        playerName: 'Marcus Bennett',
        description: 'Goal',
      },
      {
        playerName: 'Christopher Montgomery-Wells',
        description: 'Assist',
      },
    ]);
  });
});
