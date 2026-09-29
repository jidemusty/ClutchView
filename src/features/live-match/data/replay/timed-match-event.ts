import type { MatchEvent } from '../../domain/match-event';

export interface TimedMatchEvent {
  readonly delayMs: number;
  readonly event: MatchEvent;
}
