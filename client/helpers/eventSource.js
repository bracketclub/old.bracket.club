let hasEventSource = !!window.EventSource;
let {apiUrl} = require('../global');


module.exports = (url, onData) => {
    if (hasEventSource) {
        let source = new window.EventSource(apiUrl + url);
        source.addEventListener('entries', (e) => {
            let data = JSON.parse(e.data);
            console.log('SSE', url, data);
            onData(data);
        }, false);
    } else {
        console.warn('No event source. Cant connect to ' + url);
    }
};

