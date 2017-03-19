import config from 'config';
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

export const completeDate = createSelector(
  helpers,
  (o) => o.complete
);

export const open = createSelector(
  locks,
  completeDate,
  ($lock, $complete) => [$lock, $complete]
);

export const allOpen = () => config.events
  .map((e) => {
    const [sport, year] = e.split('-');
    const data = bh({sport, year});
    return [data.locks, data.complete];
  });

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
