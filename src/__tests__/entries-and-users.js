/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import config from 'config';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {apiMiddleware} from 'redux-api-middleware';
import nock from 'nock';
import Promise from 'bluebird';
import MockDate from 'mockdate';

import apiRelationsMiddleware from 'lib/reduxApiRelations';
import rootReducer from '../reducers';
import {fetch as entriesFetch} from '../actions/entries';
import {fetch as usersFetch} from '../actions/users';

const configureStore = (initialState = {}) => {
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

const mockApi = (url, resp, {code = 200, delay = 100} = {}) =>
  nock(config.apiUrl)
    .get(url)
    .delay(delay)
    .reply(code, resp);

const invokeSeries = (actions) =>
  Promise.mapSeries(actions, (a) => a());

const assertEach = (...assertions) => (states) =>
  states.forEach((state, index) => (assertions[index] || assertions[0])(state));

const F = {
  sport: 'ncaam',
  year: '2013',
  event: 'ncaam-2013',
  locks: '2013-03-21T16:15:00.000Z',
  users: [
    {id: '1', username: 'test1'},
    {id: '2', username: 'test2'}
  ],
  entries: [
    {id: '100', bracket: 'brkt1', sport: 'ncaam', year: '2013'},
    {id: '200', bracket: 'brkt1', sport: 'ncaam', year: '2013'}
  ]
};

describe('Store has correct state after actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
  });

  afterEach(() => {
    MockDate.reset();
    // There should not be any mocks left after a test runs
    // If there are it means something was cached that shouldnt be
    expect(nock.activeMocks().length).toBe(0);
    expect(nock.pendingMocks().length).toBe(0);
  });

  it('Entries by event (with cache)', () => {
    const mockRequest = () => mockApi(`/entries/${F.event}`, [
      {...F.entries[0], user: {...F.users[0]}},
      {...F.entries[1], user: {...F.users[1]}}
    ]);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: {},
        entities: {
          [F.users[0].id]: {...F.users[0], entries: [F.entries[0].id]},
          [F.users[1].id]: {...F.users[1], entries: [F.entries[1].id]}
        }
      });
      expect(state.entries).toEqual({
        records: {
          [F.event]: {syncing: false, refreshing: false, fetchError: null, result: F.entries.map(({id}) => id)}
        },
        entities: {
          [F.entries[0].id]: {...F.entries[0], user: F.users[0].id},
          [F.entries[1].id]: {...F.entries[1], user: F.users[1].id}
        }
      });
    };

    const dispatch = () => store.dispatch(entriesFetch(F.event));

    const actions = [
      // Mock the request before dispatching a request action
      () => {
        mockRequest();
        return dispatch();
      },
      // Doesn't need to mock the request since it reads from the cache
      () => dispatch(),
      // Forcing Date.now to return 0 will force this request to miss the cache
      () => {
        MockDate.set(0);
        mockRequest();
        return dispatch();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertState));
  });

  it('Entries are never cached during entry period', () => {
    const mockRequest = () => mockApi(`/entries/${F.event}`, [
      {...F.entries[0], user: {...F.users[0]}},
      {...F.entries[1], user: {...F.users[1]}}
    ]);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: {},
        entities: {
          [F.users[0].id]: {...F.users[0], entries: [F.entries[0].id]},
          [F.users[1].id]: {...F.users[1], entries: [F.entries[1].id]}
        }
      });
      expect(state.entries).toEqual({
        records: {
          [F.event]: {syncing: false, refreshing: false, fetchError: null, result: F.entries.map(({id}) => id)}
        },
        entities: {
          [F.entries[0].id]: {...F.entries[0], user: F.users[0].id},
          [F.entries[1].id]: {...F.entries[1], user: F.users[1].id}
        }
      });
    };

    const dispatch = () => store.dispatch(entriesFetch(F.event));

    // Set entries to open which will never cache
    MockDate.set(F.locks.replace('T16', 'T15'));

    // Fetch 10 times in a row and mock before each one since entries are open
    const actions = new Array(10).fill(() => {
      mockRequest();
      return dispatch();
    });

    return invokeSeries(actions).then(assertEach(assertState));
  });

  it('User by id', () => {
    const user = F.users[0].id;

    const mockRequest = () => mockApi(`/users/${user}`, {
      ...F.users[0],
      entries: [{...F.entries[0], user}, {...F.entries[1], user}]
    });

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: {
          [user]: {syncing: false, refreshing: false, fetchError: null, result: user}
        },
        entities: {
          [user]: {...F.users[0], entries: [F.entries[0].id, F.entries[1].id]}
        }
      });
      expect(state.entries).toEqual({
        records: {},
        entities: {
          [F.entries[0].id]: {...F.entries[0], user},
          [F.entries[1].id]: {...F.entries[1], user}
        }
      });
    };

    const dispatch = () => store.dispatch(usersFetch(user));

    const actions = [
      // Mock the request before dispatching a request action
      () => {
        mockRequest();
        return dispatch();
      },
      // Doesn't need to mock the request since it reads from the cache
      () => dispatch(),
      // Forcing Date.now to return 0 will force this request to miss the cache
      () => {
        MockDate.set(0);
        mockRequest();
        return dispatch();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertState));
  });
});
