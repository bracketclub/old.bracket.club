import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import analytics from 'lib/analytics';
import es from 'lib/eventSource';
import cache from 'lib/cacheOldYears';
import {replaceQuery} from './routing';
import {entries as schema} from '../schema';
import * as entriesSelectors from '../selectors/entries';
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

  analytics.event({state, category: 'Entries', action: 'sort', label: sort});
  dispatch(replaceQuery({location, query: {sort}}));
};

const entriesRestActions = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: cache('entries')
});

export default {
  ...entriesRestActions,
  sort: sortAction,
  sse: () => (dispatch, getState) => {
    const event = eventId(getState());
    return es({
      event: `${ENDPOINT}-${event}`,
      url: `${config.apiUrl}/${ENDPOINT}/events`
    }, () => {
      dispatch(entriesRestActions.fetch(event, {refresh: true}));
    });
  }
};
