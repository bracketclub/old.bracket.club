export default (key, selector, parseId = null) => (state, id) => {
  const eventId = (id && parseId) ? parseId(id) : id;
  const {result} = state[key].records[id] || {};

  if (!result || !eventId) return false;

  // Bailout on the request if the cache time is before right now
  const cache = selector(state, {params: {eventId}});
  return new Date(cache).getTime() <= Date.now();
};
