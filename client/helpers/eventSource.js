'use strict';

let log = require('bows')('eventSource');
let hasEventSource = !!window.EventSource;
let {apiUrl} = require('../global');


module.exports = (url, eventName, onData) => {
    if (hasEventSource) {
        let source = new window.EventSource(apiUrl + url);
        source.addEventListener(eventName, (e) => onData(JSON.parse(e.data)), false);
        // source.addEventListener('open', (e) => console.log('SSE', url, 'open', e), false);
        // source.addEventListener('error', (e) => console.log('SSE', url, 'error', e), false);
    }
    else {
        log('No event source. Cant connect to ' + url);
    }
};

