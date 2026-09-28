Status: ready-for-agent

# ClutchView Live Match Demo

## Problem Statement

The user is applying for React Native roles on PrizePicks' Checkout & Gameplay team but currently has stronger React and web experience than public React Native evidence. The relevant roles may close quickly, so a six-week portfolio project would arrive too late.

The user needs a credible, memorable demonstration that can be built in approximately 20–25 focused hours and shared as a follow-up to an immediate application. It must map directly to the role's emphasis on TypeScript, Expo, high-frequency data, second-screen mobile experiences, performance, animation, haptics, accessibility, testing, resilience, and technical communication.

A broad fantasy-sports application would dilute the effort and create unnecessary product, data-licensing, and legal complexity. The highest-value deliverable is therefore one exceptional live-match vertical slice that demonstrates engineering judgment under realistic event-stream conditions without processing wagers or claiming to be a production service.

## Solution

Build ClutchView as a focused Expo and React Native prototype for following player-stat projections during an English Premier League match.

The prototype presents one polished live-match screen containing a match clock, connection status, three player projection cards, projection progress, and a relevant event timeline. A deterministic prerecorded match fixture emits typed events for shots, shots on target, goals, and assists as if they were arriving from a live provider.

The experience emphasizes critical moments. Relevant events update projection progress immediately, while especially important events use purposeful animation and haptic feedback. Users who prefer reduced motion receive an accessible alternative without losing status information.

The prototype also demonstrates resilience. Development controls can disconnect the event source, delay events, emit duplicate events, and emit events out of order. The interface communicates when data is delayed or reconnecting, then catches up without double-counting events.

The replay source sits behind a provider-neutral event-source boundary so that a future WebSocket or sports-data provider can replace it without changing application behavior. The initial delivery remains deliberately honest: it is a deterministic real-time prototype, not a live production integration.

The finished hiring package consists of an installable Expo/EAS preview, a public repository, a 60–90 second demonstration video, concise architecture documentation, meaningful automated tests, and at least one documented performance measurement.

## User Stories

