export default (...syncStates) => syncStates.reduce((result, state = {}) => {
  result.syncing = result.syncing || state.syncing;
  result.lastError = result.lastError || state.lastError;
  return result;
}, {syncing: false, lastError: null});
