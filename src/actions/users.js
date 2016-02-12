import config from 'config';
import restActions from 'lib/restActions';
import es from 'lib/eventSource';
import {users as schema} from '../schema';

const ENDPOINT = 'users';

const usersRestActions = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`
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
        dispatch(usersRestActions.fetchOne(`${userId}${eventId ? `/${eventId}` : ''}`, {refresh: true}));
      }
    });
  }
};
