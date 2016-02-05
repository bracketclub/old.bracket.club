/* global __GA__ */

import ga from 'react-ga';
import bows from 'bows';
import {eventId} from '../selectors/event';

let analytics;

if (process.env.NODE_ENV === 'production') {
  ga.initialize(__GA__);
  analytics = ga;
}
else {
  const log = bows('analytics');
  analytics = {pageview: log, event: log};
}

export default {
  pageview: ({pathname, search}) => analytics.pageview(pathname + search),
  event: ({state, event, category, action, labels = [], label = ''}) => {
    const id = (event ? event.id : event) || eventId(Array.isArray(state) ? state[0] : state);
    const displayLabel = label || (Array.isArray(labels) ? labels.join('|') : labels);
    analytics.event({
      category,
      action,
      label: `${id}${displayLabel ? `|${displayLabel}` : ''}`
    });
  }
};
