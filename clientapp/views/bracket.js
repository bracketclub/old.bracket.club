var HumanView = require('./base');
var templates = require('../templates');
var _ = require('underscore');
var EnterModal = require('../modals/enterBracket');


module.exports = HumanView.extend({
    template: templates.includes.bracket,
    events: {
        'click a.pickable': 'pickGame',
        'click [role=enter]': 'enterBracket'
    },
    initialize: function (options) {
        this.pickable = options.pickable;
        this.listenTo(this.model, 'change:ordered', this.renderRegions);
    },
    render: function () {
        this.renderAndBind({bracket: this.model, pickable: this.pickable});
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
    pickGame: function (e) {
        var $winner = $(e.target).closest('[role=team]');
        var isLastRound = $winner.closest('.round').is(':last-child');
        var $matchup = $winner.closest('[role=matchup]');
        var $loser = $matchup.find('[role=team]').not('[data-id=' + $winner.data('id') + ']');
        var $region = isLastRound ? this.$('.final-region') : $winner.closest('[role=region]');

        this.model.updateGame({
            winner: _.pick($winner.data(), 'name', 'seed'),
            loser: $loser.length ? _.pick($loser.data(), 'name', 'seed') : null,
            fromRegion: $region.data('id')
        });
    },
    enterBracket: function (e) {
        e.preventDefault();
        app.localStorage('completed', this.model.current);
        this.registerSubview(new EnterModal().render());
    }
});