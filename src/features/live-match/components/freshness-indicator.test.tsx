import { render } from '@testing-library/react-native';

import { FreshnessIndicator } from './freshness-indicator';

describe('FreshnessIndicator', () => {
  it('communicates disconnected state without relying on color', async () => {
    const { getByLabelText } = await render(
      <FreshnessIndicator
        freshness={{
          status: 'Disconnected',
          detail: '2 events waiting',
          tone: 'offline',
        }}
      />,
    );

    expect(getByLabelText('Disconnected. 2 events waiting')).toBeTruthy();
  });
});
