/* globals Global, __timestamp */
var BracketData = require('bracket-data');
var extend = require('lodash/object/assign');
var hasWindow = typeof window !== 'undefined';

// Allow mocking of global data when testing in node
var bootstrapData = (hasWindow ? window : Global).bootstrap;


// Export app singleton
module.exports = {
    lastUpdated: __timestamp,
    sportYear: bootstrapData.sportYear,
    data: new BracketData(extend({props: 'all'}, bootstrapData.sportYear)),
    masters: bootstrapData.masters,
    entries: bootstrapData.entriesByName
};

if (hasWindow && window.location.host.split('.')[0].split(':')[0] === 'localhost') {
    // Play around with app in the local console
    window.app = module.exports;
}
