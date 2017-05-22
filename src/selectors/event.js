import {createSelector} from 'reselect';
import {get} from 'lodash';
import eventDisplayName from 'lib/eventDisplayName';

const matchEvent = (val) => {
  const match = val.match(/^\/?(\w+)-(\d{4})/);
  if (match) return {sport: match[1], year: match[2]};
  return {};
};

export const event = (state) => state.event;

export const id = (state, props) => {
  // From react router params
  const paramsEventId = get(props, 'match.params.eventId');
  if (paramsEventId) return paramsEventId;

  // From location prop
  const pathEventId = matchEvent(get(props, 'location.pathname', ''));
  if (pathEventId.sport) return `${pathEventId.sport}-${pathEventId.year}`;

  // Fallback to current state (which is set to a default event from config)
  const {sport, year} = event(state);
  return `${sport}-${year}`;
};

export const info = createSelector(
  id,
  ($id) => {
    const {sport, year} = matchEvent($id);
    return {
      sport,
      year,
      id: `${sport}-${year}`,
      display: eventDisplayName({sport, year})
    };
  }
);
