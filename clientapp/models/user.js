var HumanModel = require('human-model');
var LockedBracket = require('./lockedBracket');


module.exports = HumanModel.define({
    type: 'user',
    initialize: function (attributes) {
        if (attributes.bracket) this.createBracket(attributes.bracket);
    },
    session: {
        username: ['string', true, ''],
        user_id: ['string', true, ''],
        data_id: ['string', true, ''],
        name: ['string', false],
        profile_pic: ['string', false]
    },
    derived: {
        profileLink: {
            deps: ['username'],
            cache: true,
            fn: function () {
                return 'https://twitter.com/' + this.username + '/' + this.data_id;
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
            deps: ['data_id'],
            cache: true,
            fn: function () {
                return this.data_id === me.data_id;
            }
        }
    },
    createBracket: function (bracket) {
        this.bracket = new LockedBracket({
            entryBracket: bracket
        });
    }
});
