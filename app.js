#!/usr/bin/env node

/*global console */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    log = require('./lib/log'),
    jadeBrowser = require('jade-browser'),
    _ = require('underscore'),

    appPackage = require('./package'),
    config = require('./config.js'),
    routes = require('./lib/routes'),
    BracketGenerator = require('bracket-validator')().generator,

    app = express();

app.configure(function () {
  app.set('port', 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(jadeBrowser('/js/templates.js', '**', {root: path.join(__dirname, 'views/includes/bracket'), minify: true}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.status(404);
    res.render('404', {title: '404'});
  });
});

app.locals.generatedBrackets = {
  higher: new BracketGenerator({winners: 'higher'}).flatBracket(),
  lower: new BracketGenerator({winners: 'lower'}).flatBracket()
};
app.locals.version = appPackage.version;

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.env = 'development';
});

app.configure('production', function () {
  app.use(express.errorHandler());
  app.locals.env = 'production';
});

app.get('/', routes.index);
app.get('/faq', routes.faq);
app.get('/results', routes.results);
app.get('/user/:username', routes.user);

http.createServer(app).listen(app.get('port'), function () {
  log.debug('Express server listening', app.get('port'), app.settings.env);
});
