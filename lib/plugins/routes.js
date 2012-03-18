var path = require('path'),
    director = require('director'),
    routes = {},
    router,
    app,
    _ = require('underscore'),
    helpers = require('./helpers.js').helpers,
    NCAA = require('../data/2012.json'),
    validator = require('./validator.js'),
    pg = require('pg');

require('date-utils');
var editable = function() {
  return (Date.compare(new Date(), new Date(Date.parse(NCAA.closingTime))) === -1);
}

function getEmptyCode() {
  return _.flatten(_.zip(validator.allRegions, _.map(validator.allRegions, function(reg) {
    var gameCount = (reg === validator.finalFourRegionName) ? validator.regions.length : validator.seedOrder.length;
    return new Array(gameCount).join(validator.unpickedGame);
  }))).join('');
}

function getCurrentCode() {
  return 'S181241131015143XXXXW195463715X43XXXXE1854637214X2XXXMW181213113102XXXXXXXFFXXX';
}

function renderBracket(bracketCode) {
  return app.render('bracket', 'layouts/empty', validator.validateTournament(bracketCode, editable(), false, getCurrentCode()));
}

function renderCode(bracketCode) {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(renderBracket(bracketCode));
}

function renderHome() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('index', '', { bracketDisplay: renderBracket((editable()) ? getEmptyCode() : getCurrentCode()), editable: editable() }));
}

function sortByScore(results) {
  var scores = _.map(results, function(user) {
    return _.extend(user, {scores: validator.score(user.bracket, getCurrentCode(), user.username)});
  });
  var count = 1;
  return _.map(scores.sort(function(a, b) {
    return (b.scores.total - a.scores.total);
  }), function(item) { return _.extend(item, {count: count++}); });
}

function renderResults() {
  
  if (process.env.DATABASE_URL) {
  
    var _this = this;
      
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) {
        _this.res.writeHead(404, {"Content-Type": "text/html"});
        _this.res.end(app.render('404'));
      } else {
        client.query('SELECT DISTINCT ON (username) * FROM brackets ORDER BY username, created DESC', function(err, result) {
          if (err || result.rows.length < 1) {
            _this.res.writeHead(404, {"Content-Type": "text/html"});
            _this.res.end(app.render('404'));
          } else {
            _this.res.writeHead(200, {"Content-Type": "text/html"});
            _this.res.end(app.render('results', '', { editable: editable(), scores: sortByScore(result.rows) }));
          }
        });
      }
    });
    
  } else {
    var scores = [
    {username: 'test', bracket: 'S1812131137211211211111W1954113729532939E185463721562565MW19541131021531011010FFSEE'},
    {username: 'test2', bracket: 'S19124631021123212312W1854614721562166E1854631021532535MW1812463721432122FFWMWMW'},
    {username: 'test3', bracket: 'S1854113721432131W195463721432131E185463721437131MW195463721432131FFWMWW'}
    ];
    this.res.writeHead(200, {"Content-Type": "text/html"});
    this.res.end(app.render('results', '', { editable: editable(), scores: sortByScore(scores) }));
  }
  
}

function renderQ() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('faq', '', { editable: editable() }));
}

function renderUser(username) {
  
  if (process.env.DATABASE_URL) {
  
    var _this = this,
        errorObj = {usererror: true, attemptedUser: username};
      
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) {
        _this.res.writeHead(404, {"Content-Type": "text/html"});
        _this.res.end(app.render('404', '', errorObj));
      } else {
        client.query('SELECT * FROM brackets WHERE username = $1 ORDER BY created DESC LIMIT 1', [username.toLowerCase()], function(err, result) {
          if (err || result.rows.length < 1) {
            _this.res.writeHead(404, {"Content-Type": "text/html"});
            _this.res.end(app.render('404', '', errorObj));
          } else {
            _this.res.writeHead(200, {"Content-Type": "text/html"});
            _this.res.end(app.render('user', '', _.extend({
              bracketDisplay: renderBracket(result.rows[0].bracket),
              editable: editable(),
              displayDate: new Date(result.rows[0].created).toFormat('MMMM D, YYYY @ H:MIP')},
              result.rows[0]
            )));
          }
        });
      }
    });
    
  } else {
    this.res.writeHead(200, {"Content-Type": "text/html"});
    this.res.end(app.render('user', '', {bracketDisplay: renderBracket('S18541137214112424W185463721532533E191213113102112111011111MW1854113728432828FFWMWW'), username: username, editable: editable()}));
  }
  
}

exports.name = "routes";

exports.attach = function(options) {
  app = this;
  app.router.get('/', renderHome);
  app.router.get('/user/:userName', renderUser);
  app.router.get('/tybrkt_renderBracket/:bracketCode', renderCode);
  app.router.get('/results', renderResults);
  app.router.get('/questions', renderQ);
};