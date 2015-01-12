var test = require('tape');
var Entries = require('../clientapp/collections/entries');
var liveData = require('bracket-data-live/data/ncaa-mens-basketball/2014.json');
var CreateEntries = function () {
    return new Entries(liveData.entries, {
        history: liveData.masters,
        historyIndex: 62,
        sport: 'ncaa-mens-basketball',
        year: '2014'
    });
};

test('Entries', function (t) {
    var entries = CreateEntries();

    t.equal(entries.scores.length, liveData.entries.length);

    t.end();
});