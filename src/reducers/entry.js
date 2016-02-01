import concatOrInsert from '../lib/arrayConcatOrInsert';
import * as types from '../constants/entry';

const initialState = {
  __DEFAULT__: {index: 0, brackets: []}
};

export default (state = initialState, action) => {
  const id = action.event || '__DEFAULT__';
  const {index = 0, brackets = []} = state[id] || {};

  const updateState = (newState) => ({
    ...state,
    [id]: {index, brackets, ...newState}
  });

  switch (action.type) {

  case types.PUSH_BRACKET:
    const newBrackets = concatOrInsert(brackets, action.bracket, index + 1);
    return updateState({
      index: newBrackets.length - 1,
      brackets: newBrackets
    });

  case types.GOTO_INDEX:
    return updateState({
      index: action.index
    });

  default:
    return state;
  }
};
