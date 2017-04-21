import {identity} from 'lodash';
import {RECORDS, RESULT} from './endpointReducer';

const d = (t) => new Date(t).getTime();

// Return true to bailout on the request
export default (key, selector, parseId = identity) => (state, params, {timeOnly = false} = {}) => {
  const {[RESULT]: result, sse} = state[key][RECORDS][params] || {};

  if (!timeOnly) {
    // If there is no result, always fetch
    if (!result) return false;
    // If the result has successfully hooked up to the live event stream
    // then always bailout since it has the latest
    if (sse === true) return true;
  }

  // Otherwise use the time and the selector's time to determine if the request
  // should be made
  const now = Date.now();
  const open = selector(state, {params: {eventId: parseId(params)}});

  // Normalize to an array so all checks are the same and
  // bailout if the current time is after all of the open times
  return (Array.isArray(open) ? open : [open]).every((o) => {
    // null means we dont know when the event is complete so dont bailout
    if (o === null) return false;
    return now >= d(o);
  });
};
