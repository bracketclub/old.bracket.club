import config from 'config'
import { fetch as fetchMasters } from '../actions/masters'
import { fetch as fetchEntries } from '../actions/entries'
import { fetch as fetchUsers } from '../actions/users'
import * as types from '../constants/sse'
import debugLog from './debugLog'

const { EventSource } = window

export default (dispatch, getState) => {
  if (!EventSource || !config.sse) {
    return () => void 0
  }

  dispatch({ type: types.SSE_ON })

  const source = new EventSource(`${config.apiUrl}/event-stream`)
  const log = (...args) => debugLog('[EventSource]', ...args)

  const close = () => {
    log('closing listener')
    dispatch({ type: types.SSE_OFF })
    source.close()
  }

  const events = {
    entries: fetchEntries,
    masters: fetchMasters,
    users: fetchUsers,
  }

  Object.keys(events).forEach((event) => {
    log(event, 'adding listener')
    source.addEventListener(
      event,
      (e) => {
        const data = JSON.parse(e.data)
        log(event, 'data', data)
        dispatch(events[event](data.id, { refresh: true }))
      },
      false
    )
  })

  source.addEventListener('end', close)

  return close
}
