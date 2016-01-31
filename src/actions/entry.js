import * as actions from '../constants/entry';
import {routeActions} from 'redux-simple-router';

export const pushBracket = (bracket) => (dispatch, getState) => {
  const {event} = getState();
  dispatch(routeActions.replace({
    pathname: `/${event.id}/${bracket}`
  }));
  dispatch({
    type: actions.PUSH_BRACKET,
    bracket
  });
};

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
