// import { CALL_API } from 'redux-api-middleware'
// import qs from 'query-string'
// // import { auth as fbAuth, twitter as fbTwitter, parseError } from 'lib/firebase'
// import { replace } from '../actions/history'
// import * as actions from '../constants/me'
// import * as meSelectors from '../selectors/me'

export const getFriends = () => (dispatch, getState) => {
  // const { me } = getState()
  // const { id, twitterAuth } = me
  // const { accessToken: token, secret } = twitterAuth
  // if (!token || !secret || !id) {
  //   return dispatch({
  //     type: actions.FRIENDS_FETCH_ERROR,
  //     error: true,
  //     payload: new Error('Login required'),
  //   })
  // }
  // return dispatch({
  //   [CALL_API]: {
  //     endpoint: `/.netlify/functions/twitter-friends?${qs.stringify({
  //       id,
  //       token,
  //       secret,
  //     })}`,
  //     method: 'GET',
  //     // Cache friends forever
  //     bailout: meSelectors.friends,
  //     types: [
  //       actions.FRIENDS_FETCH_START,
  //       actions.FRIENDS_FETCH_SUCCESS,
  //       actions.FRIENDS_FETCH_ERROR,
  //     ],
  //   },
  // })
}

const syncLogout = () => ({
  // type: actions.LOGOUT,
})

const syncLogin = (auth) => {
  // if (!auth) return syncLogout()
  // return { type: actions.LOGIN, payload: auth }
}

export const initialAuth = (user) => (dispatch, getState) => {
  // if (!user) return syncLogout()
  // return dispatch(syncLogin({ user }))
}

export const login =
  ({ redirect } = {}) =>
  (dispatch, getState) => {
    // dispatch({ type: actions.LOGIN_START })
    // fbAuth
    //   .signInWithPopup(fbTwitter)
    //   .then((result) => {
    //     dispatch(syncLogin(result))
    //     if (redirect) dispatch(replace(redirect))
    //     return null
    //   })
    //   .catch((err) => {
    //     dispatch(syncLogout())
    //     dispatch({ type: actions.AUTH_ERROR, payload: parseError(err) })
    //   })
  }

export const logout = () => (dispatch) => {
  // fbAuth.signOut()
  // dispatch(syncLogout())
}
