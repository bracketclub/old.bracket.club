/* globals ga */
var log = require('./andlog');

module.exports = {
    pageview: function (path) {
        ga('send', 'pageview', path);
        log.log('TRACK', 'pageview', path);
    },
    pick: function (pick) {
        ga('send', 'event', 'pick', 'click', pick);
        log.log('TRACK', 'pick', pick);
    },
    bracketNavigation: function (label) {
        ga('send', 'event', 'bracket-navigate', 'click', label);
        log.log('TRACK', 'bracket-navigate', label);
    },
    enterBracket: function (brackt) {
        ga('send', 'event', 'bracket-enter', 'click', brackt);
        log.log('TRACK', 'bracket-enter', brackt);
    }
};