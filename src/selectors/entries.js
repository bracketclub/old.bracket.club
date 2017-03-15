import {createSelector} from 'reselect';
import {sortedIndexBy, orderBy, sortBy, property} from 'lodash';

import {ENTITIES} from 'lib/endpointReducer';
import {eventId} from './event';
import {canWinGlobal, canWinFriends} from './canWin';
import me from './me';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';
import * as visibleSelectors from './visible';

const STATE_KEY = property('entries');
const SORT_KEY = 'standard';
const SORT_DIR = 'desc';
const DEFAULT_SORT = (entry) => entry.score[SORT_KEY] * -1;

const users = (state) => state.users[ENTITIES];
const urlSort = (state, props) => props.location.query.sort;
const entries = visibleSelectors.list(STATE_KEY, eventId);

const entriesWithUsers = createSelector(
  entries,
  me,
  users,
  canWinGlobal,
  ($entries, $me, $users, $canWin) => $entries.map(($entry) => ({
    ...$entry,
    user: $users[$entry.user] || {id: $entry.user},
    canWin: $canWin[$entry.id],
    isMe: $entry.user === $me.id
  }))
);

const friendsEntries = createSelector(
  entriesWithUsers,
  me,
  canWinFriends,
  ($entries, $me, $canWin) => {
    const {friends, id} = $me;
    return $entries
      .filter(($entry) => (friends || []).indexOf($entry.user.id) > -1 || $entry.user.id === id)
      .map(($entry) => ({
        ...$entry,
        canWin: $canWin[$entry.id]
      }));
  }
);

export const sortParams = createSelector(
  urlSort,
  ($urlSort) => typeof $urlSort === 'undefined'
    ? {key: SORT_KEY, dir: SORT_DIR}
    : {key: $urlSort.split('|')[0], dir: $urlSort.split('|')[1]}
);

const addSortedIndex = ($order) => ($entry, $index, $list) => {
  $entry.score.index = sortedIndexBy($order, $entry, DEFAULT_SORT) + 1;
  $entry.score.total = $list.length;
  return $entry;
};

const orderEntries = ($entries, $score, $master, $sort) => {
  if (!$master || !$entries.length) return $entries;
  // This adds a score object to each entry
  const scoredEntries = $score({master: $master, entry: $entries});
  const addStandardIndex = addSortedIndex(sortBy(scoredEntries, DEFAULT_SORT));
  return orderBy(
    scoredEntries.map(addStandardIndex),
    // Break ties by falling back to descending by standard score (+ppr) then gooley  (+ppr)
    [
      `score.${$sort.key}`,
      'score.standard',
      'score.standardPPR',
      'score.gooley',
      'score.gooleyPPR'
    ],
    [
      $sort.dir,
      'desc',
      'desc',
      'desc',
      'desc'
    ]
  );
};

const entriesScoredByEvent = (entriesSelector) => createSelector(entriesSelector, ...[
  bracketSelectors.score,
  mastersSelectors.bracketString,
  sortParams,
  orderEntries
]);

export const scoredByEvent = entriesScoredByEvent(entriesWithUsers);
export const friendsScoredByEvent = entriesScoredByEvent(friendsEntries);

export const sync = visibleSelectors.sync(STATE_KEY, eventId);
