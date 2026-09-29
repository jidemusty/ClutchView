import { fireEvent, render } from '@testing-library/react-native';

import type { LiveMatchScreenModel } from '../live-match-screen-model';
import { ReplayFaultControls } from './replay-fault-controls';

const baseReplay: LiveMatchScreenModel['replay'] = {
  state: 'playing',
  connectionStatus: 'current',
  speed: 1,
  bufferedEventCount: 0,
  canEmitDuplicate: false,
  canEmitOutOfOrder: true,
};

describe('ReplayFaultControls', () => {
  it('exposes deterministic transport faults according to availability', async () => {
    const onDelayNextEvent = jest.fn();
    const onToggleConnection = jest.fn();
    const onEmitDuplicate = jest.fn();
    const onEmitOutOfOrder = jest.fn();

    const { getByRole } = await render(
      <ReplayFaultControls
        replay={baseReplay}
        onDelayNextEvent={onDelayNextEvent}
        onToggleConnection={onToggleConnection}
        onEmitDuplicate={onEmitDuplicate}
        onEmitOutOfOrder={onEmitOutOfOrder}
      />,
    );

    await fireEvent.press(getByRole('button', { name: 'Delay next' }));
    await fireEvent.press(getByRole('button', { name: 'Disconnect' }));
    await fireEvent.press(getByRole('button', { name: 'Duplicate' }));
    await fireEvent.press(getByRole('button', { name: 'Out of order' }));

    expect(onDelayNextEvent).toHaveBeenCalledTimes(1);
    expect(onToggleConnection).toHaveBeenCalledTimes(1);
    expect(onEmitDuplicate).not.toHaveBeenCalled();
    expect(onEmitOutOfOrder).toHaveBeenCalledTimes(1);
  });

  it('offers reconnect while disconnected', async () => {
    const onToggleConnection = jest.fn();

    const { getByRole } = await render(
      <ReplayFaultControls
        replay={{ ...baseReplay, connectionStatus: 'disconnected' }}
        onDelayNextEvent={jest.fn()}
        onToggleConnection={onToggleConnection}
        onEmitDuplicate={jest.fn()}
        onEmitOutOfOrder={jest.fn()}
      />,
    );

    await fireEvent.press(getByRole('button', { name: 'Reconnect' }));

    expect(onToggleConnection).toHaveBeenCalledTimes(1);
  });
});
