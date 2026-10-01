# Replay performance

## Result

ClutchView isolates projection-card updates so an accepted match event does not
rerender unrelated player cards.

The deterministic four-event fixture produces:

- **Baseline:** 15 projection-card render decisions
- **Optimized:** 7 projection-card renders
- **Reduction:** 8 renders, or 53%

The optimized total includes the initial render of all three cards and one
additional render for the affected card after each event.

During a full replay at 4x speed, React Native's performance monitor reported
**60 UI FPS and 60 JS FPS throughout the replay**, including both goal updates.

## Measurement environment

- Date: September 30, 2026
- Device: iPhone 18 Pro simulator
- OS: iOS 27.0
- Runtime: Expo Go 57.0.9
- Build mode: development
- Replay speed: 4x
- Fixture: `north-london-vs-merseyside`
- Motion preference: Reduce Motion off

## Repeat the render measurement

Run the deterministic render-budget test:

```bash
yarn test projection-render-budget.test.ts
```

The test presents the initial match state, applies all four fixture events in
sequence, and evaluates each projection card with the same value comparator
used by `React.memo`.

The test fails if the optimized replay exceeds seven projection-card renders.

## Repeat the simulator measurement

1. Start the app with `yarn ios`.
2. Use the iPhone 18 Pro simulator running iOS 27.0.
3. Open React Native's performance monitor from the developer menu.
4. Reset the replay and select 4x speed.
5. Start the replay and observe UI FPS and JS FPS until completion.
6. Include both goal updates in the observation window.

## Scope and limitations

The FPS result describes one short deterministic fixture in Expo Go development
mode on a simulator. It is not a production-build benchmark and does not
represent slower physical devices.

The render-budget result measures projection-card render isolation, not elapsed
render time. Timeline, score, freshness, and replay controls still update when
their visible data changes.
