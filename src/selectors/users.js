import {createSelector} from 'reselect';
import {find, pick} from 'lodash';

import findById from 'lib/findById';
import transformKey from 'lib/transformKey';
import eventInfo from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';

const entries = (state) => state.entries.records;
const users = (state) => state.users.records;
const userId = (state, props) => props.params.userId;

const findEntry = ($entries) => (param) => typeof param === 'string'
    ? findById($entries, param)
    : find($entries, pick(param, 'sport', 'year'));

const current = createSelector(
  userId,
  users,
  ($userId, $users) => findById($users, $userId) || {}
);

export const currentWithEntry = createSelector(
  current,
  eventInfo,
  entries,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  ($user, $event, $entries, $score, $master) => {
    const entry = findEntry($entries)(pick($event, 'sport', 'year'));
    return {
      ...$user,
      entry: entry || null,
      score: entry && $master
        ? $score({master: $master, entry: entry.bracket})
        : null
    };
  }
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
