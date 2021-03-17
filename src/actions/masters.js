import config from 'config'
import restActions from 'lib/reduxApiRestActions'
import bailoutEvent from 'lib/bailoutEvent'
import { replaceQuery, location } from './history'
import { master as schema } from '../schema'
import * as mastersSelectors from '../selectors/masters'
import * as bracketSelectors from '../selectors/bracket'

const endpoint = 'masters'

const routeToIndex = (getIndex, label) => () => (dispatch, getState) => {
  const state = getState()
  const current = mastersSelectors.index(state, { location: location() })
  const lastIndex = mastersSelectors.lastIndex(state, { location: location() })
  const game = getIndex({ current, total: lastIndex })

  dispatch(replaceQuery({ location, query: { game } }))
}

const navigationActions = {
  goToFirst: routeToIndex(() => 0, 'goToFirst'),
  goToPrevious: routeToIndex(
    ({ current }) => Math.max(0, current - 1),
    'goToPrevious'
  ),
  goToNext: routeToIndex(
    ({ current, total }) => Math.min(total, current + 1),
    'goToNext'
  ),
  goToLast: routeToIndex(({ total }) => total, 'goToLast'),
}

// Masters will never update after a tournament has completed
const bailout = bailoutEvent(endpoint, bracketSelectors.completeDate)

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`,
})

export const navigate = (method) => navigationActions[method]()
