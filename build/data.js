var crypto = require('crypto');
var config = require('figs');

var sport = process.env.TYB_SPORT || config.sport;
var data = {sportYear: {year: '2015', sport: sport}};

['2012', '2013', '2014', '2015'].forEach(function (year) {
    data[year] = require('bracket-data-live/data/' + sport + '/' + year);
});

var dataString = 'window.bootstrap=' + JSON.stringify(data) + ';';
var dataHash = crypto.createHash('sha1').update(dataString).digest('hex').slice(0, 8);
var dataFilename = 'data.' + dataHash + '.js';


module.exports = {
    string: dataString,
    filename: dataFilename
};
