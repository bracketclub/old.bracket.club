var test = require('tape');
var _ = require('underscore');
var liveData = require('bracket-data-live/data/ncaa-mens-basketball/2014.json');
var LockedBracket = require('../clientapp/models/lockedBracket');
var User = require('../clientapp/models/user');
var GenerateBracket = function () {
    return new LockedBracket({
        bracket: _.findWhere(liveData.entries, {username: 'lukekarrys'}).bracket,
        history: liveData.masters,
        historyIndex: 62,
        sport: 'ncaa-mens-basketball',
        year: '2014'
    });
};
var GenerateUser = function () {
    return new User(_.extend(_.findWhere(liveData.entries, {username: 'lukekarrys'}), {
        history: liveData.masters,
        historyIndex: 62,
        sport: 'ncaa-mens-basketball',
        year: '2014'
    }));
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

test('Can be initialized via a user', function (t) {
    var user = GenerateUser();

    t.equal(user.bracket.canRewind, true, 'cannot rewind');
    t.equal(user.bracket.canFastForward, false, 'cannot fast forward');
    t.equal(user.bracket.hasHistory, true, 'does not have history');
    t.equal(user.bracket.current, _.last(liveData.masters), 'current gets set as empty');
    t.equal(user.bracket.hasStarted, true, 'has not started');
    t.equal(user.bracket.needsEmptyBase, false, 'does not need empty base');
    t.equal(user.bracket.standard, 610);

    user.bracket.getPrevious(7);
    t.equal(user.bracket.standard, 530);

    user.bracket.getFirst();
    t.equal(user.bracket.standard, 0);

    t.end();
});