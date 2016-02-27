export default (...selectors) => (...args) => selectors.reduce((res, selector) => {
  const state = selector.sync(...args);
  res.syncing = res.syncing || state.syncing;
  res.fetchError = res.fetchError || state.fetchError;
  return res;
}, {syncing: false, fetchError: null});
