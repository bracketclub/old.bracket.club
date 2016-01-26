import config from 'config';
import restActions from '../lib/restActions';
import * as routeActions from './routing';
import {entries as schema} from '../schema';

const reverse = (dir) => dir === 'asc' ? 'desc' : 'asc';

const sort = ({current, sort: sortBy, location}) => routeActions.replaceQuery({
  location,
  query: {
    // If the sort key is the same as the current sort key then reverse the direction
    // otherwise use the existing sort direction
    sort: `${sortBy}|${current.key === sortBy ? reverse(current.dir) : current.dir}`
  }
});

export default {
  sort,
  ...restActions({
    schema,
    url: `${config.apiUrl}/entries`
  })
};
