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
var editable = (Date.compare(new Date(), new Date(Date.parse(NCAA.closingTime))) === -1);

function getEmptyCode() {
  return _.flatten(_.zip(validator.allRegions, _.map(validator.allRegions, function(reg) {
    var gameCount = (reg === validator.finalFourRegionName) ? validator.regions.length : validator.seedOrder.length;
    return new Array(gameCount).join(validator.unpickedGame);
  }))).join('');
}

function getCurrentCode() {
  return 'SXXXXXXXXXXXXXXXWXX5463XXXXXXXXXE1854XXXXXXXXXXXMWXXXXXXXXXXXXXXXFFXXX';
}

function renderBracket(bracketCode) {
  return app.render('bracket', 'layouts/empty', validator.validateTournament(bracketCode, editable, false), bracketCode);
}

function renderCode(bracketCode) {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(renderBracket(bracketCode));
}

function renderHome() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('index', '', { bracketDisplay: renderBracket((editable) ? getEmptyCode() : getCurrentCode()), editable: editable }));
}

function sortByScore(results) {
  var scores = _.map(results, function(user) {
    return _.extend(user, {score: validator.score(user.bracket, getCurrentCode(), user.username)});
  });
  var count = 1;
  return _.map(scores.sort(function(a, b) {
    return (b.score - a.score);
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
            _this.res.end(app.render('results', '', { editable: editable, scores: sortByScore(result.rows) }));
          }
        });
      }
    });
    
  } else {
    this.res.writeHead(200, {"Content-Type": "text/html"});
    this.res.end(app.render('results', '', { editable: editable, scores: sortByScore(scores) }));
  }
  
}

function renderQ() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('faq', '', { editable: editable }));
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
            _this.res.end(app.render('user', '', _.extend({bracketDisplay: renderBracket(result.rows[0].bracket), editable: editable}, result.rows[0])));
          }
        });
      }
    });
    
  } else {
    this.res.writeHead(200, {"Content-Type": "text/html"});
    this.res.end(app.render('user', '', {bracketDisplay: renderBracket('S18541137214112424W185463721532533E191213113102112111011111MW1854113728432828FFWMWW'), username: username, editable: editable}));
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