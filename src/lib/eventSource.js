import config from 'config'
import actionNames from 'lib/actionNames'

const { EventSource } = window

export default ({ endpoint, id, dispatch }, onData) => {
  if (!EventSource || !config.sse) return () => void 0

  const actionType = actionNames(endpoint).sse

  const dispatchEvent = (status) =>
    dispatch({
      type: actionType,
      payload: status,
      meta: { id },
    })

  dispatchEvent(true)

  const source = new EventSource(`${config.apiUrl}/${endpoint}/events`)
  const close = () => {
    dispatchEvent(false)
    source.close()
  }

  source.addEventListener(id, (e) => onData(JSON.parse(e.data)), false)
  source.addEventListener('end', close)

  return close
}
