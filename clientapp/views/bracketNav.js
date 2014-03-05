var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.bracketNav,
    events: {
        'click a': 'changeHistory'
    },
    initialize: function () {
        this.listenTo(this.model, this.model.navEvents(), this.render);
    },
    render: function () {
        this.renderAndBind({model: this.model});
    },
    changeHistory: function (e) {
        e.preventDefault();
        this.model[$(e.currentTarget).attr('role')]();
    }
});