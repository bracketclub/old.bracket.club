var HumanView = require('./base');
var BracketValidator = require('bracket-validator');
var templates = require('../templates');
var _ = require('underscore');


module.exports = HumanView.extend({
    template: templates.includes.bracket,
    events: {
        'click [role=nav] a': 'changeHistory'
    },
    initialize: function (options) {
        options || (options = {});
        this.listenTo(this.model, 'change:ordered', this.render);
        this.listenTo(this.model, 'change:canRewind change:canFastForward change:progressNow change:percent change:progressTotal', this.updateNav);
    },
    render: function () {
        this.renderAndBind({bracket: this.model, pickable: false});
    },
    changeHistory: function (e) {
        e.preventDefault();
        this.model[$(e.currentTarget).attr('role')]();
    },
    updateNav: function () {
        this.getByRole('nav').innerHTML = this.template.nav(this.model);
    }
});