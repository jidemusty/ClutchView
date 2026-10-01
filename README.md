# ClutchView

ClutchView is a focused second-screen sports experience for tracking player
projections while a match is in motion. A deterministic event stream drives the
score, player progress, and match tape while the domain protects the interface
from duplicate, delayed, disconnected, and out-of-order delivery.

[Read the case study](https://jidemusty.github.io/clutchview/) ·
[Watch the 3-minute demo](https://www.loom.com/share/809ba321e582446186b57461191662fa) ·
[Review the architecture](./docs/architecture.md) ·
[See the performance method](./docs/performance.md)

## Why this exists

Live sports interfaces have to remain useful when transport conditions are not
ideal. ClutchView makes that reliability work inspectable:

- replay the same typed match fixture at 1x, 2x, or 4x;
- disconnect while source time continues, then reconcile buffered events;
- emit duplicates and reversed pairs without corrupting visible state;
- hold future sequence numbers until missing events arrive;
- trigger haptic, VoiceOver, and visual goal feedback only after acceptance; and
- measure projection-row isolation against a deterministic render budget.

## Run it

Requirements:

- Node.js 22
- Yarn Classic 1.22
- Expo Go, an iOS Simulator, or an Android emulator

```bash
git clone https://github.com/jidemusty/ClutchView.git
cd ClutchView
yarn install
yarn start
```

Use the QR code for Expo Go, press `i` for iOS, `a` for Android, or `w` for web.

`yarn ios` uses a small Device Hub-compatible launcher because Xcode 27 no
longer ships the standalone Simulator app expected by the current Expo CLI. It
selects an available Metro port, opens Device Hub, and launches the project in
the booted simulator.

## Product controls

### Replay transport

- **Play / Pause** controls fixture delivery.
- **Reset** restores the initial match.
- **Speed** cycles through 1x, 2x, and 4x.

### Fault lab

Expand **Fault lab** to make transport behavior explicit:

- delay the next event by three seconds;
- disconnect while the replay continues to buffer events;
- reconnect and flush buffered events in order;
- deliver the next event twice; or
- deliver the next pair in reverse order.

Freshness changes to stale when the visible state is no longer current.

## Architecture

```text
Timed fixture
    ↓
DeterministicReplaySource
    ├── replay controls
    ├── transport fault controls
    └── snapshots
    ↓
accepted domain events
    ↓
applyMatchEvent
    ├── duplicate rejection
    ├── sequence buffering
    └── ordered reconciliation
    ↓
MatchState → presentLiveMatch → React screen model
```

Transport delivery and domain acceptance are deliberately separate. The UI,
haptics, announcements, and animations respond to accepted domain events, never
raw delivery. See [the architecture notes](./docs/architecture.md) for
boundaries, guarantees, and production tradeoffs.

## Accessibility

- Goal feedback includes heavy impact haptics and queued, high-priority
  VoiceOver announcements.
- Duplicate events cannot repeat critical feedback.
- Reduce Motion is checked immediately before animation; information remains
  visible and spoken when motion is skipped.
- Replay and Fault lab controls expose semantic labels and disabled states.
- The case-study site includes keyboard focus styles, semantic landmarks, and a
  reduced-motion mode.

## Performance

Across the deterministic four-event fixture:

- baseline projection-card render opportunities: **15**;
- optimized projection-card renders: **7**;
- reduction: **53%**.

The documented iPhone 18 Pro simulator run in Expo Go development mode held
**60 UI FPS and 60 JS FPS** through a complete replay at 4x. This is not
presented as a production-device benchmark. Reproduce the method in
[the performance report](./docs/performance.md).

## Validation

```bash
yarn format:check
yarn lint
yarn typecheck
yarn test
npx --yes expo-doctor
```

The validated pre-launch baseline contains 14 suites and 50 tests. Tests cover
domain reconciliation, replay timing and faults, component behavior, critical
feedback, accessibility, and the projection render budget.

## Project map

```text
src/features/live-match/
├── components/     screen sections and controls
├── data/replay/    deterministic source and fixture
├── domain/         typed events and ordered match state
├── hooks/          React replay coordinator
├── presentation/   domain-to-screen mapping
└── live-match-screen.tsx

docs/
├── index.html       deployable hiring case study
├── architecture.md  boundaries and guarantees
├── ai-workflow.md   AI-use disclosure
├── distribution.md preview and EAS guidance
└── performance.md   repeatable measurement
```

## AI-assisted development

AI served as a pair programmer for alternatives, implementation support, test
ideas, and editing. Product constraints, architecture selection, code review,
physical-device diagnosis, and final validation remained human-owned. The
working agreement and guardrails are documented in
[the AI workflow](./docs/ai-workflow.md).

## Distribution

The recommended reviewer package is the static case study, this repository, and
a narrated simulator recording. Expo Go is useful for a scheduled live review;
EAS internal distribution is configured for installable previews.

Read [the distribution guide](./docs/distribution.md) before publishing. A
signed iOS preview requires Apple Developer Program membership; it is not
required for the case study, source review, video, or Expo Go during a live
session.

## Scope

ClutchView is a vertical slice. It intentionally excludes authentication,
wagering, a production sports feed, persisted reconnect cursors, and
production-device profiling. Those limits keep the reliability and UI
decisions small enough to inspect.
