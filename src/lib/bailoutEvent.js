import {identity} from 'lodash';
import {RECORDS, RESULT} from './endpointReducer';

const d = (t) => new Date(t).getTime();
const isBetween = (now, times) => {
  if (!Array.isArray(times[0])) times = [times];
  return times.some(([start, stop]) => now >= d(start) && now <= d(stop));
};

// Return true to bailout on the request
export default (key, selector, parseId = identity) => (state, params, {checkResult = true} = {}) => {
  const {[RESULT]: result} = state[key][RECORDS][params] || {};

  if (!result && checkResult) return false;

  const now = Date.now();
  const open = selector(state, {params: {eventId: parseId(params)}});

  // It is an array of "open windows" where the first item is the start time
  // and the second item is the stop time. So we bailout only if now
  // is not within any window
  if (Array.isArray(open)) {
    return !isBetween(now, open);
  }

  // Bailout on the request if it is after the open time
  return now >= d(open);
};
