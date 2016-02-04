/* global __GA__ */

import ga from 'react-ga';
import bows from 'bows';

let analytics;

if (process.env.NODE_ENV === 'production') {
  ga.initialize(__GA__);
  analytics = ga;
}
else {
  const log = bows('analytics');
  analytics = {
    pageview: log,
    event: log
  };
}

export default analytics;
