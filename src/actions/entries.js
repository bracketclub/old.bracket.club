import config from 'config';
import restActions from '../lib/restActions';
import {replaceQuery} from './routing';
import {entries as schema} from '../schema';
import * as entriesSelectors from '../selectors/entries';

const reverse = (dir) => dir === 'asc' ? 'desc' : 'asc';

const sort = (sortBy) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const current = entriesSelectors.sortParams(state, {location});

  dispatch(replaceQuery({
    location,
    query: {
      // If the sort key is the same as the current sort key then reverse the direction
      // otherwise use the existing sort direction
      sort: `${sortBy}|${current.key === sortBy ? reverse(current.dir) : current.dir}`
    }
  }));
};

export default {
  sort,
  ...restActions({
    schema,
    url: `${config.apiUrl}/entries`
  })
};
