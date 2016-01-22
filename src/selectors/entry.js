import {createSelector} from 'reselect';

import findById from '../lib/findById';
import eventInfo from './event';
import * as bracketSelectors from './bracket';

const entry = (state) => state.entry;

const byEvent = createSelector(
  eventInfo,
  entry,
  ($event, $entry) => findById($entry, $event.id) || {index: -1, brackets: []}
);

const current = createSelector(
  byEvent,
  bracketSelectors.empty,
  // To pass to a view, the entry brackets always need to include
  // the empty bracket for that event as the base
  ({brackets: $brackets, index: $index}, $empty) => ({
    brackets: [$empty].concat($brackets),
    index: $index + 1
  })
);

// Exports
export const bracketString = createSelector(
  current,
  ({brackets: $brackets, index: $index}) => $brackets[$index]
);

export const navigation = createSelector(
  current,
  ({brackets: $brackets, index: $index}) => ({
    canGoBack: $brackets.length > 0 && $index > 0,
    canGoForward: $brackets.length > 0 && $index < $brackets.length - 1,
    canReset: $brackets.length > 1
  })
);

export const progress = createSelector(
  bracketSelectors.total,
  bracketSelectors.unpicked,
  bracketString,
  ($total, $unpicked, $bracket = '') => {
    const unpicked = $bracket.split($unpicked).length - 1;
    return {
      total: $total,
      current: $total - unpicked,
      complete: unpicked === 0
    };
  }
);

