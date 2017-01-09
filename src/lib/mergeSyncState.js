import {SYNC_STATE} from './endpointReducer';

const syncKeys = Object.keys(SYNC_STATE);

export default (...selectors) => (...args) => selectors.reduce((res, selector) => {
  const syncSelector = typeof selector.sync === 'function' ? selector.sync : selector;
  const state = syncSelector(...args);

  syncKeys.forEach((key) => {
    res[key] = res[key] || (state ? state[key] : SYNC_STATE[key]);
  });

  return res;
}, {...SYNC_STATE});
