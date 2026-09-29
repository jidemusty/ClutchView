import type { MatchEvent } from '../../domain/match-event';
import { DeterministicReplaySource } from './deterministic-replay-source';
import type { ReplaySnapshot } from './replay-controller';
import { ManualReplayClock } from './testing/manual-replay-clock';
import type { TimedMatchEvent } from './timed-match-event';

const matchId = 'match-001';

const replayEvents = [
  {
    delayMs: 1_000,
    event: {
      id: 'event-001',
      matchId,
      sequence: 1,
      occurredAt: '2026-09-28T20:10:00.000Z',
      minute: 10,
      type: 'shot',
      playerId: 'player-001',
      outcome: 'blocked',
    },
  },
  {
    delayMs: 2_000,
    event: {
      id: 'event-002',
      matchId,
      sequence: 2,
      occurredAt: '2026-09-28T20:20:00.000Z',
      minute: 20,
      type: 'goal',
      playerId: 'player-001',
    },
  },
] as const satisfies readonly TimedMatchEvent[];

interface TestContext {
  readonly clock: ManualReplayClock;
  readonly source: DeterministicReplaySource;
  readonly receivedEvents: MatchEvent[];
}

function createTestContext(): TestContext {
  const clock = new ManualReplayClock();

  const source = new DeterministicReplaySource({
    matchId,
    events: replayEvents,
    clock,
  });

  const receivedEvents: MatchEvent[] = [];

  source.subscribe(matchId, (event) => {
    receivedEvents.push(event);
  });

  return {
    clock,
    source,
    receivedEvents,
  };
}

