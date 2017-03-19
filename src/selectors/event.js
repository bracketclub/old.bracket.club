import {createSelector} from 'reselect';

import eventDisplayName from 'lib/eventDisplayName';

const rEvent = /^\/?(\w+)?-?(\d{4})/;

const event = (state) => state.event;
export const eventId = (state, props) => {
  if (props) {
    const {params, location} = props;
    // From react router params
    if (params && params.eventId) return params.eventId;
    // From url
    if (location && location.pathname) {
      const matches = location.pathname.match(rEvent);
      if (matches && matches[1] && matches[2]) return `${matches[1]}-${matches[2]}`;
    }
  }

  // Fallback to current state
  return `${state.event.sport}-${state.event.year}`;
};

export default createSelector(
  event,
  eventId,
  ($event, $eventId) => {
    let sport, year;

    if ($eventId) {
      // The sport is optionally only because previous year urls did not include it
      const matches = $eventId.match(rEvent);
      sport = matches && matches[1] && matches[1];
      year = matches && matches[2] && matches[2];
    }

    // The reducer also stores event info which it falls back to here. The reason
    // is that not every url has the above info, and in those cases the state
    // is used as a "last viewed" thing, so it cant be fully derived
    if (!sport) ({sport} = $event);
    if (!year) ({year} = $event);

    return {
      sport,
      year,
      id: `${sport}-${year}`,
      display: eventDisplayName({sport, year})
    };
  }
);
