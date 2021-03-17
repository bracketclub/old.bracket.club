const debugLs =
  typeof window.localStorage !== 'undefined' &&
  window.localStorage.getItem('debug')

const debugLog = (...args) => {
  if (process.env.NODE_ENV !== 'production' || debugLs) {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

export default debugLog
