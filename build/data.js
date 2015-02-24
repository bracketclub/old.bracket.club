var crypto = require('crypto');
var config = require('figs');
var _ = require('lodash');


var year = process.env.TYB_YEAR || config.year;
var sport = process.env.TYB_SPORT || config.sport;
var liveData = require('bracket-data-live')({year: year, sport: sport});
liveData.sportYear = {
    year: year,
    sport: sport
};
liveData.entriesByName = _.chain(liveData.entries).map(function (entry) {
    return [entry.username.toLowerCase(), entry];
}).object().value();

var dataString = 'window.bootstrap=' + JSON.stringify(liveData) + ';';
var dataHash = crypto.createHash('sha1').update(dataString).digest('hex').slice(0, 8);
var dataFilename = 'data.' + dataHash + '.js';


module.exports = {
    string: dataString,
    filename: dataFilename
};
