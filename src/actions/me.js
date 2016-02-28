import {CALL_API} from 'redux-api-middleware';
import qs from 'query-string';
import firebase from 'lib/firebase';
import config from 'config';
import * as actions from '../constants/me';

export const syncLogin = (auth) => {
  if (!auth) {
    return syncLogout();
  }
  return {
    type: actions.LOGIN,
    auth
  };
};

export const syncLogout = () => ({
  type: actions.LOGOUT
});

export const getFriends = () => (dispatch, getState) => {
  const {me} = getState();
  const {id, auth} = me;
  const {accessToken: token, accessTokenSecret: secret} = auth.twitter || {};

  if (!token || !secret) return;

  dispatch({
    [CALL_API]: {
      endpoint: `${config.apiUrl}/twitter/friends?${qs.stringify({id, token, secret})}`,
      method: 'GET',
      types: [
        actions.FRIENDS_FETCH_START,
        actions.FRIENDS_FETCH_SUCCESS,
        actions.FRIENDS_FETCH_ERROR
      ]
    }
  });
};

export const login = () => (dispatch, getState) => {
  firebase.authWithOAuthPopup('twitter', (err, auth) => {
    if (err) {
      dispatch(syncLogout());
      return;
    }
    dispatch(syncLogin(auth));
  });
};

export const logout = () => (dispatch) => {
  firebase.unauth();
  dispatch(syncLogout());
};
