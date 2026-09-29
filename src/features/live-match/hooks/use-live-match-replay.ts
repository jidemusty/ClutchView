import { useCallback, useEffect, useMemo, useState } from 'react';

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
