import config from 'config';
import restActions from 'lib/reduxApiRestActions';
import analytics from 'lib/analytics';
import es from 'lib/eventSource';
import cache from 'lib/cacheEvent';
import {replaceQuery} from './routing';
import {masters as schema} from '../schema';
import * as mastersSelectors from '../selectors/masters';
import * as bracketSelectors from '../selectors/bracket';
import {eventId} from '../selectors/event';

const ENDPOINT = 'masters';

const routeToIndex = (getIndex, label) => () => (dispatch, getState) => {
  const state = getState();
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const current = mastersSelectors.index(state, {location});
  const {total} = mastersSelectors.progress(state, {location});
  const game = getIndex({current, total});

  analytics.event({state, label, category: 'Masters', action: 'navigate'});
  dispatch(replaceQuery({location, query: {game}}));
};

const navigationActions = {
  goToFirst: routeToIndex(() => 0, 'goToFirst'),
  goToPrevious: routeToIndex(({current}) => Math.max(0, current - 1), 'goToPrevious'),
  goToNext: routeToIndex(({current, total}) => Math.min(total, current + 1), 'goToNext'),
  goToLast: routeToIndex(({total}) => total, 'goToLast')
};

const mastersRestActions = restActions({
  schema,
  url: `${config.apiUrl}/${ENDPOINT}`,
  cache: cache(ENDPOINT, bracketSelectors.completeDate)
});

export default {
  ...mastersRestActions,
  navigate: (method) => navigationActions[method](),
  sse: () => (dispatch, getState) => {
    const event = eventId(getState());
    return es({
      event: `${ENDPOINT}-${event}`,
      url: `${config.apiUrl}/${ENDPOINT}/events`
    }, () => {
      dispatch(mastersRestActions.fetch(event, {refresh: true}));
    });
  }
};
