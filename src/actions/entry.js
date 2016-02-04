import {routeActions} from 'react-router-redux';

import * as bracketSelectors from '../selectors/bracket';
import * as entrySelectors from '../selectors/entry';
import * as actions from '../constants/entry';

const eventId = (state) => `${state.event.sport}-${state.event.year}`;

// Helper to so actions can be called with just a bracket in which case it will
// use the thunk middleware to get the event from getState,
// or state can be passed in directly
const eventAction = (action) => (bracket, state) => state
  ? action(bracket, state)
  : (dispatch, getState) => dispatch(action(bracket, getState()));

// Replace bracket in current url
export const updatePath = eventAction((bracket, state) => routeActions.replace({
  pathname: `/${eventId(state)}${bracket ? `/${bracket}` : ''}`
}));

// Push a bracket onto the stack of entries
export const pushBracket = eventAction((bracket, state) => ({
  type: actions.PUSH_BRACKET,
  event: eventId(state),
  bracket
}));

// Add new brackets to entry and change the url
const routeToBracket = (getBracket) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const bracket = getBracket(state, {location});

  dispatch(pushBracket(bracket, state));
  dispatch(updatePath(bracket, state));
};

export const reset = () => routeToBracket((...args) =>
  bracketSelectors.empty(...args)
);

export const generate = (method) => routeToBracket((...args) =>
  bracketSelectors.generate(...args)(method)
);

export const update = (game) => routeToBracket((...args) => {
  const current = entrySelectors.bracketString(...args);
  return bracketSelectors.update(...args)({...game, currentMaster: current});
});

// Navigate between entry brackets
const routeToIndex = (getIndex) => () => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const {brackets, index: current} = entrySelectors.byEvent(state, {location});
  const total = brackets.length - 1;
  const index = getIndex({current, total});
  const bracket = brackets[index];

  dispatch({type: actions.GOTO_INDEX, event: eventId(state), index});
  dispatch(updatePath(bracket, state));
};

const navigationActions = {
  goToFirst: routeToIndex(() => actions.MIN_INDEX),
  goToLast: routeToIndex(({total}) => total),
  goToNext: routeToIndex(({total, current}) => Math.min(total, current + 1)),
  goToPrevious: routeToIndex(({current}) => Math.max(actions.MIN_INDEX, current - 1))
};

export const navigate = (method) => navigationActions[method]();
