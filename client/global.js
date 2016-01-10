'use strict';

const Firebase = require('firebase');
const range = require('lodash/utility/range');
const activeSport = __SPORT__;
const activeYear = __YEAR__;
const FIRST_YEAR = 2012;
const years = range(FIRST_YEAR, parseInt(activeYear, 10) + 1).map(String);

// These are all things that will only change once a year
// All the year stuff is based on the build step
module.exports = {
  activeSport,
  activeYear,
    // Meant to look like a regex using a test method
  rYear: {test: (year) => years.indexOf((year || '').toString()) > -1},
  years,
  staticUrl: 'https://cdn.rawgit.com/tweetyourbracket/api/6d84c44c991d8250515047655d2a8ed1ae19ee9d/data-static/ncaa-mens-basketball',
  apiUrl: 'http://104.236.223.8',
  firebase: new Firebase('https://tweetyourbracket.firebaseio.com')
};
