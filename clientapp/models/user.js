var State = require('./base');
var _ = require('underscore');
var LockedBracket = require('./lockedBracket');


module.exports = State.extend({
    idAttribute: 'username',
    session: {
        me: 'state',
        history: 'array',
        historyIndex: 'number',
        sport: 'string',
        year: 'string'
    },
    props: {
        username: ['string', true, ''],
        user_id: ['string', true, ''],
        data_id: ['string', true, ''],
        name: ['string', true, ''],
        profile_pic: ['string', true, ''],
        created: ['date', true, ''],
        bracket: 'any'
    },
    derived: {
        profileLink: {
            deps: ['username'],
            fn: function () {
                return 'https://twitter.com/' + this.username;
            }
        },
        entryLink: {
            deps: ['profileLink', 'data_id'],
            fn: function () {
                return this.profileLink + '/' + this.data_id;
            }
        },
        pageLink: {
            deps: ['username'],
            fn: function () {
                return '/user/' + this.username;
            }
        },
        isMe: {
            deps: ['username', 'me.username'],
            fn: function () {
                return this.username === me.username;
            }
        },
        scoreIndex: {
            cache: false,
            fn: function () {
                return this.collection.scoreIndex(this) + 1;
            }
        }
    },
    initialize: function () {
        if (this.bracket && this.history && this.historyIndex) {
            this.bracket = new LockedBracket(_.pick(this, 'sport', 'year', 'bracket', 'history', 'historyIndex'));
        }
    }
});
