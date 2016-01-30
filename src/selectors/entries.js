import {createSelector} from 'reselect';
import {filter, pick, sortedIndexBy, orderBy, sortBy} from 'lodash';

import findById from '../lib/findById';
import transformKey from '../lib/transformKey';
import eventInfo from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';

const SORT_KEY = 'standard';
const SORT_DIR = 'desc';
const DEFAULT_SORT = (entry) => entry.score[SORT_KEY] * -1;

const users = (state) => state.users.records;
const entries = (state) => state.entries.records;
const urlSort = (state, props) => props.location.query.sort;

const findUser = ($users) => ($user) => findById($users, $user);
const transformUser = ($users) => ($entry) => transformKey($entry, 'user', findUser($users));
const addSortedIndex = ($order) => ($entry) => {
  $entry.score.index = sortedIndexBy($order, $entry, DEFAULT_SORT) + 1;
  return $entry;
};

const byEvent = createSelector(
  entries,
  users,
  eventInfo,
  ($entries, $users, $event) => filter(
    $entries,
    pick($event, 'sport', 'year')
  ).map(transformUser($users))
);

// Exports
export const sortParams = createSelector(
  urlSort,
  ($urlSort) => typeof $urlSort === 'undefined'
    ? {key: SORT_KEY, dir: SORT_DIR}
    : {key: $urlSort.split('|')[0], dir: $urlSort.split('|')[1]}
);

export const scoredByEvent = createSelector(
  byEvent,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  sortParams,
  ($entries, $score, $master, $sort) => {
    if (!$master || !$entries.length) return $entries;
    // This adds a score object to each entry
    const scoredEntries = $score({master: $master, entry: $entries});
    const standardOrder = sortBy(scoredEntries, DEFAULT_SORT);
    return orderBy(
      scoredEntries.map(addSortedIndex(standardOrder)),
      `score.${$sort.key}`, $sort.dir
    );
  }
);
