var HumanView = require('./base');
var BracketValidator = require('bracket-validator');
var templates = require('../templates');
var _ = require('underscore');
var EnterModal = require('./enterBracket');

module.exports = HumanView.extend({
    template: templates.includes.bracket,
    events: {
        'click a.pickable': 'pickGame',
        'click [role=nav] a': 'changeHistory',
        'click [role=enter]': 'enterBracket'
    },
    initialize: function (options) {
        options || (options = {});
        this.listenTo(this.model, 'change:ordered change:historyIndex', this.render);
        this.listenTo(this.model, 'change:canRewind change:canFastForward change:hasHistory', this.updateNav);
        this.listenTo(this.model, 'change:history change:historyIndex', this.updateHistory);
    },
    render: function () {
        this.renderAndBind({bracket: this.model});
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
    changeHistory: function (e) {
        e.preventDefault();
        this.model[$(e.currentTarget).attr('role')]();
    },
    updateNav: function () {
        this.getByRole('nav').innerHTML = this.template.nav(this.model);
    },
    updateHistory: function () {
        app.localStorage('history', this.model.history);
        app.localStorage('historyIndex', this.model.historyIndex);
    },
    enterBracket: function (e) {
        e.preventDefault();
        app.localStorage('completed', this.model.current);
        this.registerSubview(new EnterModal().render());
    }
});