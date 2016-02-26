import {createSelector} from 'reselect';

import eventInfo from './event';
import * as bracketSelectors from './bracket';

const masters = (state) => state.masters;
const urlIndex = (state, props) => props.location.query.game;

export const brackets = createSelector(
  eventInfo,
  masters,
  ($event, $masters) => ((
    $masters.records[$event.id] || {results: []}
  )
  .results
  .map((id) => $masters.entities[id])[0] || {})
  .brackets || []
);

export const index = createSelector(
  urlIndex,
  brackets,
  ($index, $brackets) =>
    parseInt(typeof $index === 'undefined' ? $brackets.length - 1 : $index, 10)
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
