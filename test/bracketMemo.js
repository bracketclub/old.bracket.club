'use strict';

const _ = require('lodash');
const test = require('tape');
const bracket = require('../client/helpers/bracket');

const sport = 'ncaa-mens-basketball';
const years = ['2012', '2013', '2014', '2015'];
const finals = [ // 2012, 2013, 2014
  'S18124113101514310131W1954637151437474E185463721462122MW181213113102113112122FFSMWS',
  'MW18124637211232121W19121361410291362929S185411371514315434E1912463721432434FFMWSMW',
  'S191241131021411101111E1812463721437477W1812463721462122MW185411147284112828FFEMWE'
];

const bracketsByYear = (bracketYears) => bracketYears.map((year) => bracket({sport, year}));

// Prime the memoization cache
bracketsByYear(years);

test('Initial teams are correct', (t) => {
  const brackets = bracketsByYear(years);

  const teams = _.chain(brackets).pluck('bracket').map((b) =>
    b.regions[_.keys(b.regions)[0]].teams
  ).pluck('0').value();

  const validated = _.chain(brackets).map((b) => {
    const firstTeam = b.validate(b.emptyBracket).region1.rounds[0][0];
    return firstTeam.fromRegion + firstTeam.seed + firstTeam.name;
  }).value();

  t.equal(validated.join(' '), 'S1Kentucky MW1Louisville S1Florida MW1Kentucky');
  t.equal(teams.join(' '), 'Kentucky Louisville Florida Kentucky');

  t.end();
});

test('Initial teams are correct', (t) => {
  const _winner = (f, b, index) => b.validate(f[index]).regionFinal.rounds[2][0];
  const winner = _.partial(_winner, finals);
  const winnerBackward = _.partial(_winner, finals.slice(0).reverse());

  const teams = _.chain(bracketsByYear(['2012', '2013', '2014'])).map(winner).value();
  const teams2 = _.chain(bracketsByYear(['2014', '2013', '2012'])).map(winnerBackward).value();

  t.equal(_.pluck(teams, 'name').join(' '), 'Kentucky Louisville UConn');
  t.equal(_.pluck(teams2, 'name').join(' '), 'UConn Louisville Kentucky');

  t.end();
});
