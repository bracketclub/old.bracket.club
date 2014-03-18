var HumanModel = require('human-model');
var baseBracket = require('../helpers/bracket');
var templates = require('../templates');


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
        },
        enterButton: {
            deps: ['complete', 'current'],
            cache: true,
            fn: function () {
                if (!this.complete) return '';
                return templates.includes.tweetButton({
                    url: this.current + '/entered',
                    text: 'Check out my #madness #bracket!',
                    complete: this.complete
                });
            }
        }
    },
    base: {
        send: function () {
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
            if (!this.isEmpty) this.send();
        },
        updateBracket: function (bracket) {
            this.receiveBracketUpdate(bracket);
            this.send();
        },
        receiveBracketUpdate: function (bracket) {
            this.current = bracket;
        }
    }
}));