import * as actions from '../constants/entry';

export const pushBracket = (bracket) => ({
  type: actions.PUSH_BRACKET,
  bracket
});

export const updateGame = ({game, current, update}) => pushBracket(
  update({...game, currentMaster: current})
);

export const generateBracket = ({method, generate}) => pushBracket(
  generate(method)
);

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