describe('DeterministicReplaySource', () => {
  it('emits events after their configured relative delays', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();

    clock.advanceBy(999);
    expect(receivedEvents).toEqual([]);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);

    clock.advanceBy(1_999);
    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual([
      'event-001',
      'event-002',
    ]);

    expect(source.getSnapshot()).toEqual(
      expect.objectContaining({
        status: 'completed',
        speed: 1,
        nextEventIndex: 2,
        totalEvents: 2,
      }),
    );
  });

  it('pauses and resumes with the remaining delay', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    clock.advanceBy(400);
    source.pause();

    clock.advanceBy(10_000);
    expect(receivedEvents).toEqual([]);

    source.play();

    clock.advanceBy(599);
    expect(receivedEvents).toEqual([]);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);
  });

  it('applies speed to the remaining source delay', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    clock.advanceBy(250);

    source.setSpeed(2);

    clock.advanceBy(374);
    expect(receivedEvents).toEqual([]);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);
  });

  it('resets to the start and cancels pending delivery', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    clock.advanceBy(1_000);

    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);

    source.reset();

    expect(source.getSnapshot()).toEqual(
      expect.objectContaining({
        status: 'idle',
        connectionStatus: 'current',
        speed: 1,
        nextEventIndex: 0,
        totalEvents: 2,
        bufferedEventCount: 0,
      }),
    );

    clock.advanceBy(10_000);

    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);

    source.play();
    clock.advanceBy(1_000);

    expect(receivedEvents.map((event) => event.id)).toEqual([
      'event-001',
      'event-001',
    ]);
  });

  it('stops delivering events after unsubscription', () => {
    const clock = new ManualReplayClock();

    const source = new DeterministicReplaySource({
      matchId,
      events: replayEvents,
      clock,
    });

    const receivedEvents: MatchEvent[] = [];

    const unsubscribe = source.subscribe(matchId, (event) => {
      receivedEvents.push(event);
    });

    source.play();
    unsubscribe();
    clock.advanceBy(3_000);

    expect(receivedEvents).toEqual([]);
  });

  it('rejects subscriptions for another match', () => {
    const { source } = createTestContext();

    expect(() => source.subscribe('match-002', () => {})).toThrow(
      'Cannot subscribe to match "match-002"; replay contains "match-001"',
    );
  });

  it('notifies snapshot listeners of replay progress and controls', () => {
    const { clock, source } = createTestContext();
    const snapshots: ReplaySnapshot[] = [];

    const unsubscribe = source.subscribeToSnapshot((snapshot) => {
      snapshots.push(snapshot);
    });

    source.play();
    clock.advanceBy(1_000);
    source.pause();

    expect(
      snapshots.map(({ status, speed, nextEventIndex, totalEvents }) => ({
        status,
        speed,
        nextEventIndex,
        totalEvents,
      })),
    ).toEqual([
      {
        status: 'playing',
        speed: 1,
        nextEventIndex: 0,
        totalEvents: 2,
      },
      {
        status: 'playing',
        speed: 1,
        nextEventIndex: 1,
        totalEvents: 2,
      },
      {
        status: 'paused',
        speed: 1,
        nextEventIndex: 1,
        totalEvents: 2,
      },
    ]);

    unsubscribe();
    source.setSpeed(2);

    expect(snapshots).toHaveLength(3);
  });

  it('marks a delayed event stale until it is delivered', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    source.delayNextEvent();

    expect(source.getSnapshot().connectionStatus).toBe('delayed');

    clock.advanceBy(3_999);
    expect(receivedEvents).toEqual([]);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual(['event-001']);
    expect(source.getSnapshot().connectionStatus).toBe('current');
  });

  it('buffers events while disconnected and catches up on reconnect', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    source.disconnect();
    clock.advanceBy(3_000);

    expect(receivedEvents).toEqual([]);
    expect(source.getSnapshot()).toEqual(
      expect.objectContaining({
        status: 'completed',
        connectionStatus: 'disconnected',
        bufferedEventCount: 2,
      }),
    );

    source.reconnect();

    expect(source.getSnapshot().connectionStatus).toBe('reconnecting');

    clock.advanceBy(799);
    expect(receivedEvents).toEqual([]);

    clock.advanceBy(1);
    expect(receivedEvents.map((event) => event.id)).toEqual([
      'event-001',
      'event-002',
    ]);
    expect(source.getSnapshot()).toEqual(
      expect.objectContaining({
        connectionStatus: 'current',
        bufferedEventCount: 0,
      }),
    );
  });

  it('can emit a duplicate without advancing replay progress', () => {
    const { clock, source, receivedEvents } = createTestContext();

    source.play();
    clock.advanceBy(1_000);
    source.emitDuplicate();

    expect(receivedEvents.map((event) => event.id)).toEqual([
      'event-001',
      'event-001',
    ]);
    expect(source.getSnapshot().nextEventIndex).toBe(1);
  });

  it('can emit the next pair out of order', () => {
    const { source, receivedEvents } = createTestContext();

    source.play();
    source.emitNextPairOutOfOrder();

    expect(receivedEvents.map((event) => event.sequence)).toEqual([2, 1]);
    expect(source.getSnapshot()).toEqual(
      expect.objectContaining({
        status: 'completed',
        nextEventIndex: 2,
        canEmitOutOfOrder: false,
      }),
    );
  });

  it('rejects duplicate event IDs', () => {
    const duplicateEvents = [
      replayEvents[0],
      {
        ...replayEvents[1],
        event: {
          ...replayEvents[1].event,
          id: replayEvents[0].event.id,
        },
      },
    ] satisfies readonly TimedMatchEvent[];

    expect(
      () =>
        new DeterministicReplaySource({
          matchId,
          events: duplicateEvents,
        }),
    ).toThrow('Replay contains duplicate event ID "event-001"');
  });

  it('rejects a gap in event sequences', () => {
    const eventsWithGap = [
      replayEvents[0],
      {
        ...replayEvents[1],
        event: {
          ...replayEvents[1].event,
          sequence: 3,
        },
      },
    ] satisfies readonly TimedMatchEvent[];

    expect(
      () =>
        new DeterministicReplaySource({
          matchId,
          events: eventsWithGap,
        }),
    ).toThrow('Replay event "event-002" has sequence 3; expected 2');
  });
});
