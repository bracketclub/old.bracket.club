import {RECORDS, RESULT} from './endpointReducer';

export default (key, selector, parseId = null) => (state, id) => {
  const eventId = (id && parseId) ? parseId(id) : id;
  const {[RESULT]: result} = state[key][RECORDS][id] || {};

  if (!result) return false;

  // Bailout on the request if the cache time is before right now
  const cache = selector(state, {params: {eventId}});
  const times = (Array.isArray(cache) ? cache : [cache]).map((t) => new Date(t).getTime());
  const now = Date.now();

  return Math.max(...times) <= now;
};
