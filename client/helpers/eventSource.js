'use strict';

const log = require('bows')('eventSource');
const hasEventSource = !!window.EventSource;
const {apiUrl} = require('../global');

module.exports = (url, eventName, onData) => {
  if (hasEventSource) {
    const source = new window.EventSource(apiUrl + url);
    source.addEventListener(eventName, (e) => onData(JSON.parse(e.data)), false);
    source.addEventListener('open', (e) => log(url, 'open', e), false);
    source.addEventListener('error', (e) => log(url, 'error', e), false);
  }
  else {
    log(`No event source. Cant connect to ${url}`);
  }
};

