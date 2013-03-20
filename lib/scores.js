var ScoreTracker = require('scores').ScoreTracker;

var scoreTracker = new ScoreTracker({
  scoresUrl: '{{date}}&confId=100'
});

scoreTracker.on('gameChange', function(game) {
  // do something with game object
});

scoreTracker.watch();