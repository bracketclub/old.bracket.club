let _ = require('lodash');
let State = require('./base');
let BracketValidator = require('bracket-validator');
let BracketUpdater = require('bracket-updater');
let BracketGenerator = require('bracket-generator');
let BracketData = require('bracket-data');


module.exports = State.extend({
    props: {
        current: 'string',
        progressTotal: 'number',
        unpickedRegex: 'object',
        sport: 'string',
        year: 'string',
        region1: 'object',
        region2: 'object',
        region3: 'object',
        region4: 'object',
        regionFinal: 'object',
        progressText: ['string', true, 'picks made'],
        historyIndex: ['number', true, 0],
        history: 'array'
    },
    derived: {
        complete: {
            deps: ['current'],
            fn () {
                return this.current.indexOf(this.constants.UNPICKED_MATCH) === -1;
            }
        },
        unpicked: {
            deps: ['current', 'progressTotal', 'unpickedRegex'],
            fn () {
                return this.current && this.unpickedRegex ? this.current.replace(this.unpickedRegex, '').length : this.progressTotal;
            }
        },
        progress: {
            deps: ['progressTotal', 'unpicked'],
            fn () {
                return this.progressTotal - this.unpicked;
            }
        },
        percent: {
            deps: ['progress'],
            fn () {
                return  (this.progress / this.progressTotal) * 100;
            }
        },
        hasStarted: {
            deps: ['progress'],
            fn () {
                return this.progress > 0;
            }
        },
        sportYear: {
            deps: ['sport', 'year'],
            fn () {
                return {
                    sport: this.sport,
                    year: this.year
                };
            }
        },
        canRewind: {
            deps: ['history', 'historyIndex'],
            fn () {
                return this.history.length > 0 && this.historyIndex > 0;
            }
        },
        canFastForward: {
            deps: ['history', 'historyIndex'],
            fn () {
                return this.history.length > 0 && this.historyIndex < this.history.length - 1;
            }
        },
        hasHistory: {
            deps: ['history', 'historyIndex'],
            fn () {
                return this.history.length > 1;
            }
        },
        needsEmptyBase: {
            deps: ['hasHistory', 'history'],
            fn () {
                return !this.history || this.history.length === 0 || this.history[0] !== this.constants.EMPTY;
            }
        }
    },
    initialize () {
        this.createHelpers();

        if (this.needsEmptyBase) {
            this.setEmptyBase();
        }

        this.listenTo(this, 'change:history change:historyIndex', this.updateCurrent);
        this.updateCurrent();

        this.listenTo(this, 'change:current', this.updateRegions);
        this.updateRegions();
    },
    createHelpers () {
        this.updater = new BracketUpdater(this.sportYear);
        this.validator = new BracketValidator(this.sportYear);
        this.generator = new BracketGenerator(this.sportYear);
        this.constants = new BracketData(_.extend({props: ['constants']}, this.sportYear)).constants;
        this.progressTotal = (this.constants.TEAMS_PER_REGION * this.constants.REGION_COUNT) - 1;
        this.unpickedRegex = new RegExp('[^' + this.constants.UNPICKED_MATCH + ']', 'gi');
    },
    updateCurrent () {
        this.current = this.history[this.historyIndex];
    },
    setEmptyBase () {
        this.history = [this.constants.EMPTY].concat(this.history || []);
        this.history.length === 1 ? this.historyIndex = 0 : this.historyIndex++;
    },
    // Manipulate position in history
    getPrevious (i) {
        this.historyIndex = Math.max(0, this.historyIndex - Math.abs(i || 1));
    },
    getNext (i) {
        this.historyIndex = Math.min(this.historyIndex + Math.abs(i || 1), this.history.length - 1);
    },
    getFirst () {
        this.historyIndex = 0;
    },
    getLast () {
        this.historyIndex = this.history.length - 1;
    },
    resetHistory () {
        this.historyIndex = 0;
        this.history = [this.constants.EMPTY];
    },
    generate (type) {
        this.updateBracket(this.generator.generate(type));
    },
    getBracketObject () {
        return this.validator.validate(this.current);
    },
    updateRegions () {
        let validated = this.getBracketObject();

        if (validated instanceof Error) {
            return this.trigger('invalid', this, validated);
        }

        this.regionFinal = validated[this.constants.FINAL_ID];
        this.region1 = validated[this.constants.REGION_IDS[0]];
        this.region2 = validated[this.region1.sameSideAs];
        this.region3 = _.find(validated, function (region) {
            return [this.region1.id, this.region2.id, this.regionFinal.id].indexOf(region.id) === -1;
        }, this);
        this.region4 = validated[this.region3.sameSideAs];
    },
    updateGame (data) {
        data.currentMaster = this.current;
        let update = this.updater.update(data);

        if (update instanceof Error) {
            this.trigger('invalid', this, update);
        } else if (update !== this.current) {
            this.updateBracket(update);
        }
    },
    // Add a new bracket to the history
    updateBracket (bracket) {
        if (bracket === this.current) return;
        if (this.canFastForward) {
            this.history = this.history.slice(0, this.historyIndex + 1).concat(bracket);
        } else {
            this.history = this.history.concat(bracket);
        }
        this.historyIndex = this.history.length - 1;
    },
});
