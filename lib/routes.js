var moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    config = require('../config'),
    Bracket = require('bracket-validator')(),
    BracketValidator = Bracket.validator,
    thisLock = Bracket.locks[new Date().getFullYear()],
    Scorer = Bracket.score,
    consts = Bracket.consts,
    Database = require('tweetyourbracket-db'),
    db = new Database(config.db),
    currentYear = new Date().getFullYear(),
    isOpen = function() {
      var now = new Date().getTime();
      return (new Date(thisLock).getTime() - now > 0);
    };

function render404(req, res, data) {
  res.status(404);
  res.render('404', _.extend(data || {}, {title: '404', live: isOpen()}));
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
        res.render('index', getBracketData(bracketData, {title: 'Create Your Bracket!', live: isOpen()}));
      });
    };

    if (isOpen()) {
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
      lockTime: moment(thisLock).format(),
      live: isOpen()
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
            roundPoints: config.tournament.roundScores
          }).getScore(cb);
        }, function(err, scores) {
          if (err) return render404(req, res);
          var rankCounter = 1,
              lastUserScore = null,
              rankedScores = _.sortBy(scores, 'totalScore').reverse(),
              rankedScore;

          for (var i = 0, m = rankedScores.length; i < m; i++) {
            rankedScore = rankedScores[i];
            if (rankedScore.totalScore === lastUserScore || lastUserScore === null) {
              // Do nothing for rank
            } else {
              rankCounter++;
            }
            rankedScore.rank = rankCounter;
            lastUserScore = rankedScore.totalScore;
          }

          var totalTeams =  consts.TEAMS_PER_REGION * consts.REGION_COUNT;

          res.render('results', {
            title: 'Results',
            scores: rankedScores,
            rounds: config.tournament.roundNamesShort,
            pointsPerRound: config.tournament.roundScores,
            live: isOpen(),
            gamesPerRound: _.map(config.tournament.roundScores, function(i) {
              var returnVal = totalTeams / 2;
              totalTeams = returnVal;
              return returnVal;
            })
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
        res.render('user', getBracketData(bracketData, {title: '@' + username, entry: entry, live: isOpen()}));
      };

      if (err || ! entry) return render404(req, res, {userUrl: username});

      if (isOpen()) {
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