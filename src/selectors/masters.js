import {createSelector} from 'reselect';
import {property} from 'lodash';
import qs from 'query-string';
import * as eventSelectors from './event';
import * as bracketSelectors from './bracket';
import * as visibleSelectors from './visible';

const STATE_KEY = property('masters');
// TODO
const urlIndex = (state, props) => parseInt(qs.parse(props.location.search).game, 10);
const master = visibleSelectors.byId(STATE_KEY, eventSelectors.id);

export const brackets = createSelector(
  master,
  ($master) => $master.brackets || []
);

export const lastIndex = createSelector(
  brackets,
  ($brackets) => $brackets.length - 1
);

export const index = createSelector(
  urlIndex,
  lastIndex,
  ($index, $lastIndex) => isNaN($index) ? $lastIndex : Math.min($index, $lastIndex)
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
  ($total, $unpicked, $bracket = '') => {
    const remaining = ($bracket.split($unpicked).length - 1);
    return {
      total: $total,
      current: $total - remaining,
      remaining
    };
  }
);

export const sync = visibleSelectors.sync(STATE_KEY, eventSelectors.id);
