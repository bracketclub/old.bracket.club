import config from 'config';
import restActions from 'lib/restActions';
import analytics from 'lib/analytics';
import {replaceQuery} from './routing';
import {entries as schema} from '../schema';
import * as entriesSelectors from '../selectors/entries';

const reverse = (dir) => dir === 'asc' ? 'desc' : 'asc';

const sortAction = (sortBy) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const current = entriesSelectors.sortParams(state, {location});

  // If the sort key is the same as the current sort key then reverse the direction
  // otherwise use the existing sort direction
  const sort = `${sortBy}|${current.key === sortBy ? reverse(current.dir) : current.dir}`;

  analytics.event({state, category: 'Entries', action: 'sort', label: sort});
  dispatch(replaceQuery({location, query: {sort}}));
};

export default {
  sort: sortAction,
  ...restActions({
    schema,
    url: `${config.apiUrl}/entries`
  })
};
