import {createSelector} from 'reselect';

import findById from '../lib/findById';
import event from './event';
import * as bracketSelectors from './bracket';

const masters = (state) => state.masters.records;
const index = (state) => state.masters.index;

export const brackets = createSelector(
  event,
  masters,
  ($event, $masters) => (findById($masters, $event.id) || {}).brackets || []
);

export const navigation = createSelector(
  index,
  brackets,
  ($index, $brackets) => ({
    canGoBack: $brackets.length > 0 && $index > 0,
    canGoForward: $brackets.length > 0 && $index < $brackets.length - 1
  })
);

export const bracketString = createSelector(
  index,
  brackets,
  ($index = [], $brackets) => $brackets[$index]
);

export const bracket = createSelector(
  bracketSelectors.validate,
  bracketString,
  ($validate, $bracket = '') => $bracket ? $validate($bracket) : null
);

export const progress = createSelector(
  bracketSelectors.total,
  bracketSelectors.unpicked,
  bracketString,
  ($total, $unpicked, $bracket = '') => ({
    total: $total,
    current: $total - ($bracket.split($unpicked).length - 1)
  })
);
