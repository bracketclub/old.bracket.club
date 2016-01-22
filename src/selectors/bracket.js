import {createSelector} from 'reselect';

import bh from '../lib/bracket';
import picker from '../lib/picker';
import eventInfo from './event';

export const helpers = createSelector(
  eventInfo,
  bh
);

export const locks = createSelector(
  helpers,
  picker('locks'),
);

export const diff = createSelector(
  helpers,
  picker('diff')
);

export const validate = createSelector(
  helpers,
  picker('validate')
);

export const empty = createSelector(
  helpers,
  picker('emptyBracket')
);

export const total = createSelector(
  helpers,
  picker('totalGames')
);

export const unpicked = createSelector(
  helpers,
  picker('unpickedChar')
);
