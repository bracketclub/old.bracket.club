import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import {event as aEvent} from 'lib/analytics';
import es from 'lib/eventSource';
import bailoutEvent from 'lib/bailoutEvent';
import {replaceQuery} from './routing';
import {master as schema} from '../schema';
import * as mastersSelectors from '../selectors/masters';
import * as bracketSelectors from '../selectors/bracket';

const endpoint = 'masters';

const routeToIndex = (getIndex, label) => () => (dispatch, getState) => {
  const state = getState();
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const current = mastersSelectors.index(state, {location});
  const lastIndex = mastersSelectors.lastIndex(state, {location});
  const game = getIndex({current, total: lastIndex});

  aEvent({state, label, category: 'Masters', action: 'navigate'});
  dispatch(replaceQuery({location, query: {game}}));
};

const navigationActions = {
  goToFirst: routeToIndex(() => 0, 'goToFirst'),
  goToPrevious: routeToIndex(({current}) => Math.max(0, current - 1), 'goToPrevious'),
  goToNext: routeToIndex(({current, total}) => Math.min(total, current + 1), 'goToNext'),
  goToLast: routeToIndex(({total}) => total, 'goToLast')
};

// Masters will never update after a tournament has completed
const bailout = bailoutEvent(endpoint, bracketSelectors.completeDate);

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`
});

export const navigate = (method) => navigationActions[method]();

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
