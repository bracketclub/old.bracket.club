import {createSelector} from 'reselect';

import findById from '../lib/findById';
import transformKey from '../lib/transformKey';
import pathname from './routing';

const entries = (state) => state.entries.records;
const users = (state) => state.users.records;

const current = createSelector(
  pathname,
  users,
  ($pathname, $users) => findById(
    $users,
    $pathname.replace(/.*\/users\//, ''),
    'user_id'
  ) || {}
);

export const currentWithEntries = createSelector(
  entries,
  current,
  ($entries, $user) => transformKey(
    $user,
    'entries',
    (userEntries) => userEntries.map((id) => findById($entries, id, 'data_id'))
  )
);
