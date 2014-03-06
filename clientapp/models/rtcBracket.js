var HumanModel = require('human-model');
var baseBracket = require('../helpers/bracket');


module.exports = HumanModel.define(baseBracket({
    history: false,
    session: {
        current: ['string', true, app.empty]
    },
    base: {
        updateBracket: function (bracket) {
            this.current = bracket;
            this.trigger('userUpdateBracket');
        }
    }
}));