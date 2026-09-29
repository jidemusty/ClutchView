export type ProjectionMetric =
  'Shots' | 'Shots on target' | 'Goals' | 'Assists';

export type ProjectionStatus = 'active' | 'approaching' | 'reached';

export type TimelineEventEmphasis = 'standard' | 'highlight' | 'critical';

export type ReplayState = 'playing' | 'paused';

export interface TeamDisplay {
  readonly name: string;
  readonly abbreviation: string;
  readonly badgeColor: string;
  readonly score: number;
}

export interface ProjectionDisplay {
  readonly id: string;
  readonly playerName: string;
  readonly teamAbbreviation: string;
  readonly metric: ProjectionMetric;
  readonly current: number;
  readonly target: number;
  readonly status: ProjectionStatus;
}

export interface TimelineEventDisplay {
  readonly id: string;
  readonly minute: string;
  readonly playerName: string;
  readonly description: string;
  readonly emphasis: TimelineEventEmphasis;
}

export interface LiveMatchScreenModel {
  readonly match: {
    readonly homeTeam: TeamDisplay;
    readonly awayTeam: TeamDisplay;
    readonly clock: string;
    readonly period: string;
  };
  readonly freshness: {
    readonly status: string;
    readonly detail: string;
  };
  readonly projections: readonly ProjectionDisplay[];
  readonly timeline: readonly TimelineEventDisplay[];
  readonly replay: {
    readonly state: ReplayState;
    readonly speed: string;
  };
}
