'use strict';

/* globals ga */


module.exports = {
    pageview (path) {
        ga('send', 'pageview', path);
    },
    enterBracket (bracket) {
        ga('send', 'event', 'bracket-enter', 'click', bracket);
    }
};
