const {EventSource} = window;

export default ({url, event}, onData) => {
  if (!EventSource) return () => void 0;

  const source = new EventSource(url);
  source.addEventListener(event, (e) => onData(JSON.parse(e.data)), false);
  source.addEventListener('end', () => source.close());

  return () => source.close();
};
