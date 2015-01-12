var _ = require('underscore');
var State = require('./base');
var BracketValidator = require('bracket-validator');
var BracketUpdater = require('bracket-updater');
var BracketGenerator = require('bracket-generator');
var BracketData = require('bracket-data');


module.exports = State.extend({
    dataTypes: {
        region: {
            set: function (newVal) {
                var newType = typeof newVal;
                return {
                    val: newVal,
                    type: newType === 'object' ? 'region' : newType
                };
            },
            default: function () {
                return {};
            },
            compare: function (currentVal, newVal) {
                // Deep equals
                var isEqual = _.isEqual(currentVal, newVal);

                // Trigger the name of the region for easier consumption
                if (!isEqual) {
                    this.trigger('change:region' + newVal.id, this, newVal);
                }

                return isEqual;
            }
        }
    },
    props: {
        current: 'string',
        progressTotal: 'number',
        sport: 'string',
        year: 'string',
        _region1: 'region',
        _region2: 'region',
        _region3: 'region',
        _region4: 'region',
        _regionFinal: 'region',
        progressText: ['string', true, 'games completed']
    },
    derived: {
        complete: {
            deps: ['current'],
            fn: function () {
                return this.current.indexOf(this.constants.UNPICKED_MATCH) === -1;
            }
        },
        progressNow: {
            deps: ['current'],
            fn: function () {
                return this.progressTotal - this.current.replace(this.unpickedRegex, '').length;
            }
        },
        progressPercent: {
            deps: ['progressNow'],
            fn: function () {
                return  (this.progressNow / this.progressTotal) * 100;
            }
        },
        hasStarted: {
            deps: ['progressNow'],
            fn: function () {
                return this.progressNow > 0;
            }
        },
        sportYear: {
            deps: ['sport', 'year'],
            fn: function () {
                return {
                    sport: this.sport,
                    year: this.year
                };
            }
        }
    },
    initialize: function () {
        this.createHelpers();
        this.listenTo(this, 'change:current', this.updateRegions);
        this.updateRegions();
    },
    createHelpers: function () {
        this.updater = new BracketUpdater(this.sportYear);
        this.validator = new BracketValidator(this.sportYear);
        this.generator = new BracketGenerator(this.sportYear);
        this.constants = new BracketData(_.extend({props: ['constants']}, this.sportYear)).constants;
        this.progressTotal = (this.constants.TEAMS_PER_REGION * this.constants.REGION_COUNT) - 1;
        this.unpickedRegex = new RegExp('[^' + this.constants.UNPICKED_MATCH + ']', 'gi');
    },
    getBracketObject: function () {
        return this.validator.validate(this.current);
    },
    updateRegions: function () {
        var validated = this.getBracketObject();

        if (validated instanceof Error) {
            return this.trigger('invalid', this, validated);
        }

        this._regionFinal = validated[this.constants.FINAL_ID];
        this._region1 = validated[this.constants.REGION_IDS[0]];
        this._region2 = validated[this._region1.sameSideAs];
        this._region3 = _.find(validated, function (region) {
            return [this._region1.id, this._region2.id, this._regionFinal.id].indexOf(region.id) === -1;
        }, this);
        this._region4 = validated[this._region3.sameSideAs];
    },
    updateGame: function (data) {
        data.currentMaster = this.current;
        var update = this.updater.update(data);

        if (update instanceof Error) {
            this.trigger('invalid', this, update);
        } else if (update !== this.current) {
            this.updateBracket(update);
        }
    },
    updateBracket: function (update) {
        this.current = update;
    }
});
