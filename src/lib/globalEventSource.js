import config from 'config'
import { fetch as fetchMasters } from '../actions/masters'
import { fetch as fetchEntries } from '../actions/entries'
import { fetch as fetchUsers } from '../actions/users'
import * as types from '../constants/sse'
import debugLog from './debugLog'

const { EventSource } = window

export default (dispatch) => {
  if (!EventSource || !config.sse) {
    return () => void 0
  }

  const source = new EventSource(`${config.apiUrl}/event-stream`)
  const log = (...args) => debugLog('[EventSource]', ...args)

  const close = () => {
    log('connection closed')
    dispatch({ type: types.SSE_OFF })
    source.close()
  }

  const channels = {
    entries: (data) => dispatch(fetchEntries(data.event, { refresh: true })),
    masters: (data) => dispatch(fetchMasters(data.event, { refresh: true })),
    users: (data) =>
      dispatch(fetchUsers(`${data.id}/${data.event}`, { refresh: true })),
  }

  Object.keys(channels).forEach((channel) => {
    log(channel, 'adding listener')
    const handler = channels[channel]
    source.addEventListener(
      channel,
      (e) => {
        const data = JSON.parse(e.data)
        log(channel, 'data', data)
        handler(data)
      },
      false
    )
  })

  source.addEventListener('open', () => {
    log('connection open')
    dispatch({ type: types.SSE_ON })
  })

  let totalRetryCount = 0
  source.addEventListener('error', (err) => {
    log('connection error', err)
    dispatch({ type: types.SSE_OFF })

    // SSE reconnects on its own, but if we get too
    // many errors then manually close the connection.
    totalRetryCount++
    // eslint-disable-next-line no-magic-numbers
    if (totalRetryCount > 5) {
      close()
    }
  })

  // This is if the event manually ends which doesn't happen with the
  // current implementation but could happen in the future if the
  // API knew when entries locked and submitted an end event
  source.addEventListener('end', close)

  return close
}
