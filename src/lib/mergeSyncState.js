export default (...selectors) => (...args) => selectors.reduce((res, selector) => {
  const state = (typeof selector.sync === 'function' ? selector.sync : selector)(...args);
  res.syncing = res.syncing || (state ? state.syncing : false);
  res.fetchError = res.fetchError || (state ? state.fetchError : false);
  return res;
}, {syncing: false, fetchError: null});
