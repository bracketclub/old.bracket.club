import {createSelector} from 'reselect';
import {findWhere, pick} from 'lodash';

import findById from '../lib/findById';
import transformKey from '../lib/transformKey';
import eventInfo from './event';

const entries = (state) => state.entries.records;
const users = (state) => state.users.records;
const userId = (state, props) => props.params.userId;

const findEntry = ($entries) => ($id) => findById($entries, $id, 'data_id');

const current = createSelector(
  userId,
  users,
  ($userId, $users) => findById(
    $users,
    $userId,
    'user_id'
  ) || {}
);

export const currentWithEntries = createSelector(
  entries,
  current,
  ($entries, $user) => transformKey(
    $user,
    'entries',
    ($userEntries) => $userEntries.map(findEntry($entries))
  )
);

export const currentWithEntryByEvent = createSelector(
  currentWithEntries,
  eventInfo,
  ($user, $event) => transformKey(
    $user,
    'entries',
    ($userEntries) => findWhere($userEntries, pick($event, 'sport', 'year')),
    'entry'
  )
);
