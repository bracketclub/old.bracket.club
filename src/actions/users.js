import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import es from 'lib/eventSource';
import cache from 'lib/cacheEvent';
import {users as schema} from '../schema';
import * as bracketSelectors from '../selectors/bracket';

const ENDPOINT = 'users';

const usersRestActions = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: cache('users', bracketSelectors.locks, (id) => id.split('/')[1])
});

export default {
  ...usersRestActions,
  sse: (params) => (dispatch) => {
    const [userId, eventId] = params.split('/');
    return es({
      event: `${ENDPOINT}`,
      url: `${config.apiUrl}/entries/events`
    }, (updatedUser) => {
      if (updatedUser.id === userId) {
        dispatch(usersRestActions.fetch(`${userId}${eventId ? `/${eventId}` : ''}`, {refresh: true}));
      }
    });
  }
};
