import {createSelector} from 'reselect';
import {where, pick} from 'lodash';

import findById from '../lib/findById';
import transformKey from '../lib/transformKey';
import pathname from './routing';
import event from './event';

const users = (state) => state.users.records;
const entries = (state) => state.entries.records;

const current = createSelector(
  entries,
  pathname,
  ($entries, $pathname) => findById(
    $entries,
    $pathname.replace(/.*\/entries\//, ''),
    'data_id'
  ) || {}
);

export const byEvent = createSelector(
  entries,
  event,
  ($entries, $event) => where($entries, pick($event, 'sport', 'year'))
);

export const currentWithUser = createSelector(
  users,
  current,
  ($users, $entry) => transformKey(
    $entry,
    'user',
    (user) => findById($users, user, 'user_id')
  )
);
