import rafCountdown from 'lib/countdown';
import * as actions from '../constants/event';
import * as bracketSelectors from '../selectors/bracket';

const lock = (id) => ({
  type: actions.LOCK,
  payload: {id}
});

const unlock = (id) => ({
  type: actions.UNLOCK,
  payload: {id}
});

export const countdown = (id) => (dispatch, getState) => {
  const locks = bracketSelectors.locks(getState(), {match: {params: {eventId: id}}});
  const now = Date.now();

  if (now < new Date(locks)) {
    dispatch(unlock(id));
    rafCountdown(locks, () => dispatch(lock(id)));
  }
};
