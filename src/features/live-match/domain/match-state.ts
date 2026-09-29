import type { MatchEvent } from './match-event';
import { getPlayerStatChanges } from './player-stat';
import type { ProjectionDefinition, ProjectionProgress } from './projection';

export interface MatchState {
  readonly matchId: string;
  readonly projections: readonly ProjectionProgress[];
  readonly acceptedEventIds: readonly string[];
  readonly acceptedEvents: readonly MatchEvent[];
  readonly lastAcceptedSequence: number;
  readonly pendingEvents: readonly MatchEvent[];
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
    lastAcceptedSequence: 0,
    pendingEvents: [],
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

  if (
    state.acceptedEventIds.includes(event.id) ||
    state.pendingEvents.some((pendingEvent) => pendingEvent.id === event.id)
  ) {
    return state;
  }

  if (event.sequence <= state.lastAcceptedSequence) {
    throw new Error(
      `Cannot apply event sequence ${event.sequence}; sequence ${state.lastAcceptedSequence} was already accepted`,
    );
  }

  const expectedSequence = state.lastAcceptedSequence + 1;

  if (event.sequence > expectedSequence) {
    return {
      ...state,
      pendingEvents: [...state.pendingEvents, event].sort(
        (left, right) => left.sequence - right.sequence,
      ),
    };
  }

  return acceptConsecutiveEvents(state, event);
}

function acceptConsecutiveEvents(
  state: MatchState,
  event: MatchEvent,
): MatchState {
  let nextState = applyAcceptedEvent(state, event);

  while (true) {
    const nextSequence = nextState.lastAcceptedSequence + 1;
    const nextEvent = nextState.pendingEvents.find(
      (pendingEvent) => pendingEvent.sequence === nextSequence,
    );

    if (nextEvent === undefined) {
      return nextState;
    }

    nextState = applyAcceptedEvent(nextState, nextEvent);
  }
}

function applyAcceptedEvent(state: MatchState, event: MatchEvent): MatchState {
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
    lastAcceptedSequence: event.sequence,
    pendingEvents: state.pendingEvents.filter(
      (pendingEvent) => pendingEvent.id !== event.id,
    ),
  };
}
