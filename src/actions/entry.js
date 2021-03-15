import { replace, location } from './history'
import * as bracketSelectors from '../selectors/bracket'
import * as entrySelectors from '../selectors/entry'
import * as eventSelectors from '../selectors/event'
import * as actions from '../constants/entry'

// Helper to so actions can be called with just a bracket in which case it will
// use the thunk middleware to get the event from getState,
// or state can be passed in directly
const eventAction = (action) => (bracket, state) =>
  state
    ? action(bracket, state)
    : (dispatch, getState) => dispatch(action(bracket, getState()))

// Replace bracket in current url
export const updatePath = eventAction((bracket, state) =>
  replace({
    // TODO: props for event id?
    pathname: `/${eventSelectors.id(state)}${bracket ? `/${bracket}` : ''}`,
  })
)

// Push a bracket onto the stack of entries
export const pushBracket = eventAction((bracket, state) => ({
  type: actions.PUSH_BRACKET,
  // TODO: props
  event: eventSelectors.id(state),
  bracket,
}))

// Add new brackets to entry and change the url
const routeToBracket = (getBracket, path = true) => (dispatch, getState) => {
  const state = getState()
  const bracket = getBracket(state, { location: location() })

  dispatch(pushBracket(bracket, state))
  if (path) dispatch(updatePath(bracket, state))
}

export const reset = () =>
  routeToBracket((...args) => bracketSelectors.empty(...args))

export const generate = (method) =>
  routeToBracket((...args) => bracketSelectors.generate(...args)(method))

export const update = (game, path) =>
  routeToBracket((...args) => {
    const current = entrySelectors.bracketString(...args)

    try {
      return bracketSelectors.update(...args)({
        ...game,
        currentMaster: current,
      })
    } catch (e) {
      // Updater has an error when selecting a team that has already
      // been selected in a round when they have no opponent in the
      // next round yet. This should be fixed in the updater
      // but for now just make it a no-op on the bracket. TODO: 03-14-2021
      return current
    }
  }, path)

// Navigate between entry brackets
const routeToIndex = (getIndex, label) => () => (dispatch, getState) => {
  const state = getState()
  const { brackets, index: current } = entrySelectors.byEvent(state, {
    location: location(),
  })
  const total = brackets.length - 1
  const index = getIndex({ current, total })
  const bracket = brackets[index]

  // TODO: props
  dispatch({
    type: actions.GOTO_INDEX,
    event: eventSelectors.id(state),
    index,
  })
  dispatch(updatePath(bracket, state))
}

const navigationActions = {
  goToFirst: routeToIndex(() => actions.MIN_INDEX, 'goToFirst'),
  goToLast: routeToIndex(({ total }) => total, 'goToLast'),
  goToNext: routeToIndex(
    ({ total, current }) => Math.min(total, current + 1),
    'goToNext'
  ),
  goToPrevious: routeToIndex(
    ({ current }) => Math.max(actions.MIN_INDEX, current - 1),
    'goToPrevious'
  ),
}

export const navigate = (method) => navigationActions[method]()
