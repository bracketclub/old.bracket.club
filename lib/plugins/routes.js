var path = require('path'),
    director = require('director'),
    routes = {},
    router,
    app,
    _ = require('underscore'),
    helpers = require('../bracket/helpers.js').helpers,
    NCAA = require('../data/2012.json'),
    validator = require('../bracket/validator.js'),
    editable = true,

    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('tweetyourbracket', server);



function updateUser(userName, bracket) {
  db.open(function(err, db) {
    if (!err) {
      db.createCollection('brackets', function(err, collection) {
        collection.update({userName: userName}, {$set:{bracket: bracket}}, {upsert:true});
      });
    }
  });
}

function getEmptyCode() {
  return _.flatten(_.zip(validator.allRegions, _.map(validator.allRegions, function(reg) {
    var gameCount = (reg === validator.finalFourRegionName) ? validator.regions.length : validator.seedOrder.length;
    return new Array(gameCount).join(validator.unpickedGame);
  }))).join('');
}

function renderBracket(bracketCode) {
  return app.render('bracket', 'layouts/empty', validator.validateTournament(bracketCode, editable));
}

function renderCode(bracketCode) {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(renderBracket(bracketCode));
}

function renderHome() {
  this.res.writeHead(200, {"Content-Type": "text/html"});
  this.res.end(app.render('index', '', { bracket: renderBracket(getEmptyCode()) }));
}

function renderUser(userName) {
  var _this = this;
  db.open(function(err, db) {
    if (!err) {
      db.collection('brackets', function(err, collection) {
        collection.findOne({userName:userName}, function(err, item) {
          if (!err && item && item.bracket) {
            _this.res.writeHead(200, {"Content-Type": "text/html"});
            _this.res.end(app.render('user', '', { bracket: renderBracket(item.bracket) }));
          } else {
            _this.res.writeHead(404, {"Content-Type": "text/html"});
            _this.res.end(app.render('404'));
          }
        });
      });
    } else {
      _this.res.writeHead(404, {"Content-Type": "text/html"});
      _this.res.end(app.render('404'));
    }
  });
}

exports.name = "routes";

exports.attach = function(options) {
  app = this;
  app.router.get('/', renderHome);
  app.router.get('/user/:userName', renderUser);
  app.router.get('/validate/:bracketCode', renderCode);
};