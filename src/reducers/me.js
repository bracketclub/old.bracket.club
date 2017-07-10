import {actionTypes as localStorageTypes} from 'redux-localstorage';
import {get} from 'lodash';
import * as types from '../constants/me';

const initialState = {
  friends: null,
  twitterAuth: {},
  id: null,
  username: null,
  authenticating: false,
  authError: null,
  syncing: {
    syncing: false,
    fetchError: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
  case types.LOGIN_START:
    return {
      ...initialState,
      ...state,
      authenticating: true,
      authError: null
    };

  case types.LOGIN: {
    const auth = action.payload;
    return {
      ...initialState,
      ...state,
      authenticating: false,
      authError: null,
      twitterAuth: auth.credential || state.twitterAuth || {},
      id: auth.user.providerData[0].uid,
      username: auth.user.providerData[0].displayName
    };
  }

  case types.AUTH_ERROR:
    return {
      ...initialState,
      ...state,
      authError: action.payload
    };

  case types.LOGOUT:
    return {
      ...initialState,
      syncing: {...initialState.syncing}
    };

  case types.FRIENDS_FETCH_START:
    return {
      ...initialState,
      ...state,
      syncing: {syncing: true, fetchError: null},
      friends: null
    };

  case types.FRIENDS_FETCH_SUCCESS:
    return {
      ...initialState,
      ...state,
      syncing: {...initialState.syncing},
      friends: action.payload.ids
    };

  case types.FRIENDS_FETCH_ERROR:
    return {
      ...initialState,
      ...state,
      syncing: {syncing: false, fetchError: action.payload},
      friends: null
    };

  case localStorageTypes.INIT:
    return {
      ...state,
      ...get(action.payload, 'me', initialState)
    };

  default:
    return state;
  }
};
