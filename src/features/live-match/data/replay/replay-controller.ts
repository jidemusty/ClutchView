import type { Unsubscribe } from '../match-event-source';

export type ReplaySpeed = 1 | 2 | 4;

export type ReplayStatus = 'idle' | 'playing' | 'paused' | 'completed';
export type ConnectionStatus =
  'current' | 'delayed' | 'disconnected' | 'reconnecting';

export interface ReplaySnapshot {
  readonly status: ReplayStatus;
  readonly connectionStatus: ConnectionStatus;
  readonly speed: ReplaySpeed;
  readonly nextEventIndex: number;
  readonly totalEvents: number;
  readonly bufferedEventCount: number;
  readonly canEmitDuplicate: boolean;
  readonly canEmitOutOfOrder: boolean;
}

export type ReplaySnapshotListener = (snapshot: ReplaySnapshot) => void;

export interface ReplayController {
  play(): void;
  pause(): void;
  reset(): void;
  setSpeed(speed: ReplaySpeed): void;
  delayNextEvent(): void;
  disconnect(): void;
  reconnect(): void;
  emitDuplicate(): void;
  emitNextPairOutOfOrder(): void;
  getSnapshot(): ReplaySnapshot;
  subscribeToSnapshot(listener: ReplaySnapshotListener): Unsubscribe;
}
