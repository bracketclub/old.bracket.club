import * as types from '../constants/me';

const initialState = {
  friends: null,
  auth: {},
  id: null,
  username: null,
  authenticating: false,
  syncing: {
    syncing: false,
    fetchError: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {

  case types.LOGIN_START:
    return {
      ...state,
      authenticating: true
    };

  case types.LOGIN:
    return {
      ...state,
      authenticating: false,
      auth: action.auth,
      id: action.auth.twitter.id,
      username: action.auth.twitter.username
    };

  case types.LOGOUT:
    return {
      ...initialState,
      syncing: {...initialState.syncing}
    };

  case types.FRIENDS_FETCH_START:
    return {
      ...state,
      syncing: {syncing: true, fetchError: null},
      friends: null
    };

  case types.FRIENDS_FETCH_SUCCESS:
    return {
      ...state,
      syncing: {...initialState.syncing},
      friends: action.payload.ids
    };

  case types.FRIENDS_FETCH_ERROR:
    return {
      ...state,
      syncing: {syncing: false, fetchError: action.payload},
      friends: null
    };

  default:
    return state;
  }
};
