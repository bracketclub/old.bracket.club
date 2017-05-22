import qs from 'query-string';
import {omit} from 'lodash';
import history from 'lib/history';
import {LOCATION_CHANGE} from '../constants/history';

// Technically the calls to history are side effects, but this forces them
// to still be dispatched like all other actions. An alternative would be to use
// react-router-redux, but that doesn't work with react-router v4
const historyDispatcher = (method, ...args) => (dispatch) => {
  dispatch({
    type: `${LOCATION_CHANGE}/${method.toUpperCase()}`,
    payload: args
  });
  history[method](...args);
};

// For backward compatbility with redux-auth-wrapper and other libraries
// that were compatible with history v3
const queryToSearch = (path) => {
  if (path && path.query && !path.search) {
    return {
      ...omit(path, 'query'),
      search: qs.stringify(path.query)
    };
  }
  return path;
};

export const push = (path, state) => historyDispatcher('push', queryToSearch(path), state);
export const replace = (path, state) => historyDispatcher('replace', queryToSearch(path), state);
export const go = (...args) => historyDispatcher('go', ...args);
export const goBack = (...args) => historyDispatcher('goBack', ...args);
export const goForward = (...args) => historyDispatcher('goForward', ...args);
export const replaceQuery = ({location, query}) => replace({...location, query: {...(location.query || {}), ...query}});
export const location = () => history.location;
