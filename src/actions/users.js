import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import es from 'lib/eventSource';
import {users as schema} from '../schema';

const ENDPOINT = 'users';

const usersRestActions = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: (state, id) => {
    const {result} = state.users.records[id] || {};
    const [, eventId = ''] = id.split('/');

    if (!eventId) return !!result;

    const year = parseInt(eventId.replace(/\D/g, ''), 10);
    return !!(result && year && year < new Date().getFullYear());
  }
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
