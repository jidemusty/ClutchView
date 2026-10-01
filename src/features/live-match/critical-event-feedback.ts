import * as Haptics from 'expo-haptics';
import { AccessibilityInfo, Platform } from 'react-native';

import type { GoalEvent } from './domain/match-event';
import { liveMatchConfig } from './fixtures/live-match-config';

export function getGoalAnnouncement(event: GoalEvent): string {
  const player =
    liveMatchConfig.players[
      event.playerId as keyof typeof liveMatchConfig.players
    ];

  if (player === undefined) {
    throw new Error(
      `Missing display metadata for goal scorer "${event.playerId}"`,
    );
  }

  return `Goal by ${player.name} in the ${event.minute}th minute. Match and projection progress updated.`;
}

export async function notifyGoal(event: GoalEvent): Promise<void> {
  const announcement = getGoalAnnouncement(event);

  if (Platform.OS === 'web') {
    AccessibilityInfo.announceForAccessibility(announcement);
  } else {
    AccessibilityInfo.announceForAccessibilityWithOptions(announcement, {
      queue: true,
      priority: 'high',
    });
  }

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
