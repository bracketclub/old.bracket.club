import {routeActions} from 'redux-simple-router';
import * as bracketSelectors from '../selectors/bracket';
import * as entrySelectors from '../selectors/entry';
import * as actions from '../constants/entry';

const eventId = (state) => `${state.event.sport}-${state.event.year}`;

// Replace bracket in current url
const replaceBracket = ({bracket, state}) => routeActions.replace({
  pathname: `/${eventId(state)}/${bracket}`
});

// Add new brackets to entry
const routeToBracket = (getBracket) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const bracket = getBracket(state, {location});

  dispatch({
    type: actions.PUSH_BRACKET,
    event: eventId(state),
    bracket
  });
  dispatch(replaceBracket({bracket, state}));
};

export const reset = () => routeToBracket((...args) =>
  bracketSelectors.empty(...args)
);

export const generateBracket = (method) => routeToBracket((...args) =>
  bracketSelectors.generate(...args)(method)
);

export const updateGame = (game) => routeToBracket((...args) => {
  const current = entrySelectors.bracketString(...args);
  const update = bracketSelectors.update(...args);
  return update({...game, currentMaster: current});
});

// Navigate between entry brackets
const routeToIndex = (getIndex) => () => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const {brackets, index: current} = entrySelectors.byEvent(state, {location});
  const total = brackets.length - 1;
  const index = getIndex({current, total});

  let bracket = brackets[index];
  if (index === actions.MIN_INDEX) {
    bracket = bracketSelectors.empty(state, {location});
  }

  dispatch({
    type: actions.GOTO_INDEX,
    event: eventId(state),
    index
  });
  dispatch(replaceBracket({bracket, state}));
};

export const goToFirst = routeToIndex(() => actions.MIN_INDEX);
export const goToLast = routeToIndex(({total}) => total);
export const goToNext = routeToIndex(({total, current}) => Math.min(total, current + 1));
export const goToPrevious = routeToIndex(({current}) => Math.max(actions.MIN_INDEX, current - 1));
