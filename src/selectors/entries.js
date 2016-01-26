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
const SCORE_TYPES = ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'];

const users = (state) => state.users.records;
const entries = (state) => state.entries.records;
const entryId = (state, props) => props.params.entryId;
const urlSort = (state, props) => props.location.query.sort;

const findUser = ($users) => ($user) => findById($users, $user, 'user_id');
const transformUser = ($users) => ($entry) => transformKey($entry, 'user', findUser($users));
const addSortedIndex = ($order) => ($entry) => {
  $entry.score.index = sortedIndexBy($order, $entry, DEFAULT_SORT) + 1;
  return $entry;
};

const current = createSelector(
  entries,
  entryId,
  ($entries, $entryId) => findById(
    $entries,
    $entryId,
    'data_id'
  ) || {}
);

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
    const scoredEntries = $score(SCORE_TYPES, {master: $master, entry: $entries});
    const standardOrder = sortBy(scoredEntries, DEFAULT_SORT);

    return orderBy(
      scoredEntries.map(addSortedIndex(standardOrder)),
      `score.${$sort.key}`, $sort.dir
    );
  }
);

export const currentWithUser = createSelector(
  users,
  current,
  ($users, $entry) => transformUser($users)($entry)
);
