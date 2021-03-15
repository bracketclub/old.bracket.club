import { pick } from 'lodash'
import { SYNC_STATE, RECORDS, RESULT, ENTITIES } from 'lib/endpointReducer'

const syncKeys = Object.keys(SYNC_STATE)

const getSlice = (slice, key) => (...args) => {
  const selected = slice(...args) || {}
  return {
    visible: (selected[RECORDS] || {})[key(...args)],
    all: selected[ENTITIES] || {},
  }
}

const getVisible = (defaultValue) => (slice, key) => (...args) => {
  const { visible, all } = getSlice(slice, key)(...args)
  const result = visible && visible[RESULT]

  if (!result) return defaultValue

  return Array.isArray(result) ? result.map((id) => all[id]) : all[result]
}

export const byId = getVisible({})
export const list = getVisible([])

export const sync = (slice, key) => (...args) => {
  const { visible } = getSlice(slice, key)(...args)
  return pick(visible || {}, ...syncKeys)
}
