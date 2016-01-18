import * as actions from '../constants/entry';

export const updateGame = ({game, current, update}) => ({
  type: actions.PUSH_BRACKET,
  bracket: update({...game, currentMaster: current})
});

export const generateBracket = ({method, generate}) => ({
  type: actions.PUSH_BRACKET,
  bracket: generate(method)
});

export const reset = (emptyBracket) => ({
  type: actions.PUSH_BRACKET,
  bracket: emptyBracket
});

export const goToFirst = () => ({
  type: actions.GOTO_FIRST
});

export const goToLast = () => ({
  type: actions.GOTO_LAST
});

export const goToNext = () => ({
  type: actions.GOTO_NEXT
});

export const goToPrevious = () => ({
  type: actions.GOTO_PREVIOUS
});
