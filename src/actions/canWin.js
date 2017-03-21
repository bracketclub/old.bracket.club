import * as types from '../constants/canWin';
import * as mastersSelectors from '../selectors/masters';
import {eventId} from '../selectors/event';

const CanWinWorker = require('worker!lib/canWinWorker');

export const canWin = ({entries, id, list}) => (dispatch, getState) => {
  const state = getState();
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const index = mastersSelectors.index(state, {location});
  const master = mastersSelectors.bracketString(state, {location});
  const [sport, year] = eventId(state).split('-');

  const meta = {id, event: `${sport}-${year}`, index, list};

  dispatch({type: types.CAN_WIN_START, meta});

  const canWinWorker = new CanWinWorker();

  canWinWorker.postMessage({
    sport,
    year,
    entries,
    master,
    id
  });

  canWinWorker.onerror = (e) => dispatch({
    type: types.CAN_WIN_ERROR,
    payload: e.message,
    meta
  });

  canWinWorker.onmessage = (e) => {
    const {data} = e;
    dispatch({
      type: data ? types.CAN_WIN_SUCCESS : types.CAN_WIN_FAILURE,
      payload: data,
      meta
    });
  };
};
