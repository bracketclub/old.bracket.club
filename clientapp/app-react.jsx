var React = require('react');
var Bracket = require('./react/bracket');
var BracketModel = require('./models/liveBracket');
var bracket = new BracketModel({
    sport: 'ncaa-mens-basketball',
    year: '2014'
});

var render = function () {
    React.render(<Bracket data={bracket} />, document.body);
};

require('domready')(function () {
    render();
    window.bracket = bracket;
    bracket.on('change', function () {
        render();
    });
});

