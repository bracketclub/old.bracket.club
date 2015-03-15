/* globals ga */


module.exports = {
    pageview: function (path) {
        ga('send', 'pageview', path);
    },
    enterBracket: function (bracket) {
        ga('send', 'event', 'bracket-enter', 'click', bracket);
    }
};
