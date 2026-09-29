import { render } from '@testing-library/react-native';

import type { TimelineEventDisplay } from '../live-match-screen-model';
import { EventTimeline } from './event-timeline';

const event: TimelineEventDisplay = {
  id: 'event-49-shot',
  minute: "49'",
  playerName: 'Marcus Bennett',
  description: 'Shot blocked',
  emphasis: 'standard',
};

describe('EventTimeline', () => {
  it('directs the user to start the replay when there are no events', async () => {
    const { getByText, getByLabelText } = await render(
      <EventTimeline events={[]} />,
    );

    expect(
      getByText('Start the replay to see key match events here.'),
    ).toBeTruthy();
    expect(getByLabelText('0 events')).toBeTruthy();
  });

  it('replaces the empty state with replayed events', async () => {
    const { getByLabelText, queryByText } = await render(
      <EventTimeline events={[event]} />,
    );

    expect(queryByText('Start the replay to see key match events here.')).toBe(
      null,
    );
    expect(getByLabelText("49', Marcus Bennett, Shot blocked")).toBeTruthy();
    expect(getByLabelText('1 events')).toBeTruthy();
  });
});
