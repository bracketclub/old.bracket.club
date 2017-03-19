import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import es from 'lib/eventSource';
import bailoutEvent from 'lib/bailoutEvent';
import {user as schema} from '../schema';
import * as bracketSelectors from '../selectors/bracket';

const endpoint = 'users';

// If there is an eventId then only check if that event is open
// Otherwise check if any event if open, since that would mean to always check
// a user's profile for new entries
const bailout = bailoutEvent(endpoint, (state, props) => {
  const {eventId} = props.params;
  const selector = eventId ? bracketSelectors.open : bracketSelectors.allOpen;
  return selector(state, props);
}, (id) => id.split('/')[1]);

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`
});

export const sse = (params) => (dispatch, getState) => {
  const state = getState();
  const [userId, eventId] = params.split('/');

  if (bailout(state, params, {timeOnly: true})) return null;

  return es({
    id: endpoint,
    dispatch,
    endpoint
  }, (data) => {
    if (data.id === userId) {
      dispatch(fetch(`${userId}${eventId ? `/${eventId}` : ''}`, {refresh: true}));
    }
  });
};
