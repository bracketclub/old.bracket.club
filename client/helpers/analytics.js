let ga = window.ga;

if (window.location.hostname === 'localhost') {
    ga = console.log.bind(console);
}


module.exports = {
    pageview: function (path) {
        ga('send', 'pageview', path);
    },
    enterBracket: function (bracket) {
        ga('send', 'event', 'bracket-enter', 'click', bracket);
    }
};
