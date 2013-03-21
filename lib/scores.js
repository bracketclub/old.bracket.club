var ScoreTracker = require('scores').ScoreTracker,
    Database = require('./database'),
    _ = require('underscore'),
    async = require('async'),
    db = new Database(),
    log = require('./log'),
    Bracket = require('bracket-validator')(),
    BracketValidator = Bracket.validator,
    order = Bracket.order,
    regionMapping = {
      'MIDWEST': 'MW',
      'WEST': 'W',
      'SOUTH': 'S',
      'EAST': 'E'
    };

var scoreTracker = new ScoreTracker({
  interval: 1000 * 60 * 10,
  scoresUrl: '{{date}}&confId=100'
});

scoreTracker.on('gameChange', function(games) {
  async.concat(games, function(game, cb) {
    log.debug(game.region + ': ' + game.home.seed + game.home.team + ' vs ' + game.visitor.seed + game.visitor.team + ' ' + game.status);
    if (game.status !== 'final') return cb(new Error('Not a final:' + game.id), null);
    db.findMaster(function(err, entry) {
      if (err || !entry) cb(new Error('Error getting master'), null);
      log.debug('CURRENT MASTER: ' + entry.bracket);

      new BracketValidator({flatBracket: entry.bracket}).validate(function(err, bracketData) {
        if (err) return cb(new Error('Bad bracket validation'), null);

        var region = bracketData[regionMapping[game.region]],
            returnString = '';

        _.each(region.rounds, function(round, roundIndex) {
          _.each(round, function(roundGame, gameIndex) {
            if (roundGame !== null && roundGame.seed === game.home.seed) {
              var resultIndex = Math.floor(gameIndex/2);
              if (game.winner === 'home') {
                bracketData[regionMapping[game.region]].rounds[roundIndex+1][resultIndex] = game.home.seed;
              } else if (game.winner === 'away') {
                bracketData[regionMapping[game.region]].rounds[roundIndex+1][resultIndex] = game.visitor.seed;
              }
            }
          });
        });

        _.each(bracketData, function(bracketRegion) {
          var regionString =_.map(bracketRegion.rounds, function(round, roundIndex) {
            if (roundIndex === 0) return '';
            return _.map(round, function(roundGame) {
              if (roundGame === null) return 'X';
              if (_.isNumber(roundGame)) return roundGame;
              return roundGame.seed;
            }).join('');
          }).join('')
          .replace(new RegExp(order.join(''), 'g'), '')
          .replace(new RegExp(_.values(regionMapping).join(''), 'g'), '');
          returnString += bracketRegion.id + regionString;
        });

        log.debug('NEW MASTER: ' + returnString);

        db.updateMaster(returnString, function(err, entry) {
          if (err) return cb(new Error('BRACKET NOT UPDATED'), null);
          cb(null, 'BRACKET UPDATED: ' + entry.bracket);
        });

      });
    });
  }, function(err, results) {
    if (err) return log.debug(err.message);
    log.debug(results);
  });
});

module.exports = scoreTracker;