1. As a job candidate, I want to apply before the role closes, so that project work does not delay my application.
2. As a job candidate, I want a focused React Native demonstration, so that I can provide evidence beyond my primarily web-based experience.
3. As a recruiter, I want to understand the product within seconds, so that I can quickly judge its relevance to the open role.
4. As an engineering manager, I want the prototype to address second-screen gameplay concerns, so that I can see a direct connection to the team's work.
5. As an engineering manager, I want the prototype's limitations stated plainly, so that I can trust the candidate's technical communication.
6. As a portfolio viewer, I want to install or open a preview build, so that I can evaluate the mobile experience directly.
7. As a portfolio viewer, I want to watch a short demonstration video, so that I can understand the project without configuring a development environment.
8. As a football supporter, I want to see the teams, score, match period, and match clock, so that I understand the current match context.
9. As a football supporter, I want to follow three selected player projections, so that the live screen remains focused and easy to scan.
10. As a football supporter, I want projections for shots, shots on target, goals, and assists, so that I can follow meaningful attacking events.
11. As a football supporter, I want to see each player's target and current progress, so that I know how close each projection is to completion.
12. As a football supporter, I want relevant events to update projection progress promptly, so that the app feels synchronized with the match.
13. As a football supporter, I want unrelated player cards to remain visually stable when an event arrives, so that frequent updates do not create distracting motion.
14. As a football supporter, I want a chronological event timeline, so that I can understand what changed and why.
15. As a football supporter, I want timeline events to identify the player, statistic, and match time, so that each update has sufficient context.
16. As a football supporter, I want shots and shots on target to be represented distinctly, so that the displayed statistics remain accurate.
17. As a football supporter, I want a goal to feel more significant than an ordinary shot, so that critical moments carry appropriate emotional weight.
18. As a football supporter, I want subtle haptic feedback for critical events, so that I can notice important changes while also watching the match.
19. As a user with reduced-motion preferences, I want critical events communicated without large animations, so that the experience remains comfortable and understandable.
20. As a screen-reader user, I want match state, projection progress, and new critical events announced meaningfully, so that the experience is not dependent on visual presentation.
21. As a user, I want sufficient text contrast and touch-target sizing, so that the interface is usable under second-screen viewing conditions.
22. As a user, I want to see whether data is replaying, live, delayed, disconnected, or reconnecting, so that I do not mistake stale information for current information.
23. As a user, I want delayed data to remain visible with an explicit stale indicator, so that temporary network problems do not erase useful context.
24. As a user, I want the app to recover after reconnection, so that I do not need to restart the experience.
25. As a user, I want missed events to be applied after reconnection, so that projection totals become accurate again.
26. As a user, I want duplicate events ignored, so that statistics are not counted more than once.
27. As a user, I want out-of-order events reconciled correctly, so that network timing does not corrupt projection state.
28. As a user, I want the app to detect a missing event sequence, so that incomplete state is surfaced rather than silently accepted.
29. As a demonstrator, I want to start, pause, reset, and accelerate the match replay, so that I can reliably present the important interactions.
30. As a demonstrator, I want the same replay to produce the same result every time, so that the hiring demo is dependable.
31. As a developer, I want a scripted way to disconnect the event source, so that reconnect behavior can be demonstrated and tested.
32. As a developer, I want a scripted way to delay events, so that stale-data behavior can be demonstrated and tested.
33. As a developer, I want a scripted way to emit duplicate events, so that idempotency can be demonstrated and tested.
34. As a developer, I want a scripted way to emit out-of-order events, so that sequencing behavior can be demonstrated and tested.
35. As a developer, I want events represented by a closed, typed union, so that unsupported event handling is caught during development.
36. As a developer, I want event handling to be exhaustive, so that adding a new event type requires an explicit product decision.
37. As a developer, I want the replay mechanism hidden behind a provider-neutral boundary, so that it can later be replaced by a WebSocket or sports-data integration.
38. As a developer, I want replay timing separated from domain-state updates, so that tests can advance events without waiting for wall-clock time.
39. As a developer, I want event state derived deterministically, so that failures can be reproduced and diagnosed.
40. As a developer, I want the last accepted event sequence tracked, so that reconnection can resume from a known position.
41. As a developer, I want animation and haptic effects triggered from accepted domain changes rather than raw transport messages, so that duplicates do not replay critical effects.
42. As a developer, I want development-only failure controls excluded from the primary user experience, so that the portfolio build remains polished.
43. As an engineering reviewer, I want tests to exercise behavior through the event-source boundary, so that they remain valid if internal state management changes.
44. As an engineering reviewer, I want explicit coverage for duplicate, delayed, missing, and out-of-order events, so that the hardest real-time behaviors are demonstrated.
45. As an engineering reviewer, I want reduced-motion behavior tested, so that accessibility is treated as functional behavior rather than documentation.
46. As an engineering reviewer, I want the main replay and reconnect journey exercised on a built application, so that unit tests are not the only evidence.
47. As an engineering reviewer, I want a documented performance measurement and methodology, so that performance claims are evidence-based.
48. As an engineering reviewer, I want projection updates to avoid unnecessary full-screen rerenders, so that the design can tolerate frequent events.
49. As an engineering reviewer, I want the architecture and tradeoffs summarized concisely, so that I can discuss the candidate's decisions during an interview.
50. As an engineering reviewer, I want future production work separated from prototype behavior, so that the candidate demonstrates responsible scoping.
51. As a recruiter, I want direct links to the video, preview, and source repository, so that evaluating the project requires minimal effort.
52. As a recruiter, I want a concise explanation of why the project is relevant to PrizePicks, so that its intent is immediately apparent.
53. As the project owner, I want the prototype completed within 20–25 focused hours, so that it can be shared while the target roles remain open.
54. As the project owner, I want one excellent live screen instead of several shallow screens, so that limited time produces a memorable result.
55. As the project owner, I want neutral visual branding and no wagering mechanics, so that the prototype demonstrates relevant engineering without impersonating PrizePicks or creating unnecessary legal risk.

## Implementation Decisions

- The delivery target is a polished vertical slice completed in approximately 20–25 focused hours, not a production-ready fantasy-sports application.
- The mobile application will use Expo, React Native, and strict TypeScript.
- The first delivery will contain one primary live-match screen. Additional product screens are lower priority and must not delay the core experience.
- The match will represent an English Premier League scenario, but the prototype will use original visual design and will not use club, league, or PrizePicks logos without confirmed permission.
- The screen will show a match header, connection status, three player projection cards, projection progress, and a chronological event timeline.
- Supported projection statistics are shots, shots on target, goals, and assists.
- Projection targets and match data will be deterministic fixture data curated for the demonstration. A projection-generation model is not required for the vertical slice.
- The event model will be a discriminated TypeScript union. Every event will carry a stable identifier, match identifier, monotonic sequence number, event time, event type, player identifier, and the data required by that event type.
- A single provider-neutral match-event-source boundary will expose event subscription behavior to the application. The deterministic replay source will implement this boundary first; a future WebSocket provider can implement the same contract.
- The replay source will support starting, pausing, resetting, and accelerated playback.
- Replay timing will be controllable independently of the domain reducer so automated tests do not depend on real elapsed time.
- Accepted events will be reduced into deterministic match and projection state.
- Processed event identifiers will be tracked so duplicate deliveries cannot increment projection state or replay critical effects.
- Event sequence numbers will be tracked so gaps and out-of-order delivery can be detected.
- Out-of-order events will be buffered or reconciled into sequence before affecting visible projection state.
- A reconnect operation will resume after the last accepted sequence and apply missing events without rebuilding incorrect totals.
- The user-visible connection state will distinguish replaying, current, delayed, disconnected, and reconnecting states. The prototype must never present stale data as current.
- Development-only controls will simulate disconnection, delayed delivery, duplicate delivery, out-of-order delivery, and reconnection.
- Critical visual and haptic effects will be driven by newly accepted domain changes, not directly by transport messages.
- Goals receive the strongest critical-moment treatment. Lesser events use restrained motion appropriate to their importance.
- Haptics will be purposeful and limited to critical moments. Unsupported platforms must retain complete visual and accessible feedback.
- The application will respect the operating system's reduced-motion preference and replace large celebration motion with a restrained state change.
- Projection state and critical events will expose meaningful accessibility labels and announcements.
- The interface will prioritize strong contrast, large enough touch targets, readable typography, and glanceable hierarchy for second-screen use.
- Performance work will focus on preventing unrelated projection cards and surrounding screen content from rerendering for each incoming event.
- At least one performance result will be measured on a named device or simulator in a documented build mode with a repeatable method. No unmeasured performance claim will be presented as fact.
- The preview will be delivered through Expo/EAS when credentials and account access permit. The public repository and recorded demo remain required even if external preview distribution is blocked.
- The repository overview will explain the problem, demonstrate the main flow, describe the architecture and event guarantees, state prototype limitations, report validation results, and identify logical next steps.
- The demonstration video will be 60–90 seconds and will show normal event progression, a critical moment, disconnection, a visible stale state, reconnection, catch-up without duplication, and reduced-motion behavior.
- The project will be described as a deterministic real-time prototype. It will not claim to consume live sports data or provide production-grade reliability.

