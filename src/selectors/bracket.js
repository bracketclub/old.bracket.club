import {createSelector} from 'reselect';

import bh from 'lib/bracket';
import eventInfo from './event';

export const helpers = createSelector(
  eventInfo,
  bh
);

export const locks = createSelector(
  helpers,
  (o) => o.locks
);

export const diff = createSelector(
  helpers,
  (o) => o.diff
);

export const validate = createSelector(
  helpers,
  (o) => o.validate
);

export const score = createSelector(
  helpers,
  (o) => o.score
);

export const update = createSelector(
  helpers,
  (o) => o.update
);

export const generate = createSelector(
  helpers,
  (o) => o.generate
);

export const empty = createSelector(
  helpers,
  (o) => o.emptyBracket
);

export const total = createSelector(
  helpers,
  (o) => o.totalGames
);

export const unpicked = createSelector(
  helpers,
  (o) => o.unpickedChar
);
