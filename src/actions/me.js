import {CALL_API} from 'redux-api-middleware';
import qs from 'query-string';
import firebase from 'lib/firebase';
import {replace} from 'react-router-redux';
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
  const {accessToken: token, accessTokenSecret: tokenSecret} = auth.twitter || {};

  if (!token || !tokenSecret || !id) {
    return dispatch({
      type: actions.FRIENDS_FETCH_ERROR,
      error: true,
      payload: new Error('Login required')
    });
  }

  return dispatch({
    [CALL_API]: {
      endpoint: `https://webtask.it.auth0.com/api/run/wt-lukekarrys-gmail_com-0/twitter-friends?${qs.stringify({id, token, tokenSecret})}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      // Cache friends forever
      bailout: (state) => !!state.me.friends,
      types: [
        actions.FRIENDS_FETCH_START,
        actions.FRIENDS_FETCH_SUCCESS,
        actions.FRIENDS_FETCH_ERROR
      ]
    }
  });
};

export const login = ({redirect} = {}) => (dispatch, getState) => {
  dispatch({type: actions.LOGIN_START});
  firebase.authWithOAuthPopup('twitter', (err, auth) => {
    if (err) {
      dispatch(syncLogout());
      return;
    }
    dispatch(syncLogin(auth));
    if (redirect) {
      dispatch(replace(redirect));
    }
  });
};

export const logout = () => (dispatch) => {
  firebase.unauth();
  dispatch(syncLogout());
};
