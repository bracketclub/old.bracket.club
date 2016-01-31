import config from 'config';
import restActions from '../lib/restActions';
import {replaceQuery} from './routing';
import {masters as schema} from '../schema';
import * as mastersSelectors from '../selectors/masters';

const routeToIndex = (getIndex) => () => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const current = mastersSelectors.index(state, {location});
  const {total} = mastersSelectors.progress(state, {location});
  const game = typeof getIndex === 'function' ? getIndex({current, total}) : getIndex;

  dispatch(replaceQuery({location, query: {game}}));
};

const goToFirst = routeToIndex(0);
const goToPrevious = routeToIndex(({current}) => Math.max(0, current - 1));
const goToNext = routeToIndex(({current, total}) => Math.min(total, current + 1));
const goToLast = routeToIndex(({total}) => total);

export default {
  ...restActions({
    schema,
    url: `${config.apiUrl}/masters`
  }),
  goToFirst,
  goToLast,
  goToNext,
  goToPrevious
};
