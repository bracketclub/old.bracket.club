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
var editable = Date.compare(new Date(), new Date(Date.parse(NCAA.closingTime)));

function getEmptyCode() {
  return _.flatten(_.zip(validator.allRegions, _.map(validator.allRegions, function(reg) {
    var gameCount = (reg === validator.finalFourRegionName) ? validator.regions.length : validator.seedOrder.length;
    return new Array(gameCount).join(validator.unpickedGame);
  }))).join('');
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
  this.res.end(app.render('index', '', { bracket: renderBracket(getEmptyCode()) }));
}

function renderResults() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('results'));
}

function renderQ() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('faq'));
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
        client.query('SELECT bracket FROM brackets WHERE username = $1 ORDER BY created DESC LIMIT 1', [username.toLowerCase()], function(err, result) {
          if (err || result.rows.length < 1) {
            _this.res.writeHead(404, {"Content-Type": "text/html"});
            _this.res.end(app.render('404', '', errorObj));
          } else {
            _this.res.writeHead(200, {"Content-Type": "text/html"});
            _this.res.end(app.render('user', '', {bracket: renderBracket(result.rows[0].bracket), username: username}));
          }
        });
      }
    });
    
  } else {
    this.res.writeHead(200, {"Content-Type": "text/html"});
    this.res.end(app.render('user', '', {bracket: renderBracket('S18541137214112424W185463721532533E191213113102112111011111MW1854113728432828FFWMWW'), username: username}));
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