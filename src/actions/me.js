import {pick} from 'lodash';

import firebase from 'lib/firebase';
import * as actions from '../constants/me';

export const syncLogin = (auth) => {
  if (!auth) {
    return syncLogout();
  }
  return {
    type: actions.LOGIN,
    auth: pick(auth.twitter, 'username', 'id')
  };
};

export const syncLogout = () => ({
  type: actions.LOGOUT
});

export const login = () => (dispatch) => {
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
