var test = require('tape');
var _ = require('lodash');
var liveData = require('bracket-data-live/data/ncaa-mens-basketball/2014.json');
var LockedBracket = require('../clientapp/models/lockedBracket');
var GenerateBracket = function () {
    return new LockedBracket({
        entry: _.findWhere(liveData.entries, {username: 'lukekarrys'}).bracket,
        history: liveData.masters,
        historyIndex: 62,
        sport: 'ncaa-mens-basketball',
        year: '2014'
    });
};

test('Initialize at end of tournament', function (t) {
    var bracket = GenerateBracket();

    t.equal(bracket.canRewind, true, 'cannot rewind');
    t.equal(bracket.canFastForward, false, 'cannot fast forward');
    t.equal(bracket.hasHistory, true, 'does not have history');
    t.equal(bracket.current, _.last(liveData.masters), 'current gets set as empty');
    t.equal(bracket.hasStarted, true, 'has not started');
    t.equal(bracket.needsEmptyBase, false, 'does not need empty base');
    t.equal(bracket.standard, 610);

    bracket.getPrevious(7);
    t.equal(bracket.standard, 530);

    bracket.getFirst();
    t.equal(bracket.standard, 0);

    t.end();
});
