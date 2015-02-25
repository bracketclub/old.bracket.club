// var test = require('tape');
// var Entries = require('../clientapp/collections/entries');
// var liveData = require('bracket-data-live/data/ncaa-mens-basketball/2014.json');
// var CreateEntries = function () {
//     return new Entries(liveData.entries, {
//         history: liveData.masters,
//         historyIndex: 62,
//         sport: 'ncaa-mens-basketball',
//         year: '2014'
//     });
// };

// test('Entries', function (t) {
//     var entries = CreateEntries();

//     t.equal(entries.first().username, 'SampsonJoshua');
//     t.equal(entries.last().username, 'jacobheun');
//     t.equal(entries.first().bracket.standard, 400);
//     t.equal(entries.last().bracket.standard, 410);

//     entries.setComparator('standard');

//     t.equal(entries.at(0).username, 'robcube');
//     t.equal(entries.last().username, 'richardiii');
//     t.equal(entries.first().bracket.standard, 1160);
//     t.equal(entries.last().bracket.standard, 240);

//     t.end();
// });