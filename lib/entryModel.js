var mongoose = require('mongoose'),
    config = require('../config.js'),
    db = mongoose.createConnection(config.db),
    schema = mongoose.Schema({
      created: String,
      bracket: String,
      user_id: String,
      tweet_id: String,
      username: String,
      name: String,
      profile_pic: String
    }),
    Entry = db.model('Entry', schema);

module.exports = Entry;
