var util = require('util'),
    twitter = require('twitter'),
    _ = require('underscore'),
    validator = require('./validator.js'),
    pg = require('pg'),
    stopTime = 'Thur Mar 15 16:00:00 +0000 2012',
    twitter_keys = {};
    require('date-utils');
    
if (!process.env.TWITTER_CONSUMER_KEY) {
  twitter_keys = require('../data/twitter.json');
} else {
  twitter_keys = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
}

// One time
var pg = require('pg').native, connectionString = process.env.DATABASE_URL, client, query;
client = new pg.Client(connectionString);
client.connect();
client.query('DROP TABLE IF EXISTS brackets');
query = client.query('CREATE TABLE brackets (
  username  varchar(50) NOT NULL,
  bracket   varchar(140) NOT NULL,
  score     integer DEFAULT 0,
  userid    varchar(25) PRIMARY KEY,
  tweetid   varchar(25) NOT NULL
)');
query.on('end', function() { client.end(); });

var twit = new twitter(twitter_keys);

twit.stream('statuses/filter', {track: '#tybrkt'}, function(stream) {
  stream.on('data', function(data) {
    
    var validHash = _.find(_.without(_.pluck(data.entities.hashtags, 'text'), 'tybrkt'), function(ht) {
      return (validator.validateTournament(ht, false, true) !== false);
    });

    if (validHash && Date.compare(data.created_at, stopTime) === -1) {
      var validData = {
        bracket: validHash,
        userid: data.user.id_str,
        tweetid: data.id_str,
        username: data.user.screen_name
      };
      
      pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (!err) {
          var query = client.query('INSERT INTO brackets (bracket, userid, tweetid, username) VALUES ($1, $2, $3, $4)', [
            validData.bracket,
            validData.userid,
            validData.tweetid,
            validData.username
          ]);
        }
      });
    }
    
  });
});