import bows from 'bows';
import {apiUrl} from 'config';

const log = bows('eventSource');
const hasEventSource = !!window.EventSource;

export default (url, eventName, onData) => {
  if (!hasEventSource) {
    log(`No event source. Cannot connect to ${url}`);
    return () => void 0;
  }

  const source = new window.EventSource(apiUrl + url);
  source.addEventListener(eventName, (e) => onData(JSON.parse(e.data)), false);
  source.addEventListener('open', (e) => log(url, 'open', e), false);
  source.addEventListener('error', (e) => log(url, 'error', e), false);
  return () => source.close();
};

