import actionNames from 'action-names'

export default (type) => ({
  ...actionNames(type),
  sse: `${type.toUpperCase()}_SSE`,
})
