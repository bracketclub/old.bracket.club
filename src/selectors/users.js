import {createSelector} from 'reselect';

import findById from 'lib/findById';
import transformKey from 'lib/transformKey';
import eventInfo from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';
import * as entriesSelectors from './entries';

const entries = (state, props) => state.entries;
const users = (state) => state.users.records;
const userId = (state, props) => props.params.userId;

const current = createSelector(
  userId,
  users,
  ($userId, $users) => findById($users, $userId) || {}
);

export const currentWithEntry = createSelector(
  current,
  eventInfo,
  entries,
  ($user, $event, $entries) => {
    const entry = entries.records[$event.id] || null;
    return {
      ...$user,
      entry
    };
  }
);

export const currentWithScoredEntry = createSelector(
  currentWithEntry,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  ($entry, $score, $master) => ({
    ...$entry,
    score: $entry && $master
      ? $score({master: $master, entry: $entry.bracket})
      : null
  })
);

export const currentWithRankedEntry = createSelector(
  currentWithEntry,
  userId,
  entriesSelectors.scoredByEvent,
  ($entry, $userId, $entries) => ({
    ...$entry,
    ...$entries.find((entry) => entry.user.id === $userId)
  })
);

export const currentWithEntries = createSelector(
  entries,
  current,
  ($entries, $user) => transformKey(
    $user,
    'entries',
    ($userEntries) => $userEntries.map((id) => $entries.entities[id])
  )
);
