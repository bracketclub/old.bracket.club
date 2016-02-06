import {apiUrl} from 'config';

const {EventSource} = window;

export default (url, onData) => {
  if (!EventSource) return () => void 0;

  const source = new EventSource(apiUrl + url);
  source.addEventListener(url.split('/')[1], onData, false);

  return () => source.close();
};

