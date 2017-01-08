import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import es from 'lib/eventSource';
import cache from 'lib/cacheEvent';
import {user as schema} from '../schema';
import * as bracketSelectors from '../selectors/bracket';

const ENDPOINT = 'users';

export const fetch = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: cache('users', bracketSelectors.locks, (id) => id.split('/')[1])
});

export const sse = (params) => (dispatch) => {
  const [userId, eventId] = params.split('/');
  return es({
    event: ENDPOINT,
    url: `${config.apiUrl}/${ENDPOINT}/events`
  }, (data) => {
    if (data.id === userId) {
      dispatch(fetch(`${userId}${eventId ? `/${eventId}` : ''}`, {refresh: true}));
    }
  });
};
