/* globals Firebase */

let range = require('lodash/utility/range');
let {__year: activeYear, __sport: activeSport} = window;

// These are all things that will only change once a year
// All the year stuff is based on the build step
module.exports = {
    activeSport,
    activeYear,
    rYear: /^20\d\d$/,
    years: range(2012, parseInt(activeYear) + 1).map(String),
    apiUrl: 'http://104.236.223.8:3001',
    firebase: new Firebase('https://tweetyourbracket.firebaseio.com')
};