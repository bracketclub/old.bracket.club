/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import nock from 'nock';
import MockDate from 'mockdate';
import {transform} from 'lodash';
import BD from 'bracket-data';
import {fetch as entriesFetch} from '../actions/entries';

import {
  configureStore,
  mockApi,
  invokeSeries,
  assertEach,
  fixtures as F
} from './_utils.js';

describe('entries have correct state after actions', () => {
  let store;

  beforeEach(() => {
    MockDate.reset();
    store = configureStore();
  });

  afterEach(() => {
    MockDate.reset();
    // There should not be any mocks left after a test runs
    // If there are it means something was cached that shouldnt be
    expect(nock.activeMocks().length).toBe(0);
    expect(nock.pendingMocks().length).toBe(0);
  });

  it('entries cold -> cache -> cache miss', () => {
    const event = 'ncaam-2013';
    const resp = F.entries[event];

    const mockRequest = () => mockApi(`/entries/${event}`, resp);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: transform(resp, (res, entry) => {
          res[`${entry.user.id}/${event}`] = {...F.record, result: entry.user.id};
          return res;
        }, {}),
        entities: transform(resp, (res, entry) => {
          res[entry.user.id] = {...entry.user, entries: [entry.id]};
          return res;
        }, {})
      });

      expect(state.entries).toEqual({
        records: {
          [event]: {...F.record, result: resp.map(({id}) => id)}
        },
        entities: transform(resp, (res, entry) => {
          res[entry.id] = {...entry, user: entry.user.id};
          return res;
        }, {})
      });
    };

    const dispatch = () => store.dispatch(entriesFetch(event));

    const actions = [
      // Mock the request before dispatching a request action
      () => {
        mockRequest();
        return dispatch();
      },
      // Doesn't need to mock the request since it reads from the cache
      () => dispatch(),
      // Forcing Date.now to before the tourney will force this request to miss the cache
      () => {
        MockDate.set('2013-03-19');
        mockRequest();
        return dispatch();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertState));
  });

  it('entries are never cached during entry period', () => {
    const event = 'ncaam-2013';
    const resp = F.entries[event];
    const {locks} = BD({sport: event.split('-')[0], year: event.split('-')[1]});

    const mockRequest = () => mockApi(`/entries/${event}`, resp);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: transform(resp, (res, entry) => {
          res[`${entry.user.id}/${event}`] = {...F.record, result: entry.user.id};
          return res;
        }, {}),
        entities: transform(resp, (res, entry) => {
          res[entry.user.id] = {...entry.user, entries: [entry.id]};
          return res;
        }, {})
      });

      expect(state.entries).toEqual({
        records: {
          [event]: {...F.record, result: resp.map(({id}) => id)}
        },
        entities: transform(resp, (res, entry) => {
          res[entry.id] = {...entry, user: entry.user.id};
          return res;
        }, {})
      });
    };

    const dispatch = () => store.dispatch(entriesFetch(event));

    // Set entries to open which will never cache
    MockDate.set(locks.replace('T16', 'T15'));

    // Fetch 10 times in a row and mock before each one since entries are open
    const actions = new Array(10).fill(() => {
      mockRequest();
      return dispatch();
    });

    return invokeSeries(actions).then(assertEach(assertState));
  });
});
