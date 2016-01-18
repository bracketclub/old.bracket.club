import concatOrInsert from '../lib/arrayConcatOrInsert';
import * as types from '../constants/entry';
import eventSelector from '../selectors/event';

// This reducer only updates the index of masters since that depends
// on the rest of the state tree. The specifc dependent bits have been
// implemented in the selectors for masters
export default (state, action) => {
  const {entry} = state;
  const {id} = eventSelector(state);
  const {index = -1, brackets = []} = entry[id] || {};

  const updateState = (newState) => ({
    ...state,
    entry: {
      ...entry,
      [id]: {
        index,
        brackets,
        ...newState
      }
    }
  });

  switch (action.type) {

  case types.PUSH_BRACKET:
    // concatOrInsert will insert a bracket at the current index and remove
    // everything after that index if necessary. The purpose is to allow the user
    // to go back through their entry, and then make a different pick which will
    // reset any "next" brackets in their stack
    const bracketsWithGame = concatOrInsert(brackets, action.bracket, index + 1);
    return updateState({
      index: bracketsWithGame.length - 1,
      brackets: bracketsWithGame
    });

  case types.GOTO_FIRST:
    return updateState({
      index: -1
    });

  case types.GOTO_LAST:
    return updateState({
      index: brackets.length - 1
    });

  case types.GOTO_NEXT:
    return updateState({
      index: Math.min(index + 1, brackets.length - 1)
    });

  case types.GOTO_PREVIOUS:
    return updateState({
      index: Math.max(-1, index - 1)
    });

  default:
    return state;
  }
};
