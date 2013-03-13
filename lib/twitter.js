var Twit = require('twit'),
    _ = require('underscore'),
    config = require('configs'),
    realurl = require('realurl'),
    async = require('async'),
    mongo = require('mongodb'),
    log = require('logger'),
    app = require('../package'),
    bracket = require('bracket-validator'),

    currentYear = new Date().getFullYear(),

    finder = new bracket.finder({appName: app.name, trackTwitter: config.twitter.hashtags}),
    bracketsClose = new Date(config.lockTimes[currentYear]).getTime(),
    now = new Date().getTime(),

    T = new Twit(config.twitter.keys),
    stream = null;

if (now < bracketsClose) {
  stream = T.stream('statuses/filter', {track: config.twitter.hashtags});

  stream.on('tweet', function(data) {
    finder(data, function(err, res) {
      if (err) return log.warn('No bracket in tweet', data.id_str, 'from', data.user.screen_name, '['+data.id_str+']');

      var validBracket = res,
          bracketTime = new Date(data.created_at).getTime(),
          record = {};

      if (validBracket && bracketTime < bracketsClose) {

        record = {
          created: bracketTime,
          bracket: validBracket,
          used_id: data.user.id_str,
          tweet_id: data.id_str,
          username: data.user.screen_name,
          name: data.user.name,
          profile_pic: data.user.profile_image_url
        };

        // TODO: mongodb upsert
      }
    });
  });

  setTimeout(function() {
    stream.stop();
  }, bracketsClose - now);
}