import {replace} from 'react-router-redux';

import analytics from 'lib/analytics';
import * as bracketSelectors from '../selectors/bracket';
import * as entrySelectors from '../selectors/entry';
import {eventId} from '../selectors/event';
import * as actions from '../constants/entry';

const analyticsEvent = (state, action, ...labels) => analytics.event({
  category: 'Entry',
  state,
  action,
  labels
});

// Helper to so actions can be called with just a bracket in which case it will
// use the thunk middleware to get the event from getState,
// or state can be passed in directly
const eventAction = (action) => (bracket, state) => state
  ? action(bracket, state)
  : (dispatch, getState) => dispatch(action(bracket, getState()));

// Replace bracket in current url
export const updatePath = eventAction((bracket, state) => replace({
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
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const bracket = getBracket(state, {location});

  dispatch(pushBracket(bracket, state));
  dispatch(updatePath(bracket, state));
};

export const reset = () => routeToBracket((...args) => {
  analyticsEvent(args, 'reset');
  return bracketSelectors.empty(...args);
});

export const generate = (method) => routeToBracket((...args) => {
  analyticsEvent(args, 'generate', method);
  return bracketSelectors.generate(...args)(method);
});

export const update = (game) => routeToBracket((...args) => {
  analyticsEvent(args, 'update', game.fromRegion, game.winner.seed);
  const current = entrySelectors.bracketString(...args);
  return bracketSelectors.update(...args)({...game, currentMaster: current});
});

// Navigate between entry brackets
const routeToIndex = (getIndex, label) => () => (dispatch, getState) => {
  const state = getState();
  const location = state.routing.location || state.routing.locationBeforeTransitions;
  const {brackets, index: current} = entrySelectors.byEvent(state, {location});
  const total = brackets.length - 1;
  const index = getIndex({current, total});
  const bracket = brackets[index];

  analyticsEvent(state, 'navigate', label);
  dispatch({type: actions.GOTO_INDEX, event: eventId(state), index});
  dispatch(updatePath(bracket, state));
};

const navigationActions = {
  goToFirst: routeToIndex(() => actions.MIN_INDEX, 'goToFirst'),
  goToLast: routeToIndex(({total}) => total, 'goToLast'),
  goToNext: routeToIndex(({total, current}) => Math.min(total, current + 1), 'goToNext'),
  goToPrevious: routeToIndex(({current}) => Math.max(actions.MIN_INDEX, current - 1), 'goToPrevious')
};

export const navigate = (method) => navigationActions[method]();
