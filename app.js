#!/usr/bin/env node

/*global console */

/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    log = require('./lib/log'),

    appPackage = require('./package'),
    config = require('./config/index.js'),
    TwitterWatcher = require('./lib/twitter'),

    currentYear = new Date().getFullYear(),
    lockTime = new Date(config.lockTimes[currentYear]).getTime(),
    isOpen = function() {
      var now = new Date().getTime();
      return (lockTime - now > 0);
    },
    bracket = require('bracket-validator')(),
    Entry = new require('./lib/entryModel'),

    BracketValidator = bracket.validator,
    consts = bracket.consts,
    _ = require('underscore'),

    app = express(),
    twitter = new TwitterWatcher({appName: appPackage.name, tag: config.twitter.hashtags[0]});

app.configure(function () {
  app.set('port', 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.status(404);
    var userUrl = /\/user\/(.*)/.exec(req.url);
    res.render('404', {userUrl: (userUrl) ? userUrl[1] : '', title: '404'});
  });
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  var validator = new BracketValidator();
  validator.validate(function(err, bracketData) {
    res.render('index', {
      title: 'Create Your Bracket!',
      regions: _.omit(bracketData, consts.FINAL_ID),
      finalRegion: bracketData[consts.FINAL_ID],
      live: isOpen()
    });
  });
});

app.get('/faq', function(req, res) {
  res.render('faq', {
    title: 'Frequently Asked Questions',
    timeToLocked: lockTime - new Date().getTime()
  });
});

app.get('/results', function(req, res) {
  res.render('results', {
    title: 'Results',
    isOpen: isOpen(),
    hasScores: false
  });
});

app.get('/user/:username', function(req, res) {
  var username = req.params.username;
  Entry.findOne({username: username}, function(err, entry) {
    if (err || !entry) {
      res.status(404);
      res.render('404', {userUrl: username, title: '404'});
    } else {
      var validator = new BracketValidator({flatBracket: entry.bracket});
      validator.validate(function(err, bracketData) {
        if (err) {
          res.status(404);
          res.render('404', {userUrl: username, title: '404'});
        } else {
          res.render('user', {
            title: '@' + username,
            regions: _.omit(bracketData, consts.FINAL_ID),
            finalRegion: bracketData[consts.FINAL_ID],
            live: isOpen(),
            entry: entry
          });
        }
      });
    }
  });
});

twitter.start();

http.createServer(app).listen(app.get('port'), function () {
  log.debug('Express server listening', app.get('port'), app.settings.env);
});

