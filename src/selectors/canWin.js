import {createSelector} from 'reselect';
import {eventId} from './event';
import {index} from './masters';

export const canWin = createSelector(
  (state) => state.canWin,
  eventId,
  index,
  ($canWin, $event, $index) => (($canWin[$event] || {})[$index] || {})
);
