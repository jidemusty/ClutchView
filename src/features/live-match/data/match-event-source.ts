import type { MatchEvent } from '../domain/match-event';

export type MatchEventListener = (event: MatchEvent) => void;
export type Unsubscribe = () => void;

export interface MatchEventSource {
  subscribe(matchId: string, listener: MatchEventListener): Unsubscribe;
}
