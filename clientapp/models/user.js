var HumanModel = require('human-model');
var LockedBracket = require('./lockedBracket');
var moment = require('moment');


module.exports = HumanModel.define({
    type: 'user',
    initialize: function (attributes, options) {
        this.masters = options && options.masters;
        if (attributes && attributes.bracket && this.masters) this.createBracket(attributes.bracket);
    },
    session: {
        username: ['string', true, ''],
        user_id: ['string', true, ''],
        data_id: ['string', true, ''],
        name: ['string', false],
        profile_pic: ['string', false],
        randomHack: ['number', false, Math.random()],
        created: ['string', false, '']
    },
    derived: {
        createdMoment: {
            deps: 'created',
            cache: true,
            fn: function () {
                return moment(this.created);
            }
        },
        profileLink: {
            deps: ['username'],
            cache: true,
            fn: function () {
                return 'https://twitter.com/' + this.username;
            }
        },
        entryLink: {
            deps: ['profileLink', 'data_id'],
            cache: true,
            fn: function () {
                return this.profileLink + '/' + this.data_id;
            }
        },
        pageLink: {
            deps: ['username'],
            cache: true,
            fn: function () {
                return '/user/' + this.username;
            }
        },
        isMe: {
            deps: ['username', 'randomHack'],
            cache: false,
            fn: function () {
                return this.username === me.username;
            }
        },
        meLink: {
            deps: ['isMe'],
            cache: true,
            fn: function () {
                return this.isMe ? 'Not you?' : 'Is this you?';
            }
        },
        scoreIndex: {
            deps: [],
            cache: false,
            fn: function () {
                return this.collection.scoreIndex(this) + 1;
            }
        }
    },
    createBracket: function (bracket) {
        this.bracket = new LockedBracket({
            entryBracket: bracket,
        }, {
            masters: this.masters
        });
    }
});
