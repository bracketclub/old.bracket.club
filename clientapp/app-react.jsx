var React = require('react');
var Bracket = require('./react/bracket');
var BracketModel = require('./models/bracket');
var bracket = new BracketModel({
    sport: 'ncaa-mens-basketball',
    year: '2014',
    current: 'MW1812463721X3XXXXW191213614102XX6XXXXS1854113715X4XXXXXE191246372XXXXXXXFFXXX'
});

var render = function () {
    React.render(<Bracket data={bracket} />, document.body);
};

require('domready')(function () {
    render();
    window.bracket = bracket;
    bracket.on('change', function () {
        render();
    })
});

