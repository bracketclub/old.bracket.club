/* global console */
module.exports = {
  log: console.log.bind(console, 'LOG:'),
  info: console.info.bind(console, 'INFO:'),
  debug: console.log.bind(console, 'DEBUG:'),
  warn: console.warn.bind(console, 'WARN:'),
  error: console.error.bind(console, 'ERROR:')
};
