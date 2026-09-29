import type { PlayerStat } from './player-stat';

export interface ProjectionDefinition {
  readonly id: string;
  readonly playerId: string;
  readonly stat: PlayerStat;
  readonly target: number;
}

export interface ProjectionProgress extends ProjectionDefinition {
  readonly current: number;
}
