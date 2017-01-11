/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {apiMiddleware} from 'redux-api-middleware';
import nock from 'nock';

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

  const d = store.dispatch;
  store.dispatch = (action) => d(action).then(() => store.getState());
  return store;
};

const mockApi = (url, resp, code = 200) => nock('http://localhost:999999/').get(url).reply(code, resp);

describe('Store has correct state after actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
    expect(nock.activeMocks().length).toBe(0);
  });

  afterEach(() => {
    expect(nock.activeMocks().length).toBe(0);
    nock.cleanAll();
  });

  it('Entries by event (with cache)', () => {
    const mockRequest = () => mockApi('/entries/ncaam-2013', [{
      bracket: 'brkt',
      id: '1',
      sport: 'ncaam',
      year: '2013',
      user: {
        id: '2',
        username: 'test2'
      }
    }, {
      bracket: 'brkt',
      id: '100',
      sport: 'ncaam',
      year: '2013',
      user: {
        id: '1',
        username: 'test1'
      }
    }]);

    mockRequest();

    return store.dispatch(entriesFetch('ncaam-2013')).then((state) => {
      const assertUsers = (s) => expect(s.users).toEqual({
        records: {},
        entities: {
          2: {id: '2', username: 'test2', entries: ['1']},
          1: {id: '1', username: 'test1', entries: ['100']}
        }
      });

      const assertEntries = (s) => expect(s.entries).toEqual({
        records: {'ncaam-2013': {syncing: false, refreshing: false, fetchError: null, result: ['1', '100']}},
        entities: {
          1: {id: '1', sport: 'ncaam', year: '2013', bracket: 'brkt', user: '2'},
          100: {id: '100', sport: 'ncaam', year: '2013', bracket: 'brkt', user: '1'}
        }
      });

      assertUsers(state);
      assertEntries(state);

      // The second request is bailed out due to the cache logic
      return store.dispatch(entriesFetch('ncaam-2013')).then((state2) => {
        assertUsers(state2);
        assertEntries(state2);

        // Mock date.now so cache wont be called anymore
        Date.now = jest.genMockFunction().mockReturnValue(0);
        // Mock the request since it wont hit the cache
        mockRequest();

        return store.dispatch(entriesFetch('ncaam-2013')).then((state3) => {
          assertUsers(state3);
          assertEntries(state3);
        });
      });
    });
  });

  it('User by id', () => {
    mockApi('/users/123', {
      id: '123',
      username: 'luke',
      entries: [{
        id: '1',
        bracket: 'brkt1',
        sport: 'nba',
        year: '2016',
        user: '123'
      }, {
        id: '2',
        bracket: 'brkt2',
        sport: 'nba',
        year: '2015',
        user: '123'
      }]
    });

    return store.dispatch(usersFetch('123')).then((resp) => {
      const state = store.getState();

      expect(state.users).toEqual({
        records: {
          123: {syncing: false, refreshing: false, fetchError: null, result: '123'}
        },
        entities: {
          123: {id: '123', username: 'luke', entries: ['1', '2']}
        }
      });

      expect(state.entries).toEqual({
        records: {},
        entities: {
          1: {id: '1', bracket: 'brkt1', sport: 'nba', year: '2016', user: '123'},
          2: {id: '2', bracket: 'brkt2', sport: 'nba', year: '2015', user: '123'}
        }
      });
    });
  });
});
