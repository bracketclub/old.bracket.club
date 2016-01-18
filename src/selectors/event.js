import {createSelector} from 'reselect';

import eventDisplayName from '../lib/eventDisplayName';

export default createSelector(
  (state) => state.event,
  ({sport, year}) => ({
    sport,
    year,
    id: `${sport}-${year}`,
    display: eventDisplayName({sport, year})
  })
);
