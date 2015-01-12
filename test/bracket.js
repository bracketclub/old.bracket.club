var test = require('tape');
var Bracket = require('../clientapp/models/bracket');
var GenerateTestBracket = function () {
    return new Bracket({
        sport: 'ncaa-mens-basketball',
        year: '2014',
        current: 'MW1812463721X3XXXXW191213614102XX6XXXXS1854113715X4XXXXXE191246372XXXXXXXFFXXX'
    });
};

test('Has progress and completion and can update game', function (t) {
    var bracket = GenerateTestBracket();

    t.equal(bracket.hasStarted, true, 'has begun being picked');
    t.equal(bracket.complete, false, 'is not complete');
    t.equal(bracket.progressNow, 36, 'has total picks mafe');
    t.equal(bracket.progressTotal, 63, 'has correct total picks');
    t.equal(bracket.progressPercent.toFixed(2), '57.14', 'has correct pick percentage');

    bracket.updateGame({
        winner: 12,
        loser: 4,
        fromRegion: 'MW'
    });

    t.equal(bracket.progressNow, 37, 'has correct total picks after update');
    t.equal(bracket.progressPercent.toFixed(2), '58.73', 'has correct pick percentage after update');

    t.end();
});

test('Regions will update', function (t) {
    t.plan(1);

    var bracket = GenerateTestBracket();
    var onChange = function (model, region) {
        t.equal(region.id, 'E');
    };

    bracket.on('change:regionE', onChange);
    bracket.on('change:regionS', onChange);
    bracket.on('change:regionMW', onChange);
    bracket.on('change:regionW', onChange);
    bracket.on('change:regionFF', onChange);

    bracket.updateGame({
        winner: 9,
        loser: 1,
        fromRegion: 'E'
    });
});
