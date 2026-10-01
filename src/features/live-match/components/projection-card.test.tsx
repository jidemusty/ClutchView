import { render } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';

import type { ProjectionDisplay } from '../live-match-screen-model';
import { ProjectionCard } from './projection-card';

const projection: ProjectionDisplay = {
  id: 'projection-marcus-shots',
  playerId: 'player-marcus-bennett',
  stat: 'shots',
  playerName: 'Marcus Bennett',
  teamAbbreviation: 'NLA',
  metric: 'Shots',
  current: 2,
  target: 2,
  status: 'reached',
};

describe('ProjectionCard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps complete progress visible without motion', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);

    const { getByRole, getByText } = await render(
      <ProjectionCard
        projection={projection}
        criticalMomentId="event-68-goal"
      />,
    );

    expect(timing).not.toHaveBeenCalled();
    expect(getByText('HIT')).toBeTruthy();
    expect(getByRole('progressbar')).toHaveAccessibilityValue({
      min: 0,
      max: 2,
      now: 2,
      text: '2 of 2, Reached',
    });
  });

  it('runs one restrained pulse for a critical moment', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);

    await render(
      <ProjectionCard
        projection={projection}
        criticalMomentId="event-68-goal"
      />,
    );

    expect(timing).toHaveBeenCalledTimes(2);
  });
});
