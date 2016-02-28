import * as types from '../constants/me';

const initialState = {
  friends: null,
  auth: {},
  id: null,
  username: null,
  syncing: {
    syncing: false,
    fetchError: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {

  case types.LOGIN:
    return {
      ...state,
      auth: action.auth,
      id: action.auth.twitter.id,
      username: action.auth.twitter.username
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
      syncing: {syncing: false, fetchError: null},
      friends: action.payload.ids
    };

  case types.FRIENDS_FETCH_ERROR:
    return {
      ...state,
      syncing: {syncing: false, fetchError: action.payload},
      friends: null
    };

  case types.LOGOUT:
    return {
      ...initialState
    };

  default:
    return state;
  }
};
