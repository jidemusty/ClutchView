import { fireEvent, render } from '@testing-library/react-native';

import type { LiveMatchScreenModel } from '../live-match-screen-model';
import { ReplayControls } from './replay-controls';

const baseReplay: LiveMatchScreenModel['replay'] = {
  state: 'idle',
  connectionStatus: 'current',
  speed: 1,
  bufferedEventCount: 0,
  canEmitDuplicate: false,
  canEmitOutOfOrder: false,
};

describe('ReplayControls', () => {
  it('starts, resets, and changes the replay speed', async () => {
    const onPlay = jest.fn();
    const onPause = jest.fn();
    const onReset = jest.fn();
    const onCycleSpeed = jest.fn();

    const { getByRole } = await render(
      <ReplayControls
        replay={baseReplay}
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        onCycleSpeed={onCycleSpeed}
      />,
    );

    await fireEvent.press(getByRole('button', { name: 'Play replay' }));
    await fireEvent.press(getByRole('button', { name: 'Reset replay' }));
    await fireEvent.press(
      getByRole('button', {
        name: 'Change replay speed, currently 1 times',
      }),
    );

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPause).not.toHaveBeenCalled();
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onCycleSpeed).toHaveBeenCalledTimes(1);
  });

  it('pauses a replay in progress', async () => {
    const onPause = jest.fn();

    const { getByRole } = await render(
      <ReplayControls
        replay={{ ...baseReplay, state: 'playing', speed: 2 }}
        onPlay={jest.fn()}
        onPause={onPause}
        onReset={jest.fn()}
        onCycleSpeed={jest.fn()}
      />,
    );

    await fireEvent.press(getByRole('button', { name: 'Pause replay' }));

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('disables play after the replay completes', async () => {
    const onPlay = jest.fn();

    const { getByRole } = await render(
      <ReplayControls
        replay={{ ...baseReplay, state: 'completed', speed: 4 }}
        onPlay={onPlay}
        onPause={jest.fn()}
        onReset={jest.fn()}
        onCycleSpeed={jest.fn()}
      />,
    );

    const playButton = getByRole('button', { name: 'Play replay' });

    expect(playButton).toBeDisabled();

    await fireEvent.press(playButton);

    expect(onPlay).not.toHaveBeenCalled();
  });
});
