import {createSelector} from 'reselect';
import {get, assign, pick} from 'lodash';
import eventDisplayName from 'lib/eventDisplayName';

const matchEvent = (val) => {
  const match = val.match(/^\/?(\w+)-(\d{4})/);
  if (match) return {sport: match[1], year: match[2]};
  return {};
};

export const event = (state) => state.event;

export const id = (state, props) => {
  // From react router params
  const eventId = get(props, 'match.params.eventId');
  if (eventId) return eventId;

  // Fallback to current state
  const {sport, year} = event(state);
  return `${sport}-${year}`;
};

export const info = createSelector(
  event,
  id,
  ($event, $id) => {
    const {sport, year} = assign(pick($event, 'sport', 'year'), matchEvent($id));

    return {
      sport,
      year,
      id: `${sport}-${year}`,
      display: eventDisplayName({sport, year})
    };
  }
);
