const getSyncFromState = (state) =>
  typeof state.sync !== 'undefined' ? state.sync : state;

export default (...syncStates) => syncStates.reduce((result, state) => {
  result.syncing = result.syncing || getSyncFromState(state).syncing;
  result.lastError = result.lastError || getSyncFromState(state).lastError;
  return result;
}, {syncing: false, lastError: null});
