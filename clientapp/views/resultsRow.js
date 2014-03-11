var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.resultsRow,
    initialize: function () {
        this.listenTo(this.model.bracket, 'change:score', this.render);
    },
    render: function () {
        this.renderAndBind({user: this.model});
        return this;
    }
});