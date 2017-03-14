import {RECORDS, RESULT} from './endpointReducer';

const d = (t) => new Date(t).getTime();

// Return true to bailout on the request
export default (key, selector, parseId = null) => (state, id) => {
  const eventId = (id && parseId) ? parseId(id) : id;
  const {[RESULT]: result} = state[key][RECORDS][id] || {};

  if (!result) return false;

  const now = Date.now();
  const cache = selector(state, {params: {eventId}});

  // It is an array of "open windows" where the first item is the start time
  // and the second item is the stop time. So we bailout only if now
  // is not within any window
  if (Array.isArray(cache)) {
    return !cache.some(([start, stop]) => now >= d(start) && now <= d(stop));
  }

  // Bailout on the request if it is after the cache time
  return now >= d(cache);
};
