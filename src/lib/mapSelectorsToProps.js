export default (selectors) => (...args) => Object.keys(selectors).reduce((res, key) => {
  res[key] = selectors[key](...args);
  return res;
}, {});
