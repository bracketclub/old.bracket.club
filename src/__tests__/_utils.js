/* eslint no-magic-numbers:0 */

import config from 'config';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {apiMiddleware} from 'redux-api-middleware';
import nock from 'nock';
import Promise from 'bluebird';
import apiRelationsMiddleware from 'lib/reduxApiRelations';
import rootReducer from '../reducers';

export const configureStore = (initialState = {}) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      thunk,
      apiMiddleware,
      apiRelationsMiddleware
    ))
  );

  const ogDispatch = store.dispatch;
  // Make each call to dispatch cache and return the current state
  store.dispatch = (...args) => ogDispatch(...args).then(() => store.getState());
  return store;
};

export const mockApi = (url, resp, {code = 200, delay = 100} = {}) =>
  nock(config.apiUrl)
    .get(url)
    .delay(delay)
    .reply(code, resp);

export const invokeSeries = (actions) =>
  Promise.mapSeries(actions, (a) => a());

export const assertEach = (...assertions) => (states) =>
  states.forEach((state, index) => (assertions[index] || assertions[0])(state));

export const fixtures = {
  record: {syncing: false, refreshing: false, fetchError: null},
  users: {
    332423991: {
      user: require('./_fixtures/user-332423991'),
      'ncaam-2013': require('./_fixtures/user-332423991-ncaam-2013')
    },
    1281116485: {
      user: require('./_fixtures/user-1281116485')
    }
  },
  entries: {
    'ncaam-2013': require('./_fixtures/entries-ncaam-2013')
  }
};
