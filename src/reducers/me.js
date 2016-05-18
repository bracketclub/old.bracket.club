import * as types from '../constants/me';

const initialState = {
  friends: null,
  twitterAuth: {},
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
      ...initialState,
      ...state,
      authenticating: true
    };

  case types.LOGIN:
    return {
      ...initialState,
      ...state,
      authenticating: false,
      twitterAuth: action.auth.credential || state.twitterAuth || {},
      id: action.auth.user.providerData[0].uid,
      username: action.auth.user.providerData[0].displayName
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

  default:
    return state;
  }
};
