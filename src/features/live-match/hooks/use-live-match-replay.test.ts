import { act, renderHook } from '@testing-library/react-native';

import { notifyGoal } from '../critical-event-feedback';
import { useLiveMatchReplay } from './use-live-match-replay';

jest.mock('../critical-event-feedback', () => ({
  notifyGoal: jest.fn(() => Promise.resolve()),
}));

describe('useLiveMatchReplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(notifyGoal).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delivers critical feedback once for an accepted goal', async () => {
    const { result, unmount } = await renderHook(() => useLiveMatchReplay());

    await act(async () => {
      result.current.play();
      jest.advanceTimersByTime(3_500);
    });

    expect(notifyGoal).toHaveBeenCalledTimes(1);
    expect(notifyGoal).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'event-57-goal',
        type: 'goal',
      }),
    );

    await act(async () => {
      result.current.emitDuplicate();
    });

    expect(notifyGoal).toHaveBeenCalledTimes(1);

    unmount();
  });
});
