var HumanView = require('./base');
var templates = require('../templates');
var _ = require('underscore');
var track = require('../helpers/analytics');


module.exports = HumanView.extend({
    template: templates.includes.bracket,
    events: {
        'click a.pickable': 'pickGame'
    },
    initialize: function (options) {
        this.pickable = options.pickable;
        this.listenTo(this.model, 'change:ordered', this.renderRegions);
    },
    render: function () {
        this.renderAndBind({bracket: this.model, pickable: this.pickable});
        this.addReferences({
            scrollableRegions: '.initial-region, .final-region'
        });
        this.$scrollableRegions.on('scroll', _.bind(this.scrollRegion, this));
        return this;
    },
    renderRegions: function (bracket, regions) {
        _.each(regions, function (r) {
            this.$('[data-id=' + r.id + ']').eq(0).html(this.template.regionContents(r, this.pickable));
            if (r.id === 'FF') {
                this.$('.large-screen-final [role=region]').replaceWith(this.template.largeScreenFinal(r, this.pickable));
            }
        }, this);
    },
    scrollRegion: function (e) {
        var $target = $(e.currentTarget);
        this.$scrollableRegions.not('[data-id=' + $target.data('id') + ']').scrollLeft($target.scrollLeft());
    },
    pickGame: function (e) {
        var $winner = $(e.target).closest('[role=team]');
        var isLastRound = $winner.closest('.round').is(':last-child');
        var roundIndex = $winner.closest('.round').index();
        var $matchup = $winner.closest('[role=matchup]');
        var $loser = $matchup.find('[role=team]').not('[data-id=' + $winner.data('id') + ']');
        var $region = isLastRound ? this.$('.final-region') : $winner.closest('[role=region]');

        var regionId = $region.data('id');
        var winnerObj = _.pick($winner.data(), 'name', 'seed');
        var loserObj = $loser.length ? _.pick($loser.data(), 'name', 'seed') : null;

        this.model.updateGame({
            winner: winnerObj,
            loser: loserObj,
            fromRegion: regionId
        });

        var pickId = regionId + roundIndex + '-' + winnerObj.seed + 'o' + (loserObj ? loserObj.seed : '');
        track.pick(pickId);
    }
});