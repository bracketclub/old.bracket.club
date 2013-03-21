var Entry = new require('./entryModel');

function Database() {

}

Database.prototype.findUser = function(username, cb) {
  Entry.findOne({username: username}, cb);
};

Database.prototype.findMaster = function(cb) {
  Entry.findOne({username: '-MASTER-'}, cb);
};

Database.prototype.updateMaster = function(bracket, cb) {
  Entry.findOneAndUpdate({username: '-MASTER-'}, {bracket: bracket}, {upsert: true}, cb);
};

Database.prototype.findAll = function(cb) {
  Entry.find({ username: /^[^\-]/ }, cb);
};

Database.prototype.upsertBracket = function(record, cb) {
  Entry.findOneAndUpdate({user_id: record.user_id}, record, {upsert: true}, cb);
};

module.exports = Database;