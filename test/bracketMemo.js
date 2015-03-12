let _ = require('lodash');
let test = require('tape');
let bracket = require('../clientapp/helpers/bracket');
let sport = 'ncaa-mens-basketball';
let years = ['2012', '2013', '2014', '2015'];


test('Adds to end of array', (t) => {
    let brackets = years.map(function (year) {
        return bracket({sport: sport, year: year});
    });

    let teams = _.chain(brackets).pluck('bracket').map(function (b) {
        return b.regions[_.keys(b.regions)[0]].teams;
    }).pluck('0').value();

    let validated = _.chain(brackets).map(function (b) {
        let firstTeam = b.validate(b.emptyBracket).region1.rounds[0][0];
        return firstTeam.fromRegion + firstTeam.seed + firstTeam.name;
    }).value();

    t.equal(validated.join(), 'S1Kentucky,MW1Louisville,S1Florida,MW1Kentucky');
    t.equal(teams.join(), 'Kentucky,Louisville,Florida,Kentucky');
    t.end();
});
