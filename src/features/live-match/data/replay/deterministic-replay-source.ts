import type {
  MatchEventListener,
  MatchEventSource,
  Unsubscribe,
} from '../match-event-source';
import type { ReplayClock, ScheduledTask } from './replay-clock';
import { systemReplayClock } from './replay-clock';
import type {
  ConnectionStatus,
  ReplayController,
  ReplaySnapshot,
  ReplaySnapshotListener,
  ReplaySpeed,
  ReplayStatus,
} from './replay-controller';
import type { TimedMatchEvent } from './timed-match-event';

const simulatedDelayMs = 3_000;
const reconnectDelayMs = 800;

interface DeterministicReplaySourceOptions {
  readonly matchId: string;
  readonly events: readonly TimedMatchEvent[];
  readonly clock?: ReplayClock;
  readonly initialSpeed?: ReplaySpeed;
}

export class DeterministicReplaySource
  implements MatchEventSource, ReplayController
{
  private readonly matchId: string;
  private readonly events: readonly TimedMatchEvent[];
  private readonly clock: ReplayClock;

  private readonly eventListeners = new Set<MatchEventListener>();
  private readonly snapshotListeners = new Set<ReplaySnapshotListener>();

  private status: ReplayStatus = 'idle';
  private connectionStatus: ConnectionStatus = 'current';
  private speed: ReplaySpeed;
  private nextEventIndex = 0;
  private remainingSourceDelayMs: number;
  private readonly bufferedEvents: TimedMatchEvent['event'][] = [];
  private lastEmittedEvent: TimedMatchEvent['event'] | undefined;

  private scheduledTask: ScheduledTask | undefined;
  private reconnectTask: ScheduledTask | undefined;
  private scheduledAtMs: number | undefined;
  private scheduledSpeed: ReplaySpeed | undefined;

  constructor({
    matchId,
    events,
    clock = systemReplayClock,
    initialSpeed = 1,
  }: DeterministicReplaySourceOptions) {
    this.validateEvents(matchId, events);

    this.matchId = matchId;
    this.events = [...events];
    this.clock = clock;
    this.speed = initialSpeed;
    this.remainingSourceDelayMs = events[0]?.delayMs ?? 0;
  }

  subscribe(matchId: string, listener: MatchEventListener): Unsubscribe {
    if (matchId !== this.matchId) {
      throw new Error(
        `Cannot subscribe to match "${matchId}"; replay contains "${this.matchId}"`,
      );
    }

    this.eventListeners.add(listener);

    return () => {
      this.eventListeners.delete(listener);
    };
  }

  subscribeToSnapshot(listener: ReplaySnapshotListener): Unsubscribe {
    this.snapshotListeners.add(listener);

    return () => {
      this.snapshotListeners.delete(listener);
    };
  }

  getSnapshot(): ReplaySnapshot {
    return {
      status: this.status,
      connectionStatus: this.connectionStatus,
      speed: this.speed,
      nextEventIndex: this.nextEventIndex,
      totalEvents: this.events.length,
      bufferedEventCount: this.bufferedEvents.length,
      canEmitDuplicate: this.lastEmittedEvent !== undefined,
      canEmitOutOfOrder:
        (this.status === 'playing' || this.status === 'paused') &&
        this.nextEventIndex + 1 < this.events.length,
    };
  }

  play(): void {
    if (this.status === 'playing' || this.status === 'completed') {
      return;
    }

    if (this.nextEventIndex >= this.events.length) {
      this.status = 'completed';
      this.notifySnapshotListeners();
      return;
    }

    this.status = 'playing';
    this.scheduleNextEvent();
    this.notifySnapshotListeners();
  }

  pause(): void {
    if (this.status !== 'playing') {
      return;
    }

    this.captureRemainingSourceDelay();
    this.cancelScheduledTask();

    this.status = 'paused';
    this.notifySnapshotListeners();
  }

  reset(): void {
    this.cancelScheduledTask();
    this.cancelReconnectTask();

    this.status = 'idle';
    this.connectionStatus = 'current';
    this.nextEventIndex = 0;
    this.remainingSourceDelayMs = this.events[0]?.delayMs ?? 0;
    this.bufferedEvents.length = 0;
    this.lastEmittedEvent = undefined;

    this.notifySnapshotListeners();
  }

  setSpeed(speed: ReplaySpeed): void {
    if (speed === this.speed) {
      return;
    }

    if (this.status === 'playing') {
      this.captureRemainingSourceDelay();
      this.cancelScheduledTask();

      this.speed = speed;
      this.scheduleNextEvent();
      this.notifySnapshotListeners();
      return;
    }

    this.speed = speed;
    this.notifySnapshotListeners();
  }

  delayNextEvent(): void {
    if (
      (this.status !== 'playing' && this.status !== 'paused') ||
      this.connectionStatus !== 'current'
    ) {
      return;
    }

    if (this.status === 'playing') {
      this.captureRemainingSourceDelay();
      this.cancelScheduledTask();
    }

    this.remainingSourceDelayMs += simulatedDelayMs;
    this.connectionStatus = 'delayed';

    if (this.status === 'playing') {
      this.scheduleNextEvent();
    }

    this.notifySnapshotListeners();
  }

  disconnect(): void {
    if (
      this.status === 'idle' ||
      (this.status === 'completed' && this.connectionStatus === 'current') ||
      this.connectionStatus === 'disconnected' ||
      this.connectionStatus === 'reconnecting'
    ) {
      return;
    }

    this.connectionStatus = 'disconnected';
    this.notifySnapshotListeners();
  }

  reconnect(): void {
    if (this.connectionStatus !== 'disconnected') {
      return;
    }

    this.connectionStatus = 'reconnecting';
    this.notifySnapshotListeners();

    this.reconnectTask = this.clock.schedule(() => {
      this.reconnectTask = undefined;

      for (const event of this.bufferedEvents.splice(0)) {
        this.deliverEvent(event);
      }

      this.connectionStatus = 'current';
      this.notifySnapshotListeners();
    }, reconnectDelayMs);
  }

  emitDuplicate(): void {
    if (this.lastEmittedEvent === undefined) {
      return;
    }

    this.publishEvent(this.lastEmittedEvent);
    this.notifySnapshotListeners();
  }

  emitNextPairOutOfOrder(): void {
    if (this.status !== 'playing' && this.status !== 'paused') {
      return;
    }

    const firstEvent = this.events[this.nextEventIndex];
    const secondEvent = this.events[this.nextEventIndex + 1];

    if (firstEvent === undefined || secondEvent === undefined) {
      return;
    }

    if (this.status === 'playing') {
      this.cancelScheduledTask();
    }

    this.nextEventIndex += 2;
    this.remainingSourceDelayMs =
      this.events[this.nextEventIndex]?.delayMs ?? 0;

    this.publishEvent(secondEvent.event);
    this.publishEvent(firstEvent.event);

    if (this.nextEventIndex >= this.events.length) {
      this.status = 'completed';
    } else if (this.status === 'playing') {
      this.scheduleNextEvent();
    }

    this.notifySnapshotListeners();
  }

  private scheduleNextEvent(): void {
    if (this.status !== 'playing') {
      return;
    }

    const nextTimedEvent = this.events[this.nextEventIndex];

    if (nextTimedEvent === undefined) {
      this.status = 'completed';
      this.notifySnapshotListeners();
      return;
    }

    const realDelayMs = this.remainingSourceDelayMs / this.speed;

    this.scheduledAtMs = this.clock.now();
    this.scheduledSpeed = this.speed;

    this.scheduledTask = this.clock.schedule(() => {
      this.scheduledTask = undefined;
      this.scheduledAtMs = undefined;
      this.scheduledSpeed = undefined;

      this.emitNextEvent();
    }, realDelayMs);
  }

  private emitNextEvent(): void {
    if (this.status !== 'playing') {
      return;
    }

    const timedEvent = this.events[this.nextEventIndex];

    if (timedEvent === undefined) {
      this.status = 'completed';
      this.notifySnapshotListeners();
      return;
    }

    this.nextEventIndex += 1;

    const nextTimedEvent = this.events[this.nextEventIndex];
    this.remainingSourceDelayMs = nextTimedEvent?.delayMs ?? 0;

    if (nextTimedEvent === undefined) {
      this.status = 'completed';
    }

    this.publishEvent(timedEvent.event);

    if (this.connectionStatus === 'delayed') {
      this.connectionStatus = 'current';
    }

    if (this.status === 'completed') {
      this.notifySnapshotListeners();
      return;
    }

    if (this.status !== 'playing') {
      return;
    }

    this.scheduleNextEvent();
    this.notifySnapshotListeners();
  }

  private captureRemainingSourceDelay(): void {
    if (this.scheduledAtMs === undefined || this.scheduledSpeed === undefined) {
      return;
    }

    const elapsedRealTimeMs = Math.max(
      this.clock.now() - this.scheduledAtMs,
      0,
    );

    const consumedSourceTimeMs = elapsedRealTimeMs * this.scheduledSpeed;

    this.remainingSourceDelayMs = Math.max(
      this.remainingSourceDelayMs - consumedSourceTimeMs,
      0,
    );
  }

  private cancelScheduledTask(): void {
    this.scheduledTask?.cancel();

    this.scheduledTask = undefined;
    this.scheduledAtMs = undefined;
    this.scheduledSpeed = undefined;
  }

  private cancelReconnectTask(): void {
    this.reconnectTask?.cancel();
    this.reconnectTask = undefined;
  }

  private publishEvent(event: TimedMatchEvent['event']): void {
    this.lastEmittedEvent = event;

    if (
      this.connectionStatus === 'disconnected' ||
      this.connectionStatus === 'reconnecting'
    ) {
      this.bufferedEvents.push(event);
      return;
    }

    this.deliverEvent(event);
  }

  private deliverEvent(event: TimedMatchEvent['event']): void {
    for (const listener of this.eventListeners) {
      listener(event);
    }
  }

  private notifySnapshotListeners(): void {
    const snapshot = this.getSnapshot();

    for (const listener of this.snapshotListeners) {
      listener(snapshot);
    }
  }

  private validateEvents(
    matchId: string,
    events: readonly TimedMatchEvent[],
  ): void {
    const eventIds = new Set<string>();
    let previousSequence: number | undefined;

    for (const timedEvent of events) {
      const { event } = timedEvent;

      if (event.matchId !== matchId) {
        throw new Error(
          `Replay event "${event.id}" belongs to match "${event.matchId}", expected "${matchId}"`,
        );
      }

      if (!Number.isFinite(timedEvent.delayMs) || timedEvent.delayMs < 0) {
        throw new Error(
          `Replay event "${event.id}" has invalid delay "${timedEvent.delayMs}"`,
        );
      }

      if (eventIds.has(event.id)) {
        throw new Error(`Replay contains duplicate event ID "${event.id}"`);
      }

      if (
        previousSequence !== undefined &&
        event.sequence !== previousSequence + 1
      ) {
        throw new Error(
          `Replay event "${event.id}" has sequence ${event.sequence}; expected ${previousSequence + 1}`,
        );
      }

      eventIds.add(event.id);
      previousSequence = event.sequence;
    }
  }
}
