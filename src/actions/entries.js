import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import {event as aEvent} from 'lib/analytics';
import es from 'lib/eventSource';
import bailoutEvent from 'lib/bailoutEvent';
import {replaceQuery} from './routing';
import {entry as schema} from '../schema';
import * as entriesSelectors from '../selectors/entries';
import * as bracketSelectors from '../selectors/bracket';

const endpoint = 'entries';
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

// No entries after a tournament is locked
const bailout = bailoutEvent(endpoint, bracketSelectors.locks);

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`
});

export {sortAction as sort};

export const sse = (event) => (dispatch, getState) => {
  const state = getState();

  if (bailout(state, event, {timeOnly: true})) return null;

  return es({
    id: event,
    dispatch,
    endpoint
  }, () => {
    dispatch(fetch(event, {refresh: true}));
  });
};
