interface MatchEventBase {
  readonly id: string;
  readonly matchId: string;
  readonly sequence: number;
  readonly occurredAt: string;
  readonly minute: number;
}

export interface ShotEvent extends MatchEventBase {
  readonly type: 'shot';
  readonly playerId: string;
  readonly outcome: 'blocked' | 'offTarget';
}

export interface ShotOnTargetEvent extends MatchEventBase {
  readonly type: 'shotOnTarget';
  readonly playerId: string;
  readonly outcome: 'saved';
}

export interface GoalEvent extends MatchEventBase {
  readonly type: 'goal';
  readonly playerId: string;
  readonly assistedByPlayerId?: string;
}

export type MatchEvent = ShotEvent | ShotOnTargetEvent | GoalEvent;
