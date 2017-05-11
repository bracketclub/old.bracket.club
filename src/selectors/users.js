import {createSelector} from 'reselect';
import {find, pick, property, compact, orderBy, groupBy, map} from 'lodash';
import {ENTITIES} from 'lib/endpointReducer';
import {id as meId} from './me';
import * as eventSelectors from './event';
import * as bracketSelectors from './bracket';
import * as mastersSelectors from './masters';
import * as entriesSelectors from './entries';
import * as visibleSelectors from './visible';

const STATE_KEY = property('users');
const entries = (state, props) => state.entries[ENTITIES];
const userId = (state, props) => props.match.params.userId;
const userEventId = createSelector(userId, eventSelectors.id, (...args) => args.join('/'));

const mapUserToEntries = ($user, $entries) => {
  const $userEntries = compact(($user.entries || []).map((id) => $entries[id]));
  // Only include the latest entry for each year
  const grouped = groupBy(orderBy($userEntries, 'created', 'desc'), ({sport, year}) => sport + year);
  return map(grouped, (value) => value[0]);
};

const visibleUser = (userSelector) => createSelector(
  meId,
  visibleSelectors.byId(STATE_KEY, userSelector),
  ($id, $user) => ({
    ...$user,
    isMe: $id && $user.id && $id === $user.id
  })
);

export const userWithEntries = createSelector(
  visibleUser(userId),
  entries,
  ($user, $entries) => ({
    ...$user,
    entries: mapUserToEntries($user, $entries)
  })
);

export const userWithEntry = createSelector(
  visibleUser(userEventId),
  eventSelectors.info,
  entries,
  ($user, $event, $entries) => ({
    ...$user,
    entry: find(mapUserToEntries($user, $entries), pick($event, 'sport', 'year'))
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

export const sync = visibleSelectors.sync(STATE_KEY, userId);
export const eventSync = visibleSelectors.sync(STATE_KEY, userEventId);
