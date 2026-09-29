import { replayEvents, replayMatchId } from './north-london-vs-merseyside';

describe('north London versus Merseyside replay fixture', () => {
  it('uses one match ID for every event', () => {
    expect(
      replayEvents.every(({ event }) => event.matchId === replayMatchId),
    ).toBe(true);
  });

  it('uses positive delays', () => {
    expect(replayEvents.every(({ delayMs }) => delayMs > 0)).toBe(true);
  });

  it('uses consecutive sequence numbers', () => {
    expect(replayEvents.map(({ event }) => event.sequence)).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it('is ordered chronologically', () => {
    const minutes = replayEvents.map(({ event }) => event.minute);

    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });

  it('uses unique event IDs', () => {
    const eventIds = replayEvents.map(({ event }) => event.id);

    expect(new Set(eventIds).size).toBe(eventIds.length);
  });
});
