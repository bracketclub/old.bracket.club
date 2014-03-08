var HumanModel = require('human-model');
var baseBracket = require('../helpers/bracket');


module.exports = HumanModel.define(baseBracket({
    history: false,
    session: {
        current: ['string', true, window.bootstrap.masters[0]]
    },
    derived: {
        isEmpty: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.current === window.bootstrap.masters[0];
            }
        }
    },
    base: {
        afterInit: function () {
            this.listenTo(this, 'userUpdateBracket', this.save);
        },
        save: function () {
            if (this.dataChannel && this.dataChannel.readyState === 'open') {
                this.dataChannel.send(this.current);
            } else {
                console.warn('Not sending bracket. No open data channel.');
            }
        },
        hasDataChannel: function () {
            return !!this.dataChannel && this.channel;
        },
        setDataChannel: function (channel) {
            this.dataChannel = channel;
            if (!this.isEmpty) this.save();
        },
        updateBracket: function (bracket) {
            this.current = bracket;
            this.trigger('userUpdateBracket');
        },
        receiveBracketUpdate: function (bracket) {
            this.current = bracket;
        }
    }
}));