/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import nock from 'nock';
import {transform} from 'lodash';
import {fetch as usersFetch} from '../actions/users';

import {
  configureStore,
  mockApi,
  invokeSeries,
  assertEach,
  fixtures as F
} from './_utils.js';

describe('user-entry has correct state after actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
  });

  afterEach(() => {
    // There should not be any mocks left after a test runs
    // If there are it means something was cached that shouldnt be
    expect(nock.activeMocks().length).toBe(0);
    expect(nock.pendingMocks().length).toBe(0);
  });

  it('single user entry request', () => {
    const user = '332423991';
    const event = 'ncaam-2013';
    const resp = F.users[user][event];
    const respId = `${user}/${event}`;

    const mockRequest = () => mockApi(`/users/${respId}`, resp);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: {
          [`${user}/${event}`]: {...F.record, result: user}
        },
        entities: {
          [user]: {...resp, entries: resp.entries.map(({id}) => id)}
        }
      });
      expect(state.entries).toEqual({
        records: {},
        entities: transform(resp.entries, (res, entry) => {
          res[entry.id] = {...entry, user};
          return res;
        }, {})
      });
    };

    const dispatch = () => store.dispatch(usersFetch(respId));

    const actions = [
      () => {
        mockRequest();
        return dispatch();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertState));
  });
});
