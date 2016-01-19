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

const byUser = createSelector(
  entries,
  pathname,
  ($entries, $pathname) => findById(
    $entries,
    $pathname.replace(/.*\/users\//, ''),
    'user'
  ) || {}
);

// Exports
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

export const currentUserId = createSelector(
  current,
  ($entry) => $entry ? $entry.user : null
);

export const currentByUser = createSelector(
  users,
  byUser,
  ($users, $entry) => transformKey(
    $entry,
    'user',
    (user) => findById($users, user, 'user_id')
  )
);
