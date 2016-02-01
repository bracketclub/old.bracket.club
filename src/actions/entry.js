import {routeActions} from 'redux-simple-router';
import * as bracketSelectors from '../selectors/bracket';
import * as entrySelectors from '../selectors/entry';
import * as actions from '../constants/entry';

const eventId = (state) => `${state.event.sport}-${state.event.year}`;
const MIN = -1;

// Dispatchers
const pushBracket = ({bracket, state}) => ({
  type: actions.PUSH_BRACKET,
  event: eventId(state),
  bracket
});

const goToIndex = ({index, state}) => ({
  type: actions.GOTO_INDEX,
  event: eventId(state),
  index
});

const routeToBracket = ({bracket, state}) => routeActions.replace({
  pathname: `/${eventId(state)}/${bracket}`
});

const pushAndRoute = ({dispatch, bracket, state}) => {
  dispatch(pushBracket({bracket, state}));
  dispatch(routeToBracket({bracket, state}));
};

// Add new brackets to entry
export const reset = () => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const bracket = bracketSelectors.empty(state, {location});

  pushAndRoute({bracket, state, dispatch});
};

export const updateGame = (game) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const current = entrySelectors.bracketString(state, {location});
  const update = bracketSelectors.update(state, {location});
  const bracket = update({...game, currentMaster: current});

  pushAndRoute({bracket, state, dispatch});
};

export const generateBracket = (method) => (dispatch, getState) => {
  const state = getState();
  const {location} = state.routing;
  const generate = bracketSelectors.generate(state, {location});
  const bracket = generate(method);

  pushAndRoute({bracket, state, dispatch});
};

// Navigate between entry brackets
const currentBrackets = (getState) => {
  const state = getState();
  const {location} = state.routing;
  const {brackets, index: currentIndex} = entrySelectors.byEvent(state, {location});

  return {brackets, currentIndex, state};
};

const indexAndRoute = ({dispatch, brackets, index, state}) => {
  let bracket = brackets[index];
  if (index === MIN) {
    bracket = bracketSelectors.empty(state, {location: state.routing.location});
  }

  dispatch(goToIndex({index, state}));
  dispatch(routeToBracket({bracket, state}));
};

export const goToFirst = () => (dispatch, getState) => {
  const {brackets, state} = currentBrackets(getState);
  const index = MIN;

  indexAndRoute({dispatch, brackets, index, state});
};

export const goToLast = () => (dispatch, getState) => {
  const {brackets, state} = currentBrackets(getState);
  const index = brackets.length - 1;

  indexAndRoute({dispatch, brackets, index, state});
};

export const goToNext = () => (dispatch, getState) => {
  const {brackets, currentIndex, state} = currentBrackets(getState);
  const index = Math.min(brackets.length - 1, currentIndex + 1);

  indexAndRoute({dispatch, brackets, index, state});
};

export const goToPrevious = () => (dispatch, getState) => {
  const {brackets, currentIndex, state} = currentBrackets(getState);
  const index = Math.max(MIN, currentIndex - 1);

  indexAndRoute({dispatch, brackets, index, state});
};
