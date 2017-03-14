/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import nock from 'nock';
import MockDate from 'mockdate';
import {transform, without} from 'lodash';

import {fetch as usersFetch} from '../actions/users';

import {
  configureStore,
  mockApi,
  invokeSeries,
  assertEach,
  fixtures as F
} from './_utils.js';

describe('users have correct state after actions', () => {
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

  it('user profile cold -> cache -> cache miss', () => {
    const user = '332423991';
    const resp = F.users[user].user;

    const mockRequest = () => mockApi(`/users/${user}`, resp);

    const assertState = (state) => {
      expect(state.users).toEqual({
        records: {
          [user]: {...F.record, result: user},
          ...transform(resp.entries, (res, entry) => {
            res[`${user}/${entry.sport}-${entry.year}`] = {...F.record, result: user};
            return res;
          }, {})
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

    const dispatch = () => store.dispatch(usersFetch(user));

    const actions = [
      // Mock the request before dispatching a request action
      // Sets the date to after the june of 2017 when there should be no live tournaments
      () => {
        MockDate.set('2017-06-30');
        mockRequest();
        return dispatch();
      },
      // Doesn't need to mock the request since it reads from the cache
      () => dispatch(),
      // Forcing Date.now to any time when a tourney is open will force this request to miss the cache
      () => {
        MockDate.set('2017-03-21');
        mockRequest();
        return dispatch();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertState));
  });

  it('user profile -> user entry', () => {
    const user = '332423991';
    const event = 'ncaam-2013';
    const userResp = F.users[user].user;
    const userEntry = `${user}/${event}`;

    const mockUserRequest = () => mockApi(`/users/${user}`, userResp);

    const assertUserState = (state) => {
      expect(state.users).toEqual({
        records: {
          [user]: {...F.record, result: user},
          ...transform(userResp.entries, (res, entry) => {
            res[`${user}/${entry.sport}-${entry.year}`] = {...F.record, result: user};
            return res;
          }, {})
        },
        entities: {
          [user]: {...userResp, entries: userResp.entries.map(({id}) => id)}
        }
      });
      expect(state.entries).toEqual({
        records: {},
        entities: transform(userResp.entries, (res, entry) => {
          res[entry.id] = {...entry, user};
          return res;
        }, {})
      });
    };

    const dispatchUser = () => store.dispatch(usersFetch(user));
    const dispatchUserEntry = () => store.dispatch(usersFetch(userEntry));

    // This test should be able to not mock the user entry request, because
    // going from the user profile page to a specifc user entry will already
    // have all the data it needs to display that entry
    const actions = [
      () => {
        mockUserRequest();
        return dispatchUser();
      },
      () => dispatchUserEntry()
    ];

    return invokeSeries(actions).then(assertEach(assertUserState));
  });

  it('user entry -> user profile', () => {
    const user = '332423991';
    const event = 'ncaam-2013';
    const userResp = F.users[user].user;
    const userEntryResp = F.users[user][event];
    const userEntryId = userEntryResp.entries[0].id;
    const userEntry = `${user}/${event}`;

    const mockUserRequest = () => mockApi(`/users/${user}`, userResp);
    const mockUserEntryRequest = () => mockApi(`/users/${userEntry}`, userEntryResp);

    const assertUserEntryState = (state) => {
      expect(state.users).toEqual({
        records: {
          [`${user}/${event}`]: {...F.record, result: user}
        },
        entities: {
          [user]: {...userEntryResp, entries: [userEntryId]}
        }
      });
      expect(state.entries).toEqual({
        records: {},
        entities: transform(userEntryResp.entries, (res, entry) => {
          res[entry.id] = {...entry, user};
          return res;
        }, {})
      });
    };

    const assertUserState = (state) => {
      expect(state.users).toEqual({
        records: {
          [user]: {...F.record, result: user},
          ...transform(userResp.entries, (res, entry) => {
            res[`${user}/${entry.sport}-${entry.year}`] = {...F.record, result: user};
            return res;
          }, {})
        },
        entities: {
          [user]: {
            ...userResp,
            entries: [userEntryId, ...without(userResp.entries.map(({id}) => id), userEntryId)]
          }
        }
      });
      expect(state.entries).toEqual({
        records: {},
        entities: transform(userResp.entries, (res, entry) => {
          res[entry.id] = {...entry, user};
          return res;
        }, {})
      });
    };

    const dispatchUser = () => store.dispatch(usersFetch(user));
    const dispatchUserEntry = () => store.dispatch(usersFetch(userEntry));

    // When going from a specific event back to the user profile page, it can't
    // be known if there is a enough information to cache that request, because
    // the user could have more entries (or they could just have the one). But
    // the request will always need to be made
    const actions = [
      () => {
        mockUserEntryRequest();
        return dispatchUserEntry();
      },
      () => {
        mockUserRequest();
        return dispatchUser();
      }
    ];

    return invokeSeries(actions).then(assertEach(assertUserEntryState, assertUserState));
  });
});
