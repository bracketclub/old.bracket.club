var test = require('tape');
var _ = require('underscore');
var LiveBracket = require('../clientapp/models/liveBracket');
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

    bracket.on('change:regionE', _.partial(onChange, 'E'));
    bracket.on('change:regionS', _.partial(onChange, 'S'));
    bracket.on('change:regionMW', _.partial(onChange, 'MW'));
    bracket.on('change:regionW', _.partial(onChange, 'W'));
    bracket.on('change:regionFF', _.partial(onChange, 'FF'));

    bracket.generate('higher');
});