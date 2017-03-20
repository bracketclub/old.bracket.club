import * as types from '../constants/canWin';

const initialState = {};

export default (state = initialState, action) => {
  const {payload, meta, type} = action;

  const updateId = (data) => {
    const key = `${meta.event}-${meta.index}-${meta.list}`;
    return {
      ...state,
      [key]: {
        ...state[key],
        [meta.id]: data
      }
    };
  };

  switch (type) {

  case types.CAN_WIN_SUCCESS:
    return updateId({bracket: payload.bracket, loading: false, error: null});

  case types.CAN_WIN_FAILURE:
    return updateId({bracket: null, loading: false, error: null});

  case types.CAN_WIN_START:
    return updateId({bracket: null, loading: true, error: null});

  case types.CAN_WIN_ERROR:
    return updateId({bracket: null, loading: false, error: payload});

  default:
    return state;
  }
};
