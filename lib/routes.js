var moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),

    Bracket = require('bracket-validator')(),
    BracketValidator = Bracket.validator,
    Scorer = Bracket.score,
    consts = Bracket.consts,
    Database = require('./database'),
    db = new Database(),

    lock = require('./lock');

function render404(req, res, data) {
  res.status(404);
  res.render('404', _.extend(data || {}, {title: '404'}));
}

function getBracketData(bracketData, otherData) {
  return _.extend({}, {
    regions: _.omit(bracketData, consts.FINAL_ID),
    finalRegion: bracketData[consts.FINAL_ID]
  }, otherData || {});
}

var routes = {

  index: function(req, res) {
    var renderIndex = function(err, bracketString) {
      new BracketValidator({flatBracket: bracketString}).validate(function(err, bracketData) {
        if (err) return render404(req, res);
        res.render('index', getBracketData(bracketData, {title: 'Create Your Bracket!'}));
      });
    };

    if (lock.isOpen()) {
      renderIndex(null, '');
    } else {
      db.findMaster(function(err, masterEntry) {
        renderIndex(err, (masterEntry || {}).bracket);
      });
    }
  },

  faq: function(req, res) {
    res.render('faq', {
      title: 'Frequently Asked Questions',
      lockTime: moment(lock.lockTime).format()
    });
  },

  results: function(req, res) {
    db.findMaster(function(err, masterEntry) {
      if (err || !masterEntry) return render404(req, res);
      db.findAll(function(err, entries) {
        if (err || !entries) return render404(req, res);
        async.concat(entries, function(entry, cb) {
          var s = new Scorer({
            userBracket: entry.bracket,
            masterBracket: masterEntry.bracket,
            otherData: entry,
            roundPoints: [10, 20, 40, 80, 160, 320]
          }).getScore(cb);
        }, function(err, scores) {
          if (err) return render404(req, res);
          res.render('results', {
            title: 'Results',
            scores: _.sortBy(scores, 'totalScore').reverse()
          });
        });
      });
    });
  },

  user: function(req, res) {
    var username = req.params.username.toLowerCase();

    db.findUser(username, function(err, entry) {
      var renderUser = function(err, bracketData) {
        if (err) return render404(req, res, {userUrl: username});
        res.render('user', getBracketData(bracketData, {title: '@' + username, entry: entry}));
      };

      if (err || ! entry) return render404(req, res, {userUrl: username});

      if (lock.isOpen()) {
        new BracketValidator({flatBracket: entry.bracket}).validate(renderUser);
      } else {
        db.findMaster(function(err, masterEntry) {
          new Scorer({userBracket: entry.bracket, masterBracket: masterEntry.bracket}).diff(renderUser);
        });
      }
    });
  }

};

module.exports = routes;