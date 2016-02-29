import {createSelector} from 'reselect';
import {sortedIndexBy, orderBy, sortBy, property} from 'lodash';

import {eventId} from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';
import * as visibleSelectors from './visible';

const STATE_KEY = property('entries');
const SORT_KEY = 'standard';
const SORT_DIR = 'desc';
const DEFAULT_SORT = (entry) => entry.score[SORT_KEY] * -1;

const me = (state) => state.me;
const users = (state) => state.users.entities;
const urlSort = (state, props) => props.location.query.sort;
const entries = visibleSelectors.list(STATE_KEY, eventId);

const entriesWithUsers = createSelector(
  entries,
  users,
  ($entries, $users) => $entries.map(($entry) => ({
    ...$entry,
    user: $users[$entry.user] || {id: $entry.user}
  }))
);

const friendsEntries = createSelector(
  entriesWithUsers,
  me,
  ($entries, $me) => {
    const {friends, id} = $me;
    return $entries.filter(($entry) => friends.indexOf($entry.user.id) > -1 || $entry.user.id === id);
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
    // Break ties by falling back to descending by standard score
    [`score.${$sort.key}`, 'score.standard'], [$sort.dir, 'desc']
  );
};

export const scoredByEvent = createSelector(
  entriesWithUsers,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  sortParams,
  orderEntries
);

export const friendsScoredByEvent = createSelector(
  friendsEntries,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  sortParams,
  orderEntries
);

export const sync = visibleSelectors.sync(STATE_KEY, eventId);
