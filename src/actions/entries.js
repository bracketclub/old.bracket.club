import config from 'config'
import restActions from 'lib/reduxApiRestActions'
import bailoutEvent from 'lib/bailoutEvent'
import { replaceQuery, location } from './history'
import { entry as schema } from '../schema'
import * as entriesSelectors from '../selectors/entries'
import * as bracketSelectors from '../selectors/bracket'

const endpoint = 'entries'
const reverse = (dir) => (dir === 'asc' ? 'desc' : 'asc')

const sortAction = (sortBy) => (dispatch, getState) => {
  const state = getState()
  const current = entriesSelectors.sortParams(state, { location: location() })

  // If the sort key is the same as the current sort key then reverse the direction
  // otherwise use the existing sort direction
  const sort = `${sortBy}|${
    current.key === sortBy ? reverse(current.dir) : current.dir
  }`

  dispatch(replaceQuery({ location, query: { sort } }))
}

// No entries after a tournament is locked
const bailout = bailoutEvent(endpoint, bracketSelectors.locks)

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`,
})

export { sortAction as sort }
