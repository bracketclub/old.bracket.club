var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.resultsRow,
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        this.renderAndBind({entry: this.model});
    }
});