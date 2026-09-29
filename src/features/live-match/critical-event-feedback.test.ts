import * as Haptics from 'expo-haptics';
import { AccessibilityInfo } from 'react-native';

import type { GoalEvent } from './domain/match-event';
import { getGoalAnnouncement, notifyGoal } from './critical-event-feedback';

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: {
    Heavy: 'heavy',
  },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

const goal: GoalEvent = {
  id: 'event-68-goal',
  matchId: 'match-nla-mc',
  sequence: 4,
  occurredAt: '2026-09-28T21:08:00.000Z',
  minute: 68,
  type: 'goal',
  playerId: 'player-marcus-bennett',
};

describe('critical event feedback', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('describes the scorer, minute, and visible result', () => {
    expect(getGoalAnnouncement(goal)).toBe(
      'Goal by Marcus Bennett in the 68th minute. Match and projection progress updated.',
    );
  });

  it('announces and delivers success haptics for a goal', async () => {
    const announce = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
      .mockImplementation(() => {});

    await notifyGoal(goal);

    expect(announce).toHaveBeenCalledWith(getGoalAnnouncement(goal), {
      queue: true,
      priority: 'high',
    });
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Heavy,
    );
  });
});
