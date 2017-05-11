import {createSelector} from 'reselect';
import {UserAuthWrapper} from 'redux-auth-wrapper';
import qs from 'query-string';
import {replace} from '../actions/history';

const KEY = 'me';
const repredicate = (selector) => (val) => selector({[KEY]: val});

export const me = (state) => state[KEY];

export const sync = createSelector(
  me,
  ($me) => $me.syncing
);

export const id = createSelector(
  me,
  ($me) => $me.id
);

export const authenticating = createSelector(
  me,
  ($me) => $me.authenticating
);

export const friends = createSelector(
  me,
  ($me) => $me.friends
);

export const isAuthed = createSelector(
  id,
  ($id) => !!$id
);

export const notAuthed = createSelector(
  id,
  ($id) => !$id
);

export const Authed = UserAuthWrapper({
  authSelector: me,
  predicate: repredicate(isAuthed),
  redirectAction: replace,
  allowRedirectBack: true,
  wrapperDisplayName: 'Authed'
});

export const NotAuthed = UserAuthWrapper({
  authSelector: me,
  predicate: repredicate(notAuthed),
  failureRedirectPath: (state, props) => qs.parse(props.location.search).redirect || '/',
  redirectAction: replace,
  allowRedirectBack: false,
  wrapperDisplayName: 'NotAuthed'
});
