import {createSelector} from 'reselect';

import eventDisplayName from '../lib/eventDisplayName';

const event = (state) => state.event;
const eventId = (state, props) => props && props.params && props.params.eventId;

export default createSelector(
  event,
  eventId,
  ($event, $eventId) => {
    let sport, year;

    if ($eventId) {
      const matches = $eventId.match(/(\w+)-(\d{4})/);
      sport = matches && matches[1] && matches[1];
      year = matches && matches[2] && matches[2];
    }

    // The reducer also stores event info which it falls back to here. The reason
    // is that not every url has the above info, and in those cases the state
    // is used as a "last viewed" thing, so it cant be fully derived
    if (!sport) sport = $event.sport;
    if (!year) year = $event.year;

    return {
      sport,
      year,
      id: `${sport}-${year}`,
      display: eventDisplayName({sport, year})
    };
  }
);