## Testing Decisions

- The primary test seam is the provider-neutral match-event-source boundary. Tests will inject scripted event sequences into the application and assert externally visible projection, timeline, connection, and accessibility behavior.
- Tests should describe observable outcomes rather than internal hooks, component state, reducer calls, animation-library details, or specific rendering optimizations.
- Deterministic timing controls will allow tests to advance the replay without sleeping or depending on wall-clock time.
- Application-level tests will verify that an accepted shot, shot on target, goal, or assist updates the correct player's visible projection and timeline.
- Application-level tests will verify that duplicate events do not change a projection twice and do not trigger critical feedback twice.
- Application-level tests will verify that out-of-order events ultimately produce the same visible result as correctly ordered events.
- Application-level tests will verify that a missing sequence changes the connection or freshness presentation instead of silently presenting incomplete state as current.
- Application-level tests will verify that reconnection applies missed events after the last accepted sequence without duplicating previously accepted events.
- Application-level tests will verify that reduced-motion preference replaces the large critical-event treatment while preserving all meaningful information.
- Application-level tests will verify that connection states are communicated in accessible text rather than color alone.
- A built-application smoke journey will cover opening the match, running replay, observing a projection update, disconnecting, reconnecting, and completing catch-up. Maestro is the preferred E2E tool if it can be added within the time budget.
- Focused pure-domain tests may be used for event-sequencing edge cases when exercising every permutation through the rendered application would make failures less clear. These tests remain secondary to the application seam.
- Performance validation will compare render behavior before and after optimization using the same fixture, playback rate, device, and build mode.
- There is no existing test prior art because the project is new. The first tests will establish the convention of behavior-oriented names, deterministic fixtures, and event-source injection.

## Out of Scope

- Real-money wagering, entry fees, payouts, prizes, wallets, deposits, withdrawals, and checkout.
- Authentication, authorization, account management, profiles, and social features.
- A real sports-data provider, live Premier League ingestion, provider licensing, or provider billing.
- A backend service, WebSocket gateway, distributed event pipeline, persistent event store, or production caching.
- A statistical projection-generation model or claims that projection targets are predictive.
- Multiple matches, competitions, sports, or configurable projection-card construction.
- Push notifications, background match tracking, widgets, and live activities.
- Betting odds, sportsbook lines, cash-out values, profit-and-loss calculations, and financial advice.
- Official PrizePicks, Premier League, broadcaster, or football-club branding.
- An administrative dashboard or content-management system.
- Full production analytics, crash reporting, alerting, on-call procedures, or service-level objectives.
- App Store or Play Store production submission.
- Exhaustive design-system construction or broad reusable component coverage unrelated to the demonstration.
- Premature infrastructure intended only to imitate the scale of a production distributed system.

## Further Notes

- The user should submit the job application immediately and use this project as a targeted follow-up rather than waiting for completion before applying.
- The project's strongest differentiator is the visible failure-and-recovery demonstration. The stale state, sequence handling, and duplicate-safe catch-up should not be sacrificed for secondary screens.
- If time runs short, preserve the replay engine, one polished screen, reconnect demonstration, reduced-motion behavior, core tests, video, and repository explanation. Cut secondary controls and decorative polish first.
- A future phase may add a focused TypeScript gateway, a licensed sports-data adapter, event persistence, observability, and EAS delivery automation after the time-sensitive hiring package has shipped.
- Suggested follow-up language should emphasize high-frequency event processing, reconnect-safe state, critical-moment mobile interaction, accessibility, and measured performance rather than describing the project generically as a fantasy-sports app.
