var HumanModel = require('human-model');
var baseBracket = require('./bracket');


module.exports = HumanModel.define(baseBracket({
    history: true
}));