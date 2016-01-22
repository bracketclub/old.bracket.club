import {createSelector} from 'reselect';
import {where, pick} from 'lodash';

import findById from '../lib/findById';
import transformKey from '../lib/transformKey';
import eventInfo from './event';

const users = (state) => state.users.records;
const entries = (state) => state.entries.records;
const entryId = (state, props) => props.params.entryId;

const findUser = ($users) => ($user) => findById($users, $user, 'user_id');
const transformUser = ($users) => ($entry) => transformKey($entry, 'user', findUser($users));

const current = createSelector(
  entries,
  entryId,
  ($entries, $entryId) => findById(
    $entries,
    $entryId,
    'data_id'
  ) || {}
);

// Exports
export const byEvent = createSelector(
  entries,
  users,
  eventInfo,
  ($entries, $users, $event) => where(
    $entries,
    pick($event, 'sport', 'year')
  ).map(transformUser($users))
);

export const currentWithUser = createSelector(
  users,
  current,
  ($users, $entry) => transformUser($users)($entry)
);
