import {createSelector} from 'reselect';

import bh from '../lib/bracket';
import picker from '../lib/picker';
import event from './event';

export const helpers = createSelector(
  event,
  bh
);

export const lock = createSelector(
  helpers,
  picker('timeLeft', 'isLocked')
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
