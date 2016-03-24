import * as types from '../constants/canWin';

const initialState = {};

export default (state = initialState, action) => {
  const {payload, meta, type} = action;

  const updateId = (data) => {
    const event = state[meta.event] || {};
    const eventIndex = event[meta.index] || {};
    return {
      ...state,
      [meta.event]: {
        ...event,
        [meta.index]: {
          ...eventIndex,
          [meta.id]: data
        }
      }
    };
  };

  switch (type) {

  case types.CAN_WIN_SUCCESS:
    return updateId({bracket: payload, loading: false, error: null});

  case types.CAN_WIN_START:
    return updateId({bracket: null, loading: true, error: null});

  case types.CAN_WIN_ERROR:
    return updateId({bracket: null, loading: false, error: payload});

  default:
    return state;
  }
};
