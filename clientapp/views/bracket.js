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
        this.listenTo(this.model, 'change:ordered', this.render);
    },
    render: function () {
        this.renderAndBind({bracket: this.model, pickable: this.pickable});
    },
    pickGame: function (e) {
        var $winner = $(e.target).closest('[role=team]'),
            $matchup = $winner.closest('[role=matchup'),
            $loser = $matchup.find('[role=team]').not('[data-id=' + $winner.data('id') + ']'),
            $region = $winner.closest('[role=region]');

        this.model.updateGame(
            _.pick($winner.data(), 'name', 'seed'),
            $loser.length ? _.pick($loser.data(), 'name', 'seed') : null,
            $region.data('id')
        );
    },
    enterBracket: function (e) {
        e.preventDefault();
        app.localStorage('completed', this.model.current);
        this.registerSubview(new EnterModal().render());
    }
});