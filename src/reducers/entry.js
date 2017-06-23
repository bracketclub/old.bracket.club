import concatOrInsert from 'lib/arrayConcatOrInsert';
import * as types from '../constants/entry';

const initialState = {};
const baseEventEntry = {index: types.MIN_INDEX, brackets: []};

export default (state = initialState, action) => {
  const id = action.event;
  const event = state[id] || baseEventEntry;

  const updateEvent = (newEvent) => ({...state, [id]: {...event, ...newEvent}});
  const updateBrackets = (brackets) => updateEvent({
    brackets,
    index: brackets.length - 1
  });

  switch (action.type) {
  case types.PUSH_BRACKET:
    return updateBrackets(concatOrInsert({
      values: event.brackets,
      index: event.index
    }, action.bracket));

  case types.GOTO_INDEX:
    return updateEvent({index: action.index});

  default:
    return state;
  }
};
