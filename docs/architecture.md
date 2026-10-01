# Architecture

ClutchView separates transport behavior, domain truth, presentation, and
critical feedback so each can be reasoned about independently.

```text
Timed fixture
    |
    v
DeterministicReplaySource
    |-- replay controls
    |-- transport fault controls
    `-- source snapshots
    |
    v
accepted domain events
    |
    v
applyMatchEvent
    |-- duplicate rejection
    |-- sequence buffering
    `-- ordered reconciliation
    |
    v
MatchState
    |
    v
presentLiveMatch
    |
    v
React screen model
```

## Boundaries

### Replay source

`DeterministicReplaySource` owns clocks and delivery. It can play, pause, reset,
change speed, delay one event, disconnect, reconnect, duplicate delivery, and
reverse the next pair. It does not decide whether an event belongs in match
state.

### Domain reducer

`applyMatchEvent` is the acceptance boundary. It:

- rejects events for another match;
- ignores IDs that have already been applied;
- buffers events whose sequence is ahead of the expected sequence;
- applies contiguous events in order once a gap closes; and
- derives score and player statistics from accepted events.

This keeps UI state correct even when transport delivery is not.

### Presenter

`presentLiveMatch` maps domain state to screen-ready values. Progress bars may
be clamped for display while domain totals remain exact.

### React coordinator

`useLiveMatchReplay` connects source snapshots to domain state, exposes replay
and fault controls, and identifies newly accepted goals. Components receive
presentation data rather than raw transport events.

### Critical feedback

Goal feedback runs only after domain acceptance. Duplicate delivery therefore
cannot retrigger haptics, VoiceOver, or card motion. During reconnect catch-up,
only the newest newly accepted goal produces feedback to avoid a burst.

## Failure guarantees

| Condition         | Guarantee                                                |
| ----------------- | -------------------------------------------------------- |
| Duplicate ID      | Ignored without replay progress advancing                |
| Future sequence   | Buffered until every earlier sequence arrives            |
| Disconnect        | Source timing continues and emitted events are buffered  |
| Reconnect         | Buffered events flush in order after the reconnect delay |
| Reversed delivery | Domain state remains ordered                             |
| Wrong match       | Explicit error rather than silent fallback               |

## Tradeoffs

The fixture and source are local by design. They provide deterministic tests and
repeatable demos, but do not model authentication, server cursors, schema
versioning, or process restarts. A production transport would preserve the
domain boundary and replace the source with a versioned WebSocket adapter plus a
persisted reconnect cursor.
