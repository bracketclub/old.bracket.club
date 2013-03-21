var ScoreTracker = require('scores').ScoreTracker,
    log = require('./log');

var scoreTracker = new ScoreTracker({
  scoresUrl: '{{date}}&confId=100'
});

scoreTracker.on('gameChange', function(game) {
  log.debug(game);
});

module.exports = scoreTracker;