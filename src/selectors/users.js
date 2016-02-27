import {createSelector} from 'reselect';
import {find, pick, property} from 'lodash';

import eventInfo, {eventId} from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';
import * as entriesSelectors from './entries';
import * as visibleSelectors from './visible';

const STATE_KEY = property('users');
const entries = (state, props) => state.entries.entities;
const userId = (state, props) => props.params.userId;
const userKey = createSelector(userId, eventId, (...args) => args.join('/'));
const user = visibleSelectors.byId(STATE_KEY, userKey);

export const userWithEntries = createSelector(
  user,
  entries,
  ($user, $entries) => ({
    ...$user,
    entries: $user.entries ? $user.entries.map((id) => $entries[id]) : []
  })
);

export const userWithEntry = createSelector(
  userWithEntries,
  eventInfo,
  ($user, $event) => ({
    ...$user,
    entry: find($user.entries, pick($event, 'sport', 'year'))
  })
);

export const userWithScoredEntry = createSelector(
  userWithEntry,
  bracketSelectors.score,
  mastersSelectors.bracketString,
  ($user, $score, $master) => ({
    ...$user,
    score: $user && $master && $score({master: $master, entry: $user.entry.bracket})
  })
);

export const userWithRankedEntry = createSelector(
  userWithEntry,
  entriesSelectors.scoredByEvent,
  ($user, $entries) => ({
    ...$user,
    ...pick($entries.find((entry) => entry.user.id === $user.id), 'score')
  })
);

export const sync = visibleSelectors.sync(STATE_KEY, eventId);
