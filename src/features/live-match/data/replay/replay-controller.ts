import type { Unsubscribe } from '../match-event-source';

export type ReplaySpeed = 1 | 2 | 4;

export type ReplayStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface ReplaySnapshot {
  readonly status: ReplayStatus;
  readonly speed: ReplaySpeed;
  readonly nextEventIndex: number;
  readonly totalEvents: number;
}

export type ReplaySnapshotListener = (snapshot: ReplaySnapshot) => void;

export interface ReplayController {
  play(): void;
  pause(): void;
  reset(): void;
  setSpeed(speed: ReplaySpeed): void;
  getSnapshot(): ReplaySnapshot;
  subscribeToSnapshot(listener: ReplaySnapshotListener): Unsubscribe;
}
