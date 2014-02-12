var HumanModel = require('human-model');
var BracketValidator = require('bracket-validator');
var bd = new BracketValidator({year: '2013'});
var BracketUpdater = require('bracket-updater');
var _ = require('underscore');
var logger = require('../helpers/andlog');


module.exports = HumanModel.define({
    type: 'bracket',
    initialize: function (attributes, options) {
        attributes || (attributes = {});
        options || (options = {});
        this.hasInitial = !!attributes.bracket;
        this.room = options.room;
        this.listenTo(this, 'connect:room', this.onRoomConnect);
        this.listenTo(this, 'connect:error', this.onRoomError);
        app.goinstant.room(this, this.roomId);
    },
    session: {
        bracket: {
            required: true,
            type: 'string',
            default: bd.constants.EMPTY
        },
        roomId: ['strng', true, '']
    },
    derived: {
        complete: {
            deps: ['bracket'],
            cache: true,
            fn: function () {
                return this.bracket.indexOf(bd.constants.UNPICKED_MATCH) === -1;
            }
        },
        unpickedGames: {
            deps: ['bracket'],
            cache: true,
            fn: function () {
                return this.bracket.replace(new RegExp('[^' + bd.constants.UNPICKED_MATCH + ']', 'gi'), '').length;
            }
        },
        percentDone: {
            deps: ['unpickedGames'],
            cache: true,
            fn: function () {
                var total = ((bd.constants.TEAMS_PER_REGION * bd.constants.REGION_COUNT) - 1);
                return  (total - this.unpickedGames) / total;
            }
        },
        validated: {
            deps: ['bracket'],
            cache: true,
            fn: function () {
                return new BracketValidator({year: '2013', flatBracket: this.bracket}).validate();
            }
        },
        ordered: {
            deps: ['validated'],
            cache: true,
            fn: function () {
                var v = this.validated;
                var f = v[bd.constants.FINAL_ID];
                var first = v[bd.constants.REGION_IDS[0]];
                var second = v[first.sameSideAs];
                var others = _.reject(v, function (r) { return _.contains([f.id, first.id, second.id], r.id); });
                return [first, v[first.sameSideAs], others[0], others[1], f];
            }
        }
    },
    updateGame: function (winner, loser, region) {
        var data = {
            winner: winner,
            fromRegion: region,
            currentMaster: this.bracket,
            year: '2013'
        };
        loser && (data.loser = loser);
        var update = new BracketUpdater(data).update();

        if (!(update instanceof Error) && update !== this.bracket) {
            if (this.bracketKey) this.bracketKey.set(update);
            this.bracket = update;
            
        }
    },
    onRoomConnect: function (connection, room) {
        logger.log('Connected to', room);
        this.bracketKey = room.key('/bracket');
        var self = this;
        
        // Get shared for first time
        this.bracketKey.get(function (err, value, context) {
            logger.log('Get bracket', value);
            if (value && !self.hasInitial) self.bracket = value;

            if (self.hasInitial) {
                self.bracketKey.set(self.bracket);
                app.navigate(window.location.pathname.replace('/collaborate-set/', '/collaborate/'), {trigger: false, replace: true});
            }

            self.bracketKey.on('set', function (value, context) {
                logger.log('Set bracket', value);
                if (value) self.bracket = value;
            });

        });
    },
    onRoomError: function () {
        console.log('error', arguments);
    }
});
