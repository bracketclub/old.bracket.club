'use strict';

let Alt = require('alt');


module.exports = new Alt();

// Require each store so that they can be
// instantiated before we bootstrap the window data.
require('./stores/bracketEntryStore');
require('./stores/entryStore');
require('./stores/globalDataStore');
require('./stores/masterStore');
require('./stores/meStore');
