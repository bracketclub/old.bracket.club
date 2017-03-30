import config from 'config';
import {createSelector} from 'reselect';

import bh from 'lib/bracket';
import eventInfo from './event';

const allHelpers = () => config.events.map((e) => {
  const [sport, year] = e.split('-');
  return bh({sport, year});
});

export const helpers = createSelector(
  eventInfo,
  bh
);

export const locks = createSelector(
  helpers,
  (o) => o.locks
);

export const allLocks = () => allHelpers().map((d) => d.locks);

export const completeDate = createSelector(
  helpers,
  (o) => o.complete
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

export const next = createSelector(
  helpers,
  (o) => o.next
);

export const generate = createSelector(
  helpers,
  (o) => o.generate
);

export const empty = createSelector(
  helpers,
  (o) => o.emptyBracket
);

export const finalId = createSelector(
  helpers,
  (o) => o.finalId
);

export const total = createSelector(
  helpers,
  (o) => o.totalGames
);

export const unpicked = createSelector(
  helpers,
  (o) => o.unpickedChar
);

export const columns = createSelector(
  helpers,
  (o) => o.columns
);
