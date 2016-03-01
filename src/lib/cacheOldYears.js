export default (key) => (state, id) => {
  const {result} = state[key].records[id] || {};
  const year = parseInt((id || '').replace(/\D/g, ''), 10);

  return !!(result && year && year < new Date().getFullYear());
};
