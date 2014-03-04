var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.bracket,
    events: {
        'click [role=nav] a': 'changeHistory'
    },
    initialize: function (options) {
        options || (options = {});
        this.listenTo(this.model, 'change:ordered', this.render);
        var navEvents = ' canRewind canFastForward progressNow percent progressTotal'.split(' ').join(' change:');
        this.listenTo(this.model, navEvents, this.updateNav);
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