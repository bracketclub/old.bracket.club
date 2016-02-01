import {createSelector} from 'reselect';

import findById from '../lib/findById';
import eventInfo from './event';
import {MIN_INDEX} from '../constants/entry';
import * as bracketSelectors from './bracket';

const entry = (state) => state.entry;

export const byEvent = createSelector(
  eventInfo,
  entry,
  ($event, $entry) => findById($entry, $event.id) || {
    index: MIN_INDEX,
    brackets: []
  }
);

export const bracketString = createSelector(
  byEvent,
  bracketSelectors.empty,
  ({brackets: $brackets, index: $index}, $empty) =>
    $index === MIN_INDEX
      ? $empty
      : $brackets[$index]
);

export const navigation = createSelector(
  byEvent,
  ({brackets: $brackets, index: $index}) => ({
    canGoBack: $brackets.length > 0 && $index > MIN_INDEX,
    canGoForward: $brackets.length > 0 && $index < $brackets.length - 1,
    canReset: $brackets.length > 0
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

