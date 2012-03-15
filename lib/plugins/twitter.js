var util = require('util'),
    twitter = require('twitter'),
    _ = require('underscore'),
    validator = require('./validator.js'),
    pg = require('pg'),
    NCAA = require('../data/2012.json'),
    stopTime = new Date(Date.parse(NCAA.closingTime)),
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

var twit = new twitter(twitter_keys);

function findBracket(tweetEntities) {
  var urls = _.pluck(tweetEntities.urls, 'expanded_url'),
      hashtags = _.without(_.pluck(tweetEntities.hashtags, 'text'), 'tybrkt'),
      urlHashes = _.map(urls, function(url) { return url.split('#')[1] || ''; }),
      both = _.union(urlHashes, hashtags);
      
  return _.find(both, function(bracket) { return (validator.validateTournament(bracket, false, true) !== false); })
}

function validateTweet(data) {
  
  var validHash = findBracket(data.entities),
      tweetDate = new Date(Date.parse(data.created_at));
  
  console.log('#tybrkt stream', validHash, tweetDate);
  
  if (validHash && Date.compare(tweetDate, stopTime) === -1) {
    
    console.log('tweet is valid');
    
    var validData = {
      created: tweetDate,
      bracket: validHash,
      userid: data.user.id_str,
      tweetid: data.id_str,
      username: data.user.screen_name.toLowerCase()
    };
    
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (!err) {
          console.log("adding tweet", validData);
          var query = client.query('INSERT INTO brackets (bracket, userid, tweetid, username, created) VALUES ($1, $2, $3, $4, $5)', [
            validData.bracket,
            validData.userid,
            validData.tweetid,
            validData.username,
            validData.created
          ]);
        }
      });
    } else {
      console.log("dev tweet", validData);
    }
  }
}


twit.stream('statuses/filter', {track: '#tybrkt'}, function(stream) {
  stream.on('data', function(data) {
    validateTweet(data);
  });
});