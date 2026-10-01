# AI-assisted workflow

AI was used as a pair-programming tool, not as an autonomous author.

## Where AI helped

- compared implementation approaches and surfaced tradeoffs;
- accelerated component and test scaffolding;
- proposed failure cases for duplicate and out-of-order delivery;
- helped audit accessibility semantics and documentation;
- edited copy after the product and technical decisions were established.

## What remained human-owned

- choosing the narrow second-screen product problem;
- defining the acceptance and recovery guarantees;
- selecting the final architecture and visual direction;
- reviewing every code change;
- diagnosing physical-device-only haptic, VoiceOver, and Reduce Motion issues;
- running simulator and physical-device validation; and
- deciding which performance claims were supportable.

## Guardrails

1. Every behavioral claim needs a test or a recorded manual check.
2. AI output is treated as a proposal until it fits the domain model.
3. Generated copy cannot overstate the benchmark environment.
4. Failures remain visible; code does not turn errors into success-shaped
   fallbacks.
5. The repository history and documentation preserve tradeoffs and limitations.

This workflow increased iteration speed while keeping product judgment,
verification, and accountability with the engineer.
