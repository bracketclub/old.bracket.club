let Firebase = require('firebase');
let range = require('lodash/utility/range');
let {__year: activeYear, __sport: activeSport} = window;
let years = range(2012, parseInt(activeYear) + 1).map(String);


// These are all things that will only change once a year
// All the year stuff is based on the build step
module.exports = {
    activeSport,
    activeYear,
    rYear: {test: (year) => years.indexOf((year || '').toString()) > -1},
    years: years,
    apiUrl: 'http://104.236.223.8:3001',
    firebase: new Firebase('https://tweetyourbracket.firebaseio.com')
};
