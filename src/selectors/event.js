import {createSelector} from 'reselect';

import eventDisplayName from '../lib/eventDisplayName';

const event = (state) => state.event;

export default createSelector(
  event,
  ({sport, year}) => ({
    sport,
    year,
    id: `${sport}-${year}`,
    display: eventDisplayName({sport, year})
  })
);
