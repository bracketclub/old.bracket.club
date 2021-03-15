import config from 'config'
import actionNames from 'lib/actionNames'

const { EventSource } = window

const debugLs =
  typeof window.localStorage !== 'undefined' &&
  window.localStorage.getItem('debug')
const debugLog = (...args) => {
  if (process.env.NODE_ENV !== 'production' || debugLs) {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

export default ({ endpoint, id, dispatch }, onData) => {
  if (!EventSource || !config.sse) return () => void 0

  const actionType = actionNames(endpoint).sse

  const log = (...args) => debugLog(`[EventSource] ${endpoint} ${id}`, ...args)

  const dispatchEvent = (status) =>
    dispatch({
      type: actionType,
      payload: status,
      meta: { id },
    })

  dispatchEvent(true)

  const source = new EventSource(`${config.apiUrl}/${endpoint}/events`)
  const close = () => {
    log(`closing listener`)
    dispatchEvent(false)
    source.close()
  }

  log(`adding listener`)
  source.addEventListener(
    id,
    (e) => {
      const data = JSON.parse(e.data)
      log(`data`, data)
      onData(data)
    },
    false
  )
  source.addEventListener('end', close)

  return close
}
