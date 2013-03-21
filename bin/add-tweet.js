#!/usr/bin/env node

var id = process.argv[2],
    Twit = require('twit'),
    _ = require('underscore'),
    config = require('../config.js'),
    appPackage = require('../package'),
    Entry = new require('../lib/entryModel'),
    log = require('../lib/log'),
    bracket = require('bracket-validator')({props: 'finder'}),
    finder = new bracket.finder({appName: appPackage.name, trackTwitter: config.twitter.hashtags[0]}),
    T = new Twit(config.twitter.keys);

T.get('statuses/show/' + id, function(err, data) {
  if (!_.has(data, 'retweeted_status')) {
    finder.find(data, function(err, res) {
      if (err) return log.debug('No bracket in tweet ' + data.id_str + ' from ' + data.user.screen_name + ' : ' + err.message);

      var validBracket = res,
          bracketTime = new Date(data.created_at).getTime(),
          record = {};

      record = {
        created: bracketTime,
        bracket: validBracket.toUpperCase(),
        user_id: data.user.id_str,
        tweet_id: data.id_str,
        username: data.user.screen_name.toLowerCase(),
        name: data.user.name,
        profile_pic: data.user.profile_image_url
      };

      Entry.findOneAndUpdate({user_id: record.user_id}, record, {upsert: true}, function(err, doc) {
        if (err) return log.debug('BRACKET NOT SAVED: ' + record.tweet_id + ' from ' + record.username);
        log.debug('BRACKET SAVED: ' + record.tweet_id + ' from ' + record.username);
      });
    });
  }
});

