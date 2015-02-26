var test = require('tape');
var _ = require('lodash');
var BracketData = require('bracket-data');
var bd = new BracketData({
    props: ['constants'],
    sport: 'ncaa-mens-basketball',
    year: '2014'
});
var HistoryBracket = require('../clientapp/models/bracket');
var GenerateHistoryBracket = function (options) {
    return new HistoryBracket(_.extend({
        sport: 'ncaa-mens-basketball',
        year: '2014'
    }, options));
};

test('Initializes properly', function (t) {
    var bracket = GenerateHistoryBracket();

    t.equal(bracket.canRewind, false, 'cannot rewind');
    t.equal(bracket.canFastForward, false, 'cannot fast forward');
    t.equal(bracket.hasHistory, false, 'does not have history');
    t.equal(bracket.current, bd.constants.EMPTY, 'current gets set as empty');
    t.equal(bracket.hasStarted, false, 'has not started');
    t.equal(bracket.needsEmptyBase, false, 'does not need empty base');

    t.end();
});

test('Receives empty base if initialized with non-empty history', function (t) {
    var onePick = 'SXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXXWXXXXXXXXXXXXXXXMW1XXXXXXXXXXXXXXFFXXX';
    var bracket = GenerateHistoryBracket({
        history: [onePick]
    });

    t.equal(bracket.canRewind, true, 'can rewind');
    t.equal(bracket.canFastForward, false, 'cannot fast forward');
    t.equal(bracket.hasHistory, true, 'has history');
    t.equal(bracket.current, onePick, 'current has one pick');
    t.equal(bracket.hasStarted, true, 'has started');
    t.equal(bracket.needsEmptyBase, false, 'does not need empty base');
    t.equal(bracket.historyIndex, 1, 'index is 1');

    bracket.getPrevious();
    t.equal(bracket.current, bd.constants.EMPTY, 'previous bracket is empty');
    t.equal(bracket.historyIndex, 0, 'index is 0');

    t.end();
});

test('History bracket initialized properly', function (t) {
    var bracket = GenerateHistoryBracket();

    bracket.updateGame({
        winner: 1,
        loser: 16,
        fromRegion: 'MW'
    });

    t.equal(bracket.canRewind, true);
    t.equal(bracket.canFastForward, false);
    t.equal(bracket.hasHistory, true);
    t.equal(bracket.current, 'SXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXXWXXXXXXXXXXXXXXXMW1XXXXXXXXXXXXXXFFXXX');
    t.equal(bracket.hasStarted, true);

    bracket.updateGame({
        winner: 15,
        loser: 2,
        fromRegion: 'MW'
    });

    t.equal(bracket.canRewind, true);
    t.equal(bracket.canFastForward, false);
    t.equal(bracket.hasHistory, true);
    t.equal(bracket.current, 'SXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXXWXXXXXXXXXXXXXXXMW1XXXXXX15XXXXXXXFFXXX');
    t.equal(bracket.hasStarted, true);

    bracket.getPrevious();

    t.equal(bracket.canRewind, true);
    t.equal(bracket.canFastForward, true);
    t.equal(bracket.hasHistory, true);
    t.equal(bracket.current, 'SXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXXWXXXXXXXXXXXXXXXMW1XXXXXXXXXXXXXXFFXXX');
    t.equal(bracket.hasStarted, true);

    t.end();
});