import * as actions from '../constants/event';

export const lock = (event) => ({
  type: actions.LOCK,
  payload: event
});
