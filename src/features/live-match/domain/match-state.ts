import type { MatchEvent } from './match-event';
import { getPlayerStatChanges } from './player-stat';
import type { ProjectionDefinition, ProjectionProgress } from './projection';

export interface MatchState {
  readonly matchId: string;
  readonly projections: readonly ProjectionProgress[];
  readonly acceptedEventIds: readonly string[];
  readonly acceptedEvents: readonly MatchEvent[];
}

interface CreateMatchStateInput {
  readonly matchId: string;
  readonly projections: readonly ProjectionDefinition[];
}

export function createMatchState({
  matchId,
  projections,
}: CreateMatchStateInput): MatchState {
  return {
    matchId,
    projections: projections.map((projection) => ({
      ...projection,
      current: 0,
    })),
    acceptedEventIds: [],
    acceptedEvents: [],
  };
}

export function applyMatchEvent(
  state: MatchState,
  event: MatchEvent,
): MatchState {
  if (event.matchId !== state.matchId) {
    throw new Error(
      `Cannot apply event for match "${event.matchId}" to match "${state.matchId}"`,
    );
  }

  if (state.acceptedEventIds.includes(event.id)) {
    return state;
  }

  const statChanges = getPlayerStatChanges(event);

  const projections = state.projections.map((projection) => {
    const increment = statChanges
      .filter(
        (change) =>
          change.playerId === projection.playerId &&
          change.stat === projection.stat,
      )
      .reduce((total, change) => total + change.amount, 0);

    if (increment === 0) {
      return projection;
    }

    return {
      ...projection,
      current: projection.current + increment,
    };
  });

  return {
    ...state,
    projections,
    acceptedEventIds: [...state.acceptedEventIds, event.id],
    acceptedEvents: [...state.acceptedEvents, event],
  };
}
