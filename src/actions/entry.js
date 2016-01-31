import * as actions from '../constants/entry';
import {routeActions} from 'redux-simple-router';

export const pushBracket = ({event, location, bracket}) => (dispatch) => {
  dispatch(routeActions.replace({
    ...location,
    pathname: `/${event.id}/${bracket}`
  }));
  dispatch({
    type: actions.PUSH_BRACKET,
    bracket
  });
};

export const updateGame = ({event, location, game, current, update}) => pushBracket({
  event,
  location,
  bracket: update({...game, currentMaster: current})
});

export const generateBracket = ({event, location, method, generate}) => pushBracket({
  event,
  location,
  bracket: generate(method)
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
