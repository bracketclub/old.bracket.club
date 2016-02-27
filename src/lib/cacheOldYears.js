export default (key, getYear) => (state, id) => {
  const result = state[key].records[id];
  const year = parseInt((getYear ? getYear(id) : id).replace(/\D/g, ''), 10);

  return result && year < new Date().getFullYear();
};
