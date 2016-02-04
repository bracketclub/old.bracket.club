import {LOGIN, LOGOUT} from '../constants/me';

const initialState = {
  id: null,
  username: null
};

export default (state = initialState, action) => {
  switch (action.type) {

  case LOGIN:
    return {
      ...state,
      id: action.auth.id,
      username: action.auth.username
    };

  case LOGOUT:
    return {
      ...state,
      id: null,
      username: null
    };

  default:
    return state;
  }
};
