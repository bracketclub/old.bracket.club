var HumanView = require('./base');
var BracketValidator = require('bracket-validator');
var templates = require('../templates');
var _ = require('underscore');


module.exports = HumanView.extend({
    template: templates.includes.resultsRow,
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        this.renderAndBind({entry: this.model});
    }
});