var Twit = require('twit'),
    _ = require('underscore'),
    config = require('../config.js'),
    async = require('async'),
    Entry = new require('./entryModel'),
    log = require('./log'),
    bracket = require('bracket-validator')({props: 'finder'}),
    T = new Twit(config.twitter.keys);

function TwitterWatcher(options) {
  options = options || {};

  this.tag = options.tag || '';
  this.finder = new bracket.finder({appName: options.appName, trackTwitter: options.tag});
  this.stream = null;
}

TwitterWatcher.prototype.stop = function() {
  log.debug('Closing twitter stream');
  this.stream.stop();
};

TwitterWatcher.prototype.start = function() {

  var self = this,
      currentYear = new Date().getFullYear(),
      now = new Date().getTime(),
      bracketsClose = new Date(config.lockTimes[currentYear]).getTime();

  if (now < bracketsClose) {
    log.debug('TWITTER: Listening to ' + self.tag + ' until ' + (bracketsClose - now));

    self.stream = T.stream('statuses/filter', {track: self.tag});

    self.stream.on('tweet', function(data) {

      log.debug('TWEET: ' + data.user.screen_name + ':' + data.id_str);

      if (!_.has(data, 'retweeted_status')) {
        self.finder.find(data, function(err, res) {
          if (err) return log.debug('No bracket in tweet ' + data.id_str + ' from ' + data.user.screen_name + ' : ' + err.message);

          var validBracket = res,
              bracketTime = new Date(data.created_at).getTime(),
              record = {};

          if (validBracket && bracketTime < bracketsClose) {

            record = {
              created: bracketTime,
              bracket: validBracket.toUpperCase(),
              user_id: data.user.id_str,
              tweet_id: data.id_str,
              username: data.user.screen_name.toLowerCase(),
              name: data.user.name,
              profile_pic: data.user.profile_image_url,
              year: currentYear
            };

            Entry.findOneAndUpdate({user_id: record.user_id}, record, {upsert: true}, function(err, doc) {
              if (err) return log.debug('BRACKET NOT SAVED: ' + record.tweet_id + ' from ' + record.username);
              log.debug('BRACKET SAVED: ' + record.tweet_id + ' from ' + record.username);
            });
          }
        });
      }
    });

    setTimeout(function() {
      self.stop();
    }, bracketsClose - now);

  } else {
    log.debug('TWITTER: Too late to tweet');
  }
};

module.exports = TwitterWatcher;