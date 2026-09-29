import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { notifyGoal } from '../critical-event-feedback';
import { DeterministicReplaySource } from '../data/replay/deterministic-replay-source';
import { replayEvents } from '../data/replay/fixtures/north-london-vs-merseyside';
import type {
  ReplaySnapshot,
  ReplaySpeed,
} from '../data/replay/replay-controller';
import {
  applyMatchEvent,
  createMatchState,
  type MatchState,
} from '../domain/match-state';
import type { GoalEvent } from '../domain/match-event';
import { liveMatchConfig } from '../fixtures/live-match-config';
import { presentLiveMatch } from '../live-match-presenter';

const replaySpeeds: readonly ReplaySpeed[] = [1, 2, 4];

function createInitialMatchState(): MatchState {
  return createMatchState({
    matchId: liveMatchConfig.matchId,
    projections: liveMatchConfig.projections,
  });
}

export function useLiveMatchReplay() {
  const [source] = useState(
    () =>
      new DeterministicReplaySource({
        matchId: liveMatchConfig.matchId,
        events: replayEvents,
      }),
  );

  const [matchState, setMatchState] = useState(createInitialMatchState);

  const [replaySnapshot, setReplaySnapshot] = useState<ReplaySnapshot>(() =>
    source.getSnapshot(),
  );
  const lastFeedbackSequence = useRef(0);

  useEffect(() => {
    const unsubscribeFromEvents = source.subscribe(
      liveMatchConfig.matchId,
      (event) => {
        setMatchState((currentState) => applyMatchEvent(currentState, event));
      },
    );

    const unsubscribeFromSnapshots = source.subscribeToSnapshot((snapshot) => {
      setReplaySnapshot(snapshot);
    });

    return () => {
      unsubscribeFromEvents();
      unsubscribeFromSnapshots();
      source.pause();
    };
  }, [source]);

  useEffect(() => {
    if (matchState.lastAcceptedSequence === 0) {
      lastFeedbackSequence.current = 0;
      return;
    }

    const latestGoal = [...matchState.acceptedEvents]
      .reverse()
      .find(
        (event): event is GoalEvent =>
          event.type === 'goal' &&
          event.sequence > lastFeedbackSequence.current,
      );

    lastFeedbackSequence.current = matchState.lastAcceptedSequence;

    if (latestGoal === undefined) {
      return;
    }

    void notifyGoal(latestGoal).catch((error: unknown) => {
      console.error('Unable to deliver goal feedback', error);
    });
  }, [matchState]);

  const criticalMoment = useMemo(() => {
    const latestGoal = [...matchState.acceptedEvents]
      .reverse()
      .find((event): event is GoalEvent => event.type === 'goal');

    if (latestGoal === undefined) {
      return undefined;
    }

    return {
      eventId: latestGoal.id,
      playerId: latestGoal.playerId,
    };
  }, [matchState.acceptedEvents]);

  const screenModel = useMemo(
    () => presentLiveMatch(matchState, replaySnapshot),
    [matchState, replaySnapshot],
  );

  const play = useCallback(() => {
    source.play();
  }, [source]);

  const pause = useCallback(() => {
    source.pause();
  }, [source]);

  const reset = useCallback(() => {
    source.reset();
    setMatchState(createInitialMatchState());
  }, [source]);

  const cycleSpeed = useCallback(() => {
    const currentIndex = replaySpeeds.indexOf(source.getSnapshot().speed);

    const nextIndex = (currentIndex + 1) % replaySpeeds.length;
    const nextSpeed = replaySpeeds[nextIndex];

    if (nextSpeed !== undefined) {
      source.setSpeed(nextSpeed);
    }
  }, [source]);

  const delayNextEvent = useCallback(() => {
    source.delayNextEvent();
  }, [source]);

  const toggleConnection = useCallback(() => {
    if (source.getSnapshot().connectionStatus === 'disconnected') {
      source.reconnect();
      return;
    }

    source.disconnect();
  }, [source]);

  const emitDuplicate = useCallback(() => {
    source.emitDuplicate();
  }, [source]);

  const emitOutOfOrder = useCallback(() => {
    source.emitNextPairOutOfOrder();
  }, [source]);

  return {
    screenModel,
    criticalMoment,
    play,
    pause,
    reset,
    cycleSpeed,
    delayNextEvent,
    toggleConnection,
    emitDuplicate,
    emitOutOfOrder,
  };
}
