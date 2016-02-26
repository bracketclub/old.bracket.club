import {createSelector} from 'reselect';
import {sortedIndexBy, orderBy, sortBy} from 'lodash';

import transformKey from 'lib/transformKey';
import eventInfo from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';

const SORT_KEY = 'standard';
const SORT_DIR = 'desc';
const DEFAULT_SORT = (entry) => entry.score[SORT_KEY] * -1;

const users = (state) => state.users.entities;
const entries = (state, props) => state.entries;
const urlSort = (state, props) => props.location.query.sort;

const transformUser = ($users) => ($entry) => transformKey($entry, 'user', ($user) => $users[$user]);
const addSortedIndex = ($order) => ($entry, $index, $list) => {
  $entry.score.index = sortedIndexBy($order, $entry, DEFAULT_SORT) + 1;
  $entry.score.total = $list.length;
  return $entry;
};

const byEvent = createSelector(
  entries,
  users,
  eventInfo,
  ($entries, $users, $event) => (
      $entries.records[$event.id] || {results: []}
    )
    .results
    .map((id) => $entries.entities[id])
    .map(transformUser($users))
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
      // Break ties by falling back to descending by standard score
      [`score.${$sort.key}`, 'score.standard'], [$sort.dir, 'desc']
    );
  }
);
