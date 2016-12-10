import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import {event as aEvent} from 'lib/analytics';
import es from 'lib/eventSource';
import cache from 'lib/cacheEvent';
import {replaceQuery} from './routing';
import {entries as schema} from '../schema';
import * as entriesSelectors from '../selectors/entries';
import * as bracketSelectors from '../selectors/bracket';
import {eventId} from '../selectors/event';

const ENDPOINT = 'entries';
const reverse = (dir) => dir === 'asc' ? 'desc' : 'asc';

const sortAction = (sortBy) => (dispatch, getState) => {
  const state = getState();
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const current = entriesSelectors.sortParams(state, {location});

  // If the sort key is the same as the current sort key then reverse the direction
  // otherwise use the existing sort direction
  const sort = `${sortBy}|${current.key === sortBy ? reverse(current.dir) : current.dir}`;

  aEvent({state, category: 'Entries', action: 'sort', label: sort});
  dispatch(replaceQuery({location, query: {sort}}));
};

export const fetch = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: cache(ENDPOINT, bracketSelectors.locks)
});

export {sortAction as sort};

export const sse = () => (dispatch, getState) => {
  const event = eventId(getState());
  return es({
    event,
    url: `${config.apiUrl}/${ENDPOINT}/events`
  }, () => {
    dispatch(fetch(event, {refresh: true}));
  });
};
