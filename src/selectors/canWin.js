import {createSelector} from 'reselect';
import {eventId} from './event';
import {index} from './masters';

export const canWinGlobal = createSelector(
  (state) => state.canWin,
  eventId,
  index,
  ($canWin, $event, $index) => $canWin[`${$event}-${$index}-global`] || {}
);

export const canWinFriends = createSelector(
  (state) => state.canWin,
  eventId,
  index,
  ($canWin, $event, $index) => $canWin[`${$event}-${$index}-friends`] || {}
);

