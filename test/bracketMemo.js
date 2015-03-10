let _ = require('lodash');
let test = require('tape');
let bracket = require('../clientapp/helpers/bracket');
let sport = 'ncaa-mens-basketball';
let years = ['2012', '2013', '2014', '2015'];


test('Adds to end of array', (t) => {
    let brackets = years.map(function (year) {
        return bracket({sport: sport, year: year});
    });
    let uniqLocks = _.chain(brackets).pluck('locks').uniq().value();
    let validated = _.chain(brackets).map(function (b) {
        return b.validate(b.emptyBracket);
    }).value();

    console.log(JSON.stringify(validated, null, 2));

    t.equal(uniqLocks.length, 4);

    t.end();
});
