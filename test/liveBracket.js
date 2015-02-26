var test = require('tape');
var _ = require('lodash');
var LiveBracket = require('../clientapp/models/bracket');
var GenerateLiveBracket = function () {
    return new LiveBracket({
        sport: 'ncaa-mens-basketball',
        year: '2014'
    });
};

test('Change from lower to higher', function (t) {
    t.plan(5);

    var bracket = GenerateLiveBracket();
    bracket.generate('lower');

    var onChange = function (id, model, region) {
        t.equal(region.id, id);
    };

    bracket.on('change:region1', _.partial(onChange, 'S'));
    bracket.on('change:region2', _.partial(onChange, 'E'));
    bracket.on('change:region3', _.partial(onChange, 'W'));
    bracket.on('change:region4', _.partial(onChange, 'MW'));
    bracket.on('change:regionFinal', _.partial(onChange, 'FF'));

    bracket.generate('higher');
